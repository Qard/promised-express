var request = require('supertest')
var express = require('express')
var middleware = require('..')
var Q = require('q')

function after (t, fn) {
  return function () {
    t-- && t == 0 && fn()
  }
}

describe('res.json', function () {
  var app

  beforeEach(function () {
    app = express()
    app.use(middleware())
  })

  it('should resolve all promises, if successful', function (done) {
    app.use(function (req, res) {
      var p1 = Q.defer()
      var p2 = Q.defer()

      res.json({
        foo: p1.promise
      })

      p1.resolve({
        bar: p2.promise
      })

      p2.resolve('baz')
    })

    request(app)
      .get('')
      .expect(200)
      .expect({ foo: { bar: 'baz' } })
      .end(done)
  })

  it('should reach error handler, if failed', function (done) {
    var error = new Error('just because')

    app.use(function (req, res) {
      var p = Q.defer()

      res.json({
        foo: p.promise
      })

      p.reject(error)
    })

    app.use(function (err, req, res, next) {
      res.json({ error: err.message }, 500)
    })

    request(app)
      .get('')
      .expect(500)
      .expect({ error: error.message })
      .end(done)
  })
  
})

describe('res.render', function () {
  var app

  beforeEach(function () {
    app = express()
    app.set('views', __dirname)
    app.set('view engine', 'jade')
    app.use(middleware())
  })

  it('should resolve all promises, if successful', function (done) {
    app.use(function (req, res) {
      var p = Q.defer()

      res.render('test', {
        name: p.promise
      })

      p.resolve('World')
    })

    request(app)
      .get('')
      .expect(200)
      .expect('<h1>Hello, World!</h1>')
      .end(done)
  })

  it('should reach error handler, if failed', function (done) {
    var error = new Error('just because')

    app.use(function (req, res) {
      var p = Q.defer()

      res.render('test', {
        name: p.promise
      })

      p.reject(error)
    })

    app.use(function (err, req, res, next) {
      res.json({ error: err.message }, 500)
    })

    request(app)
      .get('')
      .expect(500)
      .expect({ error: error.message })
      .end(done)
  })

  it('should run callback', function (done) {
    var reallyDone = Q.defer()
    reallyDone.promise.then(done).fail(done)

    app.use(function (req, res) {
      var p = Q.defer()

      res.render('test', {
        name: p.promise
      }, function (err) {
        err ? reallyDone.reject(err) : reallyDone.resolve()
      })

      p.resolve('World')
    })

    request(app)
      .get('')
      .expect(200)
      .expect('<h1>Hello, World!</h1>')
      .end(function (err) {
        err ? reallyDone.reject(err) : reallyDone.resolve()
      })
  })
  
})

describe('res.send', function () {
  var app

  beforeEach(function () {
    app = express()
    app.use(middleware())
  })

  it('should resolve all promises, if successful', function (done) {
    app.use(function (req, res) {
      var p1 = Q.defer()
      var p2 = Q.defer()

      res.send(p1.promise)
      
      p1.resolve(p2.promise)
      p2.resolve('foo')
    })

    request(app)
      .get('')
      .expect(200)
      .expect('foo')
      .end(done)
  })

  it('should reach error handler, if failed', function (done) {
    var error = new Error('just because')

    app.use(function (req, res) {
      var p = Q.defer()
      res.send(p.promise)
      p.reject(error)
    })

    app.use(function (err, req, res, next) {
      res.json({ error: err.message }, 500)
    })

    request(app)
      .get('')
      .expect(500)
      .expect({ error: error.message })
      .end(done)
  })
  
})
