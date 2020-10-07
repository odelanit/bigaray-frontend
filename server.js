const express = require('express')
const next = require('next')

const port = parseInt(process.env.PORT, 10) || 3009
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()
const compression = require('compression')
// const apicache = require('apicache')
const { parse } = require('url')
const { join } = require('path')

app.prepare().then(() => {
    const server = express()
    // let cache = apicache.middleware
    // server.use(cache('1 hour'))
    server.use(compression())

    server.get(['/manifest.json',
        '/sitemap.xml',
        '/favicon.ico',
        '/robots.txt',
        '/browserconfig.xml',
        '/site.webmanifest'], (req, res) => {
        return handle(req, res)
    })

    server.get('/new-arrivals', (req, res) => {
        return app.render(req, res, '/new-arrivals', {})
    })

    server.get('/sale', (req, res) => {
        return app.render(req, res, '/sale', {})
    })

    server.get('/brand/:name', (req, res) => {
        return app.render(req, res, '/brand', { name: req.params.name })
    })

    server.get('/my-brands', (req, res) => {
        return app.render(req, res, '/my-brands', {})
    })

    server.get('/contact', (req, res) => {
        return app.render(req, res, '/contact', {})
    })

    server.get('/service-worker.js', (req, res) => {
        const filePath = join(__dirname, '.next/service-worker.js')
        console.log(19, filePath)
        // return app.serveStatic(req, res, filePath)
        res.sendFile(filePath);
    })

    server.get('/my-profile', (req, res) => {
        return app.render(req, res, '/my-profile', {})
    })
    server.get('/login', (req, res) => {
        return app.render(req, res, '/login', {})
    })

    server.get('/:username', (req, res) => {
        return app.render(req, res, '/profile', { username: req.params.username })
    })

    server.get('/:username/brands', (req, res) => {
        return app.render(req, res, '/profile-brands', { username: req.params.username })
    })


    server.get('*', (req, res) => {
        return handle(req, res)
    })

    server.listen(port, err => {
        if (err) throw err
        console.log(`> Ready on http://localhost:${port}`)
    })
})