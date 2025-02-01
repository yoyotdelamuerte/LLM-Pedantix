import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [question, setQuestion] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState('');

  const fetchQuestion = async () => {
    try {
      const res = await axios.get('http://localhost:3001/api/question');
      setQuestion(res.data);
      setFeedback('');
      setUserAnswer('');
    } catch (error) {
      console.error("Erreur lors du chargement de la question", error);
    }
  };

  useEffect(() => {
    fetchQuestion();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:3001/api/validate', {
        questionTitle: question.title,
        userAnswer: userAnswer
      });
      if (res.data.valid) {
        setFeedback("Bonne réponse !");
      } else {
        setFeedback(`Mauvaise réponse. La bonne réponse était : ${res.data.correctAnswer}`);
      }
    } catch (error) {
      console.error("Erreur lors de la validation", error);
      setFeedback("Erreur lors de la validation de la réponse");
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Jeu Pedantix</h1>
        {question ? (
          <div>
            <h2>{question.title}</h2>
            <p>{question.extract}</p>
            <a href={question.url} target="_blank" rel="noopener noreferrer">
              Lire plus sur Wikipédia
            </a>
            <form onSubmit={handleSubmit}>
              <input 
                type="text" 
                value={userAnswer} 
                onChange={(e) => setUserAnswer(e.target.value)} 
                placeholder="Votre réponse" 
              />
              <button type="submit">Valider</button>
            </form>
            {feedback && <p>{feedback}</p>}
            <button onClick={fetchQuestion} style={{ marginTop: '20px' }}>
              Nouvelle question
            </button>
          </div>
        ) : (
          <p>Chargement de la question...</p>
        )}
      </header>
    </div>
  );
}

export default App;
