'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  ArrowUpCircle, 
  X, 
  MessageCircle, 
  Home, 
  User, 
  Bot, 
  Copy, 
  CheckCircle, 
  RefreshCcw,
  AlertTriangle
} from 'lucide-react';
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
  status?: 'sent' | 'failed';
}

// New interface for backend response
interface ChatResponse {
  thread_id: string;
  response: string;
  message_history: {
    type: 'HumanMessage' | 'AIMessage';
    content: string;
    timestamp: string | null;
  }[];
}

export default function ChatBubble() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [threadId, setThreadId] = useState<string | null>(null);
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

  // Clear copied status after 2 seconds
  useEffect(() => {
    if (copiedId) {
      const timeout = setTimeout(() => {
        setCopiedId(null);
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [copiedId]);

  const copyToClipboard = (content: string, id: string) => {
    navigator.clipboard.writeText(content)
      .then(() => {
        setCopiedId(id);
        toast.success('Copied to clipboard!', { 
          icon: '📋',
          duration: 2000,
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          },
        });
      })
      .catch(() => {
        toast.error('Failed to copy text', { duration: 2000 });
      });
  };

  // Convert message history to our Message format
  const convertMessageHistory = (messageHistory: ChatResponse['message_history']) => {
    return messageHistory.map((msg) => ({
      id: Math.random().toString(),
      content: msg.content,
      isUser: msg.type === 'HumanMessage',
      type: 'text' as const,
      status: 'sent' as const
    }));
  };

  const sendMessage = async (content?: string, retryMessageId?: string) => {
    const messageContent = content || inputValue.trim();
    if (!messageContent) return;

    // For new messages (not retries)
    if (!retryMessageId) {
      // Add user message
      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          content: messageContent,
          isUser: true,
          type: 'text',
          status: 'sent'
        },
      ]);
      setInputValue('');
    } else {
      // For retries, mark the message as sent again
      setMessages(prev => prev.map(msg => 
        msg.id === retryMessageId ? {...msg, status: 'sent'} : msg
      ));
    }

    setIsTyping(true);

    try {
      // Pass thread_id if we have one
      const response = await chat({ 
        message: messageContent,
        thread_id: threadId || undefined
      });
      
      setIsTyping(false);

      if (!response.success) {
        // If there was a retry message, mark it as failed
        if (retryMessageId) {
          setMessages(prev => prev.map(msg => 
            msg.id === retryMessageId ? {...msg, status: 'failed'} : msg
          ));
        }
        
        toast.error(typeof response.response === 'string' ? response.response : 'Failed to send message', { 
          duration: 3000,
          icon: '⚠️',
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          },
        });
        return;
      }

      // Process the new response format
      const chatResponse = response.response as unknown as ChatResponse;
      
      // Update thread ID
      if (chatResponse.thread_id) {
        setThreadId(chatResponse.thread_id);
      }

      // Option 1: Add just the bot response
      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          content: chatResponse.response,
          isUser: false,
          type: 'text',
        },
      ]);

      // Option 2 (alternate approach): Replace all messages with message_history
      // Only use this if you want to sync completely with backend history
      // setMessages(convertMessageHistory(chatResponse.message_history));
      
    } catch (error) {
      setIsTyping(false);
      
      // If there was a retry message, mark it as failed
      if (retryMessageId) {
        setMessages(prev => prev.map(msg => 
          msg.id === retryMessageId ? {...msg, status: 'failed'} : msg
        ));
      }
      
      console.error('Error fetching response:', error);
      toast.error('Failed to send message. Please try again.', {
        icon: '❌',
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      });
    }
  };

  const retryMessage = (messageId: string, content: string) => {
    sendMessage(content, messageId);
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

  // Helper function for welcome message
  const getWelcomeMessage = () => {
    if (messages.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center space-y-4 text-gray-500 dark:text-gray-400 px-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500/20 to-teal-500/20 flex items-center justify-center">
            <Home className="w-10 h-10 text-blue-500 dark:text-teal-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">Welcome to Comrade Homes</h3>
          <p className="text-sm max-w-sm">
            Ask me about available properties, pricing, neighborhoods, or any other housing questions you may have!
          </p>
          <div className="flex flex-wrap justify-center gap-2 w-full max-w-sm">
            {["What properties are available?", "Tell me about pricing of bedsitters?", "Tell me houses around Embu?"].map((prompt) => (
              <button
                key={prompt}
                onClick={() => sendMessage(prompt)}
                className="px-3 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-full text-xs text-blue-600 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-800/30 transition-colors font-medium"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close chat" : "Open chat"}
        className={`
          group w-14 h-14 sm:w-16 sm:h-16 lg:w-18 lg:h-18 rounded-full flex items-center justify-center 
          shadow-lg transition-all duration-300 
          bg-gradient-to-br from-blue-600 to-teal-500 
          hover:scale-110 text-white focus:outline-none focus:ring-4 focus:ring-blue-300/50
          ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}
          backdrop-blur-lg hover:shadow-xl hover:shadow-blue-500/20
        `}
      >
        <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7 transition-transform group-hover:scale-110" />
        <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-30 transition-opacity bg-white animate-pulse" />
      </button>

      {/* Chat Container */}
      <div
        ref={chatContainerRef}
        className={`
          absolute bottom-0 right-0 mb-4
          w-[90vw] sm:w-[400px] md:w-[450px] lg:w-[500px] xl:w-[550px]
          max-h-[80vh] sm:max-h-[85vh]
          rounded-2xl shadow-2xl transform transition-all duration-300 origin-bottom-right
          ${isOpen
            ? 'opacity-100 translate-y-0 pointer-events-auto scale-100'
            : 'opacity-0 translate-y-12 pointer-events-none scale-95'}
          bg-white dark:bg-gray-900 
          border border-gray-200 dark:border-gray-800 
          backdrop-blur-xl overflow-hidden
          ring-1 ring-black/5 dark:ring-white/10
        `}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between bg-gradient-to-r from-blue-600 via-blue-500 to-teal-500">
          <h2 className="text-xl font-bold flex items-center gap-2 text-white">
            <div className="p-1.5 bg-white/20 rounded-lg">
              <Home className="w-5 h-5 text-white" />
            </div>
            <span className="bg-gradient-to-r from-white to-teal-100 bg-clip-text text-transparent">
              Comrade Homes
            </span>
          </h2>
          <button
            onClick={() => setIsOpen(false)}
            aria-label="Close chat"
            className="p-2 rounded-lg hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50 active:scale-95"
          >
            <X className="w-6 h-6 text-white/80 hover:text-white" />
          </button>
        </div>

        {/* Messages Container */}
        <div className="p-4 h-[50vh] sm:h-[60vh] overflow-y-auto space-y-4 custom-scrollbar bg-gradient-to-b from-white to-gray-50/80 dark:from-gray-900 dark:to-gray-950/80">
          {getWelcomeMessage()}
          
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} animate-message-in`}
            >
              <div className="group flex items-start gap-2 max-w-[85%]">
                {/* User or Bot Icon */}
                {message.isUser ? (
                  <div className={`
                    w-8 h-8 flex-shrink-0 flex items-center justify-center 
                    rounded-full p-2
                    ${message.status === 'failed' 
                      ? 'bg-red-500/80' 
                      : 'bg-gradient-to-br from-blue-500 to-teal-400'}
                  `}>
                   {message.status === 'failed' 
                      ? <AlertTriangle className="w-4 h-4 text-white" />
                      : <User className="w-4 h-4 text-white" />
                    }
                  </div>
                ) : (
                  <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center bg-gradient-to-br from-teal-500 to-blue-400 rounded-full p-2">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                )}

                {/* Message Bubble */}
                <div className="flex flex-col w-full">
                  <div
                    className={`
                      rounded-2xl p-3.5 
                      ${message.isUser 
                        ? message.status === 'failed'
                          ? 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200'
                          : 'bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200' 
                        : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200'}
                      shadow-sm border
                      ${message.isUser 
                        ? message.status === 'failed'
                          ? 'border-red-200 dark:border-red-800/30'
                          : 'border-blue-200 dark:border-blue-800/30' 
                        : 'border-gray-100 dark:border-gray-700/50'}
                      transition-all duration-200 
                      ${message.isUser 
                        ? message.status === 'failed'
                          ? 'hover:shadow-red-500/10'
                          : 'hover:shadow-blue-500/20' 
                        : 'hover:shadow-gray-200/20 dark:hover:shadow-gray-800/20'}
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
                  
                  {/* Message Actions (Copy, Retry) */}
                  <div className={`
                    flex items-center gap-2 mt-1 px-1
                    ${message.isUser && message.status === 'failed' ? 'justify-end' : 'opacity-0 group-hover:opacity-100'}
                    transition-opacity duration-200
                  `}>
                    {/* Copy button */}
                    <button
                      onClick={() => copyToClipboard(message.content, message.id)}
                      className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors"
                      aria-label="Copy message"
                    >
                      {copiedId === message.id ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                    
                    {/* Retry button - only shown for failed messages */}
                    {message.isUser && message.status === 'failed' && (
                      <button
                        onClick={() => retryMessage(message.id, message.content)}
                        className="p-1 rounded-full bg-red-50 dark:bg-red-900/30 text-red-500 hover:bg-red-100 dark:hover:bg-red-800/50 transition-colors flex items-center gap-1 text-xs"
                        aria-label="Retry sending message"
                      >
                        <RefreshCcw className="w-3 h-3" />
                        <span>Retry</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start animate-typing-in">
              <div className="flex items-start gap-2">
                <div className="w-8 h-8 flex items-center justify-center bg-gradient-to-br from-teal-500 to-blue-400 rounded-full p-2">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="max-w-[85%] rounded-2xl p-3.5 bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700/50">
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
              placeholder="Ask about properties, pricing, or locations..."
              className="
                w-full py-3 px-4 pr-12 rounded-xl resize-none 
                bg-white dark:bg-gray-800 
                text-gray-900 dark:text-gray-100
                placeholder-gray-400 dark:placeholder-gray-500
                border-2 border-gray-200 dark:border-gray-700 
                focus:border-blue-400 focus:ring-2 focus:ring-blue-200/50
                focus:outline-none
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
              disabled={isTyping || !inputValue.trim()}
              className={`
                absolute right-3 bottom-3 p-2 
                rounded-full transition-all
                ${inputValue.trim() 
                  ? 'bg-gradient-to-r from-blue-500 to-teal-400 text-white' 
                  : 'text-gray-400 dark:text-gray-500'} 
                hover:shadow-md hover:shadow-blue-500/20
                disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none
                focus:outline-none focus:ring-2 focus:ring-blue-300/50
                transform active:scale-95
              `}
              aria-label="Send message"
            >
              <ArrowUpCircle className="w-6 h-6" strokeWidth={1.5} />
            </button>
          </div>
          
          {/* Footer with helpful tips or branding */}
          <div className="flex justify-center mt-3">
            <p className="text-xs text-gray-400 dark:text-gray-500">
              <span className="font-medium text-blue-500 dark:text-blue-400">Comrade Homes</span> - Finding your perfect community
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}