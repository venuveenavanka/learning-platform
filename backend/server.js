// ============================================
// FILE: server.js
// ============================================
require('dotenv').config();
const app = require('./src/app');
const { sequelize } = require('./src/models');

const PORT = process.env.PORT || 5000;

// Test database connection and start server
sequelize.authenticate()
  .then(() => {
    console.log('✅ Database connection established successfully.');
    
    // Sync models (use { force: true } only in development to recreate tables)
    return sequelize.sync({ alter: true });
  })
  .then(() => {
    console.log('✅ Database models synchronized.');
    
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📍 Environment: ${process.env.NODE_ENV}`);
    });
  })
  .catch((error) => {
    console.error('❌ Unable to connect to the database:', error);
    process.exit(1);
  });

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  sequelize.close();
  process.exit(0);
});
