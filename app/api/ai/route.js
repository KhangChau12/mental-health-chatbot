import { Together } from 'together';
import { NextResponse } from 'next/server';
import { questionnaires, emergencyMessage } from '../../../data/questionnaires';
import { StreamingTextResponse } from 'ai';
import { createContextualPrompt } from '../../../lib/contextual-prompt';
import { processMessage } from '../../../lib/chat-logic';

// Khởi tạo Together client
const together = new Together(process.env.TOGETHER_API_KEY);

export async function POST(req) {
  try {
    const { messages, chatState } = await req.json();
    
    // Lấy tin nhắn người dùng cuối cùng
    const lastUserMessage = messages.length > 0 && messages[messages.length - 1].role === 'user' 
      ? messages[messages.length - 1].content 
      : '';
    
    // Xử lý cập nhật trạng thái chat trước khi tạo prompt
    const updatedChatState = lastUserMessage ? processMessage(chatState, lastUserMessage) : chatState;
    
    // Tạo prompt tùy chỉnh dựa trên ngữ cảnh đã cập nhật
    const contextualPrompt = createContextualPrompt(
      updatedChatState,
      lastUserMessage,
      messages
    );
    
    // Tạo messages cho API
    const apiMessages = [
      { role: 'system', content: contextualPrompt },
      ...messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }))
    ];

    // Gọi API Together với streaming
    const response = together.chat.completions.create({
      model: "meta-llama/Llama-3.3-70B-Instruct-Turbo-Free",
      messages: apiMessages,
      max_tokens: 1000,
      temperature: 0.7,
      top_p: 0.7,
      top_k: 50,
      repetition_penalty: 1,
      stop: ["<|eot_id|>", "<|eom_id|>"],
      stream: true
    });

    // Trả về kết quả dạng stream và chatState đã cập nhật
    const streamingResponse = new StreamingTextResponse(response);
    
    // Gắn chatState vào response
    streamingResponse.headers.set('X-Chat-State', JSON.stringify(updatedChatState));
    
    return streamingResponse;
  } catch (error) {
    console.error('Error calling Together API:', error);
    return NextResponse.json(
      { error: 'Error processing your request' },
      { status: 500 }
    );
  }
}