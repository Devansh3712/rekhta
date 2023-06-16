import express from 'express';

import { getNazmsByTag, getNazmsByPoet } from '../../src/nazm.js';

const router = express.Router();

router.get('/tag/:tag', async (req, res) => {
	const tag = req.params.tag;
	const language = req.query?.lang || 'en';
	const count = req.query?.count || false;
	const sortBy = req.query?.sort || 'popularity';
	const orderBy = req.query?.order || 'desc';
	const nazms = await getNazmsByTag(
		tag,
		language,
		count,
		sortBy + '-' + orderBy,
	);
	res.status(200).json(nazms);
});

router.get('/poet/:poet', async (req, res) => {
	const poet = req.params.poet;
	const language = req.query?.lang || 'en';
	const count = req.query?.count || false;
	const sortBy = req.query?.sort || 'popularity';
	const orderBy = req.query?.order || 'desc';
	const nazms = await getNazmsByPoet(
		poet,
		language,
		count,
		sortBy + '-' + orderBy,
	);
	res.status(200).json(nazms);
});

export default router;
