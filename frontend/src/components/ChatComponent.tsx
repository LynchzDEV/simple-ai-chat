import React, { useState, useEffect } from 'react';
import { getCompletion } from '../services/ollamaService';
import Typewriter from 'react-typewriter-effect';
import './ChatComponent.css';

const ChatComponent: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [messages, setMessages] = useState<{ user: string; bot: string | null }[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [typingIndex, setTypingIndex] = useState<number | null>(null); 

  useEffect(() => {
    const savedMessages = localStorage.getItem('chatHistory');
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('chatHistory', JSON.stringify(messages));
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const userMessage = { user: prompt, bot: null };
    setMessages((prev) => [...prev, userMessage]);

    setLoading(true); 

    const contextPrompt = messages
      .map((msg) => `You: ${msg.user}\nBot: ${msg.bot || ''}`)
      .join('\n') + `\nYou: ${prompt}\nBot:`;

    const response = await getCompletion(contextPrompt);

    setMessages((prev) => {
      const updatedMessages = [...prev];
      updatedMessages[updatedMessages.length - 1].bot = response; 
      return updatedMessages;
    });

    setLoading(false);
    setPrompt('');
    setTypingIndex(messages.length); 
  };

  return (
    <div className="chat-container">
      <h1 className="chat-header">Chat with Ollama (phi-3.5)</h1>
      <div>
        {messages.map((msg, index) => (
          <div key={index} className="message-container">
            <p className="user-message">You: {msg.user}</p>
            {msg.bot !== null && (
              <div className="bot-message-container">
                <strong>Bot:</strong>
                {typingIndex === index ? (
                  <Typewriter
                    text={msg.bot}
                    cursorColor="#000"
                    typeSpeed={50}
                    eraseSpeed={100}
                    typingDelay={500}
                    onType={() => {}}
                    onErase={() => {}}
                  />
                ) : (
                  <p className="bot-message">{msg.bot}</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your prompt here..."
        />
        <button type="submit" disabled={loading || !prompt.trim()}>Send</button>
      </form>
    </div>
  );
};

export default ChatComponent;
