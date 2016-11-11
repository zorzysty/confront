import {translation} from "./translation";
import {consoleDOMMethods} from "./consoleDOM";

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
	setBusy: (param) => {
		consoleState.busy = param;
		if (consoleState.busy) {
			consoleDOMMethods.showSpinner();
		} else {
			consoleDOMMethods.hideSpinner();
		}
	},
	historyUp: () => {
		if (consoleState.history.length - consoleState.rollback > 0) {
			consoleState.rollback++;
			consoleDOMMethods.setInputValue(consoleState.history[consoleState.history.length - consoleState.rollback]);
		}
	},
	historyDown: () => {
		if (consoleState.rollback > 1) {
			consoleState.rollback--;
			consoleDOMMethods.setInputValue(consoleState.history[consoleState.history.length - consoleState.rollback]);
		} else if (consoleState.rollback === 1) {
			consoleState.rollback = 0;
			consoleDOMMethods.setInputValue("");
		}
	}
};

export {consoleState, consoleStateMethods};
