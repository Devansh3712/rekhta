import { getNazmsByTag, getNazmsByPoet } from '../src/nazm.js';

test('Get nazms by a tag', async () => {
	const nazms = await getNazmsByTag('ishq', 'en', 5);
	expect(nazms).toHaveLength(5);
	expect(nazms).toBeInstanceOf(Array);
}, 60000);

test('Get nazms by a poet', async () => {
	const nazms = await getNazmsByPoet('faiz ahmad faiz', 'en', 5);
	expect(nazms).toHaveLength(5);
	expect(nazms).toBeInstanceOf(Array);
}, 60000);
