let config = {};

const defaultConfig = {
	shortcutActivator: "ctrl",
	shortcutKeyCode: 192,
	convertTypes: true,
};

const initConfig = (userConfig) => {
	config = Object.assign(defaultConfig, userConfig);
};

export {config, initConfig};
