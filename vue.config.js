module.exports = {
    publicPath: './',
    productionSourceMap: false,
    devServer: {
        overlay: false,
        proxy: {
            '/rule': {
                target: 'http://localhost:8080/'
            }
        }
    }
}
