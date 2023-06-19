import {
	getShayarisByTag,
	getShayarisByPoet,
	getTop20ShayarisByTag,
	getTop20CoupletsByTag,
	getTop20ShayarisByPoet,
	getTop5ShayarisByDay,
} from '../src/shayari.js';

test('Get shayaris by a tag', async () => {
	const shayaris = await getShayarisByTag('ishq', 'en', 5);
	expect(shayaris).toHaveLength(5);
	expect(shayaris).toBeInstanceOf(Array);
}, 60000);

test('Get shayaris by a poet', async () => {
	const shayaris = await getShayarisByPoet('faiz ahmad faiz', 'en', 5);
	expect(shayaris).toHaveLength(5);
	expect(shayaris).toBeInstanceOf(Array);
}, 60000);

test('Get top 20 shayaris by a tag', async () => {
	const shayaris = await getTop20ShayarisByTag('phool', 'en');
	expect(shayaris).toHaveLength(20);
	expect(shayaris).toBeInstanceOf(Array);
}, 60000);

test('Get top 20 couplets by a tag', async () => {
	const shayaris = await getTop20CoupletsByTag('couplets-on-eyes', 'en');
	expect(shayaris).toHaveLength(20);
	expect(shayaris).toBeInstanceOf(Array);
}, 60000);

test('Get top 20 shayaris by a poet', async () => {
	const shayaris = await getTop20ShayarisByPoet('jaun eliya', 'en');
	expect(shayaris).toHaveLength(20);
	expect(shayaris).toBeInstanceOf(Array);
}, 60000);

test('Get top 5 shayaris of a day', async () => {
	const date = new Date().toISOString().slice(0, 10);
	const shayaris = await getTop5ShayarisByDay(date, 'en');
	expect(shayaris).toHaveLength(5);
	expect(shayaris).toBeInstanceOf(Array);
}, 60000);
