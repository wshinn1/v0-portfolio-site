'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Mail, Clock, User, Trash2, Check, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface ContactSubmission {
  id: string
  name: string
  email: string
  message: string
  created_at: string
  read: boolean
}

export default function MessagesPage() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedMessage, setSelectedMessage] = useState<ContactSubmission | null>(null)

  useEffect(() => {
    fetchSubmissions()
  }, [])

  async function fetchSubmissions() {
    const { data, error } = await supabase
      .from('contact_submissions')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching submissions:', error)
    } else {
      setSubmissions(data || [])
    }
    setLoading(false)
  }

  async function markAsRead(id: string) {
    await supabase
      .from('contact_submissions')
      .update({ read: true })
      .eq('id', id)
    
    setSubmissions(prev => 
      prev.map(s => s.id === id ? { ...s, read: true } : s)
    )
  }

  async function deleteSubmission(id: string) {
    await supabase
      .from('contact_submissions')
      .delete()
      .eq('id', id)
    
    setSubmissions(prev => prev.filter(s => s.id !== id))
    if (selectedMessage?.id === id) {
      setSelectedMessage(null)
    }
  }

  function formatDate(dateString: string) {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const unreadCount = submissions.filter(s => !s.read).length

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Header */}
      <header className="bg-white border-b border-zinc-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                href="/admin" 
                className="p-2 hover:bg-zinc-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-zinc-900">Messages</h1>
                <p className="text-sm text-zinc-500">
                  {submissions.length} total, {unreadCount} unread
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-zinc-900" />
          </div>
        ) : submissions.length === 0 ? (
          <div className="bg-white rounded-xl border border-zinc-200 p-12 text-center">
            <Mail className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-zinc-900 mb-2">No messages yet</h2>
            <p className="text-zinc-500">When someone submits your contact form, their messages will appear here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Message List */}
            <div className="lg:col-span-1 space-y-2">
              {submissions.map((submission) => (
                <button
                  key={submission.id}
                  onClick={() => {
                    setSelectedMessage(submission)
                    if (!submission.read) markAsRead(submission.id)
                  }}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${
                    selectedMessage?.id === submission.id
                      ? 'bg-zinc-900 text-white border-zinc-900'
                      : submission.read
                      ? 'bg-white border-zinc-200 hover:border-zinc-300'
                      : 'bg-blue-50 border-blue-200 hover:border-blue-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span className={`font-medium truncate ${
                      selectedMessage?.id === submission.id ? 'text-white' : 'text-zinc-900'
                    }`}>
                      {submission.name}
                    </span>
                    {!submission.read && selectedMessage?.id !== submission.id && (
                      <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-2" />
                    )}
                  </div>
                  <p className={`text-sm truncate mb-2 ${
                    selectedMessage?.id === submission.id ? 'text-zinc-300' : 'text-zinc-500'
                  }`}>
                    {submission.email}
                  </p>
                  <p className={`text-sm line-clamp-2 ${
                    selectedMessage?.id === submission.id ? 'text-zinc-400' : 'text-zinc-600'
                  }`}>
                    {submission.message}
                  </p>
                  <p className={`text-xs mt-2 ${
                    selectedMessage?.id === submission.id ? 'text-zinc-400' : 'text-zinc-400'
                  }`}>
                    {formatDate(submission.created_at)}
                  </p>
                </button>
              ))}
            </div>

            {/* Message Detail */}
            <div className="lg:col-span-2">
              {selectedMessage ? (
                <div className="bg-white rounded-xl border border-zinc-200 p-6">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h2 className="text-xl font-semibold text-zinc-900 mb-1">
                        {selectedMessage.name}
                      </h2>
                      <a 
                        href={`mailto:${selectedMessage.email}`}
                        className="text-blue-600 hover:underline"
                      >
                        {selectedMessage.email}
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <a
                        href={`mailto:${selectedMessage.email}?subject=Re: Your message`}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900 text-white rounded-lg hover:bg-zinc-800 transition-colors"
                      >
                        <Mail className="w-4 h-4" />
                        Reply
                      </a>
                      <button
                        onClick={() => deleteSubmission(selectedMessage.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete message"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-zinc-500 mb-6 pb-6 border-b">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {formatDate(selectedMessage.created_at)}
                    </div>
                    {selectedMessage.read && (
                      <div className="flex items-center gap-1 text-green-600">
                        <Check className="w-4 h-4" />
                        Read
                      </div>
                    )}
                  </div>

                  <div className="prose prose-zinc max-w-none">
                    <p className="whitespace-pre-wrap text-zinc-700 leading-relaxed">
                      {selectedMessage.message}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-xl border border-zinc-200 p-12 text-center">
                  <Mail className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
                  <p className="text-zinc-500">Select a message to view details</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
