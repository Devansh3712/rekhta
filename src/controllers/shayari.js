import puppeteer from 'puppeteer';

const getShayaris = async (rekhtaUrl, isSinglePoet) => {
	const browser = await puppeteer.launch({
		headless: 'new',
	});
	const page = await browser.newPage();
	await page.goto(rekhtaUrl, {
		waitUntil: 'networkidle2',
	});
	const shayaris = await page.evaluate((isSinglePoet) => {
		const shayariList = document.querySelectorAll('.sherSection');
		return Array.from(shayariList).map((quote) => {
			const shayari = quote
				.querySelector('.c')
				.innerText.replace(/(\r\n|\n|\r)/gm, '')
				.trim();
			const url = quote.querySelector('.shareSocial').getAttribute('data-url');
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
		});
	}, isSinglePoet);
	await browser.close();
	return shayaris;
};

const getShayarisByTag = async (tag, language, sort) => {
	tag = tag.toLowerCase().replaceAll(' ', '-');
	const url = `https://www.rekhta.org/tags/${tag}-shayari?lang=${language}&sort=${sort}`;
	const shayaris = await getShayaris(url, false);
	return shayaris;
};

const getShayarisByPoet = async (poet, language, sort) => {
	poet = poet.toLowerCase().replaceAll(' ', '-');
	const url = `https://www.rekhta.org/poets/${poet}/couplets?lang=${language}&sort=${sort}`;
	const shayaris = await getShayaris(url, true);
	return shayaris;
};

const getTop20ShayarisByPoet = async (poet, language) => {
	poet = poet.toLowerCase().replaceAll(' ', '-');
	const url = `https://www.rekhta.org/poets/${poet}/t20?lang=${language}`;
	const shayaris = await getShayaris(url, true);
	return shayaris;
};

export { getShayarisByTag, getShayarisByPoet, getTop20ShayarisByPoet };
