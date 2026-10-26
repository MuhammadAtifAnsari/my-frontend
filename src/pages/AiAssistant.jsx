import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, HelpCircle, RefreshCw, CheckCircle2 } from 'lucide-react';

const AiAssistant = () => {
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: 'Hello! I am your HCM Lite AI HR Assistant. How can I help you with company policies, employee queries, or HR operations today?'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Pre-built quick prompt chips
  const quickPrompts = [
    "What is our annual leave policy?",
    "How are payroll deductions calculated?",
    "Show me the new hire onboarding checklist",
    "What are the remote work guidelines?"
  ];

  // Smart HR response generator for hackathon demo
  const getAiResponse = (query) => {
    const q = query.toLowerCase();
    if (q.includes('leave') || q.includes('vacation') || q.includes('holiday')) {
      return "Employees are entitled to 20 paid annual leaves, 10 sick leaves, and 5 casual leaves per year. Leave requests must be submitted at least 3 days in advance through the HCM portal.";
    } else if (q.includes('payroll') || q.includes('salary') || q.includes('deduction')) {
      return "Payroll is processed on the 28th of every month. Deductions include standard income tax brackets, employee provident fund contribution (if opted), and unexcused unpaid leaves.";
    } else if (q.includes('onboard') || q.includes('hire') || q.includes('checklist')) {
      return "Onboarding Checklist: 1. Collect signed employment contract. 2. Setup corporate email & slack access. 3. Assign employee ID code. 4. Schedule department orientation with manager.";
    } else if (q.includes('remote') || q.includes('work from home') || q.includes('guidelines')) {
      return "Remote work is permitted up to 2 days per week with manager approval. Core working hours are 10:00 AM to 6:00 PM PKT, and team sync meetings are mandatory via Zoom/Meet.";
    } else {
      return `I understand you are asking about "${query}". As your HCM Assistant, I can help policy lookup, payroll guidelines, and staff management rules. Feel free to ask more specific HR questions!`;
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input.trim();
    setInput('');
    
    // Add user message
    setMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setLoading(true);

    // Simulate AI thinking delay
    setTimeout(() => {
      const reply = getAiResponse(userText);
      setMessages(prev => [...prev, { sender: 'ai', text: reply }]);
      setLoading(false);
    }, 800);
  };

  const handlePromptClick = (promptText) => {
    setInput(promptText);
  };

  const clearChat = () => {
    setMessages([
      {
        sender: 'ai',
        text: 'Chat history cleared. How else can I assist your HR operations today?'
      }
    ]);
  };

  return (
    <div className="space-y-6 h-[calc(100vh-7rem)] flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-100">AI HR Assistant</h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold">
              <Sparkles size={12} />
              GPT Powered
            </span>
          </div>
          <p className="text-sm text-slate-400">Instant policy lookups, employee guidance, and HR insights</p>
        </div>
        <button
          onClick={clearChat}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-slate-100 text-xs transition-colors self-start sm:self-auto cursor-pointer"
        >
          <RefreshCw size={14} />
          <span>Reset Chat</span>
        </button>
      </div>

      {/* Main Chat Container */}
      <div className="flex-1 rounded-xl bg-[#111827] border border-slate-800 shadow-lg flex flex-col overflow-hidden">
        
        {/* Message History Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((msg, index) => (
            <div 
              key={index} 
              className={`flex items-start gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                msg.sender === 'user' 
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_10px_rgba(6,182,212,0.3)]' 
                  : 'bg-slate-900 border border-slate-800 text-cyan-400'
              }`}>
                {msg.sender === 'user' ? <User size={18} /> : <Bot size={18} />}
              </div>
              
              <div className={`max-w-[80%] sm:max-w-[70%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-cyan-500 text-slate-950 rounded-tr-none font-medium'
                  : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none shadow-sm'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 text-cyan-400 flex items-center justify-center shrink-0">
                <Bot size={18} />
              </div>
              <div className="rounded-2xl rounded-tl-none bg-slate-900 border border-slate-800 px-4 py-3 text-sm text-slate-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce"></span>
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.4s]"></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts Chips Bar */}
        <div className="px-4 py-2.5 bg-slate-900/40 border-t border-slate-800/60 overflow-x-auto flex items-center gap-2 shrink-0">
          <span className="text-xs text-slate-400 font-medium whitespace-nowrap flex items-center gap-1">
            <HelpCircle size={12} /> Suggested:
          </span>
          {quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handlePromptClick(prompt)}
              className="text-xs px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:border-cyan-500/40 hover:text-cyan-400 whitespace-nowrap transition-all cursor-pointer"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSendMessage} className="p-4 bg-slate-900/80 border-t border-slate-800 flex items-center gap-3 shrink-0">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about leave policies, payroll, onboarding, or HR rules..."
            className="flex-1 rounded-lg bg-[#07090E] border border-slate-800 px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none text-sm transition-colors"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-cyan-500 text-slate-950 font-semibold hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] cursor-pointer shrink-0"
          >
            <Send size={18} />
            <span className="hidden sm:inline">Send</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default AiAssistant;