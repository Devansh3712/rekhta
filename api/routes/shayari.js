import express from 'express';

import {
	getShayarisByTag,
	getShayarisByPoet,
	getTodaysTop5Shayari,
} from '../../src/shayari.js';

const router = express.Router();

router.get('/tag/:tag', async (req, res) => {
	const tag = req.params.tag;
	const language = req.query?.lang || 'en';
	const count = req.query?.count || false;
	const sortBy = req.query?.sort || 'popularity';
	const orderBy = req.query?.order || 'desc';
	const shayaris = await getShayarisByTag(
		tag,
		language,
		count,
		sortBy + '-' + orderBy,
	);
	res.status(200).json(shayaris);
});

router.get('/top5', async (req, res) => {
	const date = req.query?.date || new Date().toISOString().split('T')[0];
	const language = req.query?.lang || 'en';
	const shayaris = await getTodaysTop5Shayari(date, language);
	res.status(200).json(shayaris);
});

router.get('/poet/:poet', async (req, res) => {
	const poet = req.params.poet;
	const language = req.query?.lang || 'en';
	const count = req.query?.count || false;
	const sortBy = req.query?.sort || 'popularity';
	const orderBy = req.query?.order || 'desc';
	const shayaris = await getShayarisByPoet(
		poet,
		language,
		count,
		sortBy + '-' + orderBy,
	);
	res.status(200).json(shayaris);
});

export default router;
