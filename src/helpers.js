const today = new Date().toISOString().slice(0, 10);

const isValidDate = (dateString) => {
	const regex = /^\d{4}-\d{2}-\d{2}$/;
	if (!dateString.match(regex)) return false;
	const date = new Date(dateString);
	const dateTime = date.getTime();
	if (!dateTime && dateTime !== 0) return false;
	return date.toISOString().slice(0, 10);
};

const isValidCount = (count) => isNaN(parseInt(count)) === false;

export { today, isValidDate, isValidCount };
