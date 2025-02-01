import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [question, setQuestion] = useState(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [foundWords, setFoundWords] = useState([]);
  const [maskedWords, setMaskedWords] = useState([]);
  const [maskedExtract, setMaskedExtract] = useState([]);
  const [feedback, setFeedback] = useState("");
  const [gameFinished, setGameFinished] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0); // Compteur de coups
  const [triedWords, setTriedWords] = useState([]); // Liste des mots essayés

  const fetchQuestion = async () => {
    try {
      const res = await axios.get("http://localhost:3001/api/question");
      setQuestion(res.data);
      setFoundWords([]);
      setFeedback("");
      setUserAnswer("");
      setGameFinished(false);
      setAttemptCount(0);
      setTriedWords([]);

      // Initialisation des mots masqués pour le titre et l'extrait
      const titleWords = res.data.title.split(" ");
      const maskedTitle = titleWords.map((word) => "_".repeat(word.length));
      setMaskedWords(maskedTitle);

      const extractWords = res.data.extract.split(" ");
      const maskedExtractText = extractWords.map((word) =>
        "_".repeat(word.length)
      );
      setMaskedExtract(maskedExtractText);
    } catch (error) {
      console.error("Erreur lors du chargement de la question", error);
    }
  };

  useEffect(() => {
    fetchQuestion();
  }, []);

  const normalizeWord = (word) => {
    return word.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "").toLowerCase();
  };

  const handleGuess = (e) => {
    e.preventDefault();
    if (!question || gameFinished) return;

    const guess = userAnswer.trim().toLowerCase();
    if (!guess || triedWords.includes(guess)) return;

    setAttemptCount((prev) => prev + 1); // Incrémentation du compteur
    setTriedWords((prev) => [...prev, guess]); // Ajout du mot essayé

    let found = false;
    const updatedMaskedWords = [...maskedWords];
    const updatedMaskedExtract = [...maskedExtract];

    // Vérification et mise à jour du titre
    question.title.split(" ").forEach((word, index) => {
      if (
        normalizeWord(word) === guess &&
        !foundWords.includes(normalizeWord(word))
      ) {
        found = true;
        setFoundWords((prev) => [...prev, normalizeWord(word)]);
        updatedMaskedWords[index] = word;
      }
    });

    // Vérification et mise à jour du texte extrait
    question.extract.split(" ").forEach((word, index) => {
      if (normalizeWord(word) === guess) {
        updatedMaskedExtract[index] = word;
      }
    });

    if (found) {
      setFeedback(`Le mot "${guess}" est trouvé !`);
      setMaskedWords(updatedMaskedWords);
      setMaskedExtract(updatedMaskedExtract);
    } else {
      setFeedback(`Le mot "${guess}" n'est pas dans le texte.`);
    }

    setUserAnswer("");
  };

  useEffect(() => {
    if (question) {
      const uniqueWords = [
        ...new Set(question.title.split(" ").map(normalizeWord)),
      ];
      if (uniqueWords.every((word) => foundWords.includes(word))) {
        setGameFinished(true);
        setFeedback("Félicitations, vous avez trouvé tous les mots !");
      }
    }
  }, [foundWords, question]);

  const renderTitle = () => {
    return maskedWords.map((word, index) => (
      <span
        key={index}
        className={word.includes("_") ? "hidden-word" : "revealed-word"}
      >
        {word}{" "}
      </span>
    ));
  };

  const renderExtract = () => {
    return maskedExtract.map((word, index) => (
      <span
        key={index}
        className={word.includes("_") ? "hidden-word" : "revealed-word"}
      >
        {word}{" "}
      </span>
    ));
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Pedantix</h1>
        {question ? (
          <div className="question-container">
            {/* Affichage du titre avec les mots masqués/révélés */}
            <div className="question-title-display">{renderTitle()}</div>

            {/* Texte de l'extrait masqué */}
            <p className="question-extract">{renderExtract()}</p>

            <a
              className="question-link"
              href={question.url}
              target="_blank"
              rel="noopener noreferrer"
            >
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
                <button className="btn" type="submit">
                  Valider
                </button>
              </form>
            )}
            {feedback && <p className="feedback">{feedback}</p>}
          </div>
        ) : (
          <p>Chargement de la question...</p>
        )}
        <button className="btn new-page" onClick={fetchQuestion}>
          Nouvelle page Wikipédia
        </button>
      </header>

      <div>
        {/* Liste des mots essayés */}
        <div className="tried-words-container">
          {/* Compteur de coups */}
          <p>
            Nombre de coups : <strong>{attemptCount}</strong>
          </p>

          <h3>Mots essayés :</h3>
          <ul>
            {triedWords.map((word, index) => (
              <li key={index}>{word}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
