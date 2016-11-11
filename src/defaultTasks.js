const displayHelp = () => {
	const tableStart = "<table class='frontconsole-table'>";
	const tableEnd = "</table>";
	let rows = [];
	Object.keys(tasks).forEach((key)=> {
		const name = key;
		const desc = tasks[key].desc;
		rows.push(`<tr><td class="frontconsole-label">${name}: </td><td class="frontconsole-value">${desc ? desc : ""}</td>`);
	});
	return tableStart + rows.sort().join("") + tableEnd;
};
