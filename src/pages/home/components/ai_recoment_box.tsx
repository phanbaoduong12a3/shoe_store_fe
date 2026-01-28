import { useState, useRef, useEffect } from 'react';
import { Send, X } from 'lucide-react';

interface Message {
  role: 'user' | 'ai';
  content: string;
}

export default function AiShoeChat() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'ai',
      content:
        '👋 Chào bạn! Mình là AI tư vấn giày.\nHãy nói cho mình biết:\n• Hãng\n• Mục đích\n• Giá tiền\n\nVD: Nike đi học, giá 1–2 triệu',
    },
  ]);

  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Auto scroll xuống cuối
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');

    // ⚠️ DEMO AI – sau này gọi API backend
    setTimeout(() => {
      const aiMsg: Message = {
        role: 'ai',
        content:
          '🤖 Mình gợi ý cho bạn:\n• Nike Air Force 1\n• Adidas Forum Low\n• Asics Japan S\n\nBạn muốn xem chi tiết mẫu nào?',
      };
      setMessages((prev) => [...prev, aiMsg]);
    }, 800);
  };

  return (
    <>
      {/* NÚT MỞ CHAT */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-[9999] w-14 h-14 rounded-full bg-black text-white flex items-center justify-center shadow-xl hover:scale-105 transition"
        >
          🤖
        </button>
      )}

      {/* CHAT BOX */}
      {open && (
        <div className="fixed bottom-6 right-6 z-[9999] w-[320px] rounded-2xl shadow-2xl bg-white border overflow-hidden flex flex-col">
          {/* HEADER */}
          <div className="flex items-center justify-between px-4 py-3 bg-black text-white">
            <div className="flex items-center gap-2">
              <span className="font-semibold">🤖AI tư vấn giày</span>
            </div>
            <button onClick={() => setOpen(false)}>
              <X size={18} />
            </button>
          </div>

          {/* MESSAGE LIST */}
          <div className="flex-1 max-h-[400px] overflow-y-auto p-4 space-y-3 bg-gray-50">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`px-3 py-2 rounded-xl text-sm whitespace-pre-line max-w-[85%]
                    ${
                      msg.role === 'user'
                        ? 'bg-black text-white rounded-br-none'
                        : 'bg-white border rounded-bl-none'
                    }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* INPUT */}
          <div className="border-t p-4 flex gap-2 bg-white">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Nhập nhu cầu của bạn..."
              className="flex-1 border rounded-full px-4 py-2 text-sm outline-none focus:ring-1 focus:ring-black"
            />
            <button
              onClick={sendMessage}
              className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
