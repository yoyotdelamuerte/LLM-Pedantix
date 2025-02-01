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
    } catch (error) {
      console.error("Erreur lors du chargement de la question", error);
    }
  };

  useEffect(() => {
    fetchQuestion();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Pour l’instant, nous enregistrons simplement la réponse sans validation
    setFeedback("Votre réponse a été enregistrée. (Validation à implémenter)");
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
          </div>
        ) : (
          <p>Chargement de la question...</p>
        )}
      </header>
    </div>
  );
}

export default App;
