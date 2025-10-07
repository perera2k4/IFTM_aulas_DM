const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // A partir do Mongoose 6.x, useNewUrlParser e useUnifiedTopology não são mais necessários
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    console.log(`✅ MongoDB Conectado: ${conn.connection.host}`);
    
    // Event listeners para monitorar a conexão
    mongoose.connection.on('error', (err) => {
      console.error('❌ Erro na conexão MongoDB:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ MongoDB desconectado');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('🔄 MongoDB reconectado');
    });

    return conn;
  } catch (error) {
    console.error('❌ Erro ao conectar ao MongoDB:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;