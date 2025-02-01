const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

/**
 * Endpoint pour récupérer une question depuis Wikipédia.
 * Ici, nous utilisons l’API Wikipédia en récupérant un résumé de page aléatoire.
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

app.listen(PORT, () => {
  console.log(`Serveur Pedantix backend en écoute sur le port ${PORT}`);
});
