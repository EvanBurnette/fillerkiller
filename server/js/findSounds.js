// const WaveFile = require('wavefile').WaveFile;
const fs = require('fs')
const _ = require('lodash')

const findSounds = (req, res, next) => {
    console.info("finding sounds")
    f = fs.readFileSync(req.wav_audio)
    const momentOfSilence = .300 //seconds
    const sampleRate = 32000
    const samplesPerMoment = momentOfSilence * sampleRate
    const samples = f.slice(78) //start byte of data in wavefile when made with FFMPEG TODO:read data position from wav header

    let silentCount = samplesPerMoment
    let soundCues = []
    let silentCues = []

    for (i = 0; i < samples.length; i += 1){
        //if silent
        if (samples[i] == 128
            || Math.abs(samples[i] - 128) < 5)
            {
            silentCount += 1
            if (silentCount === samplesPerMoment) {
                silentCues.push(i - silentCount)
            }
        }
        else { //if not silent
            if (silentCount >= samplesPerMoment) {
                soundCues.push(i)
            }
            silentCount = 0
        }
    }
    silentCues.push(samples.length - 1)

    let sounds = soundCues.map((sound, i) => {
        return [sound / sampleRate, silentCues[i] / sampleRate]
    })
    const soundedSeconds = sounds.reduce((accum, current) => {
        return accum + current[1] - current[0]
    }, 0)

    const silentSeconds = sounds[sounds.length - 1][1] - soundedSeconds

    sounds = {
        cues: _.flatten(sounds).map(n => parseFloat(n.toFixed(2))),
        date: new Date().getTime(),
        silentSeconds: parseFloat(silentSeconds.toFixed(2))
    }

    const jsondata = JSON.stringify(sounds)
    fs.writeFile(req.prefix + '.json', jsondata, ()=>res.json(sounds))
    console.info(`sent ${req.prefix}.json`)
    fs.unlinkSync(req.wav_audio)
}

module.exports = findSounds
