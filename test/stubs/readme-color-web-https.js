/* jshint node:true, asi:true, eqnull:true */
'use strict'
var Seneca = require('seneca')
var Fs = require('fs')
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

function color () {
  this.add('color:red', function (args, done) {
    console.log('Connected to client! Color returned:', {hex: '#FF0000'})
    done(null, {hex: '#FF0000'})
  })
}

Seneca()
  .use('../transport')
  .use(color)
  .listen({
    type: 'web',
    port: 8000,
    host: '127.0.0.1',
    protocol: 'https',
    serverOptions: {
      key: Fs.readFileSync('ssl/key.pem', 'utf8'),
      cert: Fs.readFileSync('ssl/cert.pem', 'utf8')
    }
  })
  .ready(function () {
    Seneca()
      .use('../transport')
      .client({
        type: 'http',
        port: 8000,
        host: '127.0.0.1',
        protocol: 'https'
      })
      .act('color:red', function (error, res) {
        if (error) {
          console.log(error)
        }
        console.log('Result from service: ', res)
      })
  })
// node readme-color.js --seneca.log=type:act,regex:color:red
