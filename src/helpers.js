const guessType = (str, convertTypes) => {
	if (!convertTypes) {
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

const getArgsAndFlags = (params, convertTypes) => {
	let args = [];
	let shortFlags = {};
	let longFlags = {};
	let argsLoaded = false;
	let lastFlag = "";
	let lastFlagType = "";

	params.forEach(param => {
		const isFlag = param[0] === "-";

		if (!argsLoaded && !isFlag) {
			args.push(guessType(param, convertTypes));
			return;
		}

		if (isFlag) {
			argsLoaded = true;

			if (param[1] === "-") {
				const flag = param.replace(/^--/, "");
				longFlags[flag] = [];
				lastFlag = flag;
				lastFlagType = "long";
				return;
			} else {
				const shortFlagsGroup = param.replace(/^-/, "").split("");
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

const checkType = (cmdResultType, cmdResult) => {
	if (!cmdResultType) {
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

const extractCommandParts = (inputValue) => {
	const commandParts = inputValue.match(/[^\s"]+|"[^"]*"/g);
	return commandParts.map(str => str.replace(/"/g, ""));
};

export {getArgsAndFlags, checkType, extractCommandParts};
