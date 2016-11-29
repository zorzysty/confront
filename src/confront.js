import "babel-polyfill";
import {consoleDOM, consoleDOMMethods} from "./consoleDOM";
import {translation, initTranslation} from "./translation";
import {config, initConfig} from "./config";
import {tasks, initTasks} from "./tasks";
import {initAliases} from "./aliases";
import {getArgsAndFlags, checkType, extractCommandParts, isShortcutActivatorEnabled} from "./helpers";
import consoleState from "./consoleState";

const ConFront = (userTasks, userConfig, userTranslation) => {

	const init = () => {
		initConfig(userConfig);
		initTranslation(userTranslation);
		initTasks(userTasks, translation);
		initAliases();

		consoleState.loadHistoryFromLocalStorage();

		consoleDOMMethods.createElements();
		consoleDOMMethods.printLine(config.welcomeMessage);
		consoleState.setBusy(false);
		document.addEventListener("keydown", keyDownHandler);
		consoleDOM.wrapper.addEventListener("click", clickHandler);

		if (!config.externalCSS) {
			consoleDOMMethods.styleElements();
		}
	};

	const keyDownHandler = (event) => {
		const shortcutActivatorEnabled = isShortcutActivatorEnabled(event, config.shortcutActivator);
		if (shortcutActivatorEnabled && event.keyCode === config.shortcutKeyCode) {
			consoleDOMMethods.toggleDisplay();
		}

		if (consoleState.isBusy()) {
			return;
		}

		if (consoleDOM.input === document.activeElement) {
			switch (event.keyCode) {
				case 13: //enter/return
					consoleState.resetRollback();
					executeCmd();
					break;
				case 38: //up
					event.preventDefault();
					consoleState.historyUp();
					break;
				case 40: //down
					event.preventDefault();
					consoleState.historyDown();
					break;
				case 9: //tab
					event.preventDefault();
					consoleDOMMethods.autoComplete();
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

		consoleState.saveHistory(inputValue);
		consoleDOMMethods.clearInput();
		consoleDOMMethods.printLine(inputValue, "cmd");

		const [cmd, ...params] = extractCommandParts(inputValue);

		if (!tasks[cmd]) {
			consoleDOMMethods.printLine(translation["err.cmdNotFound"], "error");
			return;
		}

		try {
			var {args, shortFlags, longFlags} = getArgsAndFlags(params, config.convertTypes);
		}
		catch (err) {
			consoleDOMMethods.printLine(err, "error");
			return;
		}

		try {
			var cmdResult = tasks[cmd].cmd(args, shortFlags, longFlags, inputValue);
		}
		catch (err) {
			consoleDOMMethods.printLine(err, "error");
			return;
		}

		if (!cmdResult) {
			return;
		}

		let cmdResultType = tasks[cmd].type;
		let isCmdAPromise = typeof cmdResult.then === "function";

		if (isCmdAPromise) {
			handlePromise(cmdResult, cmdResultType);
		} else {
			consoleDOMMethods.handleResult(cmdResult, checkType(cmdResultType, cmdResult));
		}
	};

	const handlePromise = (cmdResult, cmdResultType) => {
		consoleState.setBusy(true);
		cmdResult
			.then((promiseResult) => {
				consoleDOMMethods.handleResult(promiseResult, checkType(cmdResultType, promiseResult));
				consoleState.setBusy(false);
			})
			.catch((err) => {
				consoleDOMMethods.printLine(String(err), "error");
				consoleState.setBusy(false);
			});
	};

	init();

	return {
		config,
		tasks,
		consoleDOM
	};
};

export default ConFront;
