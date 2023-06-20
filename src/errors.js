const InvalidTagError = new Error('The parameter tag is not valid');
const InvalidLanguageError = new Error(
	"The parameter language can only have values 'en', 'hi' or 'ur'",
);
const InvalidCountError = new Error('The count should be an integer value');
const InvalidSortParamError = new Error(
	"The parameter order can only have values 'popularity' or 'title'",
);
const InvalidGhazalSortParamError = new Error(
	"The parameter order can only have values 'popularity', 'title' or 'radeef'",
);
const InvalidOrderParamError = new Error(
	"The parameter order can only have values 'asc' or 'desc'",
);
const WordNotFoundError = new Error(
	'No word of the day found for the given date',
);
const DateFormatError = new Error('The date should be in YYYY-MM-DD format');

export {
	InvalidTagError,
	InvalidLanguageError,
	InvalidCountError,
	InvalidSortParamError,
	InvalidGhazalSortParamError,
	InvalidOrderParamError,
	WordNotFoundError,
	DateFormatError,
};
