import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const request = async (method, url, getState, body) => {
  const token = getState().auth.token;
  const { data } = await axios({
    method,
    url,
    data: body,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!data.success) throw new Error(data.message);
  return data;
};

// Fetch
export const fetchGuides = createAsyncThunk('community/fetchGuides', async (_, { getState }) =>
  (await request('get', '/api/community/guides', getState)).guides);

export const fetchSchemes = createAsyncThunk('community/fetchSchemes', async (_, { getState }) =>
  (await request('get', '/api/community/schemes', getState)).schemes);

export const fetchForumThreads = createAsyncThunk('community/fetchForumThreads', async (_, { getState }) =>
  (await request('get', '/api/community/forum', getState)).threads);

export const fetchReviews = createAsyncThunk('community/fetchReviews', async (_, { getState }) =>
  (await request('get', '/api/community/reviews', getState)).reviews);

// Post
export const postGuide = createAsyncThunk('community/postGuide', async (body, { getState }) =>
  (await request('post', '/api/community/guides', getState, body)).guide);

export const postForumThread = createAsyncThunk('community/postForumThread', async (body, { getState }) =>
  (await request('post', '/api/community/forum', getState, body)).thread);

export const postReview = createAsyncThunk('community/postReview', async (body, { getState }) =>
  (await request('post', '/api/community/reviews', getState, body)).review);

export const postReply = createAsyncThunk('community/postReply', async ({ threadId, text }, { getState }) => {
  const { reply } = await request('post', `/api/community/forum/${threadId}/reply`, getState, { text });
  return { threadId, reply };
});

// Slice
const communitySlice = createSlice({
  name: 'community',
  initialState: { guides: [], schemes: [], forumThreads: [], reviews: [] },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGuides.fulfilled, (state, { payload }) => { state.guides = payload; })
      .addCase(fetchSchemes.fulfilled, (state, { payload }) => { state.schemes = payload; })
      .addCase(fetchForumThreads.fulfilled, (state, { payload }) => { state.forumThreads = payload; })
      .addCase(fetchReviews.fulfilled, (state, { payload }) => { state.reviews = payload; })
      .addCase(postGuide.fulfilled, (state, { payload }) => { state.guides.unshift(payload); })
      .addCase(postForumThread.fulfilled, (state, { payload }) => { state.forumThreads.unshift(payload); })
      .addCase(postReview.fulfilled, (state, { payload }) => { state.reviews.unshift(payload); })
      .addCase(postReply.fulfilled, (state, { payload: { threadId, reply } }) => {
        const thread = state.forumThreads.find((t) => (t._id || t.id) === threadId);
        if (thread) thread.replies = [...(thread.replies || []), reply];
      });
  },
});

// Selectors
export const selectGuides = (state) => state.community.guides;
export const selectSchemes = (state) => state.community.schemes;
export const selectForumThreads = (state) => state.community.forumThreads;
export const selectReviews = (state) => state.community.reviews;

export default communitySlice.reducer;