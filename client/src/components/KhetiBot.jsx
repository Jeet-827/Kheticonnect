import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { API_BASE_URL } from '../config/api.js';
import { 
  Bot, 
  Sparkles, 
  User, 
  X, 
  Maximize2, 
  Minimize2, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Mic, 
  MicOff, 
  Send, 
  Copy, 
  Check, 
  Globe, 
  ChevronDown, 
  Loader2,
  Plus,
  MessageSquare,
  ArrowLeft,
  Sparkle,
  Sprout,
  ShieldCheck,
  TrendingUp,
  Truck,
  Gavel,
  BookOpen
} from 'lucide-react';

const LANGUAGES = [
  { code: 'hi-IN', label: 'हिन्दी (Hindi)', flag: '🇮🇳', short: 'हिन्दी' },
  { code: 'en-IN', label: 'English (Indian)', flag: '🇮🇳', short: 'English' },
  { code: 'gu-IN', label: 'ગુજરાતી (Gujarati)', flag: '🇮🇳', short: 'ગુજરાતી' },
  { code: 'pa-IN', label: 'ਪੰਜਾਬੀ (Punjabi)', flag: '🇮🇳', short: 'ਪੰਜਾਬੀ' },
  { code: 'mr-IN', label: 'मराठी (Marathi)', flag: '🇮🇳', short: 'मराठी' },
  { code: 'bn-IN', label: 'বাংলা (Bengali)', flag: '🇮🇳', short: 'বাংলা' },
];

const SUGGESTED_TOPICS = [
  { icon: Sprout, title: 'Sell Crops Directly', desc: 'Listing process & finding verified buyers', prompt: 'खेतीकनेक्ट पर अपनी फसल सीधे कैसे बेचें? पूरी प्रक्रिया विस्तार से समझाएं।' },
  { icon: ShieldCheck, title: 'Escrow Payment Safety', desc: 'How funds stay protected until delivery', prompt: 'एस्क्रो (Escrow) पेमेंट सुरक्षा कैसे काम करती है? क्या मेरा पैसा सुरक्षित है?' },
  { icon: Gavel, title: 'Live Crop Auction', desc: 'Participate in transparent price bidding', prompt: 'लाइव नीलामी (Live Bidding) में भाग कैसे लें और सबसे अच्छी कीमत कैसे पाएं?' },
  { icon: BookOpen, title: 'Govt Farmer Schemes', desc: 'PM-KISAN, PMFBY subsidies & claims', prompt: 'पीएम-किसान (PM-KISAN) और फसल बीमा योजना (PMFBY) के क्या लाभ हैं और आवेदन कैसे करें?' },
  { icon: TrendingUp, title: 'Live Mandi Price Rates', desc: 'Check latest APMC market price trends', prompt: 'प्रमुख फसलों के आज के ताजा मंडी भाव क्या हैं?' },
];

