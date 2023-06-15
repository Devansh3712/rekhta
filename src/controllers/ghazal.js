import puppeteer from 'puppeteer';

const getGhazals = async (rekhtaUrl, selector, isSinglePoet) => {
	const browser = await puppeteer.launch({
		headless: 'new',
	});
	const page = await browser.newPage();
	await page.goto(rekhtaUrl, {
		waitUntil: 'networkidle2',
	});
	// Retrieve ghazal links
	const links = await page.evaluate((selector) => {
		const ghazals = document.querySelectorAll(selector);
		return Array.from(ghazals).map((ghazal) => {
			const link = ghazal.querySelector('a:nth-child(2)').href;
			return link;
		});
	}, selector);
	// Fetch the ghazal content
	const ghazals = [];
	for (let i = 0; i < links.length; i++) {
		const link = links[i];
		await page.goto(link, {
			waitUntil: 'networkidle2',
		});
		page.setDefaultNavigationTimeout(0);
		const content = await page.evaluate(
			(url, isSinglePoet) => {
				const ghazal = document
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
					return { ghazal, poet, url };
				}
				return { ghazal, url };
			},
			link,
			isSinglePoet,
		);
		ghazals.push(content);
	}
	await browser.close();
	return ghazals;
};

const getGhazalsByTag = async (tag, language) => {
	tag = tag.toLowerCase().replaceAll(' ', '-');
	const url = `https://www.rekhta.org/tags/${tag}-shayari/ghazals?lang=${language}`;
	const ghazals = await getGhazals(url, '.contentListBody', false);
	return ghazals;
};

const getGhazalsByPoet = async (poet, language, sort) => {
	poet = poet.toLowerCase().replaceAll(' ', '-');
	const url = `https://www.rekhta.org/poets/${poet}/ghazals?lang=${language}&sort=${sort}`;
	const ghazals = await getGhazals(url, '.rt_bodyTitle', true);
	return ghazals;
};

export { getGhazalsByTag, getGhazalsByPoet };
