module.exports = {
	entry: "./src/confront.js",
	output: {
		path: "./dist",
		filename: "confront.js",
		library: "ConFront",
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
