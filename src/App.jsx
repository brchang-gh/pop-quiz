import React, { useState } from 'react';
import { fetchQuestions, submitAnswers } from './api';

const START = 'START';
const LOADING = 'LOADING';
const QUIZ = 'QUIZ';
const RESULT = 'RESULT';

export default function App() {
  const [screen, setScreen] = useState(START);
  const [userId, setUserId] = useState('');
  const [questions, setQuestions] = useState([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const startQuiz = async () => {
    if (!userId.trim()) {
      alert("PLEASE ENTER ID!");
      return;
    }
    setScreen(LOADING);
    setError(null);
    try {
      const q = await fetchQuestions();
      setQuestions(q);
      setCurrentQIndex(0);
      setAnswers([]);
      setScreen(QUIZ);
    } catch (err) {
      setError(err.message);
      setScreen(START);
    }
  };

  const handleAnswer = async (answer) => {
    const currentQ = questions[currentQIndex];
    const newAnswers = [...answers, { id: currentQ.id, answer }];
    setAnswers(newAnswers);

    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex(currentQIndex + 1);
    } else {
      // Finished
      setScreen(LOADING);
      try {
        const res = await submitAnswers(userId, newAnswers);
        setResult(res);
        setScreen(RESULT);
      } catch (err) {
        setError(err.message);
        setScreen(START);
      }
    }
  };

  const reset = () => {
    setScreen(START);
    setUserId('');
    setQuestions([]);
    setAnswers([]);
    setResult(null);
    setError(null);
  };

  return (
    <div className="card text-center">
      {screen === START && (
        <div>
          <h1 className="blink">POP QUIZ</h1>
          <h2>ARCADE EDITION</h2>
          <div className="mb-2">
            <p className="mb-1" style={{color: 'var(--neon-magenta)'}}>INSERT ID TO PLAY</p>
            <input 
              type="text" 
              placeholder="PLAYER ID" 
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && startQuiz()}
            />
          </div>
          <button onClick={startQuiz}>START GAME</button>
          {error && <p style={{color: 'red', marginTop: '1rem'}}>ERROR: {error}</p>}
        </div>
      )}

      {screen === LOADING && (
        <div>
          <h1 className="blink">LOADING...</h1>
          <p>PLEASE WAIT</p>
        </div>
      )}

      {screen === QUIZ && questions.length > 0 && (
        <div>
          <h2 style={{color: 'var(--neon-magenta)'}}>STAGE {currentQIndex + 1} / {questions.length}</h2>
          <div className="boss-container">
            <img 
              src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=boss_${questions[currentQIndex].id}`} 
              alt="Boss" 
              className="boss-image"
            />
          </div>
          <p className="mb-2" style={{lineHeight: 1.8}}>{questions[currentQIndex].question}</p>
          <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
            {['A', 'B', 'C', 'D'].map((opt) => (
              <button 
                key={opt} 
                className="option-btn"
                onClick={() => handleAnswer(opt)}
              >
                {opt}. {questions[currentQIndex].options[opt]}
              </button>
            ))}
          </div>
        </div>
      )}

      {screen === RESULT && result && (
        <div>
          <h1>GAME OVER</h1>
          <div className="boss-container">
            <img 
              src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${result.passed ? 'win' : 'lose'}`} 
              alt="Result Boss" 
              className="boss-image"
            />
          </div>
          <h2 style={{color: result.passed ? 'var(--neon-green)' : 'red'}}>
            {result.passed ? 'MISSION ACCOMPLISHED' : 'MISSION FAILED'}
          </h2>
          <p className="mb-1">SCORE: {result.score}</p>
          <button onClick={reset} style={{marginTop: '2rem'}}>PLAY AGAIN</button>
        </div>
      )}
    </div>
  );
}
