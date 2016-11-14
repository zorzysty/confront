import consoleState from "./consoleState";
import {consoleDOMMethods} from "./consoleDOM";

let tasks = {};

const displayHelp = () => {
	const tableStart = "<table class='confront-table'>";
	const tableEnd = "</table>";
	let rows = [];
	Object.keys(tasks).forEach((key) => {
		const name = key;
		const desc = tasks[key].desc;
		rows.push(`<tr><td class="confront-label">${name}: </td><td class="confront-value">${desc ? desc : ""}</td>`);
	});
	return tableStart + rows.sort().join("") + tableEnd;
};

const getDefaultTasks = (translation) => {
	return {
		"clear": {
			cmd: () => consoleDOMMethods.clearConsole(),
			desc: translation["desc.clear"],
		},
		"clearhistory": {
			cmd: () => consoleState.clearHistory(),
			desc: translation["desc.clearHistory"],
		},
		"help": {
			cmd: () => displayHelp(),
			desc: translation["desc.help"],
			type: "html",
		},
	};
};

const getTasksNames = () => {
	return Object.keys(tasks).map((key) => key);
};

const initTasks = (userTasks, translation) => {
	const defaultTasks = getDefaultTasks(translation);
	tasks = Object.assign(defaultTasks, userTasks);
};

export {tasks, initTasks, getTasksNames};
