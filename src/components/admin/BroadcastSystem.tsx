import React, { useState } from 'react';
import { Radio, Send, Users, Calendar, MessageSquare, AlertCircle } from 'lucide-react';

const BroadcastSystem = () => {
  const [messageType, setMessageType] = useState('info');
  const [targetAudience, setTargetAudience] = useState('all');
  const [message, setMessage] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');

  const broadcasts = [
    {
      id: '1',
      title: 'System Maintenance Notice',
      message: 'Scheduled maintenance tonight at 2:00 AM IST. Services will be temporarily unavailable.',
      type: 'warning',
      audience: 'all',
      sentAt: '2025-01-12 10:30',
      recipients: 47,
      status: 'sent'
    },
    {
      id: '2',
      title: 'New API Available',
      message: 'Fastag API is now available for Private Agency users. Contact admin for activation.',
      type: 'info',
      audience: 'private-agency',
      sentAt: '2025-01-11 14:15',
      recipients: 5,
      status: 'sent'
    },
    {
      id: '3',
      title: 'Credit Renewal Reminder',
      message: 'Your subscription expires in 3 days. Please renew to continue using services.',
      type: 'warning',
      audience: 'expiring-users',
      sentAt: '2025-01-10 09:00',
      recipients: 8,
      status: 'sent'
    },
    {
      id: '4',
      title: 'Security Update',
      message: 'New security features implemented. Please update your passwords.',
      type: 'success',
      audience: 'all',
      sentAt: 'Scheduled',
      recipients: 47,
      status: 'scheduled'
    }
  ];

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle broadcast sending logic here
    console.log({ messageType, targetAudience, message, scheduledDate });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Broadcast System</h1>
        <p className="mt-1 text-sm text-slate-600">Send notifications and announcements to users</p>
      </div>

      {/* Broadcast Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Total Broadcasts</p>
              <p className="text-2xl font-bold text-slate-900">{broadcasts.length}</p>
            </div>
            <Radio className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Sent Today</p>
              <p className="text-2xl font-bold text-green-600">3</p>
            </div>
            <Send className="h-8 w-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Scheduled</p>
              <p className="text-2xl font-bold text-orange-600">1</p>
            </div>
            <Calendar className="h-8 w-8 text-orange-500" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Total Recipients</p>
              <p className="text-2xl font-bold text-purple-600">107</p>
            </div>
            <Users className="h-8 w-8 text-purple-500" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Compose Broadcast */}
        <div className="bg-white shadow-sm rounded-lg border border-slate-200">
          <div className="px-6 py-4 border-b border-slate-200">
            <h2 className="text-lg font-medium text-slate-900">Compose Broadcast</h2>
          </div>
          <form onSubmit={handleSendBroadcast} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Message Type</label>
              <select
                value={messageType}
                onChange={(e) => setMessageType(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="info">Information</option>
                <option value="warning">Warning</option>
                <option value="success">Success</option>
                <option value="error">Error</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Target Audience</label>
              <select
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Users (47)</option>
                <option value="police">Police Plan (12)</option>
                <option value="private-agency">Private Agency (5)</option>
                <option value="demo">Demo Users (8)</option>
                <option value="active">Active Users (39)</option>
                <option value="expiring">Expiring Soon (8)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your broadcast message..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Schedule (Optional)
              </label>
              <input
                type="datetime-local"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-slate-500 mt-1">Leave empty to send immediately</p>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                <Send className="h-4 w-4 mr-2" />
                {scheduledDate ? 'Schedule Broadcast' : 'Send Now'}
              </button>
              <button
                type="button"
                className="px-4 py-2 border border-slate-300 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors"
              >
                Preview
              </button>
            </div>
          </form>
        </div>

        {/* Quick Templates */}
        <div className="bg-white shadow-sm rounded-lg border border-slate-200">
          <div className="px-6 py-4 border-b border-slate-200">
            <h2 className="text-lg font-medium text-slate-900">Quick Templates</h2>
          </div>
          <div className="p-6 space-y-3">
            <button
              onClick={() => setMessage('System maintenance scheduled for tonight. Services will be temporarily unavailable.')}
              className="w-full text-left p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-2 mb-1">
                <AlertCircle className="h-4 w-4 text-orange-500" />
                <span className="font-medium text-sm">Maintenance Notice</span>
              </div>
              <p className="text-xs text-slate-600">System maintenance announcement</p>
            </button>

            <button
              onClick={() => setMessage('Your subscription expires soon. Please renew to continue using services.')}
              className="w-full text-left p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="h-4 w-4 text-yellow-500" />
                <span className="font-medium text-sm">Renewal Reminder</span>
              </div>
              <p className="text-xs text-slate-600">Subscription expiry warning</p>
            </button>

            <button
              onClick={() => setMessage('New API features are now available. Check the documentation for details.')}
              className="w-full text-left p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-2 mb-1">
                <MessageSquare className="h-4 w-4 text-blue-500" />
                <span className="font-medium text-sm">Feature Update</span>
              </div>
              <p className="text-xs text-slate-600">New feature announcement</p>
            </button>

            <button
              onClick={() => setMessage('Security update implemented. Please update your passwords for enhanced security.')}
              className="w-full text-left p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-2 mb-1">
                <AlertCircle className="h-4 w-4 text-red-500" />
                <span className="font-medium text-sm">Security Alert</span>
              </div>
              <p className="text-xs text-slate-600">Security-related notification</p>
            </button>
          </div>
        </div>
      </div>

      {/* Broadcast History */}
      <div className="bg-white shadow-sm rounded-lg border border-slate-200">
        <div className="px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-medium text-slate-900">Broadcast History</h2>
        </div>
        <div className="divide-y divide-slate-200">
          {broadcasts.map((broadcast) => (
            <div key={broadcast.id} className="p-6 hover:bg-slate-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-sm font-medium text-slate-900">{broadcast.title}</h3>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      broadcast.type === 'info' ? 'bg-blue-100 text-blue-800' :
                      broadcast.type === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                      broadcast.type === 'success' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {broadcast.type}
                    </span>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      broadcast.status === 'sent' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                    }`}>
                      {broadcast.status}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 mb-2">{broadcast.message}</p>
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span>Recipients: {broadcast.recipients}</span>
                    <span>Audience: {broadcast.audience}</span>
                    <span>Sent: {broadcast.sentAt}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BroadcastSystem;