/** @module shayari */
import puppeteer from 'puppeteer';

import {
	rekhta,
	languages,
	shayariTags,
	coupletTags,
	sortParams,
	orderParams,
} from './constants.js';
import {
	InvalidLanguageError,
	InvalidCountError,
	InvalidOrderParamError,
	InvalidSortParamError,
	InvalidTagError,
	DateFormatError,
} from './errors.js';
import { today, isValidCount, isValidDate } from './helpers.js';

/**
 * Fetch shayaris from a Rekhta URL using a specificed selector.
 *
 * @async
 * @param	{String} rekhtaUrl - URL to scrape
 * @param	{String} selector - HTML selector to fetch data
 * @param	{Boolean} isSinglePoet - Shayaris of a single poet or not
 * @param	{Number} count - Count of shayaris to return
 * @returns	{Promise.<Array.<{ shayari: String, poet: String, url: String }>> | Promise.<Array.<{ shayari: String, url: String }>>}
 */
const getShayaris = async (rekhtaUrl, selector, isSinglePoet, count) => {
	const browser = await puppeteer.launch({
		headless: 'new',
	});
	const page = await browser.newPage();
	await page.goto(rekhtaUrl, {
		waitUntil: 'networkidle2',
	});
	const shayaris = await page.evaluate(
		(selector, isSinglePoet, count) => {
			let shayariList = Array.from(document.querySelectorAll(selector));
			if (count > 0) shayariList = shayariList.slice(0, count);
			const result = shayariList.map((quote) => {
				const shayari = quote
					.querySelector('.c')
					.innerText.replace(/(\r\n|\n|\r)/gm, '')
					.trim();
				const url = quote
					.querySelector('.shareSocial')
					.getAttribute('data-url');
				if (!isSinglePoet) {
					// Converting poet's name from upper case to title case
					const poet = quote
						.querySelector('.poetName')
						.innerText.toLowerCase()
						.split(' ')
						.map((word) => {
							return word.replace(word[0], word[0].toUpperCase());
						})
						.join(' ');
					return { shayari, poet, url };
				}
				return { shayari, url };
			});
			return result;
		},
		selector,
		isSinglePoet,
		count,
	);
	await browser.close();
	return shayaris;
};

/**
 * Fetch shayaris by a specific tag.
 *
 * @async
 * @param	{String} tag - Tag to get shayaris of
 * @param	{String} language - Language to get results in
 * @param	{Number} count - Count of shayaris to return
 * @param	{String} sort - Result sorting parameters
 * @param	{String} order - Order of sorting
 * @throws	{InvalidLanguageError}
 * @throws	{InvalidCountError}
 * @throws	{InvalidSortParamError}
 * @throws	{InvalidOrderParamError}
 * @returns	{Promise.<Array.<{ shayari: String, poet: String, url: String }>>}
 */
const getShayarisByTag = async (
	tag,
	language = 'en',
	count = false,
	sort = 'popularity',
	order = 'desc',
) => {
	if (!languages.includes(language)) throw InvalidLanguageError;
	if (count && !isValidCount(count)) throw InvalidCountError;
	if (!sortParams.includes(sort)) throw InvalidSortParamError;
	if (!orderParams.includes(order)) throw InvalidOrderParamError;
	tag = tag.toLowerCase().replaceAll(' ', '-');
	const url = `${rekhta}/tags/${tag}-shayari?lang=${language}&sort=${sort}-${order}`;
	const shayaris = await getShayaris(url, '.sherSection', false, count);
	return shayaris;
};

/**
 * Fetch shayaris by a specific poet.
 *
 * @async
 * @param	{String} poet - Poet to get shayaris of
 * @param	{String} language - Language to get results in
 * @param	{Number} count - Count of shayaris to return
 * @param	{String} sort - Result sorting parameters
 * @param	{String} order - Order of sorting
 * @throws	{InvalidLanguageError}
 * @throws	{InvalidCountError}
 * @throws	{InvalidSortParamError}
 * @throws	{InvalidOrderParamError}
 * @returns	{Promise.<Array.<{ shayari: String, url: String }>>}
 */
