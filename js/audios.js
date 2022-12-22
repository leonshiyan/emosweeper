let bgm = new Audio('../assets/external.mp3')

function toggleBGM() {
  bgm.volume = 0.50
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