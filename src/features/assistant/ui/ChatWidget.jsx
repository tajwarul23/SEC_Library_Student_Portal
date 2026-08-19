import React, { useEffect, useRef, useState } from 'react';
import { BookOpenText, Loader2, MessageCircle, Send, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAskAssistant } from '../Hooks/useAssistant';
import { ChatMessage } from './ChatMessage';

const THREAD_STORAGE_KEY = 'sec-library-assistant-thread-id';

const getOrCreateThreadId = () => {
  let id = sessionStorage.getItem(THREAD_STORAGE_KEY);
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem(THREAD_STORAGE_KEY, id);
  }
  return id;
};

const INITIAL_MESSAGE = {
  id: 'greeting',
  role: 'assistant',
  content:
    "Hi, I'm the Library Assistant! Tell me a topic or subject you're studying and I'll find books in our library that cover it.\n\nTry asking:\n1. \"Books on sorting algorithms\"\n2. \"What covers database normalization?\"\n3. \"Do we have anything on operating systems?\"",
};

export const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const threadIdRef = useRef(null);
  const scrollRef = useRef(null);
  const askAssistant = useAskAssistant();

  if (!threadIdRef.current) {
    threadIdRef.current = getOrCreateThreadId();
  }

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, askAssistant.isPending]);

  const handleSend = async (e) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || askAssistant.isPending) return;

    const userMessage = { id: crypto.randomUUID(), role: 'user', content: trimmed };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    try {
      const result = await askAssistant.mutateAsync({
        input: trimmed,
        threadId: threadIdRef.current,
      });
      // Backend now returns a structured object: { type, message, books? }
      const data = result?.ai || {};
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: data.message || "I couldn't generate a response. Please try again.",
          books: data.books,
          type: data.type,
        },
      ]);
    } catch (error) {
      const message = error.extractedMessage || 'Failed to reach the library assistant.';
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: 'assistant', content: message, isError: true },
      ]);
      toast.error(message);
    }
  };

  return (
    <>
      {isOpen && (
        <div className="fixed bottom-40 right-4 sm:right-6 z-50 w-[90vw] max-w-sm h-[28rem] max-h-[70vh] bg-white rounded-xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="px-4 py-3 bg-slate-900 text-white flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-[#0EA5E9]/20 flex items-center justify-center">
                <BookOpenText className="w-4 h-4 text-[#38BDF8]" />
              </div>
              <div>
                <h3 className="text-sm font-bold leading-tight">Library Assistant</h3>
                <p className="text-[10px] text-slate-400">Ask about books & topics</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-3 bg-slate-50">
            {messages.map((msg) => (
              <ChatMessage
                key={msg.id}
                role={msg.role}
                content={msg.content}
                books={msg.books}
                type={msg.type}
                isError={msg.isError}
              />
            ))}
            {askAssistant.isPending && (
              <div className="flex items-center gap-2 text-slate-400 text-xs pl-8">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Thinking...</span>
              </div>
            )}
          </div>

          {/* Input */}
          <form
            onSubmit={handleSend}
            className="p-2.5 border-t border-slate-200 bg-white flex items-center gap-2 shrink-0"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about a topic or book..."
              disabled={askAssistant.isPending}
              className="flex-1 min-w-0 px-3 py-2 text-xs border border-slate-300 rounded-md focus:outline-hidden focus:ring-2 focus:ring-sky-400 disabled:bg-slate-100"
            />
            <button
              type="submit"
              disabled={!input.trim() || askAssistant.isPending}
              className="w-8 h-8 shrink-0 flex items-center justify-center rounded-md bg-[#0EA5E9] text-white hover:bg-sky-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}

      {/* Floating toggle button */}
      <div className="fixed bottom-20 right-4 sm:right-6 z-50">
        {!isOpen && (
          <span className="absolute inset-0 rounded-full bg-[#0EA5E9] animate-ping opacity-75 pointer-events-none" />
        )}
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="relative w-14 h-14 rounded-full bg-[#0EA5E9] hover:bg-sky-600 text-white shadow-xl shadow-sky-500/40 ring-4 ring-white flex items-center justify-center transition-all hover:scale-105 cursor-pointer"
          aria-label="Toggle library assistant"
        >
          {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
        </button>
      </div>
    </>
  );
};
