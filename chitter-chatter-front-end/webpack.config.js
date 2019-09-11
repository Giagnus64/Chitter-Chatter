const path = require('path');

module.exports = {
    mode: 'development',
    entry: './src/main.js',
    devServer: {
        contentBase: './dist'
    },
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [
            {
                test: /\.(wav|mp3)$/,
                use: [
                    'file-loader'
                ]
            }
        ]
    }
};