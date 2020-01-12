var path = require('path');
module.exports = {
    publicPath: './',
    assetsDir: 'static',
    indexPath: path.resolve(__dirname, '../url-tracking-center/templates/' + '/index.html'),
    outputDir: path.resolve(__dirname, '../url-tracking-center/static/'),

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