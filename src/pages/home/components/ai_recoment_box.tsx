import { useState, useRef, useEffect } from 'react';
import { Send, X, ChevronRight } from 'lucide-react'; // Đổi ShoppingCart thành ChevronRight cho giống ảnh

export default function AiShoeChat() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<any[]>([
    {
      role: 'ai',
      content: '👋 Chào bạn! Mình là AI tư vấn phụ kiện thể thao.\nBạn cần tìm mẫu gì nhỉ?',
    },
  ]);
  const [dbProducts, setDbProducts] = useState<any[]>([]);
  const [apiHistory, setApiHistory] = useState<any[]>([]);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('http://localhost:8080/api/v1/products?limit=100');
        const json = await res.json();
        if (json.data && json.data.products) {
          setDbProducts(json.data.products);
        }
      } catch (error) {
        console.error('Lỗi fetch sản phẩm:', error);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const sendMessage = async () => {
    if (!input.trim() || isTyping) return;

    const userText = input;
    setMessages((prev) => [...prev, { role: 'user', content: userText }]);
    setInput('');
    setIsTyping(true);

    try {
      const res = await fetch('http://localhost:8080/api/v1/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userText, history: apiHistory }),
      });
      const data = await res.json();
      const recommended = dbProducts.filter((p) => data.recommendedIds?.includes(p._id));

      setMessages((prev) => [...prev, { role: 'ai', content: data.reply, products: recommended }]);

      setApiHistory([
        ...apiHistory,
        { role: 'user', parts: [{ text: userText }] },
        { role: 'model', parts: [{ text: JSON.stringify(data) }] },
      ]);
    } catch (error) {
      setMessages((prev) => [...prev, { role: 'ai', content: '🤖 AI đang bận tí!' }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div style={{ fontFamily: 'sans-serif' }}>
      <style>{`
        .dot-flashing { animation: dot 1s infinite; font-weight: bold; }
        @keyframes dot { 0%, 100% { opacity: 0.2; } 50% { opacity: 1; } }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>

      {/* NÚT MỞ */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 9999,
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            backgroundColor: '#000',
            color: '#fff',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          🤖
        </button>
      )}

      {/* KHUNG CHAT BOX */}
      {open && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 10000,
            width: '350px',
            height: '550px',
            backgroundColor: '#fff',
            borderRadius: '20px',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
            border: '1px solid #eee',
          }}
        >
          {/* HEADER */}
          <div
            style={{
              padding: '15px',
              backgroundColor: '#3095DE',
              color: '#fff',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span style={{ fontWeight: 'bold', fontSize: '14px' }}>🤖 AI Tư vấn</span>
            <X onClick={() => setOpen(false)} size={20} style={{ cursor: 'pointer' }} />
          </div>

          {/* MESSAGE LIST */}
          <div
            style={{ flex: 1, overflowY: 'auto', padding: '15px', backgroundColor: '#f9f9f9' }}
            className="no-scrollbar"
          >
            {messages.map((msg, index) => (
              <div
                key={index}
                style={{ marginBottom: '15px', textAlign: msg.role === 'user' ? 'right' : 'left' }}
              >
                <div
                  style={{
                    display: 'inline-block',
                    padding: '10px 14px',
                    borderRadius: '15px',
                    backgroundColor: msg.role === 'user' ? '#3095DE' : '#fff',
                    color: msg.role === 'user' ? '#fff' : '#000',
                    border: msg.role === 'user' ? 'none' : '1px solid #eee',
                    fontSize: '13px',
                    maxWidth: '85%',
                    whiteSpace: 'pre-line',
                  }}
                >
                  {msg.content}
                </div>

                {/* ✅ PHẦN CARD ĐÃ SỬA: HIỂN THỊ THEO DANH SÁCH DỌC GIỐNG ẢNH */}
                {msg.products && msg.products.length > 0 && (
                  <div
                    style={{
                      marginTop: '10px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                    }}
                  >
                    {msg.products.map((p: any) => {
                      const primaryImage =
                        p.images?.find((img: any) => img.isPrimary)?.url || p.images?.[0]?.url;
                      return (
                        <div
                          key={p._id}
                          onClick={() => (window.location.href = `/product-detail/${p._id}`)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            backgroundColor: '#fff',
                            padding: '10px',
                            borderRadius: '16px', // Bo góc lớn giống ảnh
                            border: '1px solid #f0f0f0',
                            cursor: 'pointer',
                            transition: 'background 0.2s',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#fcfcfc')}
                          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#fff')}
                        >
                          {/* Khối chứa ảnh */}
                          <div
                            style={{
                              width: '50px',
                              height: '50px',
                              borderRadius: '10px',
                              overflow: 'hidden',
                              backgroundColor: '#f5f5f5',
                              flexShrink: 0,
                            }}
                          >
                            <img
                              src={primaryImage || 'https://via.placeholder.com/50'}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              alt={p.name}
                            />
                          </div>

                          {/* Khối chứa thông tin */}
                          <div
                            style={{
                              flex: 1,
                              marginLeft: '12px',
                              display: 'flex',
                              flexDirection: 'column',
                            }}
                          >
                            <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#333' }}>
                              {p.name}
                            </span>
                            <span
                              style={{
                                fontSize: '14px',
                                fontWeight: 'bold',
                                color: '#00D166',
                                marginTop: '2px',
                              }}
                            >
                              {(p.salePrice || p.price).toLocaleString('vi-VN')} đ
                            </span>
                          </div>

                          {/* Icon mũi tên sang phải */}
                          <ChevronRight size={18} style={{ color: '#ccc', marginLeft: '8px' }} />
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div style={{ padding: '8px', fontSize: '12px', color: '#666' }}>
                🤖 AI đang suy nghĩ<span className="dot-flashing">.</span>
                <span className="dot-flashing" style={{ animationDelay: '0.2s' }}>
                  .
                </span>
                <span className="dot-flashing" style={{ animationDelay: '0.4s' }}>
                  .
                </span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* INPUT */}
          <div style={{ padding: '15px', borderTop: '1px solid #eee' }}>
            <div
              style={{
                display: 'flex',
                backgroundColor: '#f3f4f6',
                borderRadius: '20px',
                padding: '5px 15px',
                alignItems: 'center',
              }}
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Hỏi về sản phẩm..."
                style={{
                  flex: 1,
                  border: 'none',
                  background: 'none',
                  padding: '8px',
                  outline: 'none',
                  fontSize: '13px',
                }}
              />
              <Send onClick={sendMessage} size={18} style={{ cursor: 'pointer', color: '#000' }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
