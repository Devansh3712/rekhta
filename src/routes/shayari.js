import express from 'express';

import {
	getShayarisByTag,
	getShayarisByPoet,
	getTop20ShayarisByPoet,
} from '../controllers/shayari.js';

const router = express.Router();

router.get('/tag/:tag', async (req, res) => {
	const tag = req.params.tag;
	const lang = req.query?.lang || 'en';
	const shayaris = await getShayarisByTag(tag, lang);
	res.status(200).json(shayaris);
});

router.get('/poet/:poet', async (req, res) => {
	const poet = req.params.poet;
	const lang = req.query?.lang || 'en';
	const shayaris = await getShayarisByPoet(poet, lang);
	res.status(200).json(shayaris);
});

router.get('/poet/:poet/top20', async (req, res) => {
	const poet = req.params.poet;
	const lang = req.query?.lang || 'en';
	const shayaris = await getTop20ShayarisByPoet(poet, lang);
	res.status(200).json(shayaris);
});

export default router;
