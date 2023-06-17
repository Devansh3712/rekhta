import express from 'express';

import {
	getTop20ShayarisByTag,
	getTop20CoupletsByTag,
	getTop20ShayarisByPoet,
} from '../../src/shayari.js';
import { InvalidTagError, InvalidLanguageError } from '../../src/errors.js';

const router = express.Router();

router.get('/shayari/:tag', async (req, res) => {
	try {
		const tag = req.params.tag;
		const language = req.query?.lang || 'en';
		const shayaris = await getTop20ShayarisByTag(tag, language);
		return res.status(200).json(shayaris);
	} catch (error) {
		switch (error) {
			case InvalidTagError:
				return res.status(400).json({
					message: InvalidTagError.toString(),
				});
			case InvalidLanguageError:
				return res.status(400).json({
					message: InvalidLanguageError.toString(),
				});
		}
	}
});

router.get('/poet/:poet', async (req, res) => {
	const poet = req.params.poet;
	const language = req.query?.lang || 'en';
	const shayaris = await getTop20ShayarisByPoet(poet, language);
	res.status(200).json(shayaris);
});

router.get('/couplet/:tag', async (req, res) => {
	try {
		const tag = req.params.tag;
		const language = req.query?.lang || 'en';
		const couplets = await getTop20CoupletsByTag(tag, language);
		res.status(200).json(couplets);
	} catch (error) {
		switch (error) {
			case InvalidTagError:
				return res.status(400).json({
					message: InvalidTagError.toString(),
				});
			case InvalidLanguageError:
				return res.status(400).json({
					message: InvalidLanguageError.toString(),
				});
		}
	}
});

export default router;
