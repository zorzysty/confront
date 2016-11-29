const defaultTranslation = {
	"desc.clear": "Clears console",
	"desc.clearHistory": "Clears history",
	"desc.help": "This help",
	"desc.alias": "Allows to set aliases for frequently used commands and expand them with TAB. Available arguments are: set, remove, remove-all, list",
	"err.cmdNotFound": "Command not found",
	"historyCleared": "History cleared",
};

let translation = {};

const initTranslation = (userTranslation) => {
	translation = Object.assign(defaultTranslation, userTranslation);
};

export {translation, initTranslation};
