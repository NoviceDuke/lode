const Fs = require('fs')
const Path = require('path')
const builder = require('../electron-builder.json')
const notarize = require('electron-notarize')

module.exports = async function (params) {

    // Only notarize the app on macOS and unless it's
    // been explicitly skipped.
    if (params.electronPlatformName !== 'darwin' || process.env.NOTARIZE === 'false') {
        return
    }

    try {
        console.log(`Starting notarization of ${builder.appId}.`)

        await notarize.notarize({
            appBundleId: builder.appId,
            appPath: Path.join(params.appOutDir, `${params.packager.appInfo.productFilename}.app`),
            appleId: 'tbuteler@me.com',
            appleIdPassword: `@keychain:AC_PASSWORD`
        })
    } catch (error) {
        console.error(error)
        process.exit(1)
    }

    console.log(`Finished notarization of ${builder.appId}.`)
}