module.exports = {
	entry: "./src/frontconsole.js",
	output: {
		path: "./dist",
		filename: "frontconsole.js",
		library: "FrontConsole",
		libraryTarget: "umd",
		umdNamedDefine: true
	},
	devtool: "source-map",
	module: {
		loaders: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: "babel-loader",
			}
		]
	}
};
