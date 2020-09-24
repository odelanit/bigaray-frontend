const withCSS = require('@zeit/next-css')
const { PHASE_DEVELOPMENT_SERVER } = require('next/constants')
const nextOffline = require('next-offline')
const path = require('path')
const withPlugins = require('next-compose-plugins')

module.exports = withPlugins(
    [
        [nextOffline, ['!', PHASE_DEVELOPMENT_SERVER]], [withCSS]
    ],
    {
        webpack: config => {
            config.resolve.modules = [
                path.resolve('./src'),
                path.resolve('./public'),
                'node_modules'
            ]
            return config
        },
        // Other Next.js config here...
    }
)