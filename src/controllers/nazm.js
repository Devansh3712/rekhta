import puppeteer from 'puppeteer';

const getNazms = async (rekhtaUrl, selector, isSinglePoet) => {
	const browser = await puppeteer.launch({
		headless: 'new',
	});
	const page = await browser.newPage();
	await page.goto(rekhtaUrl, {
		waitUntil: 'networkidle2',
	});
	// Retrieve nazm links
	const links = await page.evaluate((selector) => {
		const nazms = document.querySelectorAll(selector);
		return Array.from(nazms).map((nazm) => {
			const link = nazm.querySelector('a:nth-child(2)').href;
			return link;
		});
	}, selector);
	// Fetch nazm content
	const nazms = [];
	for (let i = 0; i < links.length; i++) {
		const link = links[i];
		await page.goto(link, {
			waitUntil: 'networkidle2',
		});
		page.setDefaultNavigationTimeout(0);
		const content = await page.evaluate(
			(url, isSinglePoet) => {
				const nazm = document
					.querySelector('.poemPageContentBody')
					.innerText.replace(/(\r\n|\n|\r)/gm, '')
					.split('VIDEOS')[0]
					.split('RECITATIONS')[0];
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
		nazms.push(content);
	}
	await browser.close();
	return nazms;
};

const getNazmsByTag = async (tag, language) => {
	tag = tag.toLowerCase().replaceAll(' ', '-');
	const url = `https://www.rekhta.org/tags/${tag}-shayari/nazms?lang=${language}`;
	const nazms = await getNazms(url, '.contentListBody', false);
	return nazms;
};

const getNazmsByPoet = async (poet, language) => {
	poet = poet.toLowerCase().replaceAll(' ', '-');
	const url = `https://www.rekhta.org/poets/${poet}/nazms?lang=${language}`;
	const nazms = await getNazms(url, '.rt_bodyTitle', true);
	return nazms;
};

export { getNazmsByTag, getNazmsByPoet };
