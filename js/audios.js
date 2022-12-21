let bgm = new Audio('../assets/Day-Dreams.mp3')

function toggleBGM() {
  bgm.volume = 0.25
  bgm.loop = true
  if(bgm.paused) {
    bgm.play();
  } else {
    bgm.pause();
  }
}

export {
  toggleBGM
}