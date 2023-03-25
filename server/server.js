const express = require('express')
const app = express()
const fs = require('node:fs')
// const fsPromises = require('node:fs/promises')
const path = require('node:path')

const findSounds = require(path.join(__dirname, 'js/findSounds.js'))
const downloadAudio = require(path.join(__dirname,  'js/downloadAudio.js'))
const toWav = require(path.join(__dirname, 'js/toWav.js'))

app.get('/watch', getFile,
 downloadAudio, toWav,
 findSounds, (req, res) => {
  res.send(req.sounds)
})

app.listen(8082, () => console.log(__dirname , 'http://localhost:8082/'))

function getFile(req, res, next){
  let vidurl = req.query.v
  //TODO gzip all files to save data and time using res.set ?
  req.prefix = path.join(__dirname, 'json', `v=${vidurl}`)
  fs.access(req.prefix + '.json', fs.F_OK, (err) => {
    if (err) {
      next()
    } else {
      res.sendFile(req.prefix + '.json')
      console.info(`sent ${req.prefix}.json`)
    }
  })
}