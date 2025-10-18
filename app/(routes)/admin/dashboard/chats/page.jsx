'use client';

import { useEffect, useState } from 'react';
import { AdminService } from '@/lib/services/admin-service';
import {
  MessageSquare,
  Trash2,
  Eye,
  RefreshCw,
  Calendar,
  User,
  AlertTriangle
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';

export default function ChatsManagementPage() {
  const router = useRouter();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    setLoading(true);
    const { data } = await AdminService.getAllConversations();

    if (data) {
      setConversations(data);
    }
    setLoading(false);
  };

  const handleDeleteConversation = async (conversationId) => {
    if (!deleteConfirm) {
      setDeleteConfirm(conversationId);
      return;
    }

    const { error } = await AdminService.deleteConversation(conversationId);
    if (!error) {
      setConversations(conversations.filter(c => c.id !== conversationId));
      setDeleteConfirm(null);
    } else {
      alert('Failed to delete conversation: ' + error.message);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return 'N/A';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Chat Monitoring</h1>
          <p className="text-slate-600 mt-1">View and manage all conversations</p>
        </div>
        <button
          onClick={loadConversations}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Conversations</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">{conversations.length}</p>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg">
              <MessageSquare className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Active Today</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">
                {conversations.filter(c => {
                  if (!c.last_message_at) return false;
                  const today = new Date();
                  const msgDate = new Date(c.last_message_at);
                  return msgDate.toDateString() === today.toDateString();
                }).length}
              </p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <Calendar className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">With Listings</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">
                {conversations.filter(c => c.listing_id).length}
              </p>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <MessageSquare className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Conversations List */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-600">
            Loading conversations...
          </div>
        ) : conversations.length === 0 ? (
          <div className="p-12 text-center text-slate-600">
            No conversations found
          </div>
        ) : (
          <div className="divide-y divide-slate-200">
            {conversations.map((conv) => (
              <div
                key={conv.id}
                className="p-6 hover:bg-slate-50 transition"
              >
                <div className="flex items-start justify-between gap-4">
                  {/* Conversation Info */}
                  <div className="flex-1 min-w-0">
                    {/* Participants */}
                    <div className="flex items-center gap-3 mb-3">
                      <MessageSquare className="w-5 h-5 text-purple-500 flex-shrink-0" />
                      <div className="flex items-center gap-2 flex-wrap">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-slate-400" />
                          <span className="font-medium text-slate-900">
                            {conv.participant_1?.account_type === 'individual'
                              ? conv.participant_1?.name
                              : conv.participant_1?.business_name
                            }
                          </span>
                        </div>
                        <span className="text-slate-400">↔</span>
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-slate-400" />
                          <span className="font-medium text-slate-900">
                            {conv.participant_2?.account_type === 'individual'
                              ? conv.participant_2?.name
                              : conv.participant_2?.business_name
                            }
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Last Message */}
                    {conv.lastMessage && (
                      <div className="ml-8 mb-2">
                        <p className="text-sm text-slate-600 line-clamp-2">
                          {conv.lastMessage.content}
                        </p>
                      </div>
                    )}

                    {/* Metadata */}
                    <div className="ml-8 flex items-center gap-4 text-xs text-slate-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(conv.last_message_at || conv.created_at)}
                      </div>
                      {conv.listing && (
                        <div className="flex items-center gap-1">
                          <span>About:</span>
                          <span className="font-medium">{conv.listing.surplusType}</span>
                        </div>
                      )}
                      <div className="text-slate-400">
                        ID: {conv.id.substring(0, 8)}...
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => router.push(`/admin/dashboard/chats/${conv.id}`)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      title="View Messages"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteConversation(conv.id)}
                      className={`p-2 rounded-lg transition ${
                        deleteConfirm === conv.id
                          ? 'bg-red-600 text-white'
                          : 'text-red-600 hover:bg-red-50'
                      }`}
                      title={deleteConfirm === conv.id ? 'Click again to confirm' : 'Delete Conversation'}
                    >
                      {deleteConfirm === conv.id ? (
                        <AlertTriangle className="w-4 h-4" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <p className="text-sm text-slate-600">
          Showing <span className="font-semibold text-slate-900">{conversations.length}</span> conversation(s)
        </p>
      </div>
    </div>
  );
}
