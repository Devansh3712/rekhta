const isValidDate = (dateStr) => {
	const regex = /^\d{4}-\d{2}-\d{2}$/;
	if (!dateStr.match(regex)) return false;
	const date = new Date(dateStr);
	const dateTime = date.getTime();
	if (!dateTime && dateTime !== 0) return false;
	return date.toISOString().slice(0, 10) === dateStr;
};

export default (req, res, next) => {
	const date = req.query?.date;
	if (date && !isValidDate(date))
		return res.status(400).json({
			error: "Query parameter 'date' can only be in the format 'YYYY-MM-DD'",
		});
	next();
};
