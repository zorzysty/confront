let consoleDOM = {};

const consoleDOMMethods = {
	createElements: () => {
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
	}
};

export {consoleDOM, consoleDOMMethods};
