import express from 'express';

import { getWordOfTheDay } from '../controllers/word.js';

const router = express.Router();

router.get('/', async (req, res) => {
	const date = req.query?.date || new Date().toISOString().split('T')[0];
	try {
		const word = await getWordOfTheDay(date);
		res.status(200).json(word);
	} catch (error) {
		res.status(404).json({ error: `Word of the day not found for ${date}` });
	}
});

export default router;
