import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { COMMUNITY_GUIDES, GOVT_SCHEMES, FORUM_THREADS, REVIEWS_LIST } from '../../data/mockData';

// ─── Helper ───────────────────────────────────────────────────────────────────
const getToken = () =>
  localStorage.getItem('kc_access_token') ||
  sessionStorage.getItem('kc_access_token') || '';

// ─── Async Thunks ─────────────────────────────────────────────────────────────

export const fetchGuides = createAsyncThunk('community/fetchGuides', async (_, { rejectWithValue }) => {
  try {
    const res = await fetch('/api/community/guides');
    const data = await res.json();
    if (data.success) return data.guides;
    return rejectWithValue(data.message);
  } catch {
    return rejectWithValue('Failed to load guides');
  }
});

export const fetchSchemes = createAsyncThunk('community/fetchSchemes', async (_, { rejectWithValue }) => {
  try {
    const res = await fetch('/api/community/schemes');
    const data = await res.json();
    if (data.success) return data.schemes;
    return rejectWithValue(data.message);
  } catch {
    return rejectWithValue('Failed to load schemes');
  }
});

export const fetchForumThreads = createAsyncThunk('community/fetchForumThreads', async (_, { rejectWithValue }) => {
  try {
    const res = await fetch('/api/community/forum');
    const data = await res.json();
    if (data.success) return data.threads;
    return rejectWithValue(data.message);
  } catch {
    return rejectWithValue('Failed to load forum');
  }
});

export const postForumThread = createAsyncThunk('community/postForumThread', async (threadData, { rejectWithValue }) => {
  try {
    const res = await fetch('/api/community/forum', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
      body: JSON.stringify(threadData)
    });
    const data = await res.json();
    if (data.success) return data.thread;
    return rejectWithValue(data.message);
  } catch {
    return rejectWithValue('Failed to post thread');
  }
});

export const postReply = createAsyncThunk('community/postReply', async ({ threadId, text }, { rejectWithValue }) => {
  try {
    const res = await fetch(`/api/community/forum/${threadId}/reply`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
      body: JSON.stringify({ text })
    });
    const data = await res.json();
    if (data.success) return { threadId, reply: data.reply };
    return rejectWithValue(data.message);
  } catch {
    return rejectWithValue('Failed to post reply');
  }
});

export const fetchReviews = createAsyncThunk('community/fetchReviews', async (_, { rejectWithValue }) => {
  try {
    const res = await fetch('/api/community/reviews');
    const data = await res.json();
    if (data.success) return data.reviews;
    return rejectWithValue(data.message);
  } catch {
    return rejectWithValue('Failed to load reviews');
  }
});

export const postReview = createAsyncThunk('community/postReview', async (reviewData, { rejectWithValue }) => {
  try {
    const res = await fetch('/api/community/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
      body: JSON.stringify(reviewData)
    });
    const data = await res.json();
    if (data.success) return data.review;
    return rejectWithValue(data.message);
  } catch {
    return rejectWithValue('Failed to submit review');
  }
});

export const postGuide = createAsyncThunk('community/postGuide', async (guideData, { rejectWithValue }) => {
  try {
    const res = await fetch('/api/community/guides', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
      body: JSON.stringify(guideData)
    });
    const data = await res.json();
    if (data.success) return data.guide;
    return rejectWithValue(data.message);
  } catch {
    return rejectWithValue('Failed to submit guide');
  }
});

// ─── Slice ────────────────────────────────────────────────────────────────────

const communitySlice = createSlice({
  name: 'community',
  initialState: {
    guides: COMMUNITY_GUIDES,
    schemes: GOVT_SCHEMES,
    forumThreads: FORUM_THREADS,
    reviews: REVIEWS_LIST,
    loading: false,
    error: null,
  },
  reducers: {
    // Optimistic local fallbacks
    addForumThread(state, action) {
      state.forumThreads.unshift(action.payload);
    },
    addReply(state, action) {
      const { threadId, replyObj } = action.payload;
      const thread = state.forumThreads.find(t => t.id === threadId);
      if (thread) {
        thread.repliesCount = (thread.repliesCount || 0) + 1;
        thread.replies = [...(thread.replies || []), replyObj];
      }
    },
    addReview(state, action) {
      state.reviews.unshift(action.payload);
    },
    addGuide(state, action) {
      state.guides.unshift(action.payload);
    },
  },
  extraReducers: (builder) => {
    // fetchGuides
    builder
      .addCase(fetchGuides.fulfilled, (state, action) => { state.guides = action.payload; })

    // fetchSchemes
    builder
      .addCase(fetchSchemes.fulfilled, (state, action) => { state.schemes = action.payload; })

    // fetchForumThreads
    builder
      .addCase(fetchForumThreads.pending, (state) => { state.loading = true; })
      .addCase(fetchForumThreads.fulfilled, (state, action) => { state.loading = false; state.forumThreads = action.payload; })
      .addCase(fetchForumThreads.rejected, (state) => { state.loading = false; });

    // postForumThread
    builder
      .addCase(postForumThread.fulfilled, (state, action) => {
        state.forumThreads = state.forumThreads.filter(t => t.id !== action.payload.id);
        state.forumThreads.unshift(action.payload);
      });

    // postReply
    builder
      .addCase(postReply.fulfilled, (state, action) => {
        const { threadId, reply } = action.payload;
        const thread = state.forumThreads.find(t => t.id === threadId);
        if (thread) {
          thread.replies = [...(thread.replies || []), reply];
          thread.repliesCount = thread.replies.length;
        }
      });

    // fetchReviews
    builder
      .addCase(fetchReviews.fulfilled, (state, action) => { state.reviews = action.payload; });

    // postReview
    builder
      .addCase(postReview.fulfilled, (state, action) => {
        state.reviews = state.reviews.filter(r => r.id !== action.payload.id);
        state.reviews.unshift(action.payload);
      });

    // postGuide
    builder
      .addCase(postGuide.fulfilled, (state, action) => {
        state.guides = state.guides.filter(g => g.id !== action.payload.id);
        state.guides.unshift(action.payload);
      });
  },
});

export const { addForumThread, addReply, addReview, addGuide } = communitySlice.actions;

// ─── Selectors ────────────────────────────────────────────────────────────────
export const selectGuides       = (state) => state.community.guides;
export const selectSchemes      = (state) => state.community.schemes;
export const selectForumThreads = (state) => state.community.forumThreads;
export const selectReviews      = (state) => state.community.reviews;
export const selectCommunityLoading = (state) => state.community.loading;

export default communitySlice.reducer;
