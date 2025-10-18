/**
 * صفحة لوحة التحكم الإدارية
 * هذه الصفحة تعرض إحصائيات شاملة عن المنصة للمسؤولين
 * تتضمن عدد المستخدمين، الإعلانات، المحادثات، والرسائل
 *
 * Admin Dashboard Page
 * This page displays comprehensive platform statistics for administrators
 * Includes user count, listings, conversations, and messages
 */

'use client';

import { useEffect, useState } from 'react';
import { AdminService } from '@/lib/services/admin-service';
import { Users, Package, MessageSquare, Mail, TrendingUp, Activity } from 'lucide-react';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);

    const [statsResult, activityResult] = await Promise.all([
      AdminService.getDashboardStats(),
      AdminService.getRecentActivity()
    ]);

    if (statsResult.data) {
      setStats(statsResult.data);
    }

    if (activityResult.data) {
      setRecentActivity(activityResult.data);
    }

    setLoading(false);
  };

  const statCards = [
    {
      title: 'Total Users',
      value: stats?.totalUsers || 0,
      icon: Users,
      color: 'bg-blue-500',
      lightColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: 'Total Listings',
      value: stats?.totalListings || 0,
      icon: Package,
      color: 'bg-green-500',
      lightColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      title: 'Conversations',
      value: stats?.totalConversations || 0,
      icon: MessageSquare,
      color: 'bg-purple-500',
      lightColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
    {
      title: 'Total Messages',
      value: stats?.totalMessages || 0,
      icon: Mail,
      color: 'bg-orange-500',
      lightColor: 'bg-orange-50',
      textColor: 'text-orange-600'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-600">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-[#f16161] to-[#fcb5bd] rounded-xl p-8 text-white shadow-lg">
        <h1 className="text-3xl font-bold mb-2">Welcome to Admin Dashboard</h1>
        <p className="text-white/90">Manage your Ne3ma platform with full control</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">{stat.title}</p>
                  <p className="text-3xl font-bold text-slate-900 mt-2">{stat.value}</p>
                </div>
                <div className={`${stat.lightColor} p-3 rounded-lg`}>
                  <Icon className={`w-6 h-6 ${stat.textColor}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900">Recent Users</h2>
            <Activity className="w-5 h-5 text-slate-400" />
          </div>

          <div className="space-y-3">
            {recentActivity.slice(0, 5).map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition"
              >
                <div className="flex-1">
                  <p className="font-medium text-slate-900">
                    {user.account_type === 'individual' ? user.name : user.business_name}
                  </p>
                  <p className="text-sm text-slate-500">{user.email}</p>
                </div>
                <div className="text-right">
                  <span className={`
                    inline-block px-2 py-1 text-xs font-medium rounded-full
                    ${user.account_type === 'business'
                      ? 'bg-purple-100 text-purple-700'
                      : 'bg-blue-100 text-blue-700'
                    }
                  `}>
                    {user.account_type}
                  </span>
                </div>
              </div>
            ))}

            {recentActivity.length === 0 && (
              <p className="text-center text-slate-500 py-8">No recent activity</p>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900">Quick Actions</h2>
            <TrendingUp className="w-5 h-5 text-slate-400" />
          </div>

          <div className="space-y-3">
            <a
              href="/admin/dashboard/users"
              className="block p-4 bg-[#f7dcdf] hover:bg-[#fcb5bd] rounded-lg transition"
            >
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-[#f16161]" />
                <div>
                  <p className="font-medium text-slate-900">Manage Users</p>
                  <p className="text-sm text-slate-600">View, edit, or delete users</p>
                </div>
              </div>
            </a>

            <a
              href="/admin/dashboard/listings"
              className="block p-4 bg-green-50 hover:bg-green-100 rounded-lg transition"
            >
              <div className="flex items-center gap-3">
                <Package className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-medium text-slate-900">Manage Listings</p>
                  <p className="text-sm text-slate-600">Control all product listings</p>
                </div>
              </div>
            </a>

            <a
              href="/admin/dashboard/chats"
              className="block p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition"
            >
              <div className="flex items-center gap-3">
                <MessageSquare className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="font-medium text-slate-900">Monitor Chats</p>
                  <p className="text-sm text-slate-600">View all conversations</p>
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>

      {/* System Info */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">System Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-slate-50 rounded-lg">
            <p className="text-sm text-slate-600">Platform</p>
            <p className="text-lg font-semibold text-slate-900">Ne3ma Marketplace</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-lg">
            <p className="text-sm text-slate-600">Admin Version</p>
            <p className="text-lg font-semibold text-slate-900">v1.0.0</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-lg">
            <p className="text-sm text-slate-600">Database</p>
            <p className="text-lg font-semibold text-slate-900">Supabase PostgreSQL</p>
          </div>
        </div>
      </div>
    </div>
  );
}
