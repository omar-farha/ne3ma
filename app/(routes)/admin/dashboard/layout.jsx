'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { AdminService } from '@/lib/services/admin-service';
import Link from 'next/link';
import Image from 'next/image';
import logo from '../../../../public/logo.png';
import {
  LayoutDashboard,
  Users,
  Package,
  MessageSquare,
  LogOut,
  Menu,
  X
} from 'lucide-react';

export default function AdminDashboardLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!AdminService.isAuthenticated()) {
      router.push('/admin');
    } else {
      setLoading(false);
    }
  }, [router]);

  const handleLogout = () => {
    AdminService.logout();
    router.push('/admin');
  };

  const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Users', href: '/admin/dashboard/users', icon: Users },
    { name: 'Listings', href: '/admin/dashboard/listings', icon: Package },
    { name: 'Chats', href: '/admin/dashboard/chats', icon: MessageSquare },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-600 text-lg">Verifying access...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
      >
        {/* Logo */}
        <div className="h-20 flex items-center justify-center px-6 border-b border-gray-200">
          <Link href="/" className="flex items-center">
            <Image src={logo} width={120} height={120} alt="Ne3ma Logo" />
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden absolute right-4 text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="px-4 py-3 bg-[#f16161] text-white">
          <p className="text-xs font-medium uppercase tracking-wide">Admin Panel</p>
        </div>

        {/* Navigation */}
        <nav className="mt-2 px-3">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition
                  ${isActive
                    ? 'bg-[#f16161] text-white'
                    : 'text-gray-700 hover:bg-[#f7dcdf] hover:text-[#f16161]'
                  }
                `}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg w-full text-gray-700 hover:bg-red-50 hover:text-red-600 transition"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-30 shadow-sm">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-gray-600 hover:text-gray-900"
          >
            <Menu className="w-6 h-6" />
          </button>

          <h1 className="text-xl font-semibold text-gray-900">
            Ne3ma Admin
          </h1>

          <div className="flex items-center gap-4">
            <div className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
              Admin Active
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
