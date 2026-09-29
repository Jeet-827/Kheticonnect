import { createSlice } from '@reduxjs/toolkit';
import { COMMUNITY_GUIDES, GOVT_SCHEMES, FORUM_THREADS, REVIEWS_LIST } from '../../data/mockData';

const communitySlice = createSlice({
  name: 'community',
  initialState: {
    guides: COMMUNITY_GUIDES,
    schemes: GOVT_SCHEMES,
    forumThreads: FORUM_THREADS,
    reviews: REVIEWS_LIST,
  },
  reducers: {
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
});

export const { addForumThread, addReply, addReview, addGuide } = communitySlice.actions;

// ─── Selectors ────────────────────────────────────────────────────────────────
export const selectGuides = (state) => state.community.guides;
export const selectSchemes = (state) => state.community.schemes;
export const selectForumThreads = (state) => state.community.forumThreads;
export const selectReviews = (state) => state.community.reviews;

export default communitySlice.reducer;
