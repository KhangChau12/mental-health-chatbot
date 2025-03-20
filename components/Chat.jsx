// Components/Chat.jsx (phiên bản cải tiến)
'use client';

import React, { useState, useRef, useEffect } from 'react';
import Message from './Message';
import { initializeChat, processMessage } from '../lib/chat-logic';
import { Send, RefreshCw, Info, Moon, Sun } from 'lucide-react';
import { useChat } from 'ai/react';

const Chat = () => {
  const [chatState, setChatState] = useState(initializeChat());
  const [useAI, setUseAI] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  
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
      if (response.ok) {
        const userMessage = input;
        const updatedChatState = processMessage(chatState, userMessage);
        setChatState(prevState => ({
          ...updatedChatState,
          botMessage: prevState.botMessage
        }));
      }
    }
  });
  
  useEffect(() => {
    if (messages.length === 0 && chatState.botMessage) {
      setMessages([{ role: 'assistant', content: chatState.botMessage, id: 'welcome-message' }]);
    }
  }, [chatState.botMessage, messages.length, setMessages]);
  
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (input.trim() === '' || isLoading) return;
    
    if (useAI) {
      await handleSubmit(e);
    } else {
      const userMessage = input;
      
      setMessages(prev => [...prev, { role: 'user', content: userMessage, id: Date.now().toString() }]);
      handleInputChange({ target: { value: '' } });
      
      const updatedChatState = processMessage(chatState, userMessage);
      setChatState(updatedChatState);
      
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: updatedChatState.botMessage, 
          id: (Date.now() + 1).toString() 
        }]);
      }, 500);
    }
  };
  
  const handleRestartChat = () => {
    const newChatState = initializeChat();
    setChatState(newChatState);
    setMessages([{ role: 'assistant', content: newChatState.botMessage, id: 'welcome-message-restart' }]);
    
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };
  
  const toggleAIMode = () => {
    setUseAI(prev => !prev);
  };
  
  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };
  
  return (
    <div className={`flex flex-col h-full ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} transition-colors duration-300`}>
      {/* Thanh điều khiển */}
      <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b px-4 py-3 flex justify-between items-center transition-colors`}>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleRestartChat}
            className={`p-2 ${darkMode ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-700' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'} rounded-full transition-colors`}
            title="Bắt đầu lại cuộc trò chuyện"
          >
            <RefreshCw size={18} />
          </button>
          
          <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            {chatState.currentAssessment ? 
              `Đánh giá: ${chatState.currentAssessment}` : 
              'Trò chuyện'}
          </span>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* Dark mode toggle */}
          <button
            onClick={toggleDarkMode}
            className={`p-2 ${darkMode ? 'text-yellow-300 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-100'} rounded-full transition-colors`}
            title={darkMode ? "Chế độ sáng" : "Chế độ tối"}
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          
          {/* AI Mode toggle */}
          <div className="flex items-center">
            <span className={`text-xs mr-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {useAI ? 'AI Mode' : 'Logic Mode'}
            </span>
            <button
              onClick={toggleAIMode}
              className={`relative w-12 h-6 rounded-full flex items-center transition-colors ${
                useAI 
                  ? 'bg-purple-600' 
                  : darkMode ? 'bg-gray-600' : 'bg-gray-300'
              }`}
            >
              <span className={`absolute w-5 h-5 bg-white rounded-full transition-transform duration-300 transform ${
                useAI ? 'translate-x-6' : 'translate-x-1'
              }`}></span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Phần tin nhắn */}
      <div className={`flex-1 p-4 overflow-y-auto ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="max-w-3xl mx-auto">
          {messages.map((message) => (
            <Message 
              key={message.id} 
              message={message.content} 
              isBot={message.role === 'assistant'}
              darkMode={darkMode}
            />
          ))}
          
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      {/* Thanh nhập liệu */}
      <div className={`border-t ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} p-4 transition-colors`}>
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSendMessage} className="flex items-center gap-3">
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
                className={`w-full p-3 pr-12 rounded-2xl focus:outline-none focus:ring-2 resize-none max-h-32 transition-colors ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white focus:ring-purple-500 placeholder-gray-400' 
                    : 'border border-gray-300 text-gray-800 focus:ring-purple-500'
                }`}
                rows={1}
                style={{ minHeight: '52px' }}
                disabled={isLoading}
              />
              
              <button
                type="submit"
                disabled={input.trim() === '' || isLoading}
                className={`absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full transition-colors ${
                  input.trim() === '' || isLoading
                    ? darkMode ? 'text-gray-500' : 'text-gray-400'
                    : 'text-purple-600 hover:bg-purple-50 dark:hover:bg-gray-600'
                }`}
              >
                <Send size={20} className={isLoading ? 'animate-pulse' : ''} />
              </button>
            </div>
          </form>
          
          {/* Typing indicator khi bot đang nhập */}
          {isLoading && (
            <div className="text-center mt-2">
              <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Trợ lý đang trả lời...
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;