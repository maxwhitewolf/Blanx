import React, { useState } from 'react';

const emojis = ['😀', '😂', '😍', '👍', '🔥', '🎉', '😢', '🙏'];

const ChatBox = ({ onSend, messages, onTyping }) => {
  const [input, setInput] = useState('');
  const [showEmojis, setShowEmojis] = useState(false);

  const handleSend = (e) => {
    e.preventDefault();
    if (input.trim()) {
      onSend(input);
      setInput('');
      setShowEmojis(false);
    }
  };

  const handleEmoji = (emoji) => {
    setInput((prev) => prev + emoji);
    setShowEmojis(false);
  };

  const handleInput = (e) => {
    setInput(e.target.value);
    if (onTyping) onTyping();
  };

  return (
    <div className="flex flex-col h-96 border rounded shadow bg-white">
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {messages.map((msg, idx) => (
          <div key={idx} className="text-left bg-background rounded p-2 text-sm">
            {msg}
          </div>
        ))}
      </div>
      <form onSubmit={handleSend} className="flex border-t items-center relative">
        <button type="button" className="px-2" onClick={() => setShowEmojis((v) => !v)}>
          😊
        </button>
        {showEmojis && (
          <div className="absolute bottom-12 left-2 bg-white border rounded shadow p-2 flex space-x-1 z-10">
            {emojis.map((emoji) => (
              <button key={emoji} type="button" onClick={() => handleEmoji(emoji)} className="text-xl">
                {emoji}
              </button>
            ))}
          </div>
        )}
        <input
          className="flex-1 px-3 py-2 outline-none"
          value={input}
          onChange={handleInput}
          placeholder="Type a message..."
        />
        <button type="submit" className="bg-primary text-white px-4">Send</button>
      </form>
    </div>
  );
};

export default ChatBox; 