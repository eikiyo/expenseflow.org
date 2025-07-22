import { z } from 'zod';

export function formatValidationErrors(result: z.SafeParseError<any>): Record<string, string> {
  return Object.fromEntries(
    result.error.issues.map(issue => [
      issue.path.join('.'),
      issue.message
    ])
  );
} 