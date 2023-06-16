import puppeteer from 'puppeteer';

const getWordOfTheDay = async (date) => {
	const rekhtaUrl = `https://www.rekhta.org/archives/${date}/WordOfTheDays/`;
	const browser = await puppeteer.launch({
		headless: 'new',
	});
	const page = await browser.newPage();
	await page.goto(rekhtaUrl, {
		waitUntil: 'networkidle2',
	});
	const word = await page.evaluate(() => {
		const english = document.querySelector('.wordContainer').innerText;
		const hindi = document.querySelector('.devMeaning').innerText;
		const urdu = document.querySelector('.urMeaning').innerText;
		const meaning = document.querySelector('.engMeaning > h3').innerText;
		const usage = document
			.querySelector('.wordInSher')
			.innerText.replace(/(\r\n|\n|\r)/gm, '');
		return { english, hindi, urdu, meaning, usage };
	});
	await browser.close();
	return word;
};

export { getWordOfTheDay };
