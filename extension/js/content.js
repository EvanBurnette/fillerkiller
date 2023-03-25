let sounds

document.addEventListener('readystatechange', async (event) => {
  if (event.target.readyState == 'complete') {
    const vidid = document.baseURI.split(/[\?|\&]/g)[1]
    // console.info("vidid", vidid)
    const video = document.getElementsByTagName('video')[0]
    const soundsJSON = await chrome.storage.local.get([`${vidid}`])
    if (soundsJSON == null) {
      console.error("data not available")
      return
    }
    sounds = soundsJSON[vidid].cues
    console.info(sounds)
    function insertPosition(nums, target) {
      let low, high, mid;
      low = 0
      high = nums.length - 1
      while (low <= high) {
          mid = Math.floor((low+high) / 2);
          if (target < nums[mid])
              high = mid - 1
          else if (target > nums[mid])
              low=mid + 1
          else //found match
              return mid
      }
      return nums[mid] < target ? mid - 1 : mid
    }
    let interval
    let i = 0
    let savings = 0
    function skip() {
      //TODO: add fast path for i already right
        //find current time insert point in array
        i = insertPosition(sounds, video.currentTime)
        // console.info(i)
        //if current time is in a non-sounded section
          //skip to next sounded section
        // if (((i % 2) == 0) && Math.abs(video.currentTime - sounds[i]) > .250) {
        if (((i % 2) == 0) && (sounds[i] - video.currentTime) > .150) {
          let saved = sounds[i] - video.currentTime - 0.070
          savings += saved
          video.currentTime = sounds[i] - 0.070
          clearInterval(interval)
          console.info(`just skipped ${parseFloat(saved.toFixed(2))} seconds of silence`)
        }
    }
    video.addEventListener('playing', (event) => {
      interval = setInterval(skip, 10)
    })
    video.addEventListener('pause', (event) => {
      console.info(`saved ${parseFloat(savings.toFixed(2))} seconds total`)
      clearInterval(interval)
    })
    chrome.storage.onChanged.addListener(async function (changes, namespace) {
      console.info('namespace', namespace)
      console.info('changes', changes)
      soundsJSON = await chrome.storage.local.get([`${vidid}`])
      sounds = soundsJSON.cues
    })
  }
})