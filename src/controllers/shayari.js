import puppeteer from 'puppeteer';

const getShayaris = async (rekhtaUrl) => {
	const browser = await puppeteer.launch({
		headless: 'new',
	});
	const page = await browser.newPage();
	await page.setExtraHTTPHeaders({
		'user-agent':
			'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.131 Safari/537.36',
	});
	await page.goto(rekhtaUrl, {
		waitUntil: 'networkidle2',
	});
	const shayaris = await page.evaluate(() => {
		const shayariList = document.querySelectorAll('.sherSection');
		return Array.from(shayariList).map((quote) => {
			const shayari = quote
				.querySelector('.c')
				.innerText.replace(/(\r\n|\n|\r)/gm, '');
			let poet = quote.querySelector('.poetName');
			if (poet) {
				// Convert poet's name to title case
				poet = poet.innerText
					.toLowerCase()
					.split(' ')
					.map((word) => {
						return word.replace(word[0], word[0].toUpperCase());
					})
					.join(' ');
				return { shayari, poet };
			}
			return shayari;
		});
	});
	await browser.close();
	return shayaris;
};

const getShayarisByTag = async (tag, language) => {
	tag = tag.toLowerCase().replace(' ', '-');
	const url = `https://www.rekhta.org/tags/${tag}-shayari?lang=${language}`;
	const shayaris = await getShayaris(url);
	return shayaris;
};

const getShayarisByPoet = async (poet, language) => {
	poet = poet.toLowerCase().replace(' ', '-');
	const url = `https://www.rekhta.org/poets/${poet}/couplets?lang=${language}`;
	const shayaris = await getShayaris(url);
	return shayaris;
};

const getTop20ShayarisByPoet = async (poet, language) => {
	poet = poet.toLowerCase().replace(' ', '-');
	const url = `https://www.rekhta.org/poets/${poet}/t20?lang=${language}`;
	const shayaris = await getShayaris(url);
	return shayaris;
};

export { getShayarisByTag, getShayarisByPoet, getTop20ShayarisByPoet };
