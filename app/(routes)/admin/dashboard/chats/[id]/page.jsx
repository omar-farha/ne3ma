'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AdminService } from '@/lib/services/admin-service';
import {
  ArrowLeft,
  MessageSquare,
  Trash2,
  User,
  Calendar,
  Package,
  Mail
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function ChatDetailPage() {
  const params = useParams();
  const router = useRouter();
  const conversationId = params.id;

  const [messages, setMessages] = useState([]);
  const [conversation, setConversation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (conversationId) {
      loadChatData();
    }
  }, [conversationId]);

  const loadChatData = async () => {
    setLoading(true);

    const [messagesResult, convResult] = await Promise.all([
      AdminService.getConversationMessages(conversationId),
      AdminService.getAllConversations()
    ]);

    if (messagesResult.data) {
      setMessages(messagesResult.data);
    }

    if (convResult.data) {
      const conv = convResult.data.find(c => c.id === conversationId);
      if (conv) {
        setConversation(conv);
      }
    }

    setLoading(false);
  };

  const handleDeleteConversation = async () => {
    if (!confirm('Are you sure you want to delete this entire conversation?')) {
      return;
    }

    const { error } = await AdminService.deleteConversation(conversationId);
    if (!error) {
      router.push('/admin/dashboard/chats');
    } else {
      alert('Failed to delete conversation: ' + error.message);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    if (!confirm('Are you sure you want to delete this message?')) {
      return;
    }

    const { error } = await AdminService.deleteMessage(messageId);
    if (!error) {
      setMessages(messages.filter(m => m.id !== messageId));
    } else {
      alert('Failed to delete message: ' + error.message);
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

  const formatFullDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-US', {
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
        <div className="text-slate-600">Loading conversation...</div>
      </div>
    );
  }

  if (!conversation) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-600">Conversation not found</div>
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
            <h1 className="text-2xl font-bold text-slate-900">Conversation Details</h1>
            <p className="text-slate-600 mt-1">View all messages in this conversation</p>
          </div>
        </div>

        <button
          onClick={handleDeleteConversation}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
        >
          <Trash2 className="w-4 h-4" />
          Delete Conversation
        </button>
      </div>

      {/* Conversation Info */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Conversation Information</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Participant 1 */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Participant 1</label>
            <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 rounded-lg">
              <User className="w-5 h-5 text-blue-500" />
              <div>
                <p className="font-medium text-slate-900">
                  {conversation.participant_1?.account_type === 'individual'
                    ? conversation.participant_1?.name
                    : conversation.participant_1?.business_name
                  }
                </p>
                <p className="text-sm text-slate-500">{conversation.participant_1?.email}</p>
              </div>
            </div>
          </div>

          {/* Participant 2 */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Participant 2</label>
            <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 rounded-lg">
              <User className="w-5 h-5 text-purple-500" />
              <div>
                <p className="font-medium text-slate-900">
                  {conversation.participant_2?.account_type === 'individual'
                    ? conversation.participant_2?.name
                    : conversation.participant_2?.business_name
                  }
                </p>
                <p className="text-sm text-slate-500">{conversation.participant_2?.email}</p>
              </div>
            </div>
          </div>

          {/* Created Date */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Created</label>
            <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 rounded-lg">
              <Calendar className="w-5 h-5 text-slate-400" />
              <span className="text-slate-900">{formatFullDate(conversation.created_at)}</span>
            </div>
          </div>

          {/* Last Message */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Last Activity</label>
            <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 rounded-lg">
              <Calendar className="w-5 h-5 text-slate-400" />
              <span className="text-slate-900">{formatDate(conversation.last_message_at)}</span>
            </div>
          </div>

          {/* Related Listing */}
          {conversation.listing && (
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">Related Listing</label>
              <div className="flex items-center gap-3 px-4 py-3 bg-blue-50 rounded-lg border border-blue-200">
                <Package className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-medium text-slate-900">{conversation.listing.surplusType}</p>
                  <p className="text-sm text-slate-600">Amount: {conversation.listing.amount}</p>
                </div>
              </div>
            </div>
          )}

          {/* Conversation ID */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-2">Conversation ID</label>
            <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 rounded-lg">
              <span className="text-slate-900 text-sm font-mono">{conversation.id}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-slate-900">Messages</h2>
          <div className="flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-700 rounded-full">
            <MessageSquare className="w-4 h-4" />
            <span className="text-sm font-medium">{messages.length} messages</span>
          </div>
        </div>

        {messages.length === 0 ? (
          <p className="text-center text-slate-500 py-8">No messages in this conversation</p>
        ) : (
          <div className="space-y-4">
            {messages.map((message, index) => {
              const sender = message.sender;
              const senderName = sender?.account_type === 'individual'
                ? sender?.name
                : sender?.business_name;

              return (
                <div
                  key={message.id}
                  className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition"
                >
                  {/* Message Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                        {senderName?.charAt(0) || '?'}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{senderName || 'Unknown'}</p>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <Mail className="w-3 h-3" />
                          {sender?.email || 'N/A'}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <p className="text-xs text-slate-500">{formatDate(message.created_at)}</p>
                        <p className="text-xs text-slate-400">{formatFullDate(message.created_at)}</p>
                      </div>
                      <button
                        onClick={() => handleDeleteMessage(message.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="Delete Message"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Message Content */}
                  <div className="ml-13 pl-4 border-l-2 border-slate-200">
                    <p className="text-slate-700 whitespace-pre-wrap">{message.content}</p>
                  </div>

                  {/* Message Meta */}
                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                    <div>Message #{index + 1}</div>
                    <div className="flex items-center gap-2">
                      <span className={`
                        inline-block px-2 py-1 rounded-full
                        ${message.is_read
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                        }
                      `}>
                        {message.is_read ? 'Read' : 'Unread'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
