import {config} from "./config";

let aliases = {};
let storedAliases = JSON.parse(localStorage.getItem("aliases")) || {};

const initAliases = () => {
	aliases = Object.assign(storedAliases, config.aliases);
};

const setAlias = (args, shortFlags, longFlags, inputValue) => {
	if (args.length < 3) {
		throw new Error("to create alias write: \"alias set $<name_of_alias> <command>\"");
	}
	if (args[1][0] !== "$") {
		throw new Error("Alias name must start with dollar sign ($)");
	}
	const aliasName = `${args[1]}`;
	const parts = inputValue.split(" ");
	Object.assign(aliases, {
		[aliasName]: parts.slice(3, parts.length).join(" ")
	});
	localStorage.setItem("aliases", JSON.stringify(aliases));
	return `${aliasName} alias created successfully`;
};

const getAlias = (alias) => {
	return aliases[alias] || alias;
};

const removeAllAliases = () => {
	localStorage.removeItem("aliases");
	aliases = config.aliases;
	return "Locally stored aliases removed successfully";
};

const removeAlias = (args) => {
	const aliasToRemove = args[1];
	if (aliasToRemove[0] !== "$") {
		throw new Error("Alias name must start with dollar sign ($)");
	}
	if (!aliases[aliasToRemove]) {
		throw new Error("This alias doesn't exist");
	}
	if (config.aliases[aliasToRemove]) {
		throw new Error("This is a pre-configured alias and can be removed only in code");
	}

	delete aliases[aliasToRemove];
	localStorage.setItem("aliases", JSON.stringify(aliases));
	return "Alias removed";

};

const listAliases = () => {
	return aliases;
};

const aliasCommand = (args, shortFlags, longFlags, inputValue) => {
	switch (args[0]) {
		case "set": {
			return setAlias(args, shortFlags, longFlags, inputValue);
		}
		case "list": {
			return listAliases();
		}
		case "remove-all": {
			return removeAllAliases();
		}
		case "remove": {
			return removeAlias(args);
		}
		default: {
			throw new Error(`${args[0]} is not proper argument for alias command. See help for more information`);
		}
	}
};

export {initAliases, aliasCommand, getAlias};
