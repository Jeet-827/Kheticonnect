import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useKheti } from '../hooks/useKheti';
import { selectUser } from '../store/slices/authSlice';
import { addGuide } from '../store/slices/communitySlice';
import { tokenService } from '../services/tokenService';
import { showToast, clearToast } from '../store/slices/uiSlice';
import { PlusCircle, Send, ExternalLink, X, BookOpen, MessageCircle, Landmark, TrendingUp, ArrowUpRight, ArrowDownRight, Plus, Sparkles } from 'lucide-react';

const SUBTABS = [
  { id: 'forum',   label: 'Forum Q&A',     icon: <MessageCircle className="w-4 h-4" /> },
  { id: 'guides',  label: 'Agri Guides',   icon: <BookOpen className="w-4 h-4" /> },
  { id: 'schemes', label: 'Govt Schemes',  icon: <Landmark className="w-4 h-4" /> },
  { id: 'mandi',   label: 'Mandi Rates',   icon: <TrendingUp className="w-4 h-4" /> },
];

export default function CommunitySection() {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const { guides, schemes, forumThreads, mandiRates, searchTerm, setSearchTerm, addForumThread, addReply } = useKheti();
  const [tab, setTab]           = useState('forum');
  const [askOpen, setAskOpen]   = useState(false);
  const [openTh, setOpenTh]     = useState(null);
  const [replies, setReplies]   = useState({});
  const [guide, setGuide]       = useState(null);
  const [q, setQ]               = useState({ title: '', content: '' });

  // Admin Add Guide State
  const [guideModalOpen, setGuideModalOpen] = useState(false);
  const [newGuideData, setNewGuideData]     = useState({ title: '', category: 'Organic Farming', readTime: '5 min read', author: '', summary: '', image: '' });

  const isAdmin = user?.role === 'admin';

  const handlePostGuide = async (e) => {
    e.preventDefault();
    if (!newGuideData.title || !newGuideData.summary) return;

    try {
      const accessToken = tokenService.getAccessToken();
      const res = await fetch('/api/community/guides', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`
        },
        body: JSON.stringify(newGuideData)
      });
      const data = await res.json();
      if (data.success && data.guide) {
        dispatch(addGuide(data.guide));
        dispatch(showToast({ message: 'Advisory guide posted to backend successfully!', type: 'success' }));
      } else {
        const fallback = { id: `g-${Date.now()}`, ...newGuideData, author: newGuideData.author || 'Kheti Advisory Board', image: newGuideData.image || 'https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?q=80&w=600' };
        dispatch(addGuide(fallback));
        dispatch(showToast({ message: 'Guide added (Demo Admin Mode)!', type: 'success' }));
      }
    } catch {
      const fallback = { id: `g-${Date.now()}`, ...newGuideData, author: newGuideData.author || 'Kheti Advisory Board', image: newGuideData.image || 'https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?q=80&w=600' };
      dispatch(addGuide(fallback));
      dispatch(showToast({ message: 'Guide added (Local Mode)!', type: 'success' }));
    }
    setTimeout(() => dispatch(clearToast()), 3500);
    setGuideModalOpen(false);
    setNewGuideData({ title: '', category: 'Organic Farming', readTime: '5 min read', author: '', summary: '', image: '' });
  };

  const sq = searchTerm.trim().toLowerCase();

  const filteredThreads = forumThreads.filter(th => 
    !sq || th.title.toLowerCase().includes(sq) || th.content.toLowerCase().includes(sq) || th.authorName.toLowerCase().includes(sq)
  );

  const filteredGuides = (guides || []).filter(g =>
    !sq || g.title.toLowerCase().includes(sq) || g.summary.toLowerCase().includes(sq) || g.category.toLowerCase().includes(sq)
  );

  const filteredSchemes = (schemes || []).filter(s =>
    !sq || s.title.toLowerCase().includes(sq) || s.benefit.toLowerCase().includes(sq) || s.eligibility.toLowerCase().includes(sq)
  );

  const filteredMandi = (mandiRates || []).filter(m =>
    !sq || m.crop.toLowerCase().includes(sq) || m.location.toLowerCase().includes(sq)
  );

  const postQ = e => {
    e.preventDefault();
    if (!q.title.trim()) return;
    addForumThread({ id: `th-${Date.now()}`, authorName: 'You (Kheti Member)', authorRole: 'Community', title: q.title, content: q.content || 'Seeking advice.', likes: 1, repliesCount: 0, postedAt: 'Just now', replies: [] });
    setQ({ title: '', content: '' }); setAskOpen(false);
  };
  const postReply = id => {
    const text = replies[id]; if (!text?.trim()) return;
    addReply(id, { author: 'You (Kheti Member)', text, time: 'Just now' });
    setReplies(p => ({ ...p, [id]: '' }));
  };

  return (
    <div className="py-6">
      {/* Banner */}
      <div className="rounded-3xl overflow-hidden mb-8 shadow-xl" style={{ background: 'linear-gradient(135deg, #021a0a 0%, #063320 50%, #0c3d25 100%)' }}>
        <div className="p-8 md:p-10">
          <div className="section-eyebrow">Community Hub</div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-2">Advisory &amp; Knowledge Portal</h2>
          <p className="text-emerald-200/75 text-sm mb-6 max-w-xl">Expert guides, live mandi prices, government schemes and a peer Q&A forum — all in one place.</p>

          <div className="flex flex-wrap gap-2">
            {SUBTABS.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`btn btn-sm flex items-center gap-1.5 rounded-xl transition-all ${tab === t.id ? 'bg-white text-emerald-900 shadow-md' : 'btn-ghost-dark'}`}>
                {t.icon} {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Forum */}
      {tab === 'forum' && (
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-extrabold text-slate-900">Community Q&amp;A</h3>
              <p className="text-sm text-slate-500 mt-0.5">Ask anything — crop diseases, pricing, organic tips.</p>
            </div>
            <button onClick={() => setAskOpen(true)} className="btn btn-primary btn-sm">
              <PlusCircle className="w-4 h-4" /> Ask Question
            </button>
          </div>
          <div className="space-y-4">
            {filteredThreads.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-3xl border border-slate-200">
                <p className="text-sm font-extrabold text-slate-700">No community questions match "{searchTerm}"</p>
                <button onClick={() => setSearchTerm('')} className="mt-2 text-xs font-bold text-emerald-700 hover:underline">Clear Search</button>
              </div>
            ) : filteredThreads.map(th => (
              <div key={th.id} className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm hover:border-emerald-200 transition-colors">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-extrabold shrink-0"
                      style={{ background: 'linear-gradient(135deg, #0f5132, #052e16)' }}>
                      {th.authorName.charAt(0)}
                    </div>
                    <div>
                      <p className="text-xs font-extrabold text-slate-800">{th.authorName} <span className="font-normal text-slate-400">({th.authorRole})</span></p>
                      <p className="text-[10px] text-slate-400">{th.postedAt}</p>
                    </div>
                  </div>
                  <span className="badge badge-green shrink-0">{th.replies?.length || 0} answers</span>
                </div>

                <h4 className="font-extrabold text-slate-900 text-base mb-2 cursor-pointer hover:text-emerald-700 transition-colors"
                  onClick={() => setOpenTh(openTh === th.id ? null : th.id)}>
                  {th.title}
                </h4>
                <p className="text-xs text-slate-600 bg-slate-50 p-3.5 rounded-2xl border border-slate-100 leading-relaxed mb-3">{th.content}</p>

                <button onClick={() => setOpenTh(openTh === th.id ? null : th.id)}
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-900 transition-colors">
                  {openTh === th.id ? '▲ Hide Replies' : `▼ View ${th.replies?.length || 0} Answers`}
                </button>

                {openTh === th.id && (
                  <div className="mt-3 pl-4 border-l-2 border-emerald-100 space-y-2">
                    {th.replies?.map((r, i) => (
                      <div key={i} className="bg-emerald-50 p-3 rounded-xl border border-emerald-100 text-xs">
                        <p className="font-extrabold text-emerald-900 mb-0.5">{r.author} <span className="text-[10px] text-slate-400 font-normal">· {r.time}</span></p>
                        <p className="text-slate-700">{r.text}</p>
                      </div>
                    ))}
                    <div className="flex gap-2 pt-1">
                      <input type="text" placeholder="Write your answer..." value={replies[th.id] || ''}
                        onChange={e => setReplies(p => ({ ...p, [th.id]: e.target.value }))}
                        className="flex-1 text-xs border border-slate-200 rounded-xl px-3.5 py-2 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 bg-white" />
                      <button onClick={() => postReply(th.id)} className="btn btn-primary btn-sm">
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Guides */}
      {tab === 'guides' && (
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-extrabold text-slate-900 mb-1">Agricultural Best Practices</h3>
              <p className="text-sm text-slate-500">Drip irrigation, organic pest control, soil management.</p>
            </div>
            {isAdmin && (
              <button onClick={() => setGuideModalOpen(true)} className="btn bg-slate-900 text-white hover:bg-slate-800 btn-sm font-extrabold flex items-center gap-1.5 shadow-md">
                <Plus className="w-4 h-4 text-emerald-400" /> Add Guide (Admin)
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredGuides.length === 0 ? (
              <div className="col-span-3 text-center py-12 bg-white rounded-3xl border border-slate-200">
                <p className="text-sm font-extrabold text-slate-700">No guides match "{searchTerm}"</p>
                <button onClick={() => setSearchTerm('')} className="mt-2 text-xs font-bold text-emerald-700 hover:underline">Clear Search</button>
              </div>
            ) : filteredGuides.map(g => (
              <div key={g.id} className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col group">
                <div className="h-48 overflow-hidden relative">
                  <img src={g.image} alt={g.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute bottom-3 left-3"><span className="badge badge-green shadow">{g.category}</span></div>
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <h4 className="font-extrabold text-slate-900 text-sm mb-2">{g.title}</h4>
                  <p className="text-xs text-slate-500 line-clamp-3 flex-1 mb-4">{g.summary}</p>
                  <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-100">
                    <span>{g.readTime}</span>
                    <button onClick={() => setGuide(g)} className="text-emerald-700 font-extrabold hover:text-emerald-900 flex items-center gap-1 transition-colors">
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
            {filteredSchemes.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-3xl border border-slate-200">
                <p className="text-sm font-extrabold text-slate-700">No schemes match "{searchTerm}"</p>
                <button onClick={() => setSearchTerm('')} className="mt-2 text-xs font-bold text-emerald-700 hover:underline">Clear Search</button>
              </div>
            ) : filteredSchemes.map(s => (
              <div key={s.id} className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:border-amber-200 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-800 shrink-0"><Landmark className="w-6 h-6" /></div>
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-base mb-1">{s.title}</h4>
                    <p className="text-xs text-emerald-800 font-bold mb-1">{s.benefit}</p>
                    <p className="text-xs text-slate-500">Eligibility: {s.eligibility}</p>
                  </div>
                </div>
                <button onClick={() => alert(`Redirecting to official portal for ${s.title}`)}
                  className="btn btn-outline btn-sm shrink-0">
                  {s.linkText} <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Mandi Rates */}
      {tab === 'mandi' && (
        <section>
          <h3 className="text-xl font-extrabold text-slate-900 mb-1">Live Mandi Price Table</h3>
          <p className="text-sm text-slate-500 mb-6">Daily spot rates across major Indian agricultural mandis.</p>
          <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-sm">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-left">
                  <th className="p-4 text-xs font-extrabold text-slate-500 uppercase tracking-wider">Crop</th>
                  <th className="p-4 text-xs font-extrabold text-slate-500 uppercase tracking-wider">Mandi Location</th>
                  <th className="p-4 text-xs font-extrabold text-slate-500 uppercase tracking-wider">Price / Unit</th>
                  <th className="p-4 text-xs font-extrabold text-slate-500 uppercase tracking-wider">24h Change</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredMandi.map((r, i) => (
                  <tr key={i} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-4 font-extrabold text-slate-900 text-sm">{r.crop}</td>
                    <td className="p-4 text-slate-500 text-sm">{r.location}</td>
                    <td className="p-4 font-black text-emerald-800">₹{r.price.toLocaleString()} <span className="text-xs text-slate-400 font-normal">/{r.unit}</span></td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-extrabold ${r.change.startsWith('+') ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : r.change.startsWith('-') ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-slate-100 text-slate-500'}`}>
                        {r.change.startsWith('+') ? <ArrowUpRight className="w-3 h-3" /> : r.change.startsWith('-') ? <ArrowDownRight className="w-3 h-3" /> : null}
                        {r.change}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Ask modal */}
      {askOpen && (
        <div className="modal-overlay" onClick={() => setAskOpen(false)}>
          <div className="modal-card max-w-lg" onClick={e => e.stopPropagation()}>
            <div className="modal-header-green p-5 flex items-center justify-between">
              <h3 className="font-extrabold text-white">Post Community Question</h3>
              <button onClick={() => setAskOpen(false)} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"><X className="w-4 h-4"/></button>
            </div>
            <form onSubmit={postQ} className="p-6 space-y-4">
              <div className="form-group">
                <label className="form-label">Question Title *</label>
                <input required type="text" placeholder="e.g. How to treat yellow rust in wheat?" value={q.title} onChange={e => setQ(p => ({...p,title:e.target.value}))} className="form-input" />
              </div>
              <div className="form-group">
                <label className="form-label">Details</label>
                <textarea rows="4" value={q.content} onChange={e => setQ(p => ({...p,content:e.target.value}))} placeholder="Describe your crop, location, what you've tried..." className="form-textarea"/>
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
          <div className="modal-card max-w-xl" onClick={e => e.stopPropagation()}>
            <div className="h-52 relative rounded-t-[28px] overflow-hidden">
              <img src={guide.image} alt={guide.title} className="w-full h-full object-cover" />
              <button onClick={() => setGuide(null)} className="absolute top-3.5 right-3.5 w-9 h-9 bg-black/50 hover:bg-black/70 flex items-center justify-center text-white rounded-full backdrop-blur-sm"><X className="w-4 h-4"/></button>
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
      {/* Admin Add Guide modal */}
      {guideModalOpen && (
        <div className="modal-overlay" onClick={() => setGuideModalOpen(false)}>
          <div className="modal-card max-w-lg" onClick={e => e.stopPropagation()}>
            <div className="bg-slate-900 p-5 rounded-t-[28px] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-400" />
                <h3 className="font-extrabold text-base">Add Advisory Guide (Admin)</h3>
              </div>
              <button onClick={() => setGuideModalOpen(false)} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handlePostGuide} className="p-6 space-y-4">
              <div className="form-group">
                <label className="form-label">Guide Title *</label>
                <input required type="text" placeholder="e.g. Modern Soil Aeration Techniques" value={newGuideData.title} onChange={e => setNewGuideData(p => ({ ...p, title: e.target.value }))} className="form-input" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <select value={newGuideData.category} onChange={e => setNewGuideData(p => ({ ...p, category: e.target.value }))} className="form-input">
                    <option value="Organic Farming">Organic Farming</option>
                    <option value="Water Management">Water Management</option>
                    <option value="Market Advisory">Market Advisory</option>
                    <option value="Crop Protection">Crop Protection</option>
                    <option value="Soil Health">Soil Health</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Read Time</label>
                  <input type="text" placeholder="e.g. 6 min read" value={newGuideData.readTime} onChange={e => setNewGuideData(p => ({ ...p, readTime: e.target.value }))} className="form-input" />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Author / Organization</label>
                <input type="text" placeholder="e.g. ICAR Agri Advisory Council" value={newGuideData.author} onChange={e => setNewGuideData(p => ({ ...p, author: e.target.value }))} className="form-input" />
              </div>
              <div className="form-group">
                <label className="form-label">Summary / Content *</label>
                <textarea required rows="4" placeholder="Detailed description of farming best practices..." value={newGuideData.summary} onChange={e => setNewGuideData(p => ({ ...p, summary: e.target.value }))} className="form-textarea" />
              </div>
              <div className="form-group">
                <label className="form-label">Cover Image URL (optional)</label>
                <input type="url" placeholder="https://images.unsplash.com/..." value={newGuideData.image} onChange={e => setNewGuideData(p => ({ ...p, image: e.target.value }))} className="form-input" />
              </div>
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setGuideModalOpen(false)} className="btn btn-outline flex-1">Cancel</button>
                <button type="submit" className="btn btn-primary flex-1 font-extrabold">Publish Guide</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
