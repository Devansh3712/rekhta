/** @module ghazal */
import puppeteer from 'puppeteer';

/**
 * Fetch ghazals from a Rekhta URL using a specified selector.
 * @async
 * @param {String} rekhtaUrl - URL to scrape
 * @param {String} selector - HTML selector to fetch data
 * @param {Boolean} isSinglePoet - Ghazals of a single poet or not
 * @param {Number | Boolean} count - Count of ghazals to return
 * @returns {Promise.<Array.<{ ghazal: String, poet: String | undefined, url: String }>>}
 */
const getGhazals = async (rekhtaUrl, selector, isSinglePoet, count) => {
	const browser = await puppeteer.launch({
		headless: 'new',
	});
	const page = await browser.newPage();
	await page.goto(rekhtaUrl, {
		waitUntil: 'networkidle2',
	});
	// Retrieve ghazal links
	const links = await page.evaluate(
		(selector, count) => {
			let ghazals = Array.from(document.querySelectorAll(selector));
			if (count) ghazals = ghazals.slice(0, count);
			const result = ghazals.map((ghazal) => {
				const link = ghazal.querySelector('a:nth-child(2)').href;
				return link;
			});
			return result;
		},
		selector,
		count,
	);
	// Fetch the ghazal content
	const ghazals = [];
	for (let i = 0; i < links.length; i++) {
		const link = links[i];
		await page.goto(link, {
			waitUntil: 'networkidle2',
		});
		page.setDefaultNavigationTimeout(0);
		const result = await page.evaluate(
			(url, isSinglePoet) => {
				const ghazal = document
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
					return { ghazal, poet, url };
				}
				return { ghazal, url };
			},
			link,
			isSinglePoet,
		);
		ghazals.push(result);
	}
	await browser.close();
	return ghazals;
};

/**
 * Fetch ghazals by a specific tag.
 * @async
 * @param {String} tag - Tag to get ghazals of
 * @param {String} language - Language to get results in
 * @param {Number | Boolean} count - Count of ghazals to return
 * @param {String} sort - Result sorting parameters
 * @returns {Promise.<Array.<{ ghazal: String, poet: String, url: String }>>}
 */
const getGhazalsByTag = async (tag, language, count, sort) => {
	tag = tag.toLowerCase().replaceAll(' ', '-');
	const url = `https://www.rekhta.org/tags/${tag}-shayari/ghazals?lang=${language}&sort=${sort}`;
	const ghazals = await getGhazals(url, '.contentListBody', false, count);
	return ghazals;
};

/**
 * Fetch ghazals by a specific poet.
 * @async
 * @param {String} poet - Poet to get ghazals of
 * @param {String} language - Language to get results in
 * @param {Number | Boolean} count - Count of ghazals to return
 * @param {String} sort - Result sorting parameters
 * @returns {Promise.<Array.<{ nazm: String, url: String }>>}
 */
const getGhazalsByPoet = async (poet, language, count, sort) => {
	poet = poet.toLowerCase().replaceAll(' ', '-');
	const url = `https://www.rekhta.org/poets/${poet}/ghazals?lang=${language}&sort=${sort}`;
	const ghazals = await getGhazals(url, '.rt_bodyTitle', true, count);
	return ghazals;
};

export { getGhazalsByTag, getGhazalsByPoet };
