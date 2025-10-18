'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminService } from '@/lib/services/admin-service';
import { Shield, Lock } from 'lucide-react';
import Image from 'next/image';
import logo from '../../../public/logo.png';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (AdminService.validatePassword(password)) {
      AdminService.setAdminSession();
      router.push('/admin/dashboard');
    } else {
      setError('Invalid password');
      setPassword('');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f16161] via-[#f7dcdf] to-white flex items-center justify-center p-4">
      <div className="relative w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-8">
          {/* Logo/Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Image src={logo} width={150} height={150} alt="Ne3ma Logo" />
            </div>
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#f16161] rounded-full mb-4 shadow-lg">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
            <p className="text-gray-600">Ne3ma Platform Control Center</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Admin Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#f16161] focus:border-transparent transition"
                  placeholder="Enter admin password"
                  required
                  autoFocus
                />
              </div>
              {error && (
                <p className="mt-2 text-sm text-red-600">{error}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#f16161] text-white font-semibold py-3 px-4 rounded-lg hover:bg-[#e05555] focus:outline-none focus:ring-2 focus:ring-[#f16161] focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {loading ? 'Verifying...' : 'Access Dashboard'}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              Authorized access only. All activities are logged.
            </p>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute -top-4 -right-4 w-24 h-24 bg-[#f16161]/20 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-[#fcb5bd]/20 rounded-full blur-2xl"></div>
      </div>
    </div>
  );
}
