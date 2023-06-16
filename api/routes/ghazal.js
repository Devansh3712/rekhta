import express from 'express';

import { getGhazalsByTag, getGhazalsByPoet } from '../../src/ghazal.js';

const router = express.Router();

router.get('/tag/:tag', async (req, res) => {
	const tag = req.params.tag;
	const language = req.query?.lang || 'en';
	const count = req.query?.count || false;
	const sortBy = req.query?.sort || 'popularity';
	const orderBy = req.query?.order || 'desc';
	const ghazals = await getGhazalsByTag(
		tag,
		language,
		count,
		sortBy + '-' + orderBy,
	);
	res.status(200).json(ghazals);
});

router.get('/poet/:poet', async (req, res) => {
	const poet = req.params.poet;
	const language = req.query?.lang || 'en';
	const count = req.query?.count || false;
	const sortBy = req.query?.sort || 'popularity';
	const orderBy = req.query?.order || 'desc';
	const ghazals = await getGhazalsByPoet(
		poet,
		language,
		count,
		sortBy + '-' + orderBy,
	);
	res.status(200).json(ghazals);
});

export default router;
