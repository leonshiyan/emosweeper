  /*-------------------------------- Constants --------------------------------*/
  const boardSizes = [8,10,12] // 0 easy 1 medium 3 hard
  const mineNums = [10,30,40]

  const  EmoGrid = class {
    constructor(value){
      this.value = value // value 1~8 = nearby mine, 9 = mine
      this.revealed = false
      this.flagged = false
    }
}
  
  /*---------------------------- Variables (state) ----------------------------*/
  
  let defaultDifficulty = 0
  let playerDifficulty = 0
  let board
  let lose =  false
  
  /*------------------------ Cached Element References ------------------------*/
  const squareEles = document.querySelectorAll('.sqr')
  const messageEl = document.getElementById('message')
  const boardEl = document.querySelector('.board')
  const resetBtnEl = document.querySelector('.reset-button')
  //console.log(resetBtnEl)
  /*----------------------------- Event Listeners -----------------------------*/
  boardEl.addEventListener('click',handleClick)
  resetBtnEl.addEventListener('click',init)
  
  /*-------------------------------- Functions --------------------------------*/
  
  function init(){
    playerDifficulty = defaultDifficulty
    boardInit(boardSizes[playerDifficulty])
    placeMine(playerDifficulty)
    drawBoard()
  }
  //Create html elements
  function drawBoard(){
    const size = boardSizes[playerDifficulty]
    boardEl.style.gridTemplateRows = `repeat(${size}, 8vmin)`
    boardEl.style.gridTemplateColumns = `repeat(${size}, 8vmin)`
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
  
  function isValidMove(r,c){
    if(r < 0 || c < 0) return false
    if(r >= board.length || c >= board.length ) return false
    if(board[r][c].value === 9) return false
    return true
  }

  function chooseEmptySpot(){
    let moves = []
    for (let i = 0; i < board.length ; i++) {
      for (let j = 0; j < board.length ; j++)
      if(board[i,j].value !== 9) moves.push([i,j])
    }
    //Select a move
    let move = moves[Math.floor(Math.random() * moves.length)]
    return move
  }
  
  function updateBoard(){

  }
  
  function updateMessage(){

  }
  
  function handleClick (event){
    let sqIdx 
    let sqId = event.target.getAttribute('id')
    if (sqId != null){
      sqIdx = parseInt(sqId)
    }
    let move = convertId(sqIdx)
    console.log(move)
    render()
  }
  //Convert id to corresponding r,c location of board
  function convertId(id){
    let r = parseInt(id/boardSizes[playerDifficulty])
    let c = id%boardSizes[playerDifficulty]
    return [r,c]
  }
  function handleAnimationEnd(event){
    event.stopPropagation();
    boardEl.classList.remove('animate__animated','animate__headShake');
    console.log('animation ended')
  }
  function checkForWinner(){
  }
  
  function render(){
    updateBoard()
    updateMessage()
  }
  
  /*-------------------------------- Game init --------------------------------*/
  init()
  