import {
	InvalidLanguageError,
	InvalidGhazalSortParamError,
	InvalidOrderParamError,
	InvalidCountError,
} from '../src/errors.js';
import { getGhazalsByTag, getGhazalsByPoet } from '../src/ghazal.js';

describe('Get ghazals by a tag', () => {
	test('valid parameters', async () => {
		const ghazals = await getGhazalsByTag('ishq', 'en', 5);
		expect(ghazals).toHaveLength(5);
		expect(ghazals).toBeInstanceOf(Array);
	}, 60000);
	test('invalid tag', async () => {
		const ghazals = await getGhazalsByTag('tsuki', 'en', 5);
		expect(ghazals).toHaveLength(0);
		expect(ghazals).toBeInstanceOf(Array);
	}, 60000);
	test('invalid language', async () => {
		const ghazals = async () => await getGhazalsByTag('ishq', 'ru');
		await expect(ghazals()).rejects.toThrow(InvalidLanguageError);
	}, 60000);
	test('invalid count', async () => {
		const ghazals = async () => await getGhazalsByTag('ishq', 'en', 'one');
		await expect(ghazals()).rejects.toThrow(InvalidCountError);
	}, 60000);
	test('invalid sort', async () => {
		const ghazals = async () =>
			await getGhazalsByTag('ishq', 'en', 1, 'popular');
		await expect(ghazals()).rejects.toThrow(InvalidGhazalSortParamError);
	}, 60000);
	test('invalid order', async () => {
		const ghazals = async () =>
			await getGhazalsByTag('ishq', 'en', 1, 'popularity', 'ac');
		await expect(ghazals()).rejects.toThrow(InvalidOrderParamError);
	}, 60000);
});

describe('Get ghazals by a poet', () => {
	test('valid parameters', async () => {
		const ghazals = await getGhazalsByPoet('faiz ahmad faiz', 'en', 5);
		expect(ghazals).toHaveLength(5);
		expect(ghazals).toBeInstanceOf(Array);
	}, 60000);
	test('invalid poet', async () => {
		const ghazals = await getGhazalsByPoet('devansh singh', 'en', 5);
		expect(ghazals).toHaveLength(0);
		expect(ghazals).toBeInstanceOf(Array);
	}, 60000);
	test('invalid language', async () => {
		const ghazals = async () => await getGhazalsByPoet('faiz ahmad faiz', 'ru');
		await expect(ghazals()).rejects.toThrow(InvalidLanguageError);
	}, 60000);
	test('invalid count', async () => {
		const ghazals = async () =>
			await getGhazalsByPoet('faiz ahmad faiz', 'en', 'one');
		await expect(ghazals()).rejects.toThrow(InvalidCountError);
	}, 60000);
	test('invalid sort', async () => {
		const ghazals = async () =>
			await getGhazalsByPoet('faiz ahmad faiz', 'en', 1, 'popular');
		await expect(ghazals()).rejects.toThrow(InvalidGhazalSortParamError);
	}, 60000);
	test('invalid order', async () => {
		const ghazals = async () =>
			await getGhazalsByPoet('faiz ahmad faiz', 'en', 1, 'popularity', 'ac');
		await expect(ghazals()).rejects.toThrow(InvalidOrderParamError);
	}, 60000);
});
