module.exports = {
    assetsDir: '../static',
    outputDir: '../templates',

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