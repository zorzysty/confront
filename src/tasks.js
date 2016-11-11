import {consoleStateMethods} from "./consoleState";

const clearConsole = () => {
	console.log("clear console from tasks.js");
};
const displayHelp = () => {
	console.log("help from tasks.js");
};

const getDefaultTasks = (translation) => {
	return {
		"clear": {
			cmd: () => clearConsole(),
			desc: translation["desc.clear"],
		},
		"clearhistory": {
			cmd: () => consoleStateMethods.clearHistory(),
			desc: translation["desc.clearHistory"],
		},
		"help": {
			cmd: () => displayHelp(),
			desc: translation["desc.help"],
			type: "html",
		},
	};
};

let tasks = {};

const getTasks = (userTasks, translation) => {
	const defaultTasks = getDefaultTasks(translation);
	tasks = Object.assign(defaultTasks, userTasks);
};

export {tasks, getTasks};
