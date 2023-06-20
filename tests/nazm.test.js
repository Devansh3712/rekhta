import {
	InvalidLanguageError,
	InvalidSortParamError,
	InvalidOrderParamError,
	InvalidCountError,
} from '../src/errors.js';
import { getNazmsByTag, getNazmsByPoet } from '../src/nazm.js';

describe('Get nazms by a tag', () => {
	test('valid parameters', async () => {
		const nazms = await getNazmsByTag('ishq', 'en', 5);
		expect(nazms).toHaveLength(5);
		expect(nazms).toBeInstanceOf(Array);
	}, 60000);
	test('invalid tag', async () => {
		const nazms = await getNazmsByTag('tsuki', 'en', 5);
		expect(nazms).toHaveLength(0);
		expect(nazms).toBeInstanceOf(Array);
	}, 60000);
	test('invalid language', async () => {
		const nazms = async () => await getNazmsByTag('ishq', 'ru');
		await expect(nazms()).rejects.toThrow(InvalidLanguageError);
	}, 60000);
	test('invalid count', async () => {
		const nazms = async () => await getNazmsByTag('ishq', 'en', 'one');
		await expect(nazms()).rejects.toThrow(InvalidCountError);
	}, 60000);
	test('invalid sort', async () => {
		const nazms = async () => await getNazmsByTag('ishq', 'en', 1, 'popular');
		await expect(nazms()).rejects.toThrow(InvalidSortParamError);
	}, 60000);
	test('invalid order', async () => {
		const nazms = async () =>
			await getNazmsByTag('ishq', 'en', 1, 'popularity', 'ac');
		await expect(nazms()).rejects.toThrow(InvalidOrderParamError);
	}, 60000);
});

describe('Get nazms by a poet', () => {
	test('valid parameters', async () => {
		const nazms = await getNazmsByPoet('faiz ahmad faiz', 'en', 5);
		expect(nazms).toHaveLength(5);
		expect(nazms).toBeInstanceOf(Array);
	}, 60000);
	test('invalid poet', async () => {
		const nazms = await getNazmsByPoet('devansh singh', 'en', 5);
		expect(nazms).toHaveLength(0);
		expect(nazms).toBeInstanceOf(Array);
	}, 60000);
	test('invalid language', async () => {
		const nazms = async () => await getNazmsByPoet('faiz ahmad faiz', 'ru');
		await expect(nazms()).rejects.toThrow(InvalidLanguageError);
	}, 60000);
	test('invalid count', async () => {
		const nazms = async () =>
			await getNazmsByPoet('faiz ahmad faiz', 'en', 'one');
		await expect(nazms()).rejects.toThrow(InvalidCountError);
	}, 60000);
	test('invalid sort', async () => {
		const nazms = async () =>
			await getNazmsByPoet('faiz ahmad faiz', 'en', 1, 'popular');
		await expect(nazms()).rejects.toThrow(InvalidSortParamError);
	}, 60000);
	test('invalid order', async () => {
		const nazms = async () =>
			await getNazmsByPoet('faiz ahmad faiz', 'en', 1, 'popularity', 'ac');
		await expect(nazms()).rejects.toThrow(InvalidOrderParamError);
	}, 60000);
});
