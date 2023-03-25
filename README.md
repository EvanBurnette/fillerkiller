# FillerKiller

YouTube silence skipper browser extension

## Motivation

[The famous Carykh video on youtube.](https://www.youtube.com/watch?v=DQ8orIurGxw)

Silence in education is not just wasteful, it is also boring. Cutting silence intensifies the learning and makes every lecturer seem as quick witted and engaging as the incomparable Robin Williams.

FillerKiller is not available on the chrome store. [Jump Cutter](https://chrome.google.com/webstore/detail/jump-cutter/lmppdpldfpfdlipofacekcfleacbbncp) a better version of this browser extension.

FillerKiller was my experiment to see if silence skipping could work in the browser, and it does.

## Usage

1. `git clone REPO`

1. `cd REPO`

1. `npm install`

1. Load unpacked extension in browser

1. `cd server`

1. `node server.js`

## How it works

1. The extension requests the video id from the local server.
1. The server uses ytdl to download just the audio. Then FFMPEG to convert this audio to wav.
1. The server detects silence and creates JSON of the sound cues.
1. This is sent back to the extension which injects a content script which skips silence.

## Things are broken

This is a work in progress. Sometimes a page refresh is necessary. Sometimes the server crashes.
