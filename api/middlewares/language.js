const languages = ['en', 'hi', 'ur'];

export default (req, res, next) => {
	const language = req.query?.lang;
	if (language && !languages.includes(language))
		return res.status(400).json({
			error: "Query parameter 'lang' can only take values 'en', 'hi' or 'ur'",
		});
	next();
};
