import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import sgMail from '@sendgrid/mail';
import type { Database } from '@/lib/database.types';

if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient<Database>({ cookies });
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { to, subject, html, notification } = await request.json();

    // Save notification to database
    const { error: dbError } = await supabase
      .from('notifications')
      .insert({
        user_id: to,
        title: subject,
        content: html,
        type: notification.type,
        status: 'pending',
        metadata: notification
      });

    if (dbError) {
      console.error('Error saving notification:', dbError);
      return NextResponse.json({ error: 'Failed to save notification' }, { status: 500 });
    }

    // Send email if SENDGRID_API_KEY is configured
    if (process.env.SENDGRID_API_KEY) {
      try {
        await sgMail.send({
          to,
          from: process.env.SENDGRID_FROM_EMAIL || 'noreply@expenseflow.org',
          subject,
          html
        });
      } catch (emailError) {
        console.error('Error sending email:', emailError);
        // Don't fail the request if email fails, just log it
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in notification route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 