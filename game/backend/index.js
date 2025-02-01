const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

/**
 * Endpoint pour récupérer une question depuis Wikipédia.
 */
app.get('/api/question', async (req, res) => {
  try {
    const response = await axios.get('https://fr.wikipedia.org/api/rest_v1/page/random/summary');
    const data = response.data;
    const question = {
      title: data.title,
      extract: data.extract,
      url: data.content_urls?.desktop?.page || ''
    };
    res.json(question);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la récupération de la question' });
  }
});

/**
 * Endpoint pour valider la réponse de l'utilisateur.
 * Ici, on compare la réponse utilisateur avec le titre de la page Wikipédia.
 */
app.post('/api/validate', (req, res) => {
  const { questionTitle, userAnswer } = req.body;
  
  if (!questionTitle || !userAnswer) {
    return res.status(400).json({ error: "Paramètres manquants" });
  }
  
  // Comparaison simple en ignorant la casse et les espaces superflus.
  const normalize = str => str.trim().toLowerCase();
  const isValid = normalize(questionTitle) === normalize(userAnswer);
  
  res.json({ valid: isValid, correctAnswer: questionTitle });
});

app.listen(PORT, () => {
  console.log(`Serveur Pedantix backend en écoute sur le port ${PORT}`);
});
