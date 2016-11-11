import {translation} from "./translation";
import {consoleDOMMethods} from "./consoleDOM";

let state = {
	history: [],
	rollback: 0,
};

const consoleState = {
	loadHistoryFromLocalStorage: () => {
		let historyFromLocalStorage = JSON.parse(localStorage.getItem("fc-history"));

		if (historyFromLocalStorage && Array.isArray(historyFromLocalStorage)) {
			state.history = historyFromLocalStorage;
		}
	},
	clearHistory: () => {
		state.history = [];
		localStorage.setItem("fc-history", null);
		return translation["historyCleared"];
	},
	saveHistory: (inputValue) => {
		if (inputValue !== state.history[state.history.length - 1]) {
			state.history.push(inputValue);
			localStorage.setItem("fc-history", JSON.stringify(state.history));
		}
	},
	isBusy: () => {
		return state.busy;
	},
	resetRollback: () => {
		state.rollback = 0;
	},
	setBusy: (param) => {
		state.busy = param;
		if (state.busy) {
			consoleDOMMethods.showSpinner();
		} else {
			consoleDOMMethods.hideSpinner();
		}
	},
	historyUp: () => {
		if (state.history.length - state.rollback > 0) {
			state.rollback++;
			consoleDOMMethods.setInputValue(state.history[state.history.length - state.rollback]);
		}
	},
	historyDown: () => {
		if (state.rollback > 1) {
			state.rollback--;
			consoleDOMMethods.setInputValue(state.history[state.history.length - state.rollback]);
		} else if (state.rollback === 1) {
			state.rollback = 0;
			consoleDOMMethods.clearInput();
		}
	}
};

export default consoleState;
