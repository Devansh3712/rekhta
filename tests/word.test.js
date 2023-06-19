import { getWordOfTheDay } from '../src/word.js';

test('Get word of a day', async () => {
	const date = new Date().toISOString().slice(0, 10);
	const word = await getWordOfTheDay(date);
	expect(word).toBeInstanceOf(Object);
}, 60000);
