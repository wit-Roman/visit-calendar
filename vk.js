const express = require('express')
const next = require('next')
const cookieParser = require('cookie-parser')

const port = parseInt(process.env.PORT, 10) || 4003
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.nextConfig.poweredByHeader = false

app.prepare().then(() => {
  const server = express()
  server.disable('x-powered-by')

  server.use(cookieParser("parsersecret"))
  server.use('/', require('./routes/send.js') )

  server.use( '/', (req, res, next) => {
    if (req.originalUrl && req.originalUrl.split("/").pop() === 'favicon.ico')
      return res.sendStatus(204);
    next()
  })

  server.get('/settings/', (req, res) => {
    //require('./model/static-methods.js').validateHmac()
    return app.render(req, res, '/settings', req.query)
  })

  server.get('/welcome/', (req, res) => {
    return app.render(req, res, '/welcome', req.query)
  })

  server.get('*', (req, res) => handle(req, res))

  server.listen(port, (err) => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${port}`)
  })
})

module.exports = app