const { app, project } = require('../../configs/config')

function getPostIdFromUrl() {
    const currentUrl = document.location.href

    const devideArray = currentUrl.split('/')
    const id = devideArray[devideArray.length - 1]
    return id
}

function getPreviewUrl(postId) {
    const currentEnv = app.currentEnv || 'dev'
    const previewUrl = generatePreviewUrl(postId, currentEnv)
    console.log(previewUrl)
    // return previewUrl
    return `https://dev.mnews.tw/`
}

function generatePreviewUrl(postId, currentEnv) {
    switch (currentEnv) {
        case 'local':
            return `local preview url for post id: ${postId}`

        case 'dev':
            return `dev preview url for post id: ${postId}`

        case 'stag':
            return `stag preview url for post id: ${postId}`

        case 'prod':
            return `prod preview url for post id: ${postId}`

        default:
            return `dev preview url for post id: ${postId}`
    }
}

module.exports = { getPostIdFromUrl, getPreviewUrl }