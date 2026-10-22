import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { PlusCircle, Send, ExternalLink, X, BookOpen, MessageCircle, Landmark, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { postForumThread, postReply } from '../store/slices/communitySlice';
import { showToast } from '../store/slices/uiSlice';

const SUBTABS = [
  { id: 'forum',   label: 'Forum Q&A',    icon: <MessageCircle className="w-4 h-4" /> },
  { id: 'guides',  label: 'Agri Guides',  icon: <BookOpen className="w-4 h-4" /> },
  { id: 'schemes', label: 'Govt Schemes', icon: <Landmark className="w-4 h-4" /> },
  { id: 'mandi',   label: 'Mandi Rates',  icon: <TrendingUp className="w-4 h-4" /> },
];

const getId = (item) => item._id || item.id;

const Empty = ({ text }) => (
  <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm col-span-3">
    <p className="text-sm text-slate-500">{text}</p>
  </div>
);

export default function CommunitySection() {
  const dispatch = useDispatch();
  const { guides, schemes, forumThreads } = useSelector((state) => state.community);
  const mandiRates = useSelector((state) => state.marketplace.mandiRates);
  const searchTerm = useSelector((state) => state.ui.searchTerm);

  const [tab, setTab] = useState('forum');
  const [askOpen, setAskOpen] = useState(false);
  const [openThread, setOpenThread] = useState(null);
  const [replies, setReplies] = useState({});
  const [guide, setGuide] = useState(null);
  const [question, setQuestion] = useState({ title: '', content: '' });

  // Search filter
  const sq = searchTerm.trim().toLowerCase();
  const filter = (list, fields) =>
    list.filter((item) => !sq || fields.some((f) => (item[f] || '').toLowerCase().includes(sq)));

  const threads = filter(forumThreads, ['title', 'content', 'authorName']);
  const filteredGuides = filter(guides, ['title', 'summary', 'category']);
  const filteredSchemes = filter(schemes, ['title', 'benefit', 'eligibility']);
  const filteredMandi = filter(mandiRates, ['crop', 'location']);

  const handleAsk = async (e) => {
    e.preventDefault();
    try {
      await dispatch(postForumThread(question)).unwrap();
      setQuestion({ title: '', content: '' });
      setAskOpen(false);
    } catch (err) {
      dispatch(showToast({ message: err.message || 'Failed to post question', type: 'error' }));
    }
  };

  const handleReply = async (threadId) => {
    const text = replies[threadId]?.trim();
    if (!text) return;
    try {
      await dispatch(postReply({ threadId, text })).unwrap();
      setReplies({ ...replies, [threadId]: '' });
    } catch (err) {
      dispatch(showToast({ message: err.message || 'Failed to post reply', type: 'error' }));
    }
  };

  return (
    <div className="py-6">
      {/* Banner */}
      <div className="rounded-3xl overflow-hidden mb-8 shadow-xl" style={{ background: 'linear-gradient(135deg, #021a0a 0%, #063320 50%, #0c3d25 100%)' }}>
        <div className="p-8 md:p-10">
          <span className="badge badge-green mb-3">Community Hub</span>
          <h2 className="text-3xl font-black text-white mb-2">Farmer Knowledge Base</h2>
          <p className="text-emerald-100 text-sm max-w-xl">
            Ask farming questions, read government schemes, check mandi rates, and learn verified modern agricultural practices.
          </p>
        </div>
      </div>

      {/* Subtabs */}
      <div className="flex border-b border-slate-200 mb-6 gap-2 no-scrollbar overflow-x-auto">
        {SUBTABS.map(({ id, label, icon }) => (
          <button key={id} onClick={() => setTab(id)} className={`tab-button flex items-center gap-2 ${tab === id ? 'active' : ''}`}>
            {icon}
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* Forum */}
      {tab === 'forum' && (
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-extrabold text-slate-900 mb-1">Community Discussions</h3>
              <p className="text-sm text-slate-500">Ask questions and share farming advice.</p>
            </div>
            <button onClick={() => setAskOpen(true)} className="btn btn-primary">
              <PlusCircle className="w-4 h-4" /> Ask Question
            </button>
          </div>

          <div className="space-y-4">
            {threads.length === 0 && <Empty text="No questions yet. Be the first to ask!" />}
            {threads.map((th) => {
              const id = getId(th);
              const isOpen = openThread === id;
              return (
                <div key={id} className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-base">{th.title}</h4>
                      <p className="text-xs text-slate-400 mt-0.5">By {th.authorName} ({th.authorRole}) · {th.postedAt}</p>
                    </div>
                    <span className="badge badge-outline text-[11px]">{th.replies?.length || 0} replies</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{th.content}</p>

                  <button onClick={() => setOpenThread(isOpen ? null : id)} className="text-xs font-bold text-blue-700 hover:underline">
                    {isOpen ? 'Hide Replies' : 'View / Add Reply'}
                  </button>

                  {isOpen && (
                    <div className="mt-3 pl-4 border-l-2 border-emerald-100 space-y-2">
                      {th.replies?.map((r, i) => (
                        <div key={i} className="bg-emerald-50 p-3 rounded-xl border border-emerald-100 text-xs">
                          <p className="font-extrabold text-emerald-900 mb-0.5">
                            {r.author} <span className="text-[10px] text-slate-400 font-normal">· {r.time}</span>
                          </p>
                          <p className="text-slate-700">{r.text}</p>
                        </div>
                      ))}
                      <div className="flex gap-2 pt-1">
                        <input
                          placeholder="Write your answer..."
                          value={replies[id] || ''}
                          onChange={(e) => setReplies({ ...replies, [id]: e.target.value })}
                          className="flex-1 text-xs border border-slate-200 rounded-xl px-3.5 py-2 focus:outline-none focus:border-emerald-500 bg-white"
                        />
                        <button onClick={() => handleReply(id)} className="btn btn-primary btn-sm">
                          <Send className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Guides */}
      {tab === 'guides' && (
        <section>
          <h3 className="text-xl font-extrabold text-slate-900 mb-1">Agricultural Best Practices</h3>
          <p className="text-sm text-slate-500 mb-6">Drip irrigation, organic pest control, soil management.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredGuides.length === 0 && <Empty text="No guides found." />}
            {filteredGuides.map((g) => (
              <div key={getId(g)} className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col group">
                <div className="h-48 overflow-hidden relative">
                  <img src={g.image} alt={g.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute bottom-3 left-3"><span className="badge badge-green shadow">{g.category}</span></div>
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <h4 className="font-extrabold text-slate-900 text-sm mb-2">{g.title}</h4>
                  <p className="text-xs text-slate-500 line-clamp-3 flex-1 mb-4">{g.summary}</p>
                  <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-100">
                    <span>{g.readTime}</span>
                    <button onClick={() => setGuide(g)} className="text-emerald-700 font-extrabold hover:text-emerald-900">
                      Read Guide →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Schemes */}
      {tab === 'schemes' && (
        <section>
          <h3 className="text-xl font-extrabold text-slate-900 mb-1">Government Subsidies &amp; Schemes</h3>
          <p className="text-sm text-slate-500 mb-6">Central and state programmes for Indian farmers.</p>
          <div className="space-y-4">
            {filteredSchemes.length === 0 && <Empty text="No government schemes found." />}
            {filteredSchemes.map((s) => (
              <div key={getId(s)} className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:border-amber-200 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-800 shrink-0">
                    <Landmark className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-base mb-1">{s.title}</h4>
                    <p className="text-xs text-emerald-800 font-bold mb-1">{s.benefit}</p>
                    <p className="text-xs text-slate-500">Eligibility: {s.eligibility}</p>
                  </div>
                </div>
                <button onClick={() => alert(`Redirecting to official portal for ${s.title}`)} className="btn btn-outline btn-sm shrink-0">
                  {s.linkText || 'Apply on Portal'} <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Mandi */}
      {tab === 'mandi' && (
        <section>
          <h3 className="text-xl font-extrabold text-slate-900 mb-1">Live Mandi Price Table</h3>
          <p className="text-sm text-slate-500 mb-6">Daily spot rates across major Indian agricultural mandis.</p>
          {filteredMandi.length === 0 ? (
            <Empty text="No mandi rates found." />
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-sm">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-left">
                    {['Crop', 'Mandi Location', 'Price / Unit', '24h Change'].map((h) => (
                      <th key={h} className="p-4 text-xs font-extrabold text-slate-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredMandi.map((r, i) => {
                    const up = r.change?.startsWith('+');
                    const down = r.change?.startsWith('-');
                    return (
                      <tr key={i} className="hover:bg-slate-50/70 transition-colors">
                        <td className="p-4 font-extrabold text-slate-900 text-sm">{r.crop}</td>
                        <td className="p-4 text-slate-500 text-sm">{r.location}</td>
                        <td className="p-4 font-black text-emerald-800">
                          ₹{(r.price || 0).toLocaleString()} <span className="text-xs text-slate-400 font-normal">/{r.unit || 'Quintal'}</span>
                        </td>
                        <td className="p-4">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-extrabold ${
                            up ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : down ? 'bg-red-50 text-red-600 border border-red-200'
                            : 'bg-slate-100 text-slate-500'
                          }`}>
                            {up && <ArrowUpRight className="w-3 h-3" />}
                            {down && <ArrowDownRight className="w-3 h-3" />}
                            {r.change || '0%'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

      {/* Ask modal */}
      {askOpen && (
        <div className="modal-overlay" onClick={() => setAskOpen(false)}>
          <div className="modal-card max-w-lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-green p-5 flex items-center justify-between">
              <h3 className="font-extrabold text-white">Post Community Question</h3>
              <button onClick={() => setAskOpen(false)} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleAsk} className="p-6 space-y-4">
              <div className="form-group">
                <label className="form-label">Question Title *</label>
                <input
                  required
                  placeholder="e.g. How to treat yellow rust in wheat?"
                  value={question.title}
                  onChange={(e) => setQuestion({ ...question, title: e.target.value })}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Details</label>
                <textarea
                  rows="4"
                  placeholder="Describe your crop, location, what you've tried..."
                  value={question.content}
                  onChange={(e) => setQuestion({ ...question, content: e.target.value })}
                  className="form-textarea"
                />
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => setAskOpen(false)} className="btn btn-outline flex-1">Cancel</button>
                <button type="submit" className="btn btn-primary flex-1 font-extrabold">Post Question</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Guide modal */}
      {guide && (
        <div className="modal-overlay" onClick={() => setGuide(null)}>
          <div className="modal-card max-w-xl" onClick={(e) => e.stopPropagation()}>
            <div className="h-52 relative rounded-t-[28px] overflow-hidden">
              <img src={guide.image} alt={guide.title} className="w-full h-full object-cover" />
              <button onClick={() => setGuide(null)} className="absolute top-3.5 right-3.5 w-9 h-9 bg-black/50 hover:bg-black/70 flex items-center justify-center text-white rounded-full backdrop-blur-sm">
                <X className="w-4 h-4" />
              </button>
              <div className="absolute bottom-3 left-4"><span className="badge badge-green shadow">{guide.category}</span></div>
            </div>
            <div className="p-6">
              <h2 className="text-xl font-extrabold text-slate-900 mb-1">{guide.title}</h2>
              <p className="text-xs text-slate-400 mb-4">By {guide.author} · {guide.readTime}</p>
              <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100 mb-4">{guide.summary}</p>
              <button onClick={() => setGuide(null)} className="btn btn-primary w-full">Close Guide</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}