import puppeteer from 'puppeteer';

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
			const result = shayariList
				.map((quote) => {
					try {
						const shayari = quote
							.querySelector('.c')
							.innerText.replace(/(\r\n|\n|\r)/gm, '')
							.trim();
						const url = quote
							.querySelector('.shareSocial')
							.getAttribute('data-url');
						if (!isSinglePoet) {
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
					} catch (error) {}
				})
				.filter((shayari) => shayari);
			return result;
		},
		selector,
		isSinglePoet,
		count,
	);
	await browser.close();
	return shayaris;
};

const getShayarisByTag = async (tag, language, count, sort) => {
	tag = tag.toLowerCase().replaceAll(' ', '-');
	const url = `https://www.rekhta.org/tags/${tag}-shayari?lang=${language}&sort=${sort}`;
	const shayaris = await getShayaris(url, '.sherSection', false, count);
	return shayaris;
};

const getShayarisByPoet = async (poet, language, count, sort) => {
	poet = poet.toLowerCase().replaceAll(' ', '-');
	const url = `https://www.rekhta.org/poets/${poet}/couplets?lang=${language}&sort=${sort}`;
	const shayaris = await getShayaris(url, '.sherSection', true, count);
	return shayaris;
};

const getTop20ShayarisByPoet = async (poet, language) => {
	poet = poet.toLowerCase().replaceAll(' ', '-');
	const url = `https://www.rekhta.org/poets/${poet}/t20?lang=${language}`;
	const shayaris = await getShayaris(url, '.sherSection', true);
	return shayaris;
};

const getTodaysTop5Shayari = async (language) => {
	const url = `https://www.rekhta.org/?lang=${language}`;
	const shayaris = await getShayaris(url, '.owl-item', false);
	return shayaris;
};

export {
	getShayarisByTag,
	getShayarisByPoet,
	getTop20ShayarisByPoet,
	getTodaysTop5Shayari,
};
