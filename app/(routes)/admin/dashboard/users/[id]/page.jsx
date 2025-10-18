'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AdminService } from '@/lib/services/admin-service';
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Building,
  Package,
  Edit,
  Trash2,
  Save,
  X
} from 'lucide-react';

export default function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id;

  const [user, setUser] = useState(null);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    if (userId) {
      loadUserData();
    }
  }, [userId]);

  const loadUserData = async () => {
    setLoading(true);

    const [userResult, listingsResult] = await Promise.all([
      AdminService.getUserById(userId),
      AdminService.getUserListings(userId)
    ]);

    if (userResult.data) {
      setUser(userResult.data);
      setEditForm(userResult.data);
    }

    if (listingsResult.data) {
      setListings(listingsResult.data);
    }

    setLoading(false);
  };

  const handleSaveEdit = async () => {
    const { error } = await AdminService.updateUser(userId, editForm);
    if (!error) {
      setUser(editForm);
      setEditing(false);
    } else {
      alert('Failed to update user: ' + error.message);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this user? This will also delete all their listings and messages.')) {
      return;
    }

    const { error } = await AdminService.deleteUser(userId);
    if (!error) {
      router.push('/admin/dashboard/users');
    } else {
      alert('Failed to delete user: ' + error.message);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-600">Loading user data...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-600">User not found</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-slate-100 rounded-lg transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">User Details</h1>
            <p className="text-slate-600 mt-1">View and manage user information</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!editing ? (
            <>
              <button
                onClick={() => setEditing(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                <Edit className="w-4 h-4" />
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleSaveEdit}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                <Save className="w-4 h-4" />
                Save
              </button>
              <button
                onClick={() => {
                  setEditing(false);
                  setEditForm(user);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
            </>
          )}
        </div>
      </div>

      {/* User Information */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-6">User Information</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name / Business Name */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              {user.account_type === 'individual' ? 'Name' : 'Business Name'}
            </label>
            {editing ? (
              <input
                type="text"
                value={user.account_type === 'individual' ? editForm.name : editForm.business_name}
                onChange={(e) => setEditForm({
                  ...editForm,
                  [user.account_type === 'individual' ? 'name' : 'business_name']: e.target.value
                })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            ) : (
              <div className="flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-lg">
                <User className="w-5 h-5 text-slate-400" />
                <span className="text-slate-900">
                  {user.account_type === 'individual' ? user.name : user.business_name}
                </span>
              </div>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
            {editing ? (
              <input
                type="email"
                value={editForm.email || ''}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            ) : (
              <div className="flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-lg">
                <Mail className="w-5 h-5 text-slate-400" />
                <span className="text-slate-900">{user.email || 'N/A'}</span>
              </div>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Phone</label>
            {editing ? (
              <input
                type="tel"
                value={editForm.phone || ''}
                onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            ) : (
              <div className="flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-lg">
                <Phone className="w-5 h-5 text-slate-400" />
                <span className="text-slate-900">{user.phone || 'N/A'}</span>
              </div>
            )}
          </div>

          {/* Account Type */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Account Type</label>
            <div className="flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-lg">
              <Building className="w-5 h-5 text-slate-400" />
              <span className={`
                inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                ${user.account_type === 'business'
                  ? 'bg-purple-100 text-purple-800'
                  : 'bg-blue-100 text-blue-800'
                }
              `}>
                {user.account_type}
              </span>
            </div>
          </div>

          {/* Created At */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Joined</label>
            <div className="flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-lg">
              <Calendar className="w-5 h-5 text-slate-400" />
              <span className="text-slate-900">{formatDate(user.created_at)}</span>
            </div>
          </div>

          {/* Auth ID */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Auth ID</label>
            <div className="flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-lg">
              <span className="text-slate-900 text-sm font-mono">{user.auth_id || 'N/A'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* User's Listings */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-slate-900">User's Listings</h2>
          <div className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
            <Package className="w-4 h-4" />
            <span className="text-sm font-medium">{listings.length} listings</span>
          </div>
        </div>

        {listings.length === 0 ? (
          <p className="text-center text-slate-500 py-8">No listings found</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {listings.map((listing) => (
              <div
                key={listing.id}
                className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition cursor-pointer"
                onClick={() => router.push(`/admin/dashboard/listings/${listing.id}`)}
              >
                <h3 className="font-medium text-slate-900 mb-2">{listing.surplusType}</h3>
                <p className="text-sm text-slate-600 mb-2">{listing.category}</p>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <MapPin className="w-3 h-3" />
                  {listing.adderss || 'No address'}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