const PROMPTS_BY_LANG = {
  'hi-IN': [
    { label: '🌾 फसल कैसे बेचें?', prompt: 'खेतीकनेक्ट पर अपनी फसल कैसे बेचें? पूरी प्रक्रिया विस्तार से समझाएं।' },
    { label: '🛡️ एस्क्रो पेमेंट सुरक्षा', prompt: 'एस्क्रो (Escrow) पेमेंट सुरक्षा कैसे काम करती है? क्या मेरा पैसा सुरक्षित है?' },
    { label: '🔨 लाइव नीलामी (Bidding)', prompt: 'लाइव नीलामी (Live Bidding) में भाग कैसे लें और सबसे अच्छी कीमत कैसे पाएं?' },
    { label: '📜 पीएम-किसान योजना', prompt: 'पीएम-किसान (PM-KISAN) और फसल बीमा योजना (PMFBY) के लाभ क्या हैं?' },
    { label: '📊 आज के मंडी भाव', prompt: 'प्रमुख फसलों के आज के ताजा मंडी भाव क्या हैं?' },
    { label: '🐛 जैविक कीट नियंत्रण', prompt: 'सब्जियों और अनाज में कीट नियंत्रण के सबसे अच्छे जैविक उपाय क्या हैं?' },
  ],
  'en-IN': [
    { label: '🌾 How to sell crops?', prompt: 'How do I list and sell crops directly to buyers on KhetiConnect?' },
    { label: '🛡️ Escrow payment safety', prompt: 'How does escrow protection work for both farmers and buyers?' },
    { label: '🔨 Live crop auction', prompt: 'How does the transparent live bidding and auction system work?' },
    { label: '📜 Govt farmer schemes', prompt: 'What government subsidies and schemes are currently available for farmers?' },
    { label: '📊 Live Mandi rates', prompt: 'What are the current APMC mandi market price trends for major crops?' },
    { label: '🐛 Organic pest control', prompt: 'What are the best organic pest control methods for vegetable crops?' },
  ],
  'gu-IN': [
    { label: '🌾 પાક કેવી રીતે વેચવો?', prompt: 'ખેતીકનેક્ટ પર મારો પાક વેચવા માટેની પ્રક્રિયા શું છે?' },
    { label: '🛡️ સુરક્ષિત ચુકવણી', prompt: 'ખેતીકનેક્ટ પર એસ્ક્રો પેમેન્ટ સુરક્ષા કેવી રીતે કામ કરે છે?' },
    { label: '🔨 પાકની હરાજી', prompt: 'લાઇવ હરાજીમાં કેવી રીતે ભાગ લેવો?' },
    { label: '📊 આજના બજાર ભાવ', prompt: 'મુખ્ય પાકોના આજના બજાર ભાવ શું છે?' },
  ],
  'pa-IN': [
    { label: '🌾 ਫਸਲ ਕਿਵੇਂ ਵੇਚੀਏ?', prompt: 'ਖੇਤੀਕਨੈਕਟ ਉੱਤੇ ਆਪਣੀ ਫਸਲ ਸਿੱਧੀ ਕਿਵੇਂ ਵੇਚੀ ਜਾ ਸਕਦੀ ਹੈ?' },
    { label: '🛡️ ਐਸਕਰੋ ਸੁਰੱਖਿਆ', prompt: 'ਖੇਤੀਕਨੈਕਟ ਉੱਤੇ ਪੈਸਿਆਂ ਦੀ ਸੁਰੱਖਿਆ ਕਿਵੇਂ ਰਹਿੰਦੀ ਹੈ?' },
    { label: '🔨 ਲਾਈਵ ਬੋਲੀ', prompt: 'ਲਾਈਵ ਬੋਲੀ ਸਿਸਟਮ ਕਿਵੇਂ ਕੰਮ ਕਰਦਾ ਹੈ?' },
  ],
  'mr-IN': [
    { label: '🌾 शेतमाल कसा विकावा?', prompt: 'खेतीकनेक्टवर थेट शेतमाल कसा विकावा? संपूर्ण माहिती सांगा.' },
    { label: '🛡️ सुरक्षित पेमेंट', prompt: 'एस्क्रो पेमेंट सुरक्षा कशी काम करते? शेतमालाचे पैसे कधी मिळतात?' },
    { label: '📜 सरकारी योजना', prompt: 'शेतकऱ्यांसाठी चालू सरकारी योजना कोणत्या आहेत?' },
  ],
};

