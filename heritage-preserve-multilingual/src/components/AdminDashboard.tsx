import React from 'react';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';

export const AdminDashboard: React.FC = () => {
  const stats = [
    { label: 'Total Recordings', value: '247', change: '+12 this week' },
    { label: 'Pending QC', value: '18', change: '3 urgent' },
    { label: 'Active Elders', value: '42', change: '2 new' },
    { label: 'Embargoed Items', value: '5', change: '2 releasing soon' }
  ];

  const recentUploads = [
    { title: 'Creation Stories Vol. 3', elder: 'Baba Ifayemi', status: 'transcribing', time: '2 hours ago' },
    { title: 'Healing Rituals', elder: 'Elder Adeyemi', status: 'pending_qc', time: '5 hours ago' },
    { title: 'Divination Practices', elder: 'Mama Oshun', status: 'approved', time: '1 day ago' }
  ];

  return (
    <div>
      <h2 className="text-4xl font-serif font-bold text-white mb-8">Admin Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, i) => (
          <div key={i} className="bg-indigo-950/30 border border-silver/10 rounded-xl p-6">
            <p className="text-sm text-silver mb-2">{stat.label}</p>
            <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
            <p className="text-xs text-cerulean">{stat.change}</p>
          </div>
        ))}
      </div>

      <div className="bg-indigo-950/30 border border-silver/10 rounded-xl p-6 mb-8">
        <h3 className="text-xl font-serif text-white mb-4">Recent Uploads</h3>
        <div className="space-y-3">
          {recentUploads.map((upload, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-indigo-950/50 rounded-lg">
              <div>
                <p className="text-white font-medium">{upload.title}</p>
                <p className="text-sm text-silver">{upload.elder} • {upload.time}</p>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={upload.status === 'approved' ? 'success' : 'warning'}>
                  {upload.status.replace('_', ' ')}
                </Badge>
                <Button variant="ghost" size="sm">Review</Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-indigo-950/30 border border-silver/10 rounded-xl p-6">
          <h3 className="text-xl font-serif text-white mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Button variant="primary" className="w-full">Review Pending Tasks</Button>
            <Button variant="ghost" className="w-full">Manage Embargoes</Button>
            <Button variant="ghost" className="w-full">User Permissions</Button>
            <Button variant="ghost" className="w-full">Audit Log</Button>
          </div>
        </div>

        <div className="bg-indigo-950/30 border border-silver/10 rounded-xl p-6">
          <h3 className="text-xl font-serif text-white mb-4">System Health</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-silver">Storage Used</span>
              <span className="text-white">342 GB / 1 TB</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-silver">API Status</span>
              <Badge variant="success">Operational</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-silver">Last Backup</span>
              <span className="text-white">2 hours ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
