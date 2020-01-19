const path = require('path');

module.exports = {
    publicPath: './',
    assetsDir: 'static',
    indexPath: path.resolve(__dirname, '../url-tracking-master/templates/' + '/index.html'),
    outputDir: path.resolve(__dirname, '../url-tracking-master/static/'),

    lintOnSave: false,
    devServer: {
        proxy: {
            '/v1': {
                target: 'http://127.0.0.1:5000',
                changeOrigin: true,
                ws: true
            }
        }
    }
}