'use client';

import { useState, useEffect, useRef } from 'react';
import { ArrowUpCircle, X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
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

  // Auto-resize the textarea based on its content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        150
      )}px`;
    }
  }, [inputValue]);

  // Scroll to the latest message whenever messages or typing indicator updates
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const sendMessage = async (content?: string) => {
    const messageContent = content || inputValue.trim();
    if (!messageContent) return;

    // Add the user's message to the conversation history
    setMessages((prev) => [
      ...prev,
      {
        id: Math.random().toString(),
        content: messageContent,
        isUser: true,
        type: 'text',
      },
    ]);

    // Clear the input immediately
    setInputValue('');

    // Set the typing indicator while the actual API call is pending
    setIsTyping(true);

    try {
      // Call your server action (real logic)
      const response = await chat({ message: messageContent });

      // Disable the typing indicator once the API call is complete
      setIsTyping(false);

      if (!response.success) {
        toast.error(response.response, { duration: 3000 });
        return;
      }

      // Ensure that the bot's response is a string.
      const botResponse =
        typeof response.response === 'string'
          ? response.response
          : JSON.stringify(response.response);

      // Add the bot's response to the conversation history
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

  return (
    // Outer container: adjust positioning responsively.
    <div className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 z-50">
      {/* Chat Bubble Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 
          bg-gradient-to-r from-purple-500 to-purple-700 hover:scale-105 text-white
          ${isOpen ? 'scale-0' : 'scale-100'}`}
      >
        <span className="text-2xl animate-pulse">💬</span>
      </button>

      {/* Chat Container */}
      <div
        className={`absolute bottom-[calc(100%+1rem)] right-0 w-full sm:w-96 max-h-[70vh] rounded-2xl shadow-lg transform transition-all duration-300 
          ${isOpen
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 translate-y-4 pointer-events-none'}
          bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800`}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
          <h2 className="text-xl font-bold flex items-center gap-2 text-purple-600 dark:text-purple-400">
            <span className="bg-purple-100 dark:bg-purple-900 p-2 rounded-lg">🤖</span>
            Ask Assistant
          </h2>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
        </div>

        {/* Messages Container */}
        <div className="p-4 h-[400px] overflow-y-auto space-y-6 bg-gray-50 dark:bg-gray-950">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-4 transition-all duration-200 ${
                  message.isUser 
                    ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white'
                    : 'bg-white dark:bg-gray-800 shadow-md'
                }`}
              >
                {message.type === 'text' && (
                  <>
                    {message.isUser ? (
                      <p className="break-words text-white">{message.content}</p>
                    ) : (
                      <ReactMarkdown className="break-words text-gray-800 dark:text-gray-100">
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
                <div className="flex space-x-2">
                  <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce"></div>
                  <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce delay-100"></div>
                  <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce delay-200"></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
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
                transition-all duration-200 scrollbar-hide"
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
