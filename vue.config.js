module.exports = {
    devServer: {
        overlay: false,
        proxy: {
            '/rule': {
                target: 'http://localhost:8080/'
            }
        }
    }
}
