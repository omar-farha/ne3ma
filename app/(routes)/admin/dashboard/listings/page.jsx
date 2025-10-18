'use client';

import { useEffect, useState } from 'react';
import { AdminService } from '@/lib/services/admin-service';
import {
  Search,
  Trash2,
  Eye,
  Filter,
  Package,
  MapPin,
  DollarSign,
  Calendar,
  AlertTriangle,
  RefreshCw,
  User
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ListingsManagementPage() {
  const router = useRouter();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [selectedListings, setSelectedListings] = useState([]);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    loadListings();
  }, [categoryFilter, searchTerm]);

  const loadListings = async () => {
    setLoading(true);
    const { data } = await AdminService.getAllListings({
      category: categoryFilter,
      searchTerm: searchTerm
    });

    if (data) {
      setListings(data);
    }
    setLoading(false);
  };

  const handleDeleteListing = async (listingId) => {
    if (!deleteConfirm) {
      setDeleteConfirm(listingId);
      return;
    }

    const { error } = await AdminService.deleteListing(listingId);
    if (!error) {
      setListings(listings.filter(l => l.id !== listingId));
      setDeleteConfirm(null);
    } else {
      alert('Failed to delete listing: ' + error.message);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedListings.length === 0) return;

    if (!confirm(`Are you sure you want to delete ${selectedListings.length} listings?`)) {
      return;
    }

    const { error } = await AdminService.bulkDeleteListings(selectedListings);
    if (!error) {
      setListings(listings.filter(l => !selectedListings.includes(l.id)));
      setSelectedListings([]);
    } else {
      alert('Failed to delete listings: ' + error.message);
    }
  };

  const toggleSelectAll = () => {
    if (selectedListings.length === listings.length) {
      setSelectedListings([]);
    } else {
      setSelectedListings(listings.map(l => l.id));
    }
  };

  const toggleSelectListing = (listingId) => {
    if (selectedListings.includes(listingId)) {
      setSelectedListings(selectedListings.filter(id => id !== listingId));
    } else {
      setSelectedListings([...selectedListings, listingId]);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const categories = ['Restaurant', 'Factory', 'Pharmacy', 'Donate'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Listings Management</h1>
          <p className="text-slate-600 mt-1">Manage all platform listings</p>
        </div>
        <button
          onClick={loadListings}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Search Listings
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by product name, address..."
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Category
            </label>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedListings.length > 0 && (
          <div className="mt-4 flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm font-medium text-blue-900">
              {selectedListings.length} listing(s) selected
            </p>
            <button
              onClick={handleBulkDelete}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm"
            >
              <Trash2 className="w-4 h-4" />
              Delete Selected
            </button>
          </div>
        )}
      </div>

      {/* Listings Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-600">
            Loading listings...
          </div>
        ) : listings.length === 0 ? (
          <div className="p-12 text-center text-slate-600">
            No listings found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedListings.length === listings.length}
                      onChange={toggleSelectAll}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Owner
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {listings.map((listing) => (
                  <tr key={listing.id} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedListings.includes(listing.id)}
                        onChange={() => toggleSelectListing(listing.id)}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Package className="w-10 h-10 text-green-500" />
                        <div>
                          <p className="font-medium text-slate-900">{listing.surplusType}</p>
                          <p className="text-sm text-slate-500">ID: {listing.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-slate-400" />
                        <div>
                          <p className="text-sm text-slate-900">
                            {listing.users?.account_type === 'individual'
                              ? listing.users?.name
                              : listing.users?.business_name
                            }
                          </p>
                          <p className="text-xs text-slate-500">{listing.users?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        {listing.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-600 text-sm max-w-xs truncate">
                        <MapPin className="w-4 h-4 flex-shrink-0" />
                        {listing.adderss || 'No address'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-600">
                        <DollarSign className="w-4 h-4" />
                        {listing.price || 'Free'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-600 text-sm">
                        <Calendar className="w-4 h-4" />
                        {formatDate(listing.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => router.push(`/admin/dashboard/listings/${listing.id}`)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteListing(listing.id)}
                          className={`p-2 rounded-lg transition ${
                            deleteConfirm === listing.id
                              ? 'bg-red-600 text-white'
                              : 'text-red-600 hover:bg-red-50'
                          }`}
                          title={deleteConfirm === listing.id ? 'Click again to confirm' : 'Delete Listing'}
                        >
                          {deleteConfirm === listing.id ? (
                            <AlertTriangle className="w-4 h-4" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <p className="text-sm text-slate-600">
          Showing <span className="font-semibold text-slate-900">{listings.length}</span> listing(s)
        </p>
      </div>
    </div>
  );
}
