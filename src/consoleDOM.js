import {getTasksNames} from "./tasks";
import {getAlias} from "./aliases";
import {styles} from "./generated/styles";

let consoleDOM = {};

const consoleDOMMethods = {
	createElements: () => {
		consoleDOM.wrapper = document.createElement("div");
		consoleDOM.output = document.createElement("div");
		consoleDOM.input = document.createElement("input");
		consoleDOM.spinner = document.createElement("div");

		consoleDOM.wrapper.className = "confront";
		consoleDOM.output.className = "confront-output";
		consoleDOM.input.className = "confront-input";
		consoleDOM.spinner.className = "confront-spinner";

		consoleDOM.wrapper.appendChild(consoleDOM.output);
		consoleDOM.wrapper.appendChild(consoleDOM.input);
		consoleDOM.wrapper.appendChild(consoleDOM.spinner);

		consoleDOM.input.setAttribute("spellcheck", "false");

		consoleDOM.wrapper.style.display = "none";
		document.body.appendChild(consoleDOM.wrapper);

	},
	styleElements: () => {
		let css = document.createElement("style");
		css.type = "text/css";
		css.innerHTML = styles;
		document.getElementsByTagName("head")[0].appendChild(css);
	},
	clearConsole: () => {
		consoleDOM.output.innerHTML = "";
	},
	toggleDisplay: () => {
		if (consoleDOM.wrapper.style.display === "none") {
			consoleDOM.wrapper.style.display = "block";
			consoleDOMMethods.setFocus();
		} else {
			consoleDOM.wrapper.style.display = "none";
		}
	},
	setFocus: () => {
		consoleDOM.input.focus();
	},
	showSpinner: () => {
		consoleDOM.spinner.style.display = "block";
		consoleDOM.input.style.display = "none";
	},
	hideSpinner: () => {
		consoleDOM.spinner.style.display = "none";
		consoleDOM.input.style.display = "block";
		consoleDOMMethods.setFocus();
	},
	scrollToBottom: () => {
		consoleDOM.wrapper.scrollTop = consoleDOM.wrapper.scrollHeight;
	},
	setInputValue: (value) => {
		consoleDOM.input.value = value;
	},
	clearInput: () => {
		consoleDOM.input.value = "";
	},
	handleResult: (result, resultType) => {
		switch (resultType) {
			case "default": {
				if (typeof result === "object") {
					consoleDOMMethods.printLine(JSON.stringify(result, undefined, 2));
				} else {
					consoleDOMMethods.printLine(result);
				}
				break;
			}
			case "html": {
				consoleDOMMethods.printHTML(result);
				break;
			}
		}
	},
	printLine: (txt, type) => {
		let line = document.createElement("pre");
		line.className = `confront-${type ? type : "default"}`;
		(type === "cmd") ? txt = `> ${txt}` : txt;
		line.innerText = txt;
		consoleDOM.output.appendChild(line);
		consoleDOMMethods.scrollToBottom();
	},
	printHTML: (html) => {
		let lines = document.createElement("div");
		lines.innerHTML = html;
		consoleDOM.output.appendChild(lines);
		consoleDOMMethods.scrollToBottom();
	},
	autoComplete: () => {
		if (consoleDOM.input.value[0] === "$") {
			consoleDOMMethods.setInputValue(getAlias(consoleDOM.input.value));
			return;
		}
		const tasks = getTasksNames();
		const matching = tasks.filter((task) => {
			return task.startsWith(consoleDOM.input.value);
		});
		if (matching.length === 1) {
			consoleDOMMethods.setInputValue(matching[0]);
		} else if (matching.length > 1) {
			consoleDOMMethods.setInputValue(sharedStart(matching));
		}
	},
};

function sharedStart(array) {
	var A = array.concat().sort(),
		a1 = A[0], a2 = A[A.length - 1], L = a1.length, i = 0;
	while (i < L && a1.charAt(i) === a2.charAt(i)) i++;
	return a1.substring(0, i);
}

export {consoleDOM, consoleDOMMethods};
