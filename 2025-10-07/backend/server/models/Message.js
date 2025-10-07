const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  message: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  room: {
    type: String,
    default: 'general',
    index: true
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  },
  socketId: {
    type: String
  }
}, {
  timestamps: true
});

// Índice composto para queries otimizadas de histórico por sala
messageSchema.index({ room: 1, timestamp: -1 });

// Método estático para buscar últimas mensagens de uma sala
messageSchema.statics.getRecentMessages = async function(room = 'general', limit = 50) {
  try {
    const messages = await this.find({ room })
      .sort({ timestamp: -1 })
      .limit(limit)
      .select('username message timestamp -_id')
      .lean();
    
    // Retorna em ordem cronológica (mais antiga primeiro)
    return messages.reverse();
  } catch (error) {
    console.error('Erro ao buscar mensagens:', error);
    throw error;
  }
};

// Método estático para limpar mensagens antigas (manutenção)
messageSchema.statics.cleanOldMessages = async function(daysOld = 30) {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysOld);
  
  try {
    const result = await this.deleteMany({ timestamp: { $lt: cutoffDate } });
    console.log(`${result.deletedCount} mensagens antigas removidas`);
    return result;
  } catch (error) {
    console.error('Erro ao limpar mensagens antigas:', error);
    throw error;
  }
};

module.exports = mongoose.model('Message', messageSchema);