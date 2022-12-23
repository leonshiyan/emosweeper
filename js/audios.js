let bgm = new Audio('../assets/external.mp3')
let clickAudio = new Audio('../assets/click.wav')
let boomAudio = new Audio('../assets/boom.wav')
let rewindAudio = new Audio('../assets/rewind.wav')
let popAudio = new Audio('../assets/pop.wav')
let winAudio = new Audio('../assets/win.wav')
function toggleBGM() {
  bgm.volume = 0.30
  bgm.loop = true
  if(bgm.paused) {
    bgm.play()
  } else {
    bgm.pause()
  }
}
function playRewind(){
  rewindAudio.volume = 0.25
  rewindAudio.play()
}
function playClick(){
  clickAudio.volume = 0.70
  clickAudio.play()
}
function playBoom(){
  boomAudio.volume = 0.50
  boomAudio.play()
}
function playPop(){
  popAudio.volume = 0.30
  popAudio.play()
}
function stopPop(){
  popAudio.pause()
  popAudio.currentTime = 0;
}
function playWin(){
  winAudio.play()
}
export {
  toggleBGM,
  playClick,
  playBoom,
  playRewind,
  playPop,
  stopPop,
  playWin
}