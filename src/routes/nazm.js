import express from 'express';

import { getNazmsByTag, getNazmsByPoet } from '../controllers/nazm.js';

const router = express.Router();

router.get('/tag/:tag', async (req, res) => {
	const tag = req.params.tag;
	const language = req.query?.lang || 'en';
	const nazms = await getNazmsByTag(tag, language);
	res.status(200).json(nazms);
});

router.get('/poet/:poet', async (req, res) => {
	const poet = req.params.poet;
	const language = req.query?.lang || 'en';
	const nazms = await getNazmsByPoet(poet, language);
	res.status(200).json(nazms);
});

export default router;
