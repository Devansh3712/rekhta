const InvalidTagError = new Error('The parameter tag is not valid');
const InvalidLanguageError = new Error(
	"The parameter language can only have values 'en', 'hi' or 'ur'",
);
const InvalidSortParamError = new Error(
	"The parameter order can only have values 'popularity' or 'title'",
);
const InvalidGhazalSortParamError = new Error(
	"The parameter order can only have values 'popularity', 'title' or 'radeef'",
);
const InvalidOrderParamError = new Error(
	"The parameter order can only have values 'asc' or 'desc'",
);

export {
	InvalidTagError,
	InvalidLanguageError,
	InvalidSortParamError,
	InvalidGhazalSortParamError,
	InvalidOrderParamError,
};
