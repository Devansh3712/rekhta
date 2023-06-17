const InvalidTagError = new Error('The parameter tag is not valid');
const InvalidLanguageError = new Error(
	"The parameter language can only have values 'en', 'hi' or 'ur'",
);

export { InvalidTagError, InvalidLanguageError };
