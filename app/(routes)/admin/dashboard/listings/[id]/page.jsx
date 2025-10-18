'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AdminService } from '@/lib/services/admin-service';
import {
  ArrowLeft,
  Package,
  MapPin,
  DollarSign,
  Calendar,
  User,
  Edit,
  Trash2,
  Save,
  X,
  Tag,
  FileText
} from 'lucide-react';

export default function ListingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const listingId = params.id;

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    if (listingId) {
      loadListingData();
    }
  }, [listingId]);

  const loadListingData = async () => {
    setLoading(true);

    const { data } = await AdminService.getListingById(listingId);

    if (data) {
      setListing(data);
      setEditForm(data);
    }

    setLoading(false);
  };

  const handleSaveEdit = async () => {
    const { error } = await AdminService.updateListing(listingId, editForm);
    if (!error) {
      setListing(editForm);
      setEditing(false);
    } else {
      alert('Failed to update listing: ' + error.message);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this listing?')) {
      return;
    }

    const { error } = await AdminService.deleteListing(listingId);
    if (!error) {
      router.push('/admin/dashboard/listings');
    } else {
      alert('Failed to delete listing: ' + error.message);
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
        <div className="text-slate-600">Loading listing data...</div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-600">Listing not found</div>
      </div>
    );
  }

  const imageUrl = listing.imageUrl
    ? `${process.env.NEXT_PUBLIC_IMAGE_URL}${listing.imageUrl}`
    : null;

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
            <h1 className="text-2xl font-bold text-slate-900">Listing Details</h1>
            <p className="text-slate-600 mt-1">View and manage listing information</p>
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
                  setEditForm(listing);
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

      {/* Image */}
      {imageUrl && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Product Image</h2>
          <img
            src={imageUrl}
            alt={listing.surplusType}
            className="w-full max-w-2xl h-auto rounded-lg"
          />
        </div>
      )}

      {/* Listing Information */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-6">Listing Information</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Product Name */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Product Name</label>
            {editing ? (
              <input
                type="text"
                value={editForm.surplusType || ''}
                onChange={(e) => setEditForm({ ...editForm, surplusType: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            ) : (
              <div className="flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-lg">
                <Package className="w-5 h-5 text-slate-400" />
                <span className="text-slate-900">{listing.surplusType}</span>
              </div>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
            {editing ? (
              <select
                value={editForm.category || ''}
                onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Restaurant">Restaurant</option>
                <option value="Factory">Factory</option>
                <option value="Pharmacy">Pharmacy</option>
                <option value="Donate">Donate</option>
              </select>
            ) : (
              <div className="flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-lg">
                <Tag className="w-5 h-5 text-slate-400" />
                <span className="text-slate-900">{listing.category}</span>
              </div>
            )}
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Price</label>
            {editing ? (
              <input
                type="text"
                value={editForm.price || ''}
                onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            ) : (
              <div className="flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-lg">
                <DollarSign className="w-5 h-5 text-slate-400" />
                <span className="text-slate-900">{listing.price || 'Free'}</span>
              </div>
            )}
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Amount</label>
            {editing ? (
              <input
                type="text"
                value={editForm.amount || ''}
                onChange={(e) => setEditForm({ ...editForm, amount: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            ) : (
              <div className="flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-lg">
                <FileText className="w-5 h-5 text-slate-400" />
                <span className="text-slate-900">{listing.amount || 'N/A'}</span>
              </div>
            )}
          </div>

          {/* Address */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-2">Address</label>
            {editing ? (
              <input
                type="text"
                value={editForm.adderss || ''}
                onChange={(e) => setEditForm({ ...editForm, adderss: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            ) : (
              <div className="flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-lg">
                <MapPin className="w-5 h-5 text-slate-400" />
                <span className="text-slate-900">{listing.adderss || 'No address'}</span>
              </div>
            )}
          </div>

          {/* Created At */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Created</label>
            <div className="flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-lg">
              <Calendar className="w-5 h-5 text-slate-400" />
              <span className="text-slate-900">{formatDate(listing.createdAt)}</span>
            </div>
          </div>

          {/* Listing ID */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Listing ID</label>
            <div className="flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-lg">
              <span className="text-slate-900 text-sm font-mono">{listing.id}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Owner Information */}
      {listing.users && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-6">Owner Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Name</label>
              <div className="flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-lg">
                <User className="w-5 h-5 text-slate-400" />
                <span className="text-slate-900">
                  {listing.users.account_type === 'individual'
                    ? listing.users.name
                    : listing.users.business_name
                  }
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
              <div className="flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-lg">
                <span className="text-slate-900">{listing.users.email || 'N/A'}</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Account Type</label>
              <div className="flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-lg">
                <span className={`
                  inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                  ${listing.users.account_type === 'business'
                    ? 'bg-purple-100 text-purple-800'
                    : 'bg-blue-100 text-blue-800'
                  }
                `}>
                  {listing.users.account_type}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">User ID</label>
              <div className="flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-lg">
                <button
                  onClick={() => router.push(`/admin/dashboard/users/${listing.users.id}`)}
                  className="text-blue-600 hover:underline text-sm font-mono"
                >
                  {listing.users.id}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
