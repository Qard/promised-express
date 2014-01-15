# promised-express
[![Build Status](https://travis-ci.org/Qard/promised-express.png)](https://travis-ci.org/Qard/promised-express)

Use [resolve-promise-object](https://github.com/Qard/resolve-promise-object) on any input to res.json(), res.render(), and res.send() to allow promises to be used in place of their response values. It does handy things like finding all promises in a deep tree structure and recursing into nested promises.

## Install

    npm install promised-express

## Usage
    
    app.use(promisedExpress())

    app.get('/', function (req, res) {
      res.render('home', {
        user: User.find({ _id: req.session.userId })
      })
    })

---

### Copyright (c) 2013 Stephen Belanger
#### Licensed under MIT License

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