const getShayarisByPoet = async (
	poet,
	language = 'en',
	count = false,
	sort = 'popularity',
	order = 'desc',
) => {
	if (!languages.includes(language)) throw InvalidLanguageError;
	if (count && !isValidCount(count)) throw InvalidCountError;
	if (!sortParams.includes(sort)) throw InvalidSortParamError;
	if (!orderParams.includes(order)) throw InvalidOrderParamError;
	poet = poet.toLowerCase().replaceAll(' ', '-');
	const url = `${rekhta}/poets/${poet}/couplets?lang=${language}&sort=${sort}-${order}`;
	const shayaris = await getShayaris(url, '.sherSection', true, count);
	return shayaris;
};

/**
 * Fetch top 20 shayaris by a specific tag.
 *
 * @async
 * @param	{String} tag - Tag to get shayaris of
 * @param	{String} language - Language to get results in
 * @throws	{InvalidTagError}
 * @throws	{InvalidLanguageError}
 * @returns	{Promise.<Array.<{ shayari: String, poet: String, url: String }>>}
 */
const getTop20ShayarisByTag = async (tag, language = 'en') => {
	if (!shayariTags.includes(tag)) throw InvalidTagError;
	if (!languages.includes(language)) throw InvalidLanguageError;
	const url = `${rekhta}/top-20/${tag}-shayari`;
	const shayaris = await getShayaris(url, '.sherSection', false, false);
	return shayaris;
};

/**
 * Fetch top 20 couplets by a specific tag.
 *
 * @async
 * @param	{String} tag - Tag to get couplets of
 * @param	{String} language - Language to get results in
 * @throws	{InvalidTagError}
 * @throws	{InvalidLanguageError}
 * @returns	{Promise.<Array.<{ shayari: String, poet: String, url: String }>>}
 */
const getTop20CoupletsByTag = async (tag, language = 'en') => {
	if (!coupletTags.includes(tag)) throw InvalidTagError;
	if (!languages.includes(language)) throw InvalidLanguageError;
	const url = `${rekhta}/top-20/${tag}`;
	const shayaris = await getShayaris(url, '.sherSection', false, false);
	return shayaris;
};

/**
 * Fetch top 20 shayaris by a specific poet.
 *
 * @async
 * @param	{String} poet - Poet to get shayaris of
 * @param	{String} language - Language to get results in
 * @throws	{InvalidLanguageError}
 * @returns	{Promise.<Array.<{ shayari: String, url: String }>>}
 */
const getTop20ShayarisByPoet = async (poet, language = 'en') => {
	if (!languages.includes(language)) throw InvalidLanguageError;
	poet = poet.toLowerCase().replaceAll(' ', '-');
	const url = `${rekhta}/poets/${poet}/t20?lang=${language}`;
	const shayaris = await getShayaris(url, '.sherSection', true, false);
	return shayaris;
};

/**
 * Get top 5 shayaris of the day for a given date.
 *
 * @async
 * @param	{String} date - Date in YYYY-MM-DD format
 * @param	{String} language - Language to get results in
 * @throws	{DateFormatError}
 * @throws	{InvalidLanguageError}
 * @returns	{Promise.<Array.<{ shayari: String, poet: String, url: String }>>}
 */
const getTop5ShayarisByDay = async (date = today, language = 'en') => {
	if (!isValidDate(date)) throw DateFormatError;
	if (!languages.includes(language)) throw InvalidLanguageError;
	const url = `${rekhta}/archives/${date}/TopFive?lag=${language}`;
	const shayaris = await getShayaris(url, '.owl-item', false, false);
	return shayaris;
};

export {
	getShayarisByTag,
	getShayarisByPoet,
	getTop20ShayarisByTag,
	getTop20CoupletsByTag,
	getTop20ShayarisByPoet,
	getTop5ShayarisByDay,
};
