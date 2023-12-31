import { shayariTags, coupletTags } from './constants.js';
import { getGhazalsByPoet, getGhazalsByTag } from './ghazal.js';
import { getNazmsByPoet, getNazmsByTag } from './nazm.js';
import {
	getShayarisByTag,
	getShayarisByPoet,
	getTop20ShayarisByTag,
	getTop20CoupletsByTag,
	getTop20ShayarisByPoet,
	getTop5ShayarisByDay,
} from './shayari.js';
import { getWordOfTheDay } from './word.js';

export {
	shayariTags,
	coupletTags,
	getGhazalsByPoet,
	getGhazalsByTag,
	getNazmsByPoet,
	getNazmsByTag,
	getShayarisByTag,
	getShayarisByPoet,
	getTop20ShayarisByTag,
	getTop20CoupletsByTag,
	getTop20ShayarisByPoet,
	getTop5ShayarisByDay,
	getWordOfTheDay,
};
