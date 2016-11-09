// eslint-disable-next-line no-unused-vars
const FrontConsole = (userTasks, userConfig, userTranslation) => {

	let consoleDOM = {};
	let consoleState = {
		history: [],
		rollback: 0,
	};
	let historyFromLocalStorage = JSON.parse(localStorage.getItem("fc-history"));

	if (historyFromLocalStorage && Array.isArray(historyFromLocalStorage)) {
		consoleState.history = historyFromLocalStorage;
	}

	const defaultConfig = {
		shortcutActivator: "ctrl", //options: "ctrl", "ctrl+shift", "ctrl+alt"
		shortcutKeyCode: 192,
		convertTypes: true,
	};

	const config = Object.assign(defaultConfig, userConfig);

	const defaultTranslation = {
		"desc.clear": "Clears console",
		"desc.clearHistory": "Clears history",
		"desc.help": "This help",
		"err.cmdNotFound": "Command not found",
		"historyCleared": "History cleared",
	};

	const translation = Object.assign(defaultTranslation, userTranslation);

	const defaultTasks = {
		"clear": {
			cmd: () => clearConsole(),
			desc: translation["desc.clear"],
		},
		"clearhistory": {
			cmd: () => clearHistory(),
			desc: translation["desc.clearHistory"],
		},
		"help": {
			cmd: () => displayHelp(),
			desc: translation["desc.help"],
			type: "html",
		},
	};

	const tasks = Object.assign(defaultTasks, userTasks);

	const clearConsole = () => {
		consoleDOM.output.innerHTML = "";
	};

	const clearHistory = () => {
		consoleState.history = [];
		localStorage.setItem("fc-history", null);
		return translation["historyCleared"];
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
		let shortcutActivatorEnabled = false;
		switch (config.shortcutActivator) {
			case "ctrl":
				if (event.ctrlKey && !event.altKey && !event.shiftKey) {
					shortcutActivatorEnabled = true;
				}
				break;
			case "ctrl+shift":
				if (event.ctrlKey && !event.altKey && event.shiftKey) {
					shortcutActivatorEnabled = true;
				}
				break;
			case "ctrl+alt":
				if (event.ctrlKey && event.altKey && !event.shiftKey) {
					shortcutActivatorEnabled = true;
				}
				break;
		}

		if (shortcutActivatorEnabled && event.keyCode === config.shortcutKeyCode) {
			if (consoleDOM.wrapper.style.display === "none") {
				consoleDOM.wrapper.style.display = "block";
				setFocus();
			} else {
				consoleDOM.wrapper.style.display = "none";
			}
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

	const clickHandler = () => {
		setFocus();
	};

	const executeCmd = () => {
		const inputValue = consoleDOM.input.value.trim();
		if (inputValue === "") {
			return;
		}

		saveHistory(inputValue);
		consoleDOM.input.value = "";
		printLine(inputValue, "cmd");

		const [cmd, ...params] = extractCommandParts(inputValue);

		if (!tasks[cmd]) {
			printLine(translation["err.cmdNotFound"], "error");
			return;
		}

		try {
			var {args, shortFlags, longFlags} = getArgsAndFlags(params);
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

	const saveHistory = (inputValue) => {
		if (inputValue !== consoleState.history[consoleState.history.length - 1]) {
			consoleState.history.push(inputValue);
			localStorage.setItem("fc-history", JSON.stringify(consoleState.history));
		}
	};

	const extractCommandParts = (inputValue) => {
		const commandParts = inputValue.match(/[^\s"]+|"[^"]*"/g);
		return commandParts.map(str => str.replace(/"/g, ""));
	};

	const getArgsAndFlags = (params) => {
		let args = [];
		let shortFlags = {};
		let longFlags = {};
		let argsLoaded = false;
		let lastFlag = "";
		let lastFlagType = "";

		params.forEach(param => {
			const isFlag = param[0] === "-";

			if (!argsLoaded && !isFlag) {
				args.push(guessType(param));
				return;
			}

			if (isFlag) {
				argsLoaded = true;

				if (param[1] === "-") { // -- flag
					const flag = param.replace(/^--/, "");
					longFlags[flag] = [];
					lastFlag = flag;
					lastFlagType = "long";
					return;
				} else { // -flag
					const shortFlagsGroup = param.replace(/-/, "").split("");
					shortFlagsGroup.forEach((flag) => {
						shortFlags[flag] = [];
					});
					lastFlag = shortFlagsGroup[shortFlagsGroup.length - 1];
					lastFlagType = "short";
				}

			}

			if (argsLoaded && !isFlag) {
				if (lastFlagType === "short") {
					shortFlags[lastFlag].push(guessType(param));
				} else {
					longFlags[lastFlag].push(guessType(param));
				}
			}

		});

		return {args, shortFlags, longFlags};
	};

	const guessType = (str) => {
		if (!config.convertTypes) {
			return str;
		}
		if (str.match(/^[+-]?([0-9]*[.])?[0-9]+$/)) {
			return parseFloat(str);
		}
		if (str.toLowerCase() === "false" || str.toLowerCase() === "true") {
			return str === "true";
		}
		return str;
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

	const checkType = (cmdResultType, cmdResult) => {
		if (!cmdResultType) { //if no type is provided
			if (typeof cmdResult === "string"
				&& cmdResult[0] === "<"
				&& cmdResult[cmdResult.length - 1] === ">") {
				return "html";
			} else {
				return "default";
			}
		} else {
			return cmdResultType;
		}
	};

	const printLine = (txt, type) => {
		let line = document.createElement("pre");
		line.className = `frontconsole-${type ? type : "default"}`;
		(type === "cmd") ? txt = `> ${txt}` : txt; //prepend < sign if printing command
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
