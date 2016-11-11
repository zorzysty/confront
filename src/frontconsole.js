import "babel-polyfill";
import {consoleDOM, consoleDOMMethods} from "./consoleDOM";
import {translation, getTranslation} from "./translation";
import {config, getConfig} from "./config";
import {tasks, getTasks} from "./tasks";
import {getArgsAndFlags, checkType, extractCommandParts, isShortcutActivatorEnabled} from "./helpers";
import {consoleState, consoleStateMethods}from "./consoleState";

const FrontConsole = (userTasks, userConfig, userTranslation) => {

	const instantiate = () => {
		getConfig(userConfig);
		getTranslation(userTranslation);
		getTasks(userTasks, translation);

		consoleStateMethods.loadHistoryFromLocalStorage();

		consoleDOMMethods.createElements();
		consoleStateMethods.setBusy(false);
		document.addEventListener("keydown", keyDownHandler);
		consoleDOM.wrapper.addEventListener("click", clickHandler);
	};

	const keyDownHandler = (event) => {
		const shortcutActivatorEnabled = isShortcutActivatorEnabled(event, config.shortcutActivator);
		if (shortcutActivatorEnabled && event.keyCode === config.shortcutKeyCode) {
			consoleDOMMethods.toggleDisplay();
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
					consoleStateMethods.historyUp();
					break;
				case 40: //down
					event.preventDefault();
					consoleStateMethods.historyDown();
					break;
			}
		}
	};

	const clickHandler = () => {
		consoleDOMMethods.setFocus();
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
			consoleStateMethods.setBusy(true);
			cmdResult
				.then((promiseResult) => {
					printResult(promiseResult, checkType(cmdResultType, promiseResult));
					consoleStateMethods.setBusy(false);
				})
				.catch((err) => {
					printLine(String(err), "error");
					consoleStateMethods.setBusy(false);
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
		consoleDOMMethods.scrollToBottom();
	};

	const printHTML = (html) => {
		let lines = document.createElement("div");
		lines.innerHTML = html;
		consoleDOM.output.appendChild(lines);
		consoleDOMMethods.scrollToBottom();
	};

	instantiate();

	return {
		config,
		tasks,
		consoleDOM
	};
};

window.FrontConsole = FrontConsole;
