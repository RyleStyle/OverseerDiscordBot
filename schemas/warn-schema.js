const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/my_database', { useNewUrlParser: true, useUnifiedTopology: true });

// Define the guild schema
const guildSchema = new mongoose.Schema({
  guildId: String,
  warnings: [
    {
      userId: String,
      warnings: [
        {
          warningId: Number,
          reason: String,
          timestamp: { type: Date, default: Date.now }
        }
      ]
    }
  ]
});

// Create the guild model
const Guild = mongoose.model('Guild', guildSchema);