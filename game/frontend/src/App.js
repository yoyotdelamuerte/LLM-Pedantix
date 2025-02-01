import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [question, setQuestion] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [foundWords, setFoundWords] = useState([]);
  const [feedback, setFeedback] = useState('');
  const [gameFinished, setGameFinished] = useState(false);

  const fetchQuestion = async () => {
    try {
      const res = await axios.get('http://localhost:3001/api/question');
      setQuestion(res.data);
      setFoundWords([]);
      setFeedback('');
      setUserAnswer('');
      setGameFinished(false);
    } catch (error) {
      console.error("Erreur lors du chargement de la question", error);
    }
  };

  useEffect(() => {
    fetchQuestion();
  }, []);

  // Retourne le tableau des mots uniques (normalisés) du titre
  const getUniqueTitleWords = () => {
    if (!question) return [];
    const words = question.title.split(" ").map(word =>
      word.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "").toLowerCase()
    );
    return [...new Set(words)];
  };

  // Lorsqu'un mot est proposé
  const handleGuess = (e) => {
    e.preventDefault();
    if (!question || gameFinished) return;
    const guess = userAnswer.trim().toLowerCase();
    if (!guess) return;

    let found = false;
    question.title.split(" ").forEach(word => {
      const normalizedWord = word.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "").toLowerCase();
      if (normalizedWord === guess && !foundWords.includes(normalizedWord)) {
        found = true;
        setFoundWords(prev => [...prev, normalizedWord]);
      }
    });

    if (found) {
      setFeedback(`Le mot "${guess}" est trouvé !`);
    } else {
      setFeedback(`Le mot "${guess}" n'est pas dans le titre.`);
    }
    setUserAnswer('');
  };

  // Vérifier si le jeu est terminé : tous les mots uniques sont trouvés
  useEffect(() => {
    if (question) {
      const uniqueWords = getUniqueTitleWords();
      if (uniqueWords.every(word => foundWords.includes(word))) {
        setGameFinished(true);
        setFeedback("Félicitations, vous avez trouvé le titre !");
      }
    }
  }, [foundWords, question]);

  // Afficher le titre en masquant les mots non trouvés
  const renderTitle = () => {
    if (!question) return null;
    const titleWords = question.title.split(" ");
    return titleWords.map((word, index) => {
      const normalizedWord = word.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "").toLowerCase();
      if (foundWords.includes(normalizedWord)) {
        return <span key={index} className="revealed-word">{word} </span>;
      } else {
        return <span key={index} className="hidden-word">{'_'.repeat(word.length)} </span>;
      }
    });
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Pedantix</h1>
        {question ? (
          <div className="question-container">
            {/* Affichage du titre avec les mots masqués/révélés */}
            <div className="question-title-display">
              {renderTitle()}
            </div>
            {/* Le texte de la page est affiché en gris */}
            <p className="question-extract">{question.extract}</p>
            <a className="question-link" href={question.url} target="_blank" rel="noopener noreferrer">
              Lire plus sur Wikipédia
            </a>
            {!gameFinished && (
              <form className="answer-form" onSubmit={handleGuess}>
                <input 
                  type="text" 
                  className="answer-input"
                  value={userAnswer} 
                  onChange={(e) => setUserAnswer(e.target.value)} 
                  placeholder="Proposez un mot..."
                />
                <button className="btn" type="submit">Valider</button>
              </form>
            )}
            {feedback && <p className="feedback">{feedback}</p>}
          </div>
        ) : (
          <p>Chargement de la question...</p>
        )}
      </header>
      {/* Bouton toujours visible en bas pour charger une nouvelle page Wikipédia */}
      <footer className="App-footer">
        <button className="btn new-page" onClick={fetchQuestion}>
          Nouvelle page Wikipédia
        </button>
      </footer>
    </div>
  );
}

export default App;
