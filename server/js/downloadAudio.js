const fs = require('fs')
const ytdl = require('ytdl-core')
const path = require('node:path')

function downloadAudio(req, res, next){
  const link = `https://www.youtube.com/watch?v=${req.query.v}`
  console.info(link)
  req.orig_audio = `${req.prefix}.mp4`

  // next()

  stream = ytdl(link, {filter: format => format.itag === 140})
  .pipe(fs.createWriteStream(req.orig_audio))
  stream.on('progress', (chunkLength, downloaded, total) => {
    const percent = downloaded / total;
    console.log('downloading', `${(percent * 100).toFixed(1)}%`);
  });
  stream.on('finish', next)
  console.info('started downloading audio')
  }

module.exports = downloadAudio;