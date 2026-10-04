'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { X, Send, Sparkles, Loader2, Brain } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function AIChat() {
  const t = useTranslations('ai');
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const sendMessage = async (messageText: string) => {
    if (!messageText.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: messageText.trim()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:3002/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: messageText.trim(),
          history: messages
        }),
      });

      const data = await response.json();

      if (data.success) {
        const aiMessage: Message = {
          role: 'assistant',
          content: data.response
        };
        setMessages(prev => [...prev, aiMessage]);
      } else {
        const errorMessage: Message = {
          role: 'assistant',
          content: t('error')
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error('AI Chat Error:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: t('error')
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleQuickQuestion = (question: string) => {
    sendMessage(question);
  };

  const quickQuestions = [
    t('quick_questions.q1'),
    t('quick_questions.q2'),
    t('quick_questions.q3'),
    t('quick_questions.q4'),
    t('quick_questions.q5'),
    t('quick_questions.q6'),
    t('quick_questions.q7'),
    t('quick_questions.q8'),
  ];

  return (
    <>
      {/* AI Button - Fixed position, always visible, above ScrollToTop */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-6 z-40 flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-5 py-3 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
        aria-label="Open AI Assistant"
      >
        <Brain className="w-5 h-5" />
        <span className="font-semibold hidden sm:inline">{t('abbr')}</span>
      </button>

      {/* Chat Window - Increased size and better spacing */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl w-full max-w-3xl h-[680px] flex flex-col overflow-hidden border border-slate-200 dark:border-slate-800 transition-colors duration-200">
            {/* Header - More padding */}
            <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-5 flex items-center justify-between transition-colors duration-200">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full border-2 border-orange-500 bg-slate-900 dark:bg-slate-800 flex items-center justify-center shadow-sm">
                    <span className="text-sm font-bold bg-gradient-to-r from-orange-500 via-orange-600 to-blue-600 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient-shift">
                      {t('abbr')}
                    </span>
                  </div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-slate-900"></div>
                </div>
                <div>
                  <h2 className="font-bold text-lg text-slate-900 dark:text-slate-100">{t('title')}</h2>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{t('subtitle')}</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
                aria-label="Close chat"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Messages - More padding and spacing */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-slate-50 dark:bg-slate-950 transition-colors duration-200 scrollbar-hide">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center px-4">
                  <div className="bg-gradient-to-br from-orange-50 to-blue-50 dark:from-slate-800 dark:to-slate-800 p-6 rounded-3xl mb-6 border border-slate-200 dark:border-slate-700 transition-colors duration-200">
                    <Brain className="w-12 h-12 mx-auto text-orange-600 dark:text-orange-500 mb-3" />
                    <p className="text-slate-700 dark:text-slate-300 text-lg font-medium mb-2">{t('empty')}</p>
                  </div>

                  {/* Quick Questions - Flexible grid layout */}
                  <div className="w-full max-w-2xl">
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-4">{t('quick_questions.title')}</p>
                    <div className="flex flex-wrap gap-2 justify-start">
                      {quickQuestions.map((question, index) => (
                        <button
                          key={index}
                          onClick={() => handleQuickQuestion(question)}
                          className="text-left px-3 py-2 bg-white dark:bg-slate-800 hover:bg-orange-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 hover:border-orange-300 dark:hover:border-orange-600 rounded-xl text-sm text-slate-700 dark:text-slate-300 hover:text-orange-700 dark:hover:text-orange-400 transition-all duration-200"
                        >
                          {question}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] px-5 py-3.5 rounded-2xl transition-colors duration-200 ${
                          message.role === 'user'
                            ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-br-none shadow-md'
                            : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-bl-none shadow-sm'
                        }`}
                      >
                        <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{message.content}</p>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-5 py-3.5 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-2.5 transition-colors duration-200">
                        {/* Typing dots */}
                        <style>{`
                          @keyframes typingDot {
                            0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
                            30% { transform: translateY(-5px); opacity: 1; }
                          }
                          .typing-dot:nth-child(1) { animation: typingDot 1.2s infinite 0s; }
                          .typing-dot:nth-child(2) { animation: typingDot 1.2s infinite 0.2s; }
                          .typing-dot:nth-child(3) { animation: typingDot 1.2s infinite 0.4s; }
                        `}</style>
                        <div className="flex items-center gap-1">
                          <span className="typing-dot w-2 h-2 rounded-full bg-orange-500 inline-block"></span>
                          <span className="typing-dot w-2 h-2 rounded-full bg-orange-500 inline-block"></span>
                          <span className="typing-dot w-2 h-2 rounded-full bg-orange-500 inline-block"></span>
                        </div>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{t('loading')}...</p>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* Input - More padding */}
            <div className="border-t border-slate-200 dark:border-slate-800 p-5 bg-white dark:bg-slate-900 transition-colors duration-200">
              <form onSubmit={handleSubmit} className="flex gap-3">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={t('placeholder')}
                  disabled={isLoading}
                  className="flex-1 px-4 py-3 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-600 focus:border-transparent disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:cursor-not-allowed transition-colors duration-200"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-4 py-2.5 rounded-xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center gap-2 font-semibold shadow-md"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  <span className="hidden sm:inline text-sm">{t('send')}</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
