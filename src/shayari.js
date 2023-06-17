/** @module shayari */
import puppeteer from 'puppeteer';

import { languages, shayariTags, coupletTags } from './constants.js';
import { InvalidLanguageError, InvalidTagError } from './errors.js';

/**
 * Fetch shayaris from a Rekhta URL using a specificed selector.
 * @async
 * @param {String} rekhtaUrl - URL to scrape
 * @param {String} selector - HTML selector to fetch data
 * @param {Boolean} isSinglePoet - Shayaris of a single poet or not
 * @param {Number | Boolean} count - Count of shayaris to return
 * @returns {Promise.<Array.<{ shayari: String, poet: String | undefined, url: String }>>}
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
			if (count) shayariList = shayariList.slice(0, count);
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
 * @async
 * @param {String} tag - Tag to get shayaris of
 * @param {String} language - Language to get results in
 * @param {Number | Boolean} count - Count of shayaris to return
 * @param {String} sort - Result sorting parameters
 * @returns {Promise.<Array.<{ shayari: String, poet: String, url: String }>>}
 */
const getShayarisByTag = async (tag, language, count, sort) => {
	tag = tag.toLowerCase().replaceAll(' ', '-');
	const url = `https://www.rekhta.org/tags/${tag}-shayari?lang=${language}&sort=${sort}`;
	const shayaris = await getShayaris(url, '.sherSection', false, count);
	return shayaris;
};

/**
 * Fetch shayaris by a specific poet.
 * @async
 * @param {String} poet - Poet to get shayaris of
 * @param {String} language - Language to get results in
 * @param {Number | Boolean} count - Count of shayaris to return
 * @param {String} sort - Result sorting parameters
 * @returns {Promise.<Array.<{ shayari: String, url: String }>>}
 */
const getShayarisByPoet = async (poet, language, count, sort) => {
	poet = poet.toLowerCase().replaceAll(' ', '-');
	const url = `https://www.rekhta.org/poets/${poet}/couplets?lang=${language}&sort=${sort}`;
	const shayaris = await getShayaris(url, '.sherSection', true, count);
	return shayaris;
};

/**
 * Fetch top 20 shayaris by a specific tag.
 * @async
 * @param {String} tag - Tag to get shayaris of
 * @param {String} language - Language to get results in
 * @throws {InvalidTagError}
 * @throws {InvalidLanguageError}
 * @returns {Promise.<Array.<{ shayari: String, poet: String, url: String }>>}
 */
const getTop20ShayarisByTag = async (tag, language) => {
	if (!shayariTags.includes(tag)) throw InvalidTagError;
	if (!languages.includes(language)) throw InvalidLanguageError;
	const url = `https://www.rekhta.org/top-20/${tag}-shayari`;
	const shayaris = await getShayaris(url, '.sherSection', false);
	return shayaris;
};

/**
 * Fetch top 20 couplets by a specific tag.
 * @async
 * @param {String} tag - Tag to get couplets of
 * @param {String} language - Language to get results in
 * @throws {InvalidTagError}
 * @throws {InvalidLanguageError}
 * @returns {Promise.<Array.<{ shayari: String, poet: String, url: String }>>}
 */
const getTop20CoupletsByTag = async (tag, language) => {
	if (!coupletTags.includes(tag)) throw InvalidTagError;
	if (!languages.includes(language)) throw InvalidLanguageError;
	const url = `https://www.rekhta.org/top-20/${tag}`;
	const shayaris = await getShayaris(url, '.sherSection', false);
	return shayaris;
};

/**
 * Fetch top 20 shayaris by a specific poet.
 * @async
 * @param {String} poet - Poet to get shayaris of
 * @param {String} language - Language to get results in
 * @returns {Promise.<Array.<{ shayari: String, url: String }>>}
 */
const getTop20ShayarisByPoet = async (poet, language) => {
	poet = poet.toLowerCase().replaceAll(' ', '-');
	const url = `https://www.rekhta.org/poets/${poet}/t20?lang=${language}`;
	const shayaris = await getShayaris(url, '.sherSection', true);
	return shayaris;
};

/**
 * Get top 5 shayaris of the day for a given date.
 * @async
 * @param {String} date - Date in YYYY-MM-DD format
 * @param {String} language - Language to get results in
 * @returns {Promise.<Array.<{ shayari: String, poet: String, url: String }>>}
 */
const getTodaysTop5Shayari = async (date, language) => {
	const url = `https://www.rekhta.org/archives/${date}/TopFive?lag=${language}`;
	const shayaris = await getShayaris(url, '.owl-item', false);
	return shayaris;
};

export {
	getShayarisByTag,
	getShayarisByPoet,
	getTop20ShayarisByTag,
	getTop20CoupletsByTag,
	getTop20ShayarisByPoet,
	getTodaysTop5Shayari,
};
