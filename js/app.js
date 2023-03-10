  /*---------- Constants ----------*/
  import * as sounds from '../js/audios.js'
  const boardSizes = [8,10,12] // 0 easy 1 medium 3 hard
  const mineNums = [10,20,30]
  const bomb = '💣'
  const emoji = '😂'

  const  EmoGrid = class {
    constructor(value){
      this.value = value // value 1~8 = nearby mine, 9 = mine
      this.revealed = false
    }
  }
  let colors = [
    '',
    '#0000FA',
    '#4B802D',
    '#DB1300',
    '#202081',
    '#690400',
    '#457A7A',
    '#1B1B1B',
    '#7A7A7A',
  ]
  /*---------- Variables (state) ----------*/
  
  let currentDifficulty = 0
  let playerDifficulty = 0
  let board
  let gameStop = false
  let win = false
  
  /*---------- Cached Element References ----------*/
  const messageEl = document.getElementById('message')
  const boardEl = document.querySelector('.board')
  const resetBtnEl = document.querySelector('.reset-button')
  const difficultiesEl = document.querySelector('.difficulties-button')
  const bombsEl = document.getElementById('bombs')
  const bgmEl = document.getElementById('myToggle')

  /*---------- Event Listeners ----------*/
  boardEl.addEventListener('click',handleClick)
  boardEl.addEventListener('mouseover',handleMouseOver)
  boardEl.addEventListener('mouseout',handleMouseOut)
  resetBtnEl.addEventListener('click',handleReset)
  difficultiesEl.addEventListener('click',chooseDifficulty)
  bgmEl.addEventListener('click',handleBgm)

  /*---------- Functions ----------*/
  function init(){
    playerDifficulty = currentDifficulty
    gameStop = false
    win = false
    bombsEl.textContent = `Number of bombs ${mineNums[playerDifficulty]}`
    messageEl.textContent = '👇Make your first move👇'
    boardInit(boardSizes[playerDifficulty])
    placeMine(playerDifficulty)
    drawBoard()
    render()
  }
  function handleMouseOver(event){
    if(event.target.id){
      sounds.playPop()
    }
  }
  function handleMouseOut(event){
    if(event.target.id){
      sounds.stopPop()
    }
  }
  //Create html elements
  function drawBoard(){
    const size = boardSizes[playerDifficulty]
    boardEl.textContent = ''
    boardEl.style.gridTemplateRows = ` repeat(${size},2.6vmax)`
    boardEl.style.gridTemplateColumns = ` repeat(${size}, 2.6vmax)`
    //Use loop to add div into boardEl with ids(0~?)
    for(let i = 0; i < size*size; i++){
      let gridDiv = document.createElement(`div`)
      gridDiv.setAttribute("class",'sqr')
      gridDiv.setAttribute("id",i)
      boardEl.append(gridDiv)
    }
  }

  function boardInit(boardSize){
    board = new Array(boardSize)
    //create board with boardSize
    for(let i = 0; i < boardSize;i++){
      board[i] = new Array(boardSize)
      for(let j = 0; j < boardSize;j++){
        board[i][j] = new EmoGrid(0)
      }
    }
  }
  function chooseDifficulty(event){
    sounds.playClick()
    if(event.target.id === 'easy'){
      currentDifficulty = 0
    }else if(event.target.id === 'medium'){
      currentDifficulty = 1
    }else if(event.target.id === 'hard'){
      currentDifficulty = 2
    }
    init()
  }
  //Each mine has row and colum number stored as [r,c]
  //[r,c] will be determined by a function
  //After mine is set, call mineNumIndicator function
  function placeMine(playerChoice){
    let mineNum = mineNums[playerChoice]
    for(let idx = mineNum ; idx > 0 ; idx--){
      let mine = chooseEmptySpot()
      board[mine[0]][mine[1]].value = 9
      mineNumIndicator(mine[0],mine[1])
    }
  }
  
  //Increase surrounding value by 1 as a mine set
  //Surrouding will be up down left right upleft upright downleft downright
  //If there is mine already in place, do nothing
  function mineNumIndicator(r,c){
    if(isValidMove(r-1,c)) board[r-1][c].value++
    if(isValidMove(r-1,c+1)) board[r-1][c+1].value++
    if(isValidMove(r-1,c-1)) board[r-1][c-1].value++
    if(isValidMove(r,c+1)) board[r][c+1].value++
    if(isValidMove(r,c-1)) board[r][c-1].value++
    if(isValidMove(r+1,c)) board[r+1][c].value++
    if(isValidMove(r+1,c+1)) board[r+1][c+1].value++
    if(isValidMove(r+1,c-1)) board[r+1][c-1].value++
  }
  //Check if the move is valid
  function isValidMove(r,c){
    if(r < 0 || c < 0) return false
    if(r >= board.length || c >= board.length ) return false
    if(board[r][c].value === 9) return false
    return true
  }
  //Choose an empty spot to move
  function chooseEmptySpot(){
    let moves = []
    let size = boardSizes[playerDifficulty]
    for(let i = 0; i < size ; i++) {
      for (let j = 0; j < size ; j++){
        if(board[i][j].value !== 9){
          moves.push([i,j])
        } 
      }
    }
    //Select a move
    let move = moves[Math.floor(Math.random() * moves.length)]
    return move
  }
  //Update board depending on the state of board[][]
  function updateBoard(){
    const squareEles = document.querySelectorAll('.sqr')
    const size = boardSizes[playerDifficulty]
    for(let i = 0; i < size; i++) {
      for(let j = 0; j < size; j++) {
        if(board[i][j].revealed){
          if(board[i][j].value === 0){
            squareEles[i*size + j].textContent = ''
          }else if(board[i][j].value === 9){
            squareEles[i*size + j].textContent = bomb
          }
          else{
            squareEles[i*size + j].textContent = board[i][j].value
            squareEles[i*size + j].style.color = colors[board[i][j].value]
          }
        }else squareEles[i*size + j].textContent = emoji
      }
    }
  }

  function revealAll(){
    const size = boardSizes[playerDifficulty]
    for(let i = 0; i < size; i++) {
      for(let j = 0; j < size; j++) {
        board[i][j].revealed = true
      }
    }
    render()
  }

  //Display message depending on win and stop condition
  function updateMessage(){
    if(gameStop){
      if(win){
        sounds.playWin()
        messageEl.textContent = 'You find all the bombs!'
        gameStop = true
      }else {
        sounds.playBoom()
        messageEl.textContent = 'Boom!You lose!'
      }
    }
  }
  
  function handleClick (event){
    sounds.playClick()
    let sqIdx 
    let sqId = event.target.getAttribute('id')
    if (sqId != null){
      sqIdx = parseInt(sqId)
    }
    let move = convertId(sqIdx)
    if(!gameStop) checkTile (move)
    checkForWinner()
    render()
  }
  
  // Check tile clicked
  // 9 = dead
  // 0 reveal nearby
  // Other value reveal current
  function checkTile (move){
    let r = move[0]
    let c = move[1]
    if(board[r][c].value === 9){
      board[r][c].revealed = true
      gameStop = true
    }else if (board[r][c].value ===0){
      dfs(r,c)
    }else{
      board[r][c].revealed = true
    }
  }

  //Recursive function to reveal 0s and adjacent 0s
  function dfs(r,c){
    if(!isValidMove(r,c) || board[r][c].revealed) {
      return
    }
    else if(board[r][c].value !== 0){
      board[r][c].revealed = true
      return
    }else{
      board[r][c].revealed = true
      dfs(r - 1, c)
      dfs(r + 1, c)
      dfs(r, c - 1)
      dfs(r, c + 1)
    }   
  }
  //Convert id to corresponding r,c location of board
  function convertId(id){
    let r = parseInt(id/boardSizes[playerDifficulty])
    let c = parseInt(id%boardSizes[playerDifficulty])
    return [r,c]
  }
  //Check for winner
  //Winning condition: all tiles revealed and no bomb triggered
  function checkForWinner(){
    if(gameStop) {
      revealAll()
      return
    }
    const size = boardSizes[playerDifficulty]
    for(let i = 0; i < size; i++) {
      for(let j = 0; j < size; j++) {
        if(board[i][j].value != 9 && board[i][j].revealed == false){
          win =false
          return
        }
      }
    }
    win = true
    gameStop = true
  }
  
  function render(){
    updateBoard()
    updateMessage()
  }
  function handleBgm(){
    sounds.toggleBGM()
  }
  function handleReset(){
    sounds.playRewind()
    init()
  }
  /*---------- Function for devtool ----------*/
  window.revealAll = revealAll
  /*---------- Game init ----------*/
  init()
  