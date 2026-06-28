'use client';

import { useState, useRef, useEffect } from 'react';

interface CaseData {
  caseNumber: string;
  court: string;
  judge: string;
  plaintiff: string;
  defendant: string;
  date: string;
  proceedingType: string;
  category: string;
  summary: string;
  decisionType: string;
}

interface Message {
  role: 'user' | 'ai';
  text: string;
}

const QUICK_QUESTIONS = [
  'נתח לי את פסק הדין',
  'מה הסיכויים בערעור?',
  'אילו טענות הועלו?',
  'מה המשמעות המשפטית?',
];

export default function AiChatButton({ caseData }: { caseData: CaseData }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function sendMessage(text: string) {
    if (!text.trim() || loading) return;

    const userMsg: Message = { role: 'user', text: text.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: text.trim(),
          caseData,
          history: messages.slice(-6),
        }),
      });

      const data = await res.json();
      setMessages(prev => [...prev, { role: 'ai', text: data.answer || 'לא הצלחתי לענות. נסה שוב.' }]);
    } catch {
      setMessages(prev => [...prev, { role: 'ai', text: 'שגיאה בחיבור. נסה שוב.' }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* AI Analysis Card */}
      <div className="bg-gradient-to-l from-[#0B3C5D] to-[#0e4a72] rounded-lg shadow-md p-5 mt-6">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-2xl">&#x1F916;</span>
          <div>
            <h3 className="text-white font-bold">עוזר AI משפטי</h3>
            <p className="text-blue-200 text-xs">שאל שאלות על פסק הדין וקבל ניתוח מיידי</p>
          </div>
        </div>
        <p className="text-blue-100 text-sm mb-4">
          רוצה להבין את פסק הדין לעומק? העוזר המשפטי שלנו מבוסס בינה מלאכותית ויכול לנתח, להסביר ולענות על כל שאלה.
        </p>
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="w-full bg-[#C9A84C] hover:bg-[#D4B85E] text-[#072a42] font-bold px-6 py-3 rounded-lg transition-all shadow hover:shadow-lg text-sm"
        >
          &#x2728; שאל את ה-AI על פסק הדין
        </button>
      </div>

      {/* Chat Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4" dir="rtl">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsOpen(false)} />
          <div className="relative bg-white w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl shadow-2xl flex flex-col max-h-[85vh] sm:max-h-[600px]">
            {/* Header */}
            <div className="bg-[#0B3C5D] text-white px-5 py-4 sm:rounded-t-2xl rounded-t-2xl flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">&#x1F916;</span>
                <div>
                  <h3 className="font-bold text-sm">עוזר AI משפטי</h3>
                  <p className="text-blue-200 text-xs">{caseData.caseNumber} | {caseData.court}</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="bg-white/20 hover:bg-white/30 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold transition-colors">&#x2715;</button>
            </div>

            {/* Disclaimer */}
            <div className="bg-amber-50 border-b border-amber-200 px-4 py-2">
              <p className="text-xs text-amber-800">
                &#x26A0; תשובות ה-AI מבוססות על פרשנות אוטומטית ואינן מהוות ציטוט מתוך פסק הדין או ייעוץ משפטי.
                התוכן אינו מחליף עיון במסמך המקורי. לקבלת ייעוץ משפטי מקצועי פנו לעורך דין.
              </p>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
              {messages.length === 0 && (
                <div className="text-center py-6">
                  <p className="text-gray-500 text-sm mb-4">שאלו שאלה על פסק הדין וה-AI ינתח עבורכם</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {QUICK_QUESTIONS.map((q, i) => (
                      <button
                        key={i}
                        onClick={() => sendMessage(q)}
                        className="bg-[#f0ebe0] text-[#0B3C5D] text-xs px-3 py-2 rounded-full hover:bg-[#e5ddd0] transition-colors"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end'}`}>
                  <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-[15px] leading-7 font-medium ${
                    msg.role === 'user'
                      ? 'bg-[#0B3C5D] text-white rounded-tr-sm'
                      : 'bg-gray-100 text-gray-800 rounded-tl-sm'
                  }`}>
                    {msg.text.split('\n').map((line, j) => (
                      <p key={j} className={j > 0 ? 'mt-2' : ''}>{line}</p>
                    ))}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-end">
                  <div className="bg-gray-100 rounded-2xl rounded-tl-sm px-4 py-3">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-gray-200 px-4 py-3">
              <form onSubmit={(e) => { e.preventDefault(); sendMessage(input); }} className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="שאל שאלה על פסק הדין..."
                  className="flex-1 border border-gray-300 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C]"
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="bg-[#0B3C5D] hover:bg-[#072a42] disabled:bg-gray-300 text-white rounded-full w-10 h-10 flex items-center justify-center transition-colors"
                >
                  &#x27A4;
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
