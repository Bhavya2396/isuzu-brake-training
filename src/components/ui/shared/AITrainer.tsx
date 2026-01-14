import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, X, Send, Loader2, Sparkles } from 'lucide-react';
import { useStore } from '../../../store/useStore';
import { askAITrainer, quickSuggestions, stepContextMap } from '../../../services/geminiService';

export function AITrainer() {
  const chatOpen = useStore(state => state.chatOpen);
  const toggleChat = useStore(state => state.toggleChat);
  const chatMessages = useStore(state => state.chatMessages);
  const chatLoading = useStore(state => state.chatLoading);
  const addChatMessage = useStore(state => state.addChatMessage);
  const setChatLoading = useStore(state => state.setChatLoading);
  const currentScreen = useStore(state => state.currentScreen);
  
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleSend = async (message?: string) => {
    const textToSend = message || input.trim();
    if (!textToSend || chatLoading) return;

    setInput('');
    addChatMessage({ role: 'user', content: textToSend });
    setChatLoading(true);

    try {
      const context = stepContextMap[currentScreen] || 'General brake training';
      const response = await askAITrainer({
        userMessage: textToSend,
        context,
        currentStep: currentScreen
      });
      addChatMessage({ role: 'assistant', content: response });
    } catch (error) {
      addChatMessage({ 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try again.' 
      });
    } finally {
      setChatLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', delay: 0.5 }}
        onClick={toggleChat}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center transition-all ${
          chatOpen
            ? 'bg-dark-200 text-gray-400'
            : 'bg-gradient-to-r from-primary to-highlight text-dark-400 shadow-lg shadow-primary/30 hover:scale-110'
        }`}
      >
        {chatOpen ? <X className="w-6 h-6" /> : <Brain className="w-6 h-6" />}
      </motion.button>

      {/* Pulse animation for closed state */}
      {!chatOpen && (
        <motion.div
          initial={{ scale: 1, opacity: 0.5 }}
          animate={{ scale: 1.5, opacity: 0 }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-primary pointer-events-none"
        />
      )}

      {/* Chat panel */}
      <AnimatePresence>
        {chatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-24 right-6 z-50 w-96 max-h-[500px] glass rounded-2xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-highlight flex items-center justify-center">
                <Brain className="w-5 h-5 text-dark-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-white">AI Trainer</h3>
                <p className="text-xs text-gray-400">
                  {stepContextMap[currentScreen] || 'Ask me anything about brake service'}
                </p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[200px] max-h-[300px]">
              {chatMessages.length === 0 && (
                <div className="text-center py-8">
                  <Sparkles className="w-8 h-8 text-primary mx-auto mb-3 opacity-50" />
                  <p className="text-sm text-gray-400">
                    Hi! I'm your AI trainer. Ask me anything about brake pad replacement.
                  </p>
                </div>
              )}
              
              {chatMessages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                    message.role === 'user'
                      ? 'bg-primary text-dark-400 rounded-br-sm'
                      : 'bg-dark-200 text-gray-200 rounded-bl-sm'
                  }`}>
                    {message.content}
                  </div>
                </motion.div>
              ))}
              
              {chatLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-dark-200 p-3 rounded-2xl rounded-bl-sm">
                    <Loader2 className="w-5 h-5 text-primary animate-spin" />
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Quick suggestions */}
            {chatMessages.length === 0 && (
              <div className="px-4 pb-2">
                <div className="flex flex-wrap gap-2">
                  {quickSuggestions.slice(0, 3).map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSend(suggestion)}
                      className="px-3 py-1.5 rounded-full text-xs bg-dark-200 text-gray-300 hover:bg-dark-100 transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t border-white/10">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask a question..."
                  className="flex-1 bg-dark-300 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <button
                  onClick={() => handleSend()}
                  disabled={!input.trim() || chatLoading}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                    input.trim() && !chatLoading
                      ? 'bg-primary text-dark-400 hover:bg-primary/90'
                      : 'bg-dark-300 text-gray-500'
                  }`}
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
