/** @module word */
import puppeteer from 'puppeteer';

import { WordNotFoundError } from './errors.js';

/**
 * Fetch the word of the day for a given date.
 *
 * @async
 * @param	{string} date - Date in YYYY-MM-DD format
 * @throws	{WordNotFoundError}
 * @returns	{Promise.<{ english: String, hindi: String, urdu: String, meaning: String, usage: String }>}
 */
const getWordOfTheDay = async (date) => {
	const rekhtaUrl = `https://www.rekhta.org/archives/${date}/WordOfTheDays/`;
	const browser = await puppeteer.launch({
		headless: 'new',
	});
	const page = await browser.newPage();
	await page.goto(rekhtaUrl, {
		waitUntil: 'networkidle2',
	});
	try {
		const word = await page.evaluate(() => {
			const english = document.querySelector('.wordContainer').innerText;
			const hindi = document.querySelector('.devMeaning').innerText;
			const urdu = document.querySelector('.urMeaning').innerText;
			const meaning = document.querySelector('.engMeaning > h3').innerText;
			const usage = document
				.querySelector('.wordInSher')
				.innerText.replace(/(\r\n|\n|\r)/gm, '');
			return { english, hindi, urdu, meaning, usage };
		});
		await browser.close();
		return word;
	} catch (_) {
		throw WordNotFoundError;
	}
};

export { getWordOfTheDay };
