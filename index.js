var resolveAsync = require('resolve-promise-object')

module.exports = function () {
  return function(req, res, next) {
    var render = res.render.bind(res)
    var json = res.json.bind(res)
    var send = res.send.bind(res)

    res.render = function (view, data, callback) {
      data = data || {}
      
      if (arguments.length === 1) {
        return render(view)
      }

      if (arguments.length === 2) {
        if (typeof data === 'function') {
          return render(view, data)
        }

        resolveAsync(data, function (err, result) {
          if (err) return next(err)
          render(view, result)
        })

        return
      }

      resolveAsync(data, function (err, result) {
        if (err) return next(err)
        render(view, result, callback)
      })
    }

    res.json = function (body, status) {
      var args = arguments

      if (args.length === 2 && typeof status !== 'number') {
        status = body
        body = args[1]
      }

      resolveAsync(body, function (err, result) {
        if (err) return next(err)

        if (typeof status !== 'undefined') {
          json(status, result);
        } else {
          json(result);
        }
      })
    }

    res.send = function (body, status) {
      var args = arguments

      if (args.length === 2 && typeof status !== 'number') {
        status = body
        body = args[1]
      }

      if (typeof body === 'object' && ! (body instanceof Buffer)) {
        resolveAsync(body, function (err, result) {
          if (err) return next(err)

          if (typeof status !== 'undefined') {
            send(status, result)
          } else {
            send(result)
          }
        })
      } else {
        if (status) {
          send(status, body)
        } else {
          send(body)
        }
      }
    }

    next()
  }
}
