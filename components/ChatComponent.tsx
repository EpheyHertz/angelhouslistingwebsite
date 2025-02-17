'use client';

import { useState, useEffect, useRef } from 'react';
import { ArrowUpCircle, X } from 'lucide-react';
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

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        150
      )}px`;
    }
  }, [inputValue]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const sendMessage = async (content?: string) => {
    const messageContent = content || inputValue.trim();
    if (!messageContent) return;

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
      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          content: 'Sorry, there was an error. Please try again.',
          isUser: false,
          type: 'text',
        },
      ]);
    }
  };

  const MarkdownComponents = {
    code({ node, inline, className, children, ...props }: any) {
      const match = /language-(\w+)/.exec(className || '');
      return !inline && match ? (
        <SyntaxHighlighter
          style={materialOceanic}
          language={match[1]}
          PreTag="div"
          className="rounded-lg p-4 my-2"
          {...props}
        >
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      ) : (
        <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md" {...props}>
          {children}
        </code>
      );
    },
    img({ src, alt }: { src?: string; alt?: string }) {
      return (
        <img 
          src={src} 
          alt={alt} 
          className="max-w-full h-auto rounded-lg border border-gray-200 dark:border-gray-700 my-2"
          loading="lazy"
        />
      );
    },
    a({ href, children }: { href?: string; children?: React.ReactNode }) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-purple-600 dark:text-purple-400 hover:underline"
        >
          {children}
        </a>
      );
    },
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 
          bg-gradient-to-br from-purple-600 via-blue-500 to-indigo-600 hover:scale-110 text-white
          ${isOpen ? 'scale-0' : 'scale-100'} backdrop-blur-lg`}
      >
        <span className="text-2xl animate-pulse">✨</span>
      </button>

      <div
        className={`absolute bottom-[calc(100%+1rem)] right-0 w-[90vw] max-w-lg max-h-[80vh] rounded-2xl shadow-2xl transform transition-all duration-300
          ${isOpen
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 translate-y-4 pointer-events-none'}
          bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 backdrop-blur-lg`}
      >
        <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between bg-gradient-to-r from-purple-600 to-blue-500">
          <h2 className="text-xl font-bold flex items-center gap-2 text-white">
            <span className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">🚀</span>
            AI Assistant
          </h2>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        <div className="p-4 h-[500px] overflow-y-auto space-y-4 bg-gradient-to-b from-white/50 to-gray-50/50 dark:from-gray-900/50 dark:to-gray-950/50">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[90%] rounded-2xl p-4 transition-all duration-200 shadow-sm
                  ${message.isUser 
                    ? 'bg-gradient-to-r from-purple-600 to-blue-500 text-white'
                    : 'bg-white dark:bg-gray-800 shadow-md'}`}
              >
                {message.type === 'text' && (
                  <>
                    {message.isUser ? (
                      <p className="break-words text-white">{message.content}</p>
                    ) : (
                      <ReactMarkdown
                        className="prose dark:prose-invert max-w-none"
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[[rehypeExternalLinks, { target: '_blank' }]]}
                        components={MarkdownComponents}
                      >
                        {message.content}
                      </ReactMarkdown>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="max-w-[85%] rounded-2xl p-4 bg-white dark:bg-gray-800 shadow-md">
                <div className="flex space-x-2 items-center">
                  <div className="dot-flashing"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-300">Thinking...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
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
              placeholder="Ask me anything..."
              className="w-full py-3 px-4 pr-12 rounded-xl resize-none focus:outline-none
                bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                placeholder-gray-400 dark:placeholder-gray-500
                border border-gray-200 dark:border-gray-700
                transition-all duration-200 scrollbar-hide focus:ring-2 focus:ring-purple-500"
              rows={1}
              style={{ minHeight: '56px' }}
            />
            <button
              onClick={() => sendMessage()}
              className={`absolute right-3 bottom-3 p-2 rounded-full transition-all
                ${inputValue
                  ? 'text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300'
                  : 'text-gray-400'} 
                hover:bg-gray-100 dark:hover:bg-gray-700 disabled:bg-gray-100 disabled:cursor-not-allowed`}
              disabled={isTyping}
            >
              <ArrowUpCircle className="w-6 h-6" strokeWidth={2} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}