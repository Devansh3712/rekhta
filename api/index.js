import express from 'express';

import countMiddleware from './middlewares/count.js';
import languageMiddleware from './middlewares/language.js';
import sortByMiddleware from './middlewares/sort.js';

import ghazal from './routes/ghazal.js';
import nazm from './routes/nazm.js';
import shayari from './routes/shayari.js';
import word from './routes/word.js';

const app = express();
const port = process.env.PORT || 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(countMiddleware);
app.use(languageMiddleware);
app.use(sortByMiddleware);

app.use('/ghazal', ghazal);
app.use('/nazm', nazm);
app.use('/shayari', shayari);
app.use('/word-of-the-day', word);
app.use((req, res) => {
	res.status(404).json({ error: 'Endpoint not found' });
});

app.listen(port, (err) => {
	if (err) console.log(err);
	console.log(`Server running on http://localhost:${port}`);
});