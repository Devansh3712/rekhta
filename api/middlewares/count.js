export default (req, res, next) => {
	const count = req.query?.count;
	if (count && isNaN(parseInt(count)))
		return res.status(400).json({
			error: "Query parameter 'count' can only take integer values",
		});
	next();
};
