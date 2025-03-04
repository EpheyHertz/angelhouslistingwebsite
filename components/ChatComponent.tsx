'use client';

import { useState, useEffect, useRef } from 'react';
import { ArrowUpCircle, X, MessageCircle, Home, User, Bot } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeExternalLinks from 'rehype-external-links';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialOceanic } from 'react-syntax-highlighter/dist/esm/styles/prism';
import chat from '@/app/server-action/chat-actions';
import toast from 'react-hot-toast';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  type: 'text';
}

export default function ChatBubble() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Dynamic height adjustments for textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        150
      )}px`;
    }
  }, [inputValue]);

  // Smooth scrolling and focus management
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (isOpen && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [messages, isTyping, isOpen]);

  const sendMessage = async (content?: string) => {
    const messageContent = content || inputValue.trim();
    if (!messageContent) return;

    // Add user message
    setMessages((prev) => [
      ...prev,
      {
        id: Math.random().toString(),
        content: messageContent,
        isUser: true,
        type: 'text',
      },
    ]);

    setInputValue('');
    setIsTyping(true);

    try {
      const response = await chat({ message: messageContent });
      setIsTyping(false);

      if (!response.success) {
        toast.error(response.response, { duration: 3000 });
        return;
      }

      const botResponse =
        typeof response.response === 'string'
          ? response.response
          : JSON.stringify(response.response);

      // Add bot response
      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          content: botResponse,
          isUser: false,
          type: 'text',
        },
      ]);
    } catch (error) {
      setIsTyping(false);
      console.error('Error fetching response:', error);
      toast.error('Failed to send message. Please try again.');
    }
  };

  // Enhanced Markdown components for housing-related content
  const MarkdownComponents = {
    code({ node, inline, className, children, ...props }: any) {
      const match = /language-(\w+)/.exec(className || '');
      return !inline && match ? (
        <SyntaxHighlighter
          style={materialOceanic}
          language={match[1]}
          PreTag="div"
          className="rounded-lg p-4 my-2 overflow-x-auto code-block animate-fade-in"
          {...props}
        >
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      ) : (
        <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md text-sm font-mono code-inline" {...props}>
          {children}
        </code>
      );
    },
    img({ src, alt }: { src?: string; alt?: string }) {
      return (
        <img 
          src={src} 
          alt={alt || 'Housing image'} 
          className="max-w-full h-auto rounded-lg border border-gray-200 dark:border-gray-700 my-2 object-contain animate-media-in"
          loading="lazy"
          onError={(e) => (e.currentTarget.style.display = 'none')}
        />
      );
    },
    a({ href, children }: { href?: string; children?: React.ReactNode }) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline transition-colors duration-200 link-underline"
        >
          {children}
        </a>
      );
    },
    table({ children }: { children?: React.ReactNode }) {
      return (
        <div className="overflow-x-auto">
          <table className="w-full my-4 border-collapse">
            {children}
          </table>
        </div>
      );
    },
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close chat" : "Open chat"}
        className={`
          group w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center 
          shadow-lg transition-all duration-300 
          bg-gradient-to-br from-blue-600 to-teal-500 
          hover:scale-110 text-white focus:outline-none focus:ring-4 focus:ring-blue-300/50
          ${isOpen ? 'scale-0 rotate-180' : 'scale-100 rotate-0'}
          backdrop-blur-lg hover:shadow-blue-500/30 animate-float
        `}
      >
        <Home className="w-6 h-6 sm:w-8 sm:h-8 transition-transform group-hover:scale-110" />
        <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-30 transition-opacity bg-gradient-to-r from-blue-400 to-teal-400 animate-pulse" />
      </button>

      {/* Chat Container */}
      <div
        ref={chatContainerRef}
        className={`
          absolute bottom-full right-0 mb-4
          w-[90vw] sm:w-[400px] md:w-[450px] lg:w-[500px] xl:w-[550px]
          max-h-[70vh] sm:max-h-[80vh]
          rounded-xl shadow-lg transform transition-all duration-300 origin-bottom-right
          ${isOpen
            ? 'opacity-100 translate-y-0 pointer-events-auto scale-100'
            : 'opacity-0 translate-y-4 pointer-events-none scale-95'}
          bg-white dark:bg-gray-900 
          border border-gray-200 dark:border-gray-800 
          backdrop-blur-xl overflow-hidden
          ring-1 ring-black/5 dark:ring-white/10
        `}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between bg-gradient-to-r from-blue-600 to-teal-500">
          <h2 className="text-xl font-bold flex items-center gap-2 text-white">
            <MessageCircle className="w-6 h-6 text-teal-200" />
            <span className="bg-gradient-to-r from-teal-200 to-blue-200 bg-clip-text text-transparent">
              Housing Assistant
            </span>
          </h2>
          <button
            onClick={() => setIsOpen(false)}
            aria-label="Close chat"
            className="p-2 rounded-lg hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
          >
            <X className="w-6 h-6 text-white/80 hover:text-white" />
          </button>
        </div>

        {/* Messages Container */}
        <div className="p-4 h-[50vh] sm:h-[60vh] overflow-y-auto space-y-4 custom-scrollbar bg-gradient-to-b from-white/50 to-gray-50/50 dark:from-gray-900/50 dark:to-gray-950/50">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} animate-message-in`}
            >
              <div className="flex items-start gap-2">
                {/* User or Bot Icon */}
                {message.isUser ? (
                  <div className="w-8 h-8 flex items-center justify-center bg-blue-600 rounded-full p-2">
                    <User className="w-5 h-5 text-white" />
                  </div>
                ) : (
                  <div className="w-8 h-8 flex items-center justify-center bg-teal-500 rounded-full p-2">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                )}

                {/* Message Bubble */}
                <div
                  className={`
                    max-w-[85%] rounded-xl p-3 
                    transition-all duration-200 
                    ${message.isUser 
                      ? 'bg-gradient-to-r from-blue-600 to-teal-500 text-white'
                      : 'bg-white dark:bg-gray-800 shadow-sm'}
                    hover:shadow-md
                    ${message.isUser ? 'hover:shadow-blue-500/20' : 'hover:shadow-gray-200/20 dark:hover:shadow-gray-800/20'}
                  `}
                >
                  {message.type === 'text' && (
                    message.isUser ? (
                      <p className="break-words">{message.content}</p>
                    ) : (
                      <ReactMarkdown
                        className="prose dark:prose-invert max-w-none"
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[[rehypeExternalLinks, { target: '_blank' }]]}
                        components={MarkdownComponents}
                      >
                        {message.content}
                      </ReactMarkdown>
                    )
                  )}
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start animate-typing-in">
              <div className="max-w-[85%] rounded-xl p-3 bg-white dark:bg-gray-800 shadow-sm">
                <div className="flex space-x-2 items-center text-gray-600 dark:text-gray-300">
                  <div className="flex space-x-1">
                    {[...Array(3)].map((_, i) => (
                      <div 
                        key={i}
                        className="w-2 h-2 bg-current rounded-full animate-typing-dot"
                        style={{ animationDelay: `${i * 0.2}s` }}
                      />
                    ))}
                  </div>
                  <span className="text-sm">Finding the best options for you...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} className="h-4" />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm">
          <div className="relative">
            <textarea
              ref={textareaRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              placeholder="Ask about properties, pricing, or availability..."
              className="
                w-full py-2 px-4 pr-12 rounded-lg resize-none 
                bg-white dark:bg-gray-800 
                text-gray-900 dark:text-gray-100
                placeholder-gray-400 dark:placeholder-gray-500
                border-2 border-gray-200 dark:border-gray-700 
                focus:border-blue-400 focus:ring-2 focus:ring-blue-200/50
                transition-all duration-200 
                text-base
                scrollbar-hide
                ring-inset
              "
              rows={1}
              style={{ minHeight: '48px', maxHeight: '150px' }}
              aria-label="Type your message"
            />
            <button
              onClick={() => sendMessage()}
              disabled={isTyping}
              className={`
                absolute right-3 bottom-3 p-2 rounded-full transition-all
                ${inputValue 
                  ? 'text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300'
                  : 'text-gray-400 dark:text-gray-500'} 
                hover:bg-gray-100 dark:hover:bg-gray-700/50
                disabled:opacity-50 disabled:cursor-not-allowed
                focus:outline-none focus:ring-2 focus:ring-blue-300/50
                transform active:scale-95
              `}
              aria-label="Send message"
            >
              <ArrowUpCircle className="w-6 h-6" strokeWidth={2} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}