import {translation} from "./translation"; //todo: change to actual translation

let consoleState = {
	history: [],
	rollback: 0,
};

const consoleStateMethods = {
	loadHistoryFromLocalStorage: () => {
		let historyFromLocalStorage = JSON.parse(localStorage.getItem("fc-history"));

		if (historyFromLocalStorage && Array.isArray(historyFromLocalStorage)) {
			consoleState.history = historyFromLocalStorage;
		}
	},
	clearHistory: () => {
		consoleState.history = [];
		localStorage.setItem("fc-history", null);
		return translation["historyCleared"];
	},
	saveHistory: (inputValue) => {
		if (inputValue !== consoleState.history[consoleState.history.length - 1]) {
			consoleState.history.push(inputValue);
			localStorage.setItem("fc-history", JSON.stringify(consoleState.history));
		}
	},
	// historyUp: () => {
	// 	if (consoleState.history.length - consoleState.rollback > 0) {
	// 		consoleState.rollback++;
	// 		consoleDOM.input.value = consoleState.history[consoleState.history.length - consoleState.rollback];
	// 	}
	// }
	// setBusy: (param) => {
	// 	consoleState.busy = param;
	// 	if (consoleState.busy) {
	// 		consoleDOM.spinner.style.display = "block";
	// 		consoleDOM.input.style.display = "none";
	// 	} else {
	// 		consoleDOM.spinner.style.display = "none";
	// 		consoleDOM.input.style.display = "block";
	// 		setFocus();
	// 	}
	// },
};


export {consoleState, consoleStateMethods};
