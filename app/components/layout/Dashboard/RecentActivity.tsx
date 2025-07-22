import React from 'react';
import { Plane, Wrench, FileText, Eye } from 'lucide-react';

interface ActivityItem {
  id: number;
  type: 'Travel' | 'Maintenance' | 'Requisition';
  amount: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface RecentActivityProps {
  activities: ActivityItem[];
  onViewAll: () => void;
  onViewActivity: (id: number) => void;
}

export function RecentActivity({ activities, onViewAll, onViewActivity }: RecentActivityProps) {
  const getIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'Travel':
        return <Plane className="w-5 h-5 text-blue-600" />;
      case 'Maintenance':
        return <Wrench className="w-5 h-5 text-green-600" />;
      case 'Requisition':
        return <FileText className="w-5 h-5 text-purple-600" />;
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
        <button 
          onClick={onViewAll}
          className="text-sm text-blue-600 hover:text-blue-500 font-medium"
        >
          View All
        </button>
      </div>
      
      <div className="space-y-4">
        {activities.map((item) => (
          <div key={item.id} className="flex items-center justify-between py-4 border-b border-gray-100 last:border-b-0">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                {getIcon(item.type)}
              </div>
              <div>
                <p className="font-medium text-gray-900">{item.type} Expense</p>
                <p className="text-sm text-gray-500">{item.date}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="font-semibold text-gray-900">{item.amount}</span>
              <span className={`status-badge ${
                item.status === 'pending' ? 'status-pending-manager' :
                item.status === 'approved' ? 'status-approved' :
                'status-rejected'
              }`}>
                {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
              </span>
              <button 
                onClick={() => onViewActivity(item.id)}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <Eye className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 