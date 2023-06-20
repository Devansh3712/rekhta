import {
	InvalidLanguageError,
	InvalidSortParamError,
	InvalidOrderParamError,
	InvalidCountError,
	InvalidTagError,
	DateFormatError,
} from '../src/errors.js';
import {
	getShayarisByTag,
	getShayarisByPoet,
	getTop20ShayarisByTag,
	getTop20CoupletsByTag,
	getTop20ShayarisByPoet,
	getTop5ShayarisByDay,
} from '../src/shayari.js';

describe('Get shayaris by a tag', () => {
	test('valid parameters', async () => {
		const shayaris = await getShayarisByTag('ishq', 'en', 5);
		expect(shayaris).toHaveLength(5);
		expect(shayaris).toBeInstanceOf(Array);
	}, 60000);
	test('invalid tag', async () => {
		const shayaris = await getShayarisByTag('tsuki', 'en', 5);
		expect(shayaris).toHaveLength(0);
		expect(shayaris).toBeInstanceOf(Array);
	}, 60000);
	test('invalid language', async () => {
		const shayaris = async () => await getShayarisByTag('ishq', 'ru');
		await expect(shayaris()).rejects.toThrow(InvalidLanguageError);
	}, 60000);
	test('invalid count', async () => {
		const shayaris = async () => await getShayarisByTag('ishq', 'en', 'one');
		await expect(shayaris()).rejects.toThrow(InvalidCountError);
	}, 60000);
	test('invalid sort', async () => {
		const shayaris = async () =>
			await getShayarisByTag('ishq', 'en', 1, 'popular');
		await expect(shayaris()).rejects.toThrow(InvalidSortParamError);
	}, 60000);
	test('invalid order', async () => {
		const shayaris = async () =>
			await getShayarisByTag('ishq', 'en', 1, 'popularity', 'ac');
		await expect(shayaris()).rejects.toThrow(InvalidOrderParamError);
	}, 60000);
});

describe('Get shayaris by a poet', () => {
	test('valid parameters', async () => {
		const shayaris = await getShayarisByPoet('faiz ahmad faiz', 'en', 5);
		expect(shayaris).toHaveLength(5);
		expect(shayaris).toBeInstanceOf(Array);
	}, 60000);
	test('invalid poet', async () => {
		const shayaris = await getShayarisByPoet('devansh singh', 'en', 5);
		expect(shayaris).toHaveLength(0);
		expect(shayaris).toBeInstanceOf(Array);
	}, 60000);
	test('invalid language', async () => {
		const shayaris = async () =>
			await getShayarisByPoet('faiz ahmad faiz', 'ru');
		await expect(shayaris()).rejects.toThrow(InvalidLanguageError);
	}, 60000);
	test('invalid count', async () => {
		const shayaris = async () =>
			await getShayarisByPoet('faiz ahmad faiz', 'en', 'one');
		await expect(shayaris()).rejects.toThrow(InvalidCountError);
	}, 60000);
	test('invalid sort', async () => {
		const shayaris = async () =>
			await getShayarisByPoet('faiz ahmad faiz', 'en', 1, 'popular');
		await expect(shayaris()).rejects.toThrow(InvalidSortParamError);
	}, 60000);
	test('invalid order', async () => {
		const shayaris = async () =>
			await getShayarisByPoet('faiz ahmad faiz', 'en', 1, 'popularity', 'ac');
		await expect(shayaris()).rejects.toThrow(InvalidOrderParamError);
	}, 60000);
});

describe('Get top 20 shayaris by tag', () => {
	test('valid parameters', async () => {
		const shayaris = await getTop20ShayarisByTag('phool', 'en');
		expect(shayaris).toHaveLength(20);
		expect(shayaris).toBeInstanceOf(Array);
	}, 60000);
	test('invalid tag', async () => {
		const shayaris = async () => await getTop20ShayarisByTag('tsuki', 'en');
		await expect(shayaris()).rejects.toThrow(InvalidTagError);
	}, 60000);
	test('invalid language', async () => {
		const shayaris = async () => await getTop20ShayarisByTag('phool', 'ru');
		await expect(shayaris()).rejects.toThrow(InvalidLanguageError);
	}, 60000);
});

describe('Get top 20 couplets by tag', () => {
	test('valid parameters', async () => {
		const couplets = await getTop20CoupletsByTag('couplets-on-eyes', 'en');
		expect(couplets).toHaveLength(20);
		expect(couplets).toBeInstanceOf(Array);
	}, 60000);
	test('invalid tag', async () => {
		const couplets = async () => await getTop20CoupletsByTag('tsuki', 'en');
		await expect(couplets()).rejects.toThrow(InvalidTagError);
	}, 60000);
	test('invalid language', async () => {
		const couplets = async () =>
			await getTop20CoupletsByTag('couplets-on-eyes', 'ru');
		await expect(couplets()).rejects.toThrow(InvalidLanguageError);
	}, 60000);
});

describe('Get top 20 shayaris by poet', () => {
	test('valid parameters', async () => {
		const shayaris = await getTop20ShayarisByPoet('jaun eliya', 'en');
		expect(shayaris).toHaveLength(20);
		expect(shayaris).toBeInstanceOf(Array);
	}, 60000);
	test('invalid poet', async () => {
		const shayaris = await getTop20ShayarisByPoet('devansh singh', 'en');
		expect(shayaris).toHaveLength(0);
		expect(shayaris).toBeInstanceOf(Array);
	}, 60000);
	test('invalid language', async () => {
		const couplets = async () => await getTop20ShayarisByTag('phool', 'ru');
		await expect(couplets()).rejects.toThrow(InvalidLanguageError);
	}, 60000);
});

describe('Get top 5 shayaris of a day', () => {
	test('valid parameters', async () => {
		const shayaris = await getTop5ShayarisByDay('2022-10-01');
		expect(shayaris).toHaveLength(5);
		expect(shayaris).toBeInstanceOf(Array);
	}, 60000);
	test('invalid date', async () => {
		const shayaris = async () => await getTop5ShayarisByDay('01-10-2023');
		await expect(shayaris()).rejects.toThrow(DateFormatError);
	}, 60000);
	test('invalid language', async () => {
		const today = new Date().toISOString().slice(0, 10);
		const shayaris = async () => await getTop5ShayarisByDay(today, 'jp');
		await expect(shayaris()).rejects.toThrow(InvalidLanguageError);
	}, 60000);
});
