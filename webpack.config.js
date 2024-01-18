const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: './content.js',  // Your main script
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource'
            }
        ]
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                { from: './manifest.json', to: 'manifest.json' },
                { from: './popup.html', to: 'popup.html' },
                { from: './icons', to: 'icons' },
                { from: './styles', to: 'styles'}
            ],
        }),
    ],
    mode: 'development'  // or 'production'
};
