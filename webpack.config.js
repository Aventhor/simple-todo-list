const path = require("path");
const webpack = require("webpack");
const HtmlWebPackPlugin = require("html-webpack-plugin");

const htmlPlugin = new HtmlWebPackPlugin({
    template: "./public/index.html",
});

module.exports = {
    entry: "./src/index.tsx",
    devServer: {
        port: 8000,
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".json"],
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "bundle.js",
    },

    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/,
                loader: "awesome-typescript-loader",
                exclude: /node_modules/,
            },
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            },
        ],
    },
    plugins: [htmlPlugin],
};
