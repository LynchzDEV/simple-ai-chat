import mongoose from 'mongoose';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection using MongoDB Atlas
const MONGODB_URI =
  'mongodb+srv://Lynchz:P%40ssword01@chatarchive.v8hoh.mongodb.net/chatarchive?retryWrites=true&w=majority';

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB Atlas');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB Atlas:', err.message);
  });

// Define the chat schema and model
const chatSchema = new mongoose.Schema({
  user: String,
  bot: String,
  timestamp: { type: Date, default: Date.now },
});

const Chat = mongoose.model('Chat', chatSchema);

// Save chat route
app.post('/api/chats', async (req, res) => {
  const { user, bot } = req.body;
  const newChat = new Chat({ user, bot });
  await newChat.save();
  res.status(201).json(newChat);
});

// Retrieve chats route
app.get('/api/chats', async (req, res) => {
  const chats = await Chat.find().sort({ timestamp: -1 });
  res.json(chats);
});

// Start the server on a different port if 5000 is busy
const PORT = process.env.PORT || 5001; // Changed from 5000 to 5001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
