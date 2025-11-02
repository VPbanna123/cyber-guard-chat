
import mongoose from 'mongoose';

const alertSchema = new mongoose.Schema({
  conversationId: {
    type: String,
    required: true
  },
  victim: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  bully: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  messageContent: {
    type: String,
    required: true
  },
  bullyingType: {
    type: String,
    enum: ['harassment', 'threatening', 'sexual', 'exclusion', 'cyberstalking', 'flaming', 'general_harassment'],
    default: 'general_harassment'
  },
  confidence: {
    type: Number,
    required: true
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'resolved', 'dismissed'],
    default: 'pending'
  }
}, { 
  timestamps: true 
});

export default mongoose.model('Alert', alertSchema);
