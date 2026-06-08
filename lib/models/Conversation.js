import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['user', 'assistant', 'system'],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const ConversationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      default: 'New Chat',
      trim: true,
    },
    model: {
      type: String,
      required: true,
    },
    messages: [MessageSchema],
  },
  { timestamps: true }
);

// Create compound index for fast queries in the sidebar
ConversationSchema.index({ userId: 1, updatedAt: -1 });

export default mongoose.models.Conversation || mongoose.model('Conversation', ConversationSchema);
