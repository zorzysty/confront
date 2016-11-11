// todo: uncomment this line when bundling is finished
import "babel-polyfill";
import {translation, getTranslation} from "./translation";
import {config, getConfig} from "./config";
import {tasks, getTasks} from "./tasks";
import {getArgsAndFlags, checkType, extractCommandParts, isShortcutActivatorEnabled} from "./helpers";
import {consoleState, consoleStateMethods}from "./consoleState";

const FrontConsole = (userTasks, userConfig, userTranslation) => {

	let consoleDOM = {};

	const clearConsole = () => {
		consoleDOM.output.innerHTML = "";
	};

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

	const keyDownHandler = (event) => {
		const shortcutActivatorEnabled = isShortcutActivatorEnabled(event, config.shortcutActivator);
		if (shortcutActivatorEnabled && event.keyCode === config.shortcutKeyCode) {
			toggleDisplay();
		}

		if (consoleState.busy) {
			return;
		}

		if (consoleDOM.input === document.activeElement) {
			switch (event.keyCode) {
				case 13: //enter/return
					consoleState.rollback = 0;
					executeCmd();
					break;
				case 38: //up
					event.preventDefault();
					if (consoleState.history.length - consoleState.rollback > 0) {
						consoleState.rollback++;
						consoleDOM.input.value = consoleState.history[consoleState.history.length - consoleState.rollback];
					}
					break;
				case 40: //down
					event.preventDefault();
					if (consoleState.rollback > 1) {
						consoleState.rollback--;
						consoleDOM.input.value = consoleState.history[consoleState.history.length - consoleState.rollback];
					} else if (consoleState.rollback === 1) {
						consoleState.rollback = 0;
						consoleDOM.input.value = "";
					}
					break;
			}
		}
	};

	const toggleDisplay = () => {
		if (consoleDOM.wrapper.style.display === "none") {
			consoleDOM.wrapper.style.display = "block";
			setFocus();
		} else {
			consoleDOM.wrapper.style.display = "none";
		}
	};

	const clickHandler = () => {
		setFocus();
	};

	const executeCmd = () => {
		const inputValue = consoleDOM.input.value.trim();
		if (inputValue === "") {
			return;
		}

		consoleStateMethods.saveHistory(inputValue);
		consoleDOM.input.value = "";
		printLine(inputValue, "cmd");

		const [cmd, ...params] = extractCommandParts(inputValue);

		if (!tasks[cmd]) {
			printLine(translation["err.cmdNotFound"], "error");
			return;
		}

		try {
			var {args, shortFlags, longFlags} = getArgsAndFlags(params, config.convertTypes);
		}
		catch (err) {
			printLine(err, "error");
			return;
		}

		try {
			var cmdResult = tasks[cmd].cmd(args, shortFlags, longFlags);
		}
		catch (err) {
			printLine(err, "error");
			return;
		}

		if (!cmdResult) {
			return;
		}

		let cmdResultType = tasks[cmd].type;
		let isCmdAPromise = typeof cmdResult.then === "function";

		if (isCmdAPromise) {
			setBusy(true);
			cmdResult
				.then((promiseResult) => {
					printResult(promiseResult, checkType(cmdResultType, promiseResult));
					setBusy(false);
				})
				.catch((err) => {
					printLine(String(err), "error");
					setBusy(false);
				});
		} else {
			printResult(cmdResult, checkType(cmdResultType, cmdResult));
		}
	};

	const printResult = (result, resultType) => {
		switch (resultType) {
			case "default": {
				if (typeof result === "object") {
					printLine(JSON.stringify(result, undefined, 2));
				} else {
					printLine(result);
				}
				break;
			}
			case "html": {
				printHTML(result);
				break;
			}
		}
	};

	const printLine = (txt, type) => {
		let line = document.createElement("pre");
		line.className = `frontconsole-${type ? type : "default"}`;
		(type === "cmd") ? txt = `> ${txt}` : txt;
		line.innerText = txt;
		consoleDOM.output.appendChild(line);
		scrollToBottom();
	};

	const printHTML = (html) => {
		let lines = document.createElement("div");
		lines.innerHTML = html;
		consoleDOM.output.appendChild(lines);
		scrollToBottom();
	};

	const scrollToBottom = () => {
		consoleDOM.wrapper.scrollTop = consoleDOM.wrapper.scrollHeight;
	};

	const createDOMElements = () => {
		consoleDOM.wrapper = document.createElement("div");
		consoleDOM.output = document.createElement("div");
		consoleDOM.input = document.createElement("input");
		consoleDOM.spinner = document.createElement("div");

		consoleDOM.wrapper.className = "frontconsole";
		consoleDOM.output.className = "frontconsole-output";
		consoleDOM.input.className = "frontconsole-input";
		consoleDOM.spinner.className = "frontconsole-spinner";

		consoleDOM.wrapper.appendChild(consoleDOM.output);
		consoleDOM.wrapper.appendChild(consoleDOM.input);
		consoleDOM.wrapper.appendChild(consoleDOM.spinner);

		consoleDOM.input.setAttribute("spellcheck", "false");

		consoleDOM.wrapper.style.display = "none";
		document.body.appendChild(consoleDOM.wrapper);
	};

	const setBusy = (param) => {
		consoleState.busy = param;
		if (consoleState.busy) {
			consoleDOM.spinner.style.display = "block";
			consoleDOM.input.style.display = "none";
		} else {
			consoleDOM.spinner.style.display = "none";
			consoleDOM.input.style.display = "block";
			setFocus();
		}
	};

	const setFocus = () => {
		consoleDOM.input.focus();
	};

	const instantiate = () => {
		getConfig(userConfig);
		getTranslation(userTranslation);
		getTasks(userTasks, translation);

		consoleStateMethods.loadHistoryFromLocalStorage();

		createDOMElements();
		setBusy(false);
		document.addEventListener("keydown", keyDownHandler);
		consoleDOM.wrapper.addEventListener("click", clickHandler);
	};

	instantiate();

	return {
		config,
		tasks,
		consoleDOM
	};
};

window.FrontConsole = FrontConsole;
