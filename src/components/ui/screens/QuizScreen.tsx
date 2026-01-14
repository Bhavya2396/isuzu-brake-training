import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, CheckCircle, XCircle, HelpCircle, Volume2, VolumeX } from 'lucide-react';
import { useStore } from '../../../store/useStore';
import { quizQuestions } from '../../../data/quizQuestions';
import { voiceover, narrations } from '../../../services/voiceoverService';

export function QuizScreen() {
  const nextScreen = useStore(state => state.nextScreen);
  const prevScreen = useStore(state => state.prevScreen);
  const submitQuizAnswer = useStore(state => state.submitQuizAnswer);
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [hasPlayedIntro, setHasPlayedIntro] = useState(false);

  const currentQuestion = quizQuestions[currentQuestionIndex];

  // Play intro
  useEffect(() => {
    if (!hasPlayedIntro && voiceEnabled) {
      voiceover.speak(narrations.quiz.intro);
      setHasPlayedIntro(true);
    }
    return () => voiceover.stop();
  }, [hasPlayedIntro, voiceEnabled]);

  const handleOptionClick = (index: number) => {
    if (showResult) return;
    voiceover.stop();
    setSelectedOption(index);
  };

  const handleSubmit = () => {
    if (selectedOption === null) return;
    
    submitQuizAnswer(currentQuestion.id, selectedOption);
    setShowResult(true);
    
    // Read result
    if (voiceEnabled) {
      const isCorrect = selectedOption === currentQuestion.correctIndex;
      voiceover.speak(isCorrect 
        ? "Correct! " + currentQuestion.explanation 
        : "Not quite. " + currentQuestion.explanation
      );
    }
  };

  const handleNext = () => {
    voiceover.stop();
    
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
      setShowResult(false);
    } else {
      nextScreen();
    }
  };

  const handleToggleVoice = () => {
    const newEnabled = !voiceEnabled;
    setVoiceEnabled(newEnabled);
    voiceover.setEnabled(newEnabled);
    if (!newEnabled) voiceover.stop();
  };

  const handlePrev = () => {
    voiceover.stop();
    prevScreen();
  };

  const isCorrect = selectedOption === currentQuestion.correctIndex;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-10 flex items-center justify-end pointer-events-none"
    >
      <div className="pointer-events-auto w-full max-w-md mr-6">
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-black/80 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden"
        >
          {/* Header */}
          <div className="p-4 border-b border-white/10">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold text-white">Knowledge Check</h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleToggleVoice}
                  className={`p-2 rounded-lg transition-all ${voiceEnabled ? 'text-primary' : 'text-gray-500'}`}
                >
                  {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </button>
                <span className="text-xs text-gray-500">
                  {currentQuestionIndex + 1} / {quizQuestions.length}
                </span>
              </div>
            </div>
          </div>

          {/* Question */}
          <div className="p-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestionIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                {/* Scenario */}
                <div className="p-3 rounded-lg bg-white/5 mb-4">
                  <p className="text-sm text-gray-400">{currentQuestion.scenario}</p>
                </div>

                {/* Question */}
                <p className="text-white font-medium mb-4">{currentQuestion.question}</p>

                {/* Options */}
                <div className="space-y-2">
                  {currentQuestion.options.map((option, index) => {
                    const isSelected = selectedOption === index;
                    const isCorrectOption = index === currentQuestion.correctIndex;
                    
                    let optionStyle = 'bg-white/5 border-transparent hover:bg-white/10';
                    if (showResult) {
                      if (isCorrectOption) {
                        optionStyle = 'bg-success/20 border-success';
                      } else if (isSelected && !isCorrectOption) {
                        optionStyle = 'bg-danger/20 border-danger';
                      }
                    } else if (isSelected) {
                      optionStyle = 'bg-primary/20 border-primary';
                    }

                    return (
                      <motion.button
                        key={index}
                        onClick={() => handleOptionClick(index)}
                        disabled={showResult}
                        className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all ${optionStyle}`}
                        whileTap={{ scale: showResult ? 1 : 0.98 }}
                      >
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                          isSelected ? 'bg-primary text-black' : 'bg-white/10 text-white'
                        }`}>
                          {showResult && isCorrectOption ? (
                            <CheckCircle className="w-4 h-4 text-success" />
                          ) : showResult && isSelected && !isCorrectOption ? (
                            <XCircle className="w-4 h-4 text-danger" />
                          ) : (
                            String.fromCharCode(65 + index)
                          )}
                        </div>
                        <span className="text-sm text-left text-white">{option}</span>
                      </motion.button>
                    );
                  })}
                </div>

                {/* Result explanation */}
                {showResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`mt-4 p-3 rounded-lg ${isCorrect ? 'bg-success/10 border border-success/30' : 'bg-danger/10 border border-danger/30'}`}
                  >
                    <p className={`text-sm ${isCorrect ? 'text-success' : 'text-danger'}`}>
                      {isCorrect ? '✓ Correct!' : '✗ Not quite'}
                    </p>
                    <p className="text-sm text-gray-400 mt-1">{currentQuestion.explanation}</p>
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className="p-4 border-t border-white/10 flex items-center justify-between">
            <button
              onClick={handlePrev}
              className="px-3 py-2 text-sm text-gray-400 hover:text-white transition-colors"
            >
              Back
            </button>
            
            {!showResult ? (
              <button
                onClick={handleSubmit}
                disabled={selectedOption === null}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedOption !== null
                    ? 'bg-primary text-black'
                    : 'bg-white/10 text-gray-500 cursor-not-allowed'
                }`}
              >
                Submit Answer
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-black text-sm font-medium"
              >
                {currentQuestionIndex < quizQuestions.length - 1 ? 'Next Question' : 'See Results'}
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
