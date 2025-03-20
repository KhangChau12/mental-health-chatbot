'use client';

import React, { useState, useRef, useEffect } from 'react';
import Message from './Message';
import { initializeChat, processMessage } from '../lib/chat-logic';
import { Send, RefreshCw } from 'lucide-react';
import { useChat } from 'ai/react';

const Chat = () => {
  const [chatState, setChatState] = useState(initializeChat());
  const [useAI, setUseAI] = useState(true); // Toggle để chuyển đổi giữa AI và logic cứng
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  
  // Sử dụng hook useChat từ vercel/ai
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    setMessages,
    isLoading,
    append
  } = useChat({
    api: '/api/ai',
    body: {
      chatState: chatState
    },
    onResponse: (response) => {
      // Khi nhận được phản hồi từ API, cập nhật trạng thái chat
      if (response.ok) {
        // Cập nhật trạng thái chat nhưng không thay đổi botMessage vì sử dụng messages từ useChat
        const userMessage = input;
        const updatedChatState = processMessage(chatState, userMessage);
        // Chỉ cập nhật trạng thái, không cập nhật botMessage
        setChatState(prevState => ({
          ...updatedChatState,
          botMessage: prevState.botMessage
        }));
      }
    }
  });
  
  // Khi component được tải, hiển thị tin nhắn chào đầu tiên
  useEffect(() => {
    if (messages.length === 0 && chatState.botMessage) {
      setMessages([{ role: 'assistant', content: chatState.botMessage, id: 'welcome-message' }]);
    }
  }, [chatState.botMessage, messages.length, setMessages]);
  
  // Cuộn xuống dưới cùng khi có tin nhắn mới
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  // Xử lý gửi tin nhắn
  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (input.trim() === '' || isLoading) return;
    
    if (useAI) {
      // Sử dụng Together AI qua API
      await handleSubmit(e);
      // Lưu ý: onResponse callback sẽ cập nhật chatState sau khi nhận phản hồi
    } else {
      // Sử dụng logic cứng
      const userMessage = input;
      
      // Thêm tin nhắn người dùng
      setMessages(prev => [...prev, { role: 'user', content: userMessage, id: Date.now().toString() }]);
      handleInputChange({ target: { value: '' } });
      
      // Xử lý tin nhắn bằng logic cứng
      const updatedChatState = processMessage(chatState, userMessage);
      setChatState(updatedChatState);
      
      // Giả lập độ trễ để hiệu ứng tự nhiên hơn
      setTimeout(() => {
        // Thêm phản hồi của bot
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: updatedChatState.botMessage, 
          id: (Date.now() + 1).toString() 
        }]);
      }, 500);
    }
  };
  
  // Khởi động lại cuộc trò chuyện
  const handleRestartChat = () => {
    const newChatState = initializeChat();
    setChatState(newChatState);
    setMessages([{ role: 'assistant', content: newChatState.botMessage, id: 'welcome-message-restart' }]);
    
    // Focus vào ô input
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };
  
  // Toggle giữa AI và logic cứng
  const toggleAIMode = () => {
    setUseAI(prev => !prev);
  };
  
  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Thanh điều khiển */}
      <div className="bg-white border-b border-gray-200 px-4 py-2 flex justify-between items-center">
        <div className="flex items-center">
          <button
            onClick={handleRestartChat}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors mr-2"
            title="Bắt đầu lại cuộc trò chuyện"
          >
            <RefreshCw size={18} />
          </button>
          
          <span className="text-sm text-gray-600">
            {chatState.currentAssessment ? 
              `Đánh giá hiện tại: ${chatState.currentAssessment}` : 
              'Đang trò chuyện'}
          </span>
        </div>
        
        <div className="flex items-center">
          <span className="text-xs text-gray-500 mr-2">{useAI ? 'AI Mode' : 'Logic Mode'}</span>
          <button
            onClick={toggleAIMode}
            className={`w-10 h-5 rounded-full flex items-center transition-colors ${
              useAI ? 'bg-blue-500 justify-end' : 'bg-gray-300 justify-start'
            }`}
          >
            <span className="w-4 h-4 bg-white rounded-full block transform transition-transform mx-0.5"></span>
          </button>
        </div>
      </div>
      
      {/* Phần tin nhắn */}
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.map((message) => (
          <Message 
            key={message.id} 
            message={message.content} 
            isBot={message.role === 'assistant'} 
          />
        ))}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Thanh nhập liệu */}
      <div className="border-t border-gray-200 bg-white p-4">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <div className="relative flex-1">
            <textarea
              ref={inputRef}
              value={input}
              onChange={handleInputChange}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(e);
                }
              }}
              placeholder="Nhập tin nhắn của bạn..."
              className="w-full p-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none max-h-32"
              rows={1}
              style={{ minHeight: '44px' }}
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={input.trim() === '' || isLoading}
              className={`absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full ${
                input.trim() === '' || isLoading
                  ? 'text-gray-400'
                  : 'text-blue-600 hover:bg-blue-50'
              }`}
            >
              <Send size={20} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Chat;