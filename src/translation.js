const defaultTranslation = {
	"desc.clear": "Clears console",
	"desc.clearHistory": "Clears history",
	"desc.help": "This help",
	"err.cmdNotFound": "Command not found",
	"historyCleared": "History cleared",
};

let translation = {};

const initTranslation = (userTranslation) => {
	translation = Object.assign(defaultTranslation, userTranslation);
};

export {translation, initTranslation};
