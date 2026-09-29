import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false
  },
  role: {
    type: String,
    enum: ['farmer', 'buyer', 'admin'],
    default: 'buyer'
  },
  location: {
    type: String,
    required: [true, 'Please add a location']
  },
  phone: {
    type: String,
    default: ''
  },
  avatar: {
    type: String,
    default: function() {
      return `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(this.name)}`;
    }
  },
  rating: {
    type: Number,
    default: 5.0
  },
  verified: {
    type: Boolean,
    default: true
  },
  joinedDate: {
    type: String,
    default: () => {
      const date = new Date();
      return date.toLocaleString('en-US', { month: 'short', year: 'numeric' });
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Encrypt password using bcrypt
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', UserSchema);
export default User;
