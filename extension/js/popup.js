//TODO hookup checkbox so user can turn off skipping
const skipSilenceUI = document.getElementById("skipSilence");

skipSilenceUI.addEventListener("click", (e) => {
  chrome.storage.local.set({ skipSilence: skipSilenceUI.checked });
});

const tabs = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
const vidid = String(tabs[0].url).split(/\?|\&/g)[1];

const serverURL = "http://localhost:8082/watch?";

const data = await fetch(`${serverURL}${vidid}`);
const json = await data.json();

chrome.storage.local.set({ [`${vidid}`]: json }, async function () {
  console.info("set " + vidid + " to local storage");
});

const silentSeconds = json["silentSeconds"];
const silentUI = document.getElementById("silentSeconds");
silentUI.innerText = `${silentSeconds} seconds of silence detected`;

const totalSeconds = json.cues[json.cues.length - 1];
const percentSilence = ((100 * silentSeconds) / totalSeconds).toFixed(1);
const percentUI = document.getElementById("percentSilence");
percentUI.innerText = `${percentSilence} % silence`;
