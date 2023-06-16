import puppeteer from 'puppeteer';

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

const getNazmsByTag = async (tag, language, count, sort) => {
	tag = tag.toLowerCase().replaceAll(' ', '-');
	const url = `https://www.rekhta.org/tags/${tag}-shayari/nazms?lang=${language}&sort=${sort}`;
	const nazms = await getNazms(url, '.contentListBody', false, count);
	return nazms;
};

const getNazmsByPoet = async (poet, language, count, sort) => {
	poet = poet.toLowerCase().replaceAll(' ', '-');
	const url = `https://www.rekhta.org/poets/${poet}/nazms?lang=${language}&sort=${sort}`;
	const nazms = await getNazms(url, '.rt_bodyTitle', true, count);
	return nazms;
};

export { getNazmsByTag, getNazmsByPoet };
