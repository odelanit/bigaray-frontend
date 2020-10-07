const withCSS = require('@zeit/next-css')
const { PHASE_DEVELOPMENT_SERVER } = require('next/constants')
const nextOffline = require('next-offline')
const path = require('path')
const withPlugins = require('next-compose-plugins')
const withPWA = require('next-pwa');
const runtimeCaching = require('next-pwa/cache')

module.exports = withPlugins(
    [
        [nextOffline, ['!', PHASE_DEVELOPMENT_SERVER]], [withCSS, withPWA]
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
        pwa: {
            dest: 'public'
        }
        // Other Next.js config here...
    }
)