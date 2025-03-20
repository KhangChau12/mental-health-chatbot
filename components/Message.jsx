// Components/Message.jsx (phiên bản cải tiến)
'use client';

import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Bot, User } from 'lucide-react';

const Message = ({ message, isBot, darkMode = false }) => {
  const [typedMessage, setTypedMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showFullMessage, setShowFullMessage] = useState(true);
  
  useEffect(() => {
    if (isBot) {
      // Hiệu ứng đang nhập cho tin nhắn bot
      setIsTyping(true);
      setTypedMessage('');
      
      // Hiển thị ngay tin nhắn dài
      if (message.length > 300) {
        setShowFullMessage(false);
        setTypedMessage(message);
        setTimeout(() => {
          setIsTyping(false);
        }, 800);
        return;
      }
      
      const messageLength = message.length;
      // Tính toán tốc độ typing tự động dựa trên độ dài tin nhắn
      const typingSpeed = Math.max(10, Math.min(30, 1000 / messageLength));
      
      let i = 0;
      let typingInterval = null;
      
      const typeNextChar = () => {
        if (i < messageLength) {
          setTypedMessage(prev => prev + message.charAt(i));
          i++;
          typingInterval = setTimeout(typeNextChar, typingSpeed);
        } else {
          setIsTyping(false);
        }
      };
      
      typingInterval = setTimeout(typeNextChar, typingSpeed);
      
      return () => {
        if (typingInterval) {
          clearTimeout(typingInterval);
        }
        setIsTyping(false);
      };
    } else {
      // Hiển thị ngay lập tức cho tin nhắn người dùng
      setTypedMessage(message);
      setIsTyping(false);
    }
  }, [message, isBot]);
  
  return (
    <div className={`flex mb-4 ${isBot ? 'justify-start' : 'justify-end'} animate-fadeIn`}>
      {/* Avatar cho bot */}
      {isBot && (
        <div className={`flex-shrink-0 h-9 w-9 rounded-full flex items-center justify-center mr-2 ${
          darkMode ? 'bg-purple-900' : 'bg-purple-100'
        }`}>
          <Bot size={20} className={darkMode ? 'text-purple-300' : 'text-purple-600'} />
        </div>
      )}
      
      <div
        className={`rounded-2xl px-4 py-3 max-w-[80%] sm:max-w-[70%] shadow-sm ${
          isBot
            ? darkMode 
              ? 'bg-gray-800 text-white border border-gray-700' 
              : 'bg-white border border-gray-200 text-gray-800'
            : darkMode
              ? 'bg-purple-700 text-white' 
              : 'bg-purple-600 text-white'
        }`}
      >
        {isBot ? (
          <>
            <div className={`prose max-w-none ${darkMode ? 'prose-invert' : ''} prose-headings:mb-2 prose-p:my-1 prose-ul:my-1 prose-li:my-0.5`}>
              {!showFullMessage && message.length > 300 ? (
                <>
                  <ReactMarkdown>
                    {typedMessage.substring(0, 300) + '...'}
                  </ReactMarkdown>
                  <button 
                    onClick={() => setShowFullMessage(true)}
                    className={`text-sm font-medium mt-1 ${
                      darkMode ? 'text-purple-400 hover:text-purple-300' : 'text-purple-600 hover:text-purple-700'
                    }`}
                  >
                    Đọc thêm
                  </button>
                </>
              ) : (
                <ReactMarkdown>
                  {typedMessage}
                </ReactMarkdown>
              )}
            </div>
            
            {isTyping && (
              <div className="h-2 mt-1 flex space-x-1">
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            )}
          </>
        ) : (
          <div className="prose prose-sm prose-invert max-w-none">
            <p className="m-0">{typedMessage}</p>
          </div>
        )}
      </div>
      
      {/* Avatar cho user */}
      {!isBot && (
        <div className={`flex-shrink-0 h-9 w-9 rounded-full flex items-center justify-center ml-2 ${
          darkMode ? 'bg-gray-700' : 'bg-gray-200'
        }`}>
          <User size={18} className={darkMode ? 'text-gray-300' : 'text-gray-600'} />
        </div>
      )}
    </div>
  );
};

export default Message;