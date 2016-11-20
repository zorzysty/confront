let config = {};

const defaultConfig = {
	shortcutActivator: "ctrl",
	shortcutKeyCode: 192,
	convertTypes: true,
	welcomeMessage: "Welcome to ConFront! Type in 'help' and press enter/return to see available commands",
};

const initConfig = (userConfig) => {
	config = Object.assign(defaultConfig, userConfig);
};

export {config, initConfig};
