export const demoProfiles = {
  'f-1': {
    _id: 'f-1',
    id: 'f-1',
    name: 'Sardar Ramesh Singh',
    email: 'farmer@kheti.com',
    role: 'farmer',
    location: 'Ludhiana, Punjab',
    phone: '+91 98765 43210',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
    rating: 4.9,
    verified: true,
    acresCount: 25,
    joinedDate: 'Jan 2024',
    bio: 'Dedicated organic wheat and paddy grower with 15+ years farming experience in Punjab fertile belt.'
  },
  'b-100': {
    _id: 'b-100',
    id: 'b-100',
    name: 'Ankit Gupta (Wholesale Agri Trader)',
    email: 'buyer@kheti.com',
    role: 'buyer',
    location: 'Azadpur Mandi, Delhi',
    phone: '+91 98111 22334',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
    rating: 4.95,
    verified: true,
    businessType: 'Grain & Produce Wholesaler',
    joinedDate: 'Mar 2024',
    bio: 'Direct aggregator for supermarket chains and institutional food buyers across NCR and North India.'
  },
  'admin-1': {
    _id: 'admin-1',
    id: 'admin-1',
    name: 'Kheti Admin Officer',
    email: 'admin@kheti.com',
    role: 'admin',
    location: 'New Delhi, India',
    phone: '+91 99999 88888',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop',
    rating: 5.0,
    verified: true,
    department: 'System Administrator & Advisory Control',
    joinedDate: 'Jan 2024',
    bio: 'Oversees platform dispute resolution, mandi price index integrations, and verification workflows.'
  }
};

export const getDemoUser = (id) => {
  return demoProfiles[id] || null;
};

export const updateDemoUser = (id, fields) => {
  if (demoProfiles[id]) {
    demoProfiles[id] = { ...demoProfiles[id], ...fields };
    return demoProfiles[id];
  }
  return null;
};
