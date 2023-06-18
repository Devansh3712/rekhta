/** @module nazm */
import puppeteer from 'puppeteer';

import { rekhta, languages, sortParams, orderParams } from './constants.js';
import {
	InvalidLanguageError,
	InvalidOrderParamError,
	InvalidSortParamError,
} from './errors.js';

/**
 * Fetch nazms from a Rekhta URL using a specified selector.
 *
 * @async
 * @param	{String} rekhtaUrl - URL to scrape
 * @param	{String} selector - HTML selector to fetch data
 * @param	{Boolean} isSinglePoet - Nazms of a single poet or not
 * @param	{Number} count - Count of nazms to return
 * @returns	{Promise.<Array.<{ nazm: String, poet: String, url: String }>> | Promise.<Array.<{ nazm: String, url: String }>>}
 */
const getNazms = async (rekhtaUrl, selector, isSinglePoet, count) => {
	const browser = await puppeteer.launch({
		headless: 'new',
	});
	const page = await browser.newPage();
	await page.goto(rekhtaUrl, {
		waitUntil: 'networkidle2',
	});
	// Retrieve nazm links
	const links = await page.evaluate(
		(selector, count) => {
			let nazms = Array.from(document.querySelectorAll(selector));
			if (count) nazms = nazms.slice(0, count);
			const result = nazms.map((nazm) => {
				const link = nazm.querySelector('a:nth-child(2)').href;
				return link;
			});
			return result;
		},
		selector,
		count,
	);
	// Fetch nazm content
	const nazms = [];
	for (let i = 0; i < links.length; i++) {
		const link = links[i];
		await page.goto(link, {
			waitUntil: 'networkidle2',
		});
		page.setDefaultNavigationTimeout(0);
		const result = await page.evaluate(
			(url, isSinglePoet) => {
				const nazm = document
					.querySelector('.poemPageContentBody')
					.innerText.replace(/(\r\n|\n|\r)/gm, '')
					.split('VIDEOS')[0]
					.split('RECITATIONS')[0]
					.trim();
				if (!isSinglePoet) {
					// Converting poet's name from upper case to title case
					const poet = document
						.querySelector('.ghazalAuthor')
						.innerText.toLowerCase()
						.split(' ')
						.map((word) => {
							return word.replace(word[0], word[0].toUpperCase());
						})
						.join(' ');
					return { nazm, poet, url };
				}
				return { nazm, url };
			},
			link,
			isSinglePoet,
		);
		nazms.push(result);
	}
	await browser.close();
	return nazms;
};

/**
 * Fetch nazms by a specific tag.
 *
 * @async
 * @param	{String} tag - Tag to get nazms of
 * @param	{String} language - Language to get results in
 * @param	{Number} count - Count of nazms to return
 * @param	{String} sort - Result sorting parameters
 * @param	{String} order - Order of sorting
 * @throws	{InvalidLanguageError}
 * @throws	{InvalidSortParamError}
 * @throws	{InvalidOrderParamError}
 * @returns	{Promise.<Array.<{ nazm: String, poet: String, url: String }>>}
 */
const getNazmsByTag = async (
	tag,
	language = 'en',
	count = false,
	sort = 'popularity',
	order = 'desc',
) => {
	if (!languages.includes(language)) throw InvalidLanguageError;
	if (!sortParams.includes(sort)) throw InvalidSortParamError;
	if (!orderParams.includes(order)) throw InvalidOrderParamError;
	tag = tag.toLowerCase().replaceAll(' ', '-');
	const url = `${rekhta}/tags/${tag}-shayari/nazms?lang=${language}&sort=${sort}-${order}`;
	const nazms = await getNazms(url, '.contentListBody', false, count);
	return nazms;
};

/**
 * Fetch nazms by a specific poet.
 *
 * @async
 * @param	{String} poet - Poet to get nazms of
 * @param	{String} language - Language to get results in
 * @param	{Number} count - Count of nazms to return
 * @param	{String} sort - Result sorting parameters
 * @param	{String} order - Order of sorting
 * @throws	{InvalidLanguageError}
 * @throws	{InvalidSortParamError}
 * @throws	{InvalidOrderParamError}
 * @returns	{Promise.<Array.<{ nazm: String, url: String }>>}
 */
const getNazmsByPoet = async (
	poet,
	language = 'en',
	count = false,
	sort = 'popularity',
	order = 'desc',
) => {
	if (!languages.includes(language)) throw InvalidLanguageError;
	if (!sortParams.includes(sort)) throw InvalidSortParamError;
	if (!orderParams.includes(order)) throw InvalidOrderParamError;
	poet = poet.toLowerCase().replaceAll(' ', '-');
	const url = `${rekhta}/poets/${poet}/nazms?lang=${language}&sort=${sort}-${order}`;
	const nazms = await getNazms(url, '.rt_bodyTitle', true, count);
	return nazms;
};

export { getNazmsByTag, getNazmsByPoet };