export default function KhetiBot() {
  const user = useSelector((state) => state.auth.user);

  const [isOpen, setIsOpen] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(true); // Default to full page
  const [selectedLang, setSelectedLang] = useState('hi-IN');
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  
  const [copiedId, setCopiedId] = useState(null);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'नमस्ते! 🙏 मैं KhetiBot हूँ, KhetiConnect का AI कृषि सहायक।\nफसल बेचने, लाइव नीलामी, एस्क्रो पेमेंट सुरक्षा, सरकारी योजनाओं और मंडी भाव के बारे में आप किसी भी भाषा में पूछ सकते हैं।',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const endRef = useRef(null);
  const recognitionRef = useRef(null);

  // Listen for open event
  useEffect(() => {
    const handleOpen = () => {
      setIsOpen(true);
      setIsFullScreen(true);
    };
    window.addEventListener('open-khetibot', handleOpen);
    return () => window.removeEventListener('open-khetibot', handleOpen);
  }, []);

  // Auto-scroll
  useEffect(() => {
    if (isOpen) {
      endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, loading]);

  // Cancel speech on close
  useEffect(() => {
    if (!isOpen && typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, [isOpen]);

  // Speech Recognition setup
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = selectedLang;

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInput(transcript);
          sendQuery(transcript);
        }
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, [selectedLang]);

  // Text-To-Speech
  const speakText = (text, langCode = selectedLang) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[*_#`]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = langCode;
    utterance.rate = 1.0;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const toggleMic = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser. Please use Google Chrome or Edge.');
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.lang = selectedLang;
        recognitionRef.current.start();
      } catch (err) {
        console.error('Mic start error:', err);
      }
    }
  };

  const copyToClipboard = (id, text) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const resetChat = () => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content: 'नमस्ते! 🙏 चैट रीसेट हो गया है। आज मैं आपकी KhetiConnect पर क्या सहायता कर सकता हूँ?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  const sendQuery = async (userText) => {
    const query = (userText || input).trim();
    if (!query || loading) return;

    const newMsg = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const nextMessages = [...messages, newMsg];
    setMessages(nextMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: nextMessages.filter((m) => m.id !== 'welcome').slice(-6),
          language: selectedLang.split('-')[0],
          userContext: { name: user?.name, role: user?.role },
        }),
      });

      const data = await res.json();
      const reply = data.reply || 'मैं आपकी सहायता के लिए तैयार हूँ। कृपया पुनः प्रयास करें।';

      const botMsg = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);

      if (voiceEnabled) {
        speakText(reply, selectedLang);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          role: 'assistant',
          content: 'माफ़ करें, सर्वर से संपर्क नहीं हो पाया। कृपया अपना इंटरनेट जांचें और पुनः प्रयास करें।',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // ── Floating Button (Closed State) ──
  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-[9999] flex items-center gap-3">
        {/* Helper pill badge */}
        <div 
          onClick={() => { setIsOpen(true); setIsFullScreen(true); }}
          className="hidden sm:flex items-center gap-2 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-full shadow-xl shadow-blue-900/10 border border-blue-100 text-xs font-bold text-slate-800 animate-fadeIn cursor-pointer hover:bg-blue-50 transition-all hover:scale-105"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-ping" />
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            Ask KhetiBot AI (खेती मित्र)
          </span>
        </div>

        {/* Trigger button */}
        <button
          onClick={() => { setIsOpen(true); setIsFullScreen(true); }}
          className="group relative flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-600 text-white shadow-xl shadow-blue-600/35 hover:shadow-2xl hover:shadow-blue-600/45 hover:scale-105 active:scale-95 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-400/40"
          aria-label="Open KhetiBot AI Full Page"
        >
          <div className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          <Bot className="w-7 h-7 text-white drop-shadow-xs group-hover:rotate-6 transition-transform" />

          {/* AI Badge */}
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-4 w-4 bg-amber-500 border-2 border-white items-center justify-center text-[9px] font-black text-white">
              AI
            </span>
          </span>
        </button>
      </div>
    );
  }

  const currentPrompts = PROMPTS_BY_LANG[selectedLang] || PROMPTS_BY_LANG['hi-IN'];
  const activeLangObj = LANGUAGES.find((l) => l.code === selectedLang) || LANGUAGES[0];

  // ═══════════════════════════════════════════════════════════════════
  // ── FULL PAGE MODE (Requested by User)
  // ═══════════════════════════════════════════════════════════════════
  if (isFullScreen) {
    return (
      <div className="fixed inset-0 z-[9999] bg-slate-900/50 backdrop-blur-xs flex flex-col animate-fadeIn">
        <div className="flex-1 flex flex-col md:flex-row bg-slate-50 w-full h-full overflow-hidden">
          
          {/* ── Left Sidebar (Topic Explorer & Language) ── */}
          <aside className="w-full md:w-80 lg:w-96 bg-gradient-to-b from-[#0b1329] via-[#0d1b3e] to-[#091024] text-white flex flex-col border-r border-slate-800 shrink-0 select-none">
            {/* Top Branding */}
            <div className="p-5 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-600/30 border border-blue-400/40 flex items-center justify-center shadow-inner">
                  <Bot className="w-6 h-6 text-blue-300" />
                </div>
                <div>
                  <h2 className="font-black text-base tracking-wide flex items-center gap-1.5 text-white">
                    KhetiBot AI
                    <span className="text-[11px] font-semibold text-blue-300">खेती मित्र</span>
                  </h2>
                  <p className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                    Multilingual Agri Assistant
                  </p>
                </div>
              </div>

              {/* Close Button on Mobile / Header */}
              <button
                onClick={() => {
                  if (typeof window !== 'undefined' && window.speechSynthesis) window.speechSynthesis.cancel();
                  setIsOpen(false);
                }}
                className="md:hidden p-2 rounded-xl bg-white/10 text-slate-300 hover:text-white"
                title="Close KhetiBot"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* New Chat Button */}
            <div className="p-4 border-b border-white/10">
              <button
                onClick={resetChat}
                className="w-full py-3 px-4 rounded-2xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white text-xs font-extrabold flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all"
              >
                <Plus className="w-4 h-4" /> New Conversation (नया चैट)
              </button>
            </div>

            {/* Language Selection */}
            <div className="px-5 py-3 border-b border-white/10 bg-white/5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5 uppercase tracking-wider">
                  <Globe className="w-3.5 h-3.5 text-blue-400" /> भाषा / Language
                </span>
                {isSpeaking && (
                  <span className="text-[10px] font-extrabold text-blue-300 flex items-center gap-1 animate-pulse">
                    <Volume2 className="w-3 h-3" /> Speaking...
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-1.5">
                {LANGUAGES.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => setSelectedLang(l.code)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                      selectedLang === l.code
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 border border-blue-400/40'
                        : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white border border-white/5'
                    }`}
                  >
                    <span>{l.flag}</span>
                    <span className="truncate">{l.short}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Suggested Topic Directory */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2 no-scrollbar">
              <p className="text-[11px] font-bold text-slate-400 px-1 uppercase tracking-wider mb-2">
                Expert Topics (सहायता विषय)
              </p>
              {SUGGESTED_TOPICS.map((topic, i) => {
                const Icon = topic.icon;
                return (
                  <div
                    key={i}
                    onClick={() => sendQuery(topic.prompt)}
                    className="p-3 rounded-2xl bg-white/5 hover:bg-blue-600/20 border border-white/5 hover:border-blue-500/30 cursor-pointer transition-all group flex items-start gap-3"
                  >
                    <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-300 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-all">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-slate-200 group-hover:text-white truncate">
                        {topic.title}
                      </h4>
                      <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                        {topic.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Actions in Sidebar */}
            <div className="p-4 border-t border-white/10 flex items-center justify-between bg-black/20 text-xs">
              <button
                onClick={() => setVoiceEnabled(!voiceEnabled)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all ${
                  voiceEnabled ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
                title={voiceEnabled ? 'Voice enabled (Click to mute)' : 'Voice disabled (Click to enable)'}
              >
                {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                <span>{voiceEnabled ? 'Voice: ON' : 'Voice: OFF'}</span>
              </button>

              <button
                onClick={() => {
                  if (typeof window !== 'undefined' && window.speechSynthesis) window.speechSynthesis.cancel();
                  setIsOpen(false);
                }}
                className="flex items-center gap-1.5 text-slate-300 hover:text-white font-bold py-1 px-2.5 rounded-xl hover:bg-white/10 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Back to App
              </button>
            </div>
          </aside>

          {/* ── Main Chat Area ── */}
          <main className="flex-1 flex flex-col h-full bg-slate-50 relative overflow-hidden">
            
            {/* Top Blue Header Bar */}
            <header className="h-16 px-6 bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white flex items-center justify-between shadow-md shrink-0 border-b border-blue-950/20">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-inner">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-black text-sm sm:text-base tracking-wide flex items-center gap-2">
                    KhetiBot Full-Page Assistant
                    <span className="px-2 py-0.5 rounded-full bg-blue-500/30 text-blue-200 border border-blue-400/40 text-[10px] font-extrabold uppercase">
                      Hugging Face AI
                    </span>
                  </h3>
                  <p className="text-[11px] text-blue-200 hidden sm:block">
                    Direct advisory on crops, live auctions, logistics & government subsidies
                  </p>
                </div>
              </div>

              {/* Window controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsFullScreen(false)}
                  title="Switch to floating window mode"
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 transition-all"
                >
                  <Minimize2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Floating Mode</span>
                </button>

                <button
                  onClick={() => {
                    if (typeof window !== 'undefined' && window.speechSynthesis) window.speechSynthesis.cancel();
                    setIsOpen(false);
                  }}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all"
                  title="Close KhetiBot"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </header>

            {/* Conversation Feed */}
            <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 space-y-5">
              <div className="max-w-4xl mx-auto w-full space-y-5">
                
                {messages.map((m) => {
                  const isUser = m.role === 'user';
                  return (
                    <div
                      key={m.id}
                      className={`flex items-start gap-3.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
                    >
                      {/* Avatar */}
                      <div
                        className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 text-white shadow-md ${
                          isUser
                            ? 'bg-gradient-to-tr from-blue-700 to-indigo-600'
                            : 'bg-gradient-to-tr from-blue-900 via-blue-800 to-slate-900 border border-blue-700'
                        }`}
                      >
                        {isUser ? <User className="w-4 h-4" /> : <Bot className="w-5 h-5 text-blue-300" />}
                      </div>

                      {/* Bubble */}
                      <div className="max-w-[85%] sm:max-w-[80%] group">
                        <div
                          className={`p-4 rounded-3xl text-sm leading-relaxed shadow-xs whitespace-pre-wrap ${
                            isUser
                              ? 'bg-blue-600 text-white rounded-tr-xs shadow-blue-600/20'
                              : 'bg-white text-slate-800 border border-slate-200/90 rounded-tl-xs shadow-slate-200/50 hover:border-blue-300 transition-colors'
                          }`}
                        >
                          {m.content}
                        </div>

                        {/* Metadata & Actions */}
                        <div className={`flex items-center gap-3 mt-1.5 px-1 text-[11px] text-slate-400 ${isUser ? 'justify-end' : 'justify-start'}`}>
                          <span>{m.timestamp}</span>

                          {!isUser && (
                            <>
                              <span>•</span>
                              <button
                                onClick={() => speakText(m.content, selectedLang)}
                                className="hover:text-blue-600 flex items-center gap-1 font-semibold transition-colors"
                                title="Listen to this answer"
                              >
                                <Volume2 className="w-3.5 h-3.5" />
                                <span>Listen</span>
                              </button>
                              <span>•</span>
                              <button
                                onClick={() => copyToClipboard(m.id, m.content)}
                                className="hover:text-blue-600 flex items-center gap-1 font-semibold transition-colors"
                                title="Copy answer"
                              >
                                {copiedId === m.id ? (
                                  <>
                                    <Check className="w-3.5 h-3.5 text-blue-600" />
                                    <span className="text-blue-600 font-bold">Copied</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3.5 h-3.5" />
                                    <span>Copy</span>
                                  </>
                                )}
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Thinking Indicator */}
                {loading && (
                  <div className="flex items-start gap-3.5">
                    <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-blue-900 to-slate-900 border border-blue-700 flex items-center justify-center shrink-0 text-white shadow-md">
                      <Bot className="w-5 h-5 text-blue-300" />
                    </div>
                    <div className="bg-white border border-blue-200 rounded-3xl rounded-tl-xs p-4 shadow-sm flex items-center gap-3 text-slate-600 text-xs">
                      <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                      <span className="font-semibold text-slate-700">KhetiBot is thinking... (कृषि मित्र सोच रहा है...)</span>
                    </div>
                  </div>
                )}

                <div ref={endRef} />
              </div>
            </div>

            {/* Bottom Dock Input Area */}
            <div className="shrink-0 bg-white border-t border-slate-200 p-4 sm:p-6 shadow-xl">
              <div className="max-w-4xl mx-auto w-full space-y-3">
                
                {/* Quick Prompts Carousel */}
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                  <span className="text-[11px] font-extrabold text-blue-700 shrink-0 uppercase tracking-wider">
                    त्वरित सुझाव:
                  </span>
                  {currentPrompts.map((p, idx) => (
                    <button
                      key={idx}
                      onClick={() => sendQuery(p.prompt)}
                      disabled={loading}
                      className="shrink-0 text-xs font-semibold px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 transition-colors border border-slate-200 disabled:opacity-50"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>

                {/* Voice Listening Banner */}
                {isListening && (
                  <div className="bg-blue-50 border border-blue-200 rounded-2xl px-4 py-2.5 flex items-center justify-between text-xs text-blue-900 animate-pulse">
                    <div className="flex items-center gap-2.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                      <span className="font-bold">Listening now... (अपनी भाषा में बोलें)</span>
                    </div>
                    <button
                      onClick={toggleMic}
                      className="px-3 py-1 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition-colors"
                    >
                      Stop
                    </button>
                  </div>
                )}

                {/* Main Input Box */}
                <div className="flex items-center gap-2 bg-slate-50 border-2 border-slate-200 rounded-3xl p-2 focus-within:border-blue-600 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-500/10 transition-all shadow-xs">
                  {/* Microphone */}
                  <button
                    type="button"
                    onClick={toggleMic}
                    title={isListening ? 'Stop listening' : 'Speak via microphone (बोलकर पूछें)'}
                    className={`p-3 rounded-2xl transition-all ${
                      isListening
                        ? 'bg-red-500 text-white animate-pulse'
                        : 'text-slate-500 hover:text-blue-600 hover:bg-blue-50'
                    }`}
                  >
                    {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                  </button>

                  {/* Input field */}
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendQuery()}
                    placeholder="Ask in Hindi, English, Punjabi, Gujarati... (किसी भी भाषा में प्रश्न पूछें)"
                    disabled={loading}
                    className="flex-1 bg-transparent border-none text-slate-800 text-sm sm:text-base px-2 focus:outline-none placeholder:text-slate-400 disabled:opacity-60"
                  />

                  {/* Send Button */}
                  <button
                    type="button"
                    onClick={() => sendQuery()}
                    disabled={!input.trim() || loading}
                    className="px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-blue-600/30 transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
                    title="Send query"
                  >
                    <span>Send</span>
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  </button>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 px-2 font-medium">
                  <span>🌾 KhetiConnect Agricultural Knowledge Base</span>
                  <span>Hugging Face AI • Verified Multilingual Intelligence</span>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════
  // ── FLOATING WINDOW MODE (Blue Theme)
  // ═══════════════════════════════════════════════════════════════════
  return (
    <div
      className="fixed z-[9999] bottom-4 right-4 sm:bottom-6 sm:right-6 w-[95vw] sm:w-[460px] h-[82vh] max-h-[640px] flex flex-col bg-white rounded-3xl shadow-2xl shadow-blue-950/30 border border-slate-200 overflow-hidden transition-all duration-300 animate-fadeIn"
    >
      {/* ── Top Bar / Header ── */}
      <div className="relative bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 px-4 py-3.5 text-white flex items-center justify-between shadow-md shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-inner">
            <Bot className="w-6 h-6 text-white" />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-blue-400 border-2 border-blue-900" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-sm sm:text-base tracking-wide flex items-center gap-1.5">
                KhetiBot AI
                <span className="text-blue-200 text-xs font-normal">• खेती मित्र</span>
              </h3>
            </div>
            <p className="text-[11px] text-blue-200 font-medium flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-300 animate-spin" style={{ animationDuration: '4s' }} />
              Hugging Face AI • Blue Theme
            </p>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-1">
          {/* TTS Toggle */}
          <button
            onClick={() => {
              if (isSpeaking && typeof window !== 'undefined') {
                window.speechSynthesis.cancel();
                setIsSpeaking(false);
              }
              setVoiceEnabled(!voiceEnabled);
            }}
            title={voiceEnabled ? 'Mute AI voice output' : 'Enable AI voice speech'}
            className={`p-1.5 rounded-xl text-white/90 hover:text-white transition-colors ${
              voiceEnabled ? 'bg-blue-600 text-amber-200' : 'hover:bg-white/10'
            }`}
          >
            {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Reset */}
          <button
            onClick={resetChat}
            title="Reset conversation"
            className="p-1.5 rounded-xl hover:bg-white/10 text-white/90 hover:text-white transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Switch to Full Page */}
          <button
            onClick={() => setIsFullScreen(true)}
            title="Open Full Page view"
            className="p-1.5 rounded-xl hover:bg-white/10 text-white/90 hover:text-white transition-colors"
          >
            <Maximize2 className="w-4 h-4" />
          </button>

          {/* Close */}
          <button
            onClick={() => {
              if (typeof window !== 'undefined' && window.speechSynthesis) {
                window.speechSynthesis.cancel();
                setIsSpeaking(false);
              }
              setIsOpen(false);
            }}
            title="Close chat"
            className="p-1.5 rounded-xl hover:bg-white/10 text-white/90 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* ── Language Selector Bar ── */}
      <div className="bg-blue-50/90 border-b border-blue-100 px-3 py-1.5 flex items-center justify-between text-xs text-slate-700 shrink-0">
        <div className="flex items-center gap-1.5">
          <Globe className="w-3.5 h-3.5 text-blue-600" />
          <span className="font-semibold text-slate-600 text-[11px]">भाषा (Language):</span>

          <div className="relative">
            <button
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-white border border-blue-200 shadow-2xs font-semibold text-blue-800 text-[11px] hover:bg-blue-50 transition-colors"
            >
              <span>{activeLangObj.flag}</span>
              <span>{activeLangObj.short}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {langMenuOpen && (
              <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 max-h-56 overflow-y-auto">
                {LANGUAGES.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      setSelectedLang(l.code);
                      setLangMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs flex items-center gap-2 hover:bg-blue-50 transition-colors ${
                      selectedLang === l.code ? 'font-bold text-blue-700 bg-blue-50' : 'text-slate-700'
                    }`}
                  >
                    <span className="text-sm">{l.flag}</span>
                    <span>{l.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {isSpeaking && (
          <div className="flex items-center gap-1 text-[11px] font-semibold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full animate-pulse">
            <Volume2 className="w-3 h-3" />
            <span>Speaking...</span>
          </div>
        )}
      </div>

      {/* ── Messages Feed ── */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-slate-50/50 to-white">
        {messages.map((m) => {
          const isUser = m.role === 'user';
          return (
            <div key={m.id} className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-white shadow-2xs ${
                  isUser ? 'bg-blue-600' : 'bg-gradient-to-br from-blue-900 to-indigo-800'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 text-blue-200" />}
              </div>

              <div className="max-w-[85%] sm:max-w-[78%] group">
                <div
                  className={`p-3.5 rounded-2xl text-[13.5px] leading-relaxed shadow-2xs border whitespace-pre-wrap ${
                    isUser
                      ? 'bg-blue-600 text-white border-blue-500 rounded-tr-xs'
                      : 'bg-white text-slate-800 border-slate-200/80 rounded-tl-xs hover:border-blue-200'
                  }`}
                >
                  {m.content}
                </div>

                <div className={`flex items-center gap-2 mt-1 px-1 text-[10px] text-slate-400 ${isUser ? 'justify-end' : 'justify-start'}`}>
                  <span>{m.timestamp}</span>

                  {!isUser && (
                    <>
                      <span>•</span>
                      <button
                        onClick={() => speakText(m.content, selectedLang)}
                        className="hover:text-blue-700 flex items-center gap-0.5 transition-colors font-medium"
                        title="Speak response aloud"
                      >
                        <Volume2 className="w-3 h-3" />
                        <span>Listen</span>
                      </button>
                      <span>•</span>
                      <button
                        onClick={() => copyToClipboard(m.id, m.content)}
                        className="hover:text-blue-700 flex items-center gap-0.5 transition-colors font-medium"
                        title="Copy to clipboard"
                      >
                        {copiedId === m.id ? (
                          <>
                            <Check className="w-3 h-3 text-blue-600" />
                            <span className="text-blue-600 font-semibold">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-900 to-indigo-800 flex items-center justify-center shrink-0 text-white shadow-2xs">
              <Bot className="w-4 h-4 text-blue-200" />
            </div>
            <div className="bg-white border border-blue-100 rounded-2xl rounded-tl-xs p-3.5 shadow-2xs flex items-center gap-2 text-slate-600 text-xs">
              <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
              <span className="font-medium">KhetiBot is thinking... (कृषि मित्र सोच रहा है...)</span>
            </div>
          </div>
        )}

        <div ref={endRef} />
      </div>

      {/* ── Quick Prompts Carousel ── */}
      <div className="px-3 pt-2 pb-1 bg-white border-t border-slate-100 overflow-x-auto no-scrollbar shrink-0 flex items-center gap-1.5">
        <span className="text-[11px] font-semibold text-slate-400 shrink-0">सुझाव:</span>
        {currentPrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => sendQuery(p.prompt)}
            disabled={loading}
            className="shrink-0 text-[11px] font-medium px-2.5 py-1 rounded-full bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 transition-colors border border-slate-200/60 disabled:opacity-50"
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* ── Listening Pulse Banner ── */}
      {isListening && (
        <div className="bg-blue-50 border-t border-blue-200 px-4 py-2 flex items-center justify-between text-xs text-blue-900 shrink-0 animate-pulse">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
            <span className="font-bold">Listening... (अपनी भाषा में बोलें)</span>
          </div>
          <button
            onClick={toggleMic}
            className="text-blue-800 hover:text-blue-950 font-bold underline text-[11px]"
          >
            Stop
          </button>
        </div>
      )}

      {/* ── Input Box & Controls ── */}
      <div className="p-3 bg-white border-t border-slate-200/80 shrink-0">
        <div className="relative flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-2xl p-1.5 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-400/20 transition-all">
          {/* Mic */}
          <button
            type="button"
            onClick={toggleMic}
            title={isListening ? 'Stop listening' : 'Speak via microphone (बोलकर पूछें)'}
            className={`p-2 rounded-xl transition-all ${
              isListening
                ? 'bg-red-500 text-white animate-pulse'
                : 'text-slate-500 hover:text-blue-700 hover:bg-blue-100/50'
            }`}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          {/* Text Input */}
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendQuery()}
            placeholder="Ask in Hindi, English, Punjabi, Gujarati... (किसी भी भाषा में पूछें)"
            disabled={loading}
            className="flex-1 bg-transparent border-none text-slate-800 text-xs sm:text-sm px-1.5 focus:outline-none placeholder:text-slate-400 disabled:opacity-60"
          />

          {/* Send Button */}
          <button
            type="button"
            onClick={() => sendQuery()}
            disabled={!input.trim() || loading}
            className="p-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-2xs hover:from-blue-700 hover:to-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            title="Send query"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </div>

        <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-400 px-1">
          <span>🌾 KhetiConnect Knowledge Base</span>
          <span>Hugging Face AI • Multilingual</span>
        </div>
      </div>
    </div>
  );
}