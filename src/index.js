import express from 'express';

import languageMiddleware from './middlewares/language.js';
import shayari from './routes/shayari.js';

const app = express();
const port = process.env.PORT || 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(languageMiddleware);

app.use('/shayari', shayari);
app.use((req, res) => {
	res.status(404).json({ error: 'Endpoint not found' });
});

app.listen(port, (err) => {
	if (err) console.log(err);
	console.log(`Server running on http://localhost:${port}`);
});
