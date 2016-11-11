const defaultConfig = {
	shortcutActivator: "ctrl",
	shortcutKeyCode: 192,
	convertTypes: true,
};

let config = {};

const getConfig = (userConfig) => {
	config = Object.assign(defaultConfig, userConfig);
};

export {config, getConfig};
