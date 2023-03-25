const {resolve} = require('path')
const shell = require('any-shell-escape')
const {exec} = require('child_process')
const ffmpegPath = require('ffmpeg-static')
// const { fstat } = require('fs')
const fs = require('node:fs')

function toWav(req, res, next){
  console.info("converting to wav")
  req.wav_audio = req.prefix + '.wav'
  const makeWav = shell([
    ffmpegPath,
    '-i', resolve(process.cwd(), req.orig_audio),
    '-c:a', 'pcm_u8',
    '-ac', 1,
    // '-af', "highpass=f=100",
    '-ar', 32000,
    resolve(process.cwd(), req.wav_audio)
  ])
  exec(makeWav, (err) => {
    if (err) {
      console.error(err)
      process.exit(1)
    } else {
      console.info('done converting to wav')
      fs.unlink(req.orig_audio, next)
    }
  })
}

// test
// toWav({filename: "yt_o7h_sYMk_oc.mp4"})

module.exports = toWav
