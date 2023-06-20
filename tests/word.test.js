import { DateFormatError, WordNotFoundError } from '../src/errors.js';
import { getWordOfTheDay } from '../src/word.js';

describe('Get word of a day', () => {
	test('valid date', async () => {
		const word = await getWordOfTheDay('2022-02-10');
		expect(word).toBeInstanceOf(Object);
	}, 60000);
	test('invalid date', async () => {
		const word = async () => await getWordOfTheDay('10-02-2023');
		await expect(word()).rejects.toThrow(DateFormatError);
	}, 60000);
	test('word not found', async () => {
		const word = async () => await getWordOfTheDay('2023-02-10');
		await expect(word()).rejects.toThrow(WordNotFoundError);
	}, 60000);
});
