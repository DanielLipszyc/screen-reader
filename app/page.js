'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [inputText, setInputText] = useState('');
  const [isReading, setIsReading] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [words, setWords] = useState([]);
  const [isFinished, setIsFinished] = useState(false);
  const [wpm, setWpm] = useState(100);
  const [isPaused, setIsPaused] = useState(false);
  const [countdown, setCountdown] = useState(0);


  const msPerWord = 60000 / wpm;

  const handleStart = () => {
    if (inputText.trim()) {
      const wordArray = inputText.trim().split(/\s+/);
      setWords(wordArray);
      setCountdown(3);
      setCurrentWordIndex(0);
      setIsFinished(false);
    }
  };

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && words.length > 0 && !isReading && !isFinished && !isPaused) {
      setIsReading(true);
    }
  }, [countdown, words.length, isReading, isFinished, isPaused]);

  useEffect(() => {
    if (!isReading || currentWordIndex >= words.length) {
      if (isReading && currentWordIndex >= words.length) {
        setIsFinished(true);
        setIsReading(false);
      }
      return;
    }

    const timer = setTimeout(() => {
      setCurrentWordIndex(currentWordIndex + 1);
    }, msPerWord);

    return () => clearTimeout(timer);
  }, [isReading, currentWordIndex, words.length]);

  const handleReset = () => {
    setInputText('');
    setIsReading(false);
    setCurrentWordIndex(0);
    setWords([]);
    setIsFinished(false);
    setIsPaused(false);
    setCountdown(0);
  };

  const handleCancel = () => {
    setInputText('');
    setIsReading(false);
    setCurrentWordIndex(0);
    setWords([]);
    setIsFinished(false);
    setIsPaused(false);
    setCountdown(0);
  };

  const handlePause = () => {
    setIsReading(false);
    setIsPaused(true);
  };

  const handleResume = () => {
    setIsReading(true);
    setIsPaused(false);
  };

  if (isReading || isFinished || isPaused || countdown > 0) {
    const currentWord = words[currentWordIndex] || '';
    const middleIndex = Math.ceil(currentWord.length / 2) - 1;
    const beforeMiddle = currentWord.substring(0, middleIndex);
    const middleLetter = currentWord[middleIndex];
    const afterMiddle = currentWord.substring(middleIndex + 1);

    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center">
        <div className="text-center">
          {countdown > 0 && (
            <div style={{ position: 'relative', height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ fontSize: '120px', fontFamily: 'monospace', fontWeight: 'bold', color: '#ef4444' }}>
                {countdown}
              </div>
            </div>
          )}
          {(isReading || isPaused) && currentWordIndex < words.length && (
            <div style={{ position: 'relative', height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ position: 'absolute', width: '84px', height: '84px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} />
              <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', fontSize: '100px', fontFamily: 'monospace', fontWeight: 'bold', lineHeight: '1', display: 'flex', alignItems: 'center' }}>
                <span className="text-white" style={{ position: 'absolute', right: '100%', paddingRight: '4px' }}>{beforeMiddle}</span>
                <span className="text-red-500">{middleLetter}</span>
                <span className="text-white" style={{ position: 'absolute', left: '100%', paddingLeft: '4px' }}>{afterMiddle}</span>
              </div>
            </div>
          )}
          {isFinished && (
            <div className="text-center">
              <h2 className="text-4xl font-bold text-white mb-6">Finished!</h2>
              <button
                onClick={handleReset}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-8 rounded text-lg"
              >
                Start Again
              </button>
            </div>
          )}
        </div>
        {(isReading || isFinished || isPaused) && (
          <div className="absolute bottom-8 left-8 flex gap-4">
            <button
              onClick={handleCancel}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded"
            >
              Cancel
            </button>
            {isReading && currentWordIndex < words.length && (
              <button
                onClick={handlePause}
                className="bg-white hover:bg-gray-200 text-black font-bold py-2 px-6 rounded"
              >
                Pause
              </button>
            )}
            {isPaused && currentWordIndex < words.length && !isFinished && (
              <button
                onClick={handleResume}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded"
              >
                Resume
              </button>
            )}
          </div>
        )}
        <div className="absolute bottom-8 right-8 text-gray-400 text-xl">
          {wpm} wpm
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="animate-title mb-12 text-center">
          <h1 className="text-7xl font-serif font-light text-white tracking-tight mb-3">
            Speed Reader
          </h1>
          <p className="text-gray-400 text-lg font-light">
            Read faster, retain more
          </p>
        </div>
        <div className="space-y-8 animate-content">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Paste your text here..."
            className="w-full h-48 p-6 bg-black text-white border border-gray-800 rounded-lg focus:outline-none focus:border-gray-600 focus:ring-1 focus:ring-gray-600 placeholder-gray-600 resize-none text-base leading-relaxed transition"
          />
          <div className="space-y-4">
            <div className="text-center">
              <span className="text-white font-light text-base">{wpm} WPM</span>
            </div>
            <input
              type="range"
              min="50"
              max="800"
              value={wpm}
              onChange={(e) => setWpm(parseInt(e.target.value))}
              className="w-full cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-600 font-light">
              <span>50</span>
              <span>800</span>
            </div>
          </div>
          <button
            onClick={handleStart}
            disabled={!inputText.trim()}
            className="w-full bg-white text-black font-light py-3 px-6 rounded-lg text-base tracking-wide transition hover:bg-gray-100 disabled:bg-gray-800 disabled:text-gray-600 cursor-pointer"
          >
            Start Reading
          </button>
        </div>
      </div>
    </div>
  );
}
