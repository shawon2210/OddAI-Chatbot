import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSettingsSchema = new mongoose.Schema({
  theme: {
    type: String,
    enum: ['dark', 'light'],
    default: 'dark',
  },
  selectedModel: {
    type: String,
    default: 'openrouter/free',
  },
  systemPrompt: {
    type: String,
    default: 'You are OddAI, a helpful, harmless, and honest AI assistant. You provide clear, accurate, and thoughtful responses.',
  },
  customApiKey: {
    type: String,
    default: '',
  },
});

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      // Optional: only required for credentials login
    },
    image: {
      type: String,
      default: '',
    },
    provider: {
      type: String,
      enum: ['google', 'github', 'credentials'],
      required: true,
    },
    settings: {
      type: UserSettingsSchema,
      default: () => ({}),
    },
  },
  { timestamps: true }
);

// Hash password before saving if it is modified
UserSchema.pre('save', function (next) {
  if (!this.isModified('password') || !this.password) {
    return next();
  }

  try {
    const salt = bcrypt.genSaltSync(12);
    this.password = bcrypt.hashSync(this.password, salt);
    return next();
  } catch (error) {
    console.error('Error hashing password:', error);
    return next(error);
  }
});

// Compare password method
UserSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.password) return false;
  return bcrypt.compareSync(candidatePassword, this.password);
};

export default mongoose.models.User || mongoose.model('User', UserSchema);
