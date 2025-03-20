'use client';

import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

const Message = ({ message, isBot }) => {
  const [typedMessage, setTypedMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  useEffect(() => {
    if (isBot) {
      // Hiệu ứng đang nhập cho tin nhắn bot
      setIsTyping(true);
      setTypedMessage('');
      
      const messageLength = message.length;
      const typingSpeed = Math.max(10, Math.min(30, 1000 / messageLength)); // Giới hạn tốc độ
      
      let i = 0;
      let typingInterval = null;
      
      // Sử dụng requestAnimationFrame thay vì setInterval để hiệu suất tốt hơn
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
    <div className={`flex ${isBot ? 'justify-start' : 'justify-end'} mb-4`}>
      <div
        className={`rounded-lg px-4 py-2 max-w-[80%] md:max-w-[70%] ${
          isBot
            ? 'bg-white border border-gray-200 shadow-sm text-gray-800'
            : 'bg-blue-600 text-white'
        }`}
      >
        {isBot ? (
          <>
            <div className={`prose prose-sm max-w-none ${isTyping ? 'after:content-["_|"] after:animate-pulse' : ''}`}>
              <ReactMarkdown>
                {typedMessage}
              </ReactMarkdown>
            </div>
            {isTyping && (
              <div className="h-1 mt-1 flex space-x-1 justify-start">
                <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            )}
          </>
        ) : (
          <div className="prose prose-sm prose-invert max-w-none">
            <p className="m-0">{typedMessage}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Message;