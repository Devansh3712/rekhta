import { getGhazalsByTag, getGhazalsByPoet } from '../src/ghazal.js';

test('Get ghazals by a tag', async () => {
	const ghazals = await getGhazalsByTag('ishq', 'en', 5);
	expect(ghazals).toHaveLength(5);
	expect(ghazals).toBeInstanceOf(Array);
}, 60000);

test('Get ghazals by a poet', async () => {
	const ghazals = await getGhazalsByPoet('faiz ahmad faiz', 'en', 5);
	expect(ghazals).toHaveLength(5);
	expect(ghazals).toBeInstanceOf(Array);
}, 60000);
