let bgm = new Audio('../assets/Day-Dreams.mp3')

function playBGM() {
  bgm.volume = 0.25
  bgm.play()
}

export {
  playBGM
}