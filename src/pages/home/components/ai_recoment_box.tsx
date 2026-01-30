import { useState, useRef, useEffect } from 'react';
import { Send, X, ShoppingCart } from 'lucide-react';

export default function AiShoeChat() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<any[]>([
    { role: 'ai', content: '👋 Chào bạn! Mình là AI tư vấn giày.\nBạn cần tìm mẫu gì nhỉ?' },
  ]);
  const [dbProducts, setDbProducts] = useState<any[]>([]);
  const [apiHistory, setApiHistory] = useState<any[]>([]);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // 1. Fetch dữ liệu sản phẩm thật từ API của bạn
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

      // So khớp ID từ AI trả về với dbProducts
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
        .card-scroll::-webkit-scrollbar { height: 4px; }
        .card-scroll::-webkit-scrollbar-thumb { background: #ddd; border-radius: 10px; }
      `}</style>

      {/* NÚT MỞ (ICON ROBOT) */}
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
              backgroundColor: '#000',
              color: '#fff',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span style={{ fontWeight: 'bold', fontSize: '14px' }}>🤖 AI Tư vấn giày</span>
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
                    backgroundColor: msg.role === 'user' ? '#000' : '#fff',
                    color: msg.role === 'user' ? '#fff' : '#000',
                    border: msg.role === 'user' ? 'none' : '1px solid #eee',
                    fontSize: '13px',
                    maxWidth: '85%',
                    whiteSpace: 'pre-line',
                  }}
                >
                  {msg.content}
                </div>

                {/* HIỂN THỊ CARD SẢN PHẨM TỪ DB */}
                {msg.products && msg.products.length > 0 && (
                  <div
                    className="card-scroll no-scrollbar"
                    style={{
                      display: 'flex',
                      gap: '10px',
                      overflowX: 'auto',
                      marginTop: '10px',
                      paddingBottom: '5px',
                      cursor: 'grab',
                    }}
                  >
                    {msg.products.map((p: any) => {
                      const primaryImage =
                        p.images?.find((img: any) => img.isPrimary)?.url || p.images?.[0]?.url;

                      return (
                        <div
                          key={p._id}
                          style={{
                            minWidth: '140px', // Thu nhỏ chiều rộng card
                            maxWidth: '140px',
                            flexShrink: 0,
                            backgroundColor: '#fff',
                            border: '1px solid #eee',
                            borderRadius: '10px',
                            overflow: 'hidden',
                            boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
                          }}
                        >
                          {/* Ảnh sản phẩm nhỏ gọn */}
                          <div style={{ position: 'relative', backgroundColor: '#f8f8f8' }}>
                            <img
                              src={primaryImage || 'https://via.placeholder.com/150'}
                              style={{
                                width: '100%',
                                height: '85px',
                                objectFit: 'contain',
                                padding: '5px',
                              }} // Ảnh nhỏ và gọn hơn
                              alt={p.name}
                            />
                            {p.salePrice && p.salePrice < p.price && (
                              <span
                                style={{
                                  position: 'absolute',
                                  top: '4px',
                                  left: '4px',
                                  backgroundColor: '#ff4d4f',
                                  color: '#fff',
                                  fontSize: '8px',
                                  padding: '1px 4px',
                                  borderRadius: '3px',
                                  fontWeight: 'bold',
                                }}
                              >
                                SALE
                              </span>
                            )}
                          </div>

                          <div style={{ padding: '8px' }}>
                            {/* Tên sản phẩm - Cắt ngắn bằng dấu ... */}
                            <div
                              style={{
                                fontSize: '11px',
                                fontWeight: '600',
                                whiteSpace: 'nowrap', // Không cho xuống dòng
                                overflow: 'hidden', // Ẩn phần thừa
                                textOverflow: 'ellipsis', // Hiện dấu ...
                                color: '#333',
                              }}
                              title={p.name} // Di chuột vào vẫn hiện tên đầy đủ
                            >
                              {p.name}
                            </div>

                            {/* Giá tiền */}
                            <div
                              style={{ marginTop: '4px', display: 'flex', flexDirection: 'column' }}
                            >
                              <span
                                style={{ color: '#2563eb', fontSize: '12px', fontWeight: 'bold' }}
                              >
                                {(p.salePrice || p.price).toLocaleString()}đ
                              </span>
                              {p.salePrice && p.salePrice < p.price && (
                                <span
                                  style={{
                                    color: '#999',
                                    fontSize: '9px',
                                    textDecoration: 'line-through',
                                  }}
                                >
                                  {p.price.toLocaleString()}đ
                                </span>
                              )}
                            </div>

                            {/* Nút bấm nhỏ hơn */}
                            <button
                              onClick={() => (window.location.href = `/product-detail/${p._id}`)}
                              style={{
                                width: '100%',
                                marginTop: '6px',
                                padding: '5px 0',
                                backgroundColor: '#000',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '5px',
                                fontSize: '10px',
                                fontWeight: '500',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '4px',
                              }}
                            >
                              <ShoppingCart size={10} /> XEM
                            </button>
                          </div>
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
                placeholder="Hỏi về giày..."
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
