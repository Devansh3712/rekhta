const sortParams = ['popularity', 'title'];
const ghazalSortParams = [...sortParams, 'radeef'];
const orderParams = ['asc', 'desc'];

export default (req, res, next) => {
	const sortBy = req.query?.sort;
	const orderBy = req.query?.order;
	if (sortBy) {
		if (req.url.startsWith('/ghazal') && !ghazalSortParams.includes(sortBy))
			return res.status(400).json({
				error:
					"Query parameter 'sort' can only take values 'popularity', 'title' or 'radeef'",
			});
		if (!sortParams.includes(sortBy))
			return res.status(400).json({
				error:
					"Query parameter 'sort' can only take values 'popularity' or 'title'",
			});
	}
	if (orderBy && !orderParams.includes(orderBy))
		return res.status(400).json({
			error: "Query parameter 'order' can only take values 'asc' or 'desc'",
		});
	next();
};
