  /*-------------------------------- Constants --------------------------------*/
  const boardSizes = [8,10,12] // 0 easy 1 medium 3 hard
  const mineNums = [10,30,40]

  class EmoGrid {
    constructor(){
    this.value = 0 // value 1~8 = nearby mine, 9 = mine
    this.revealed = false
    this.flagged = false
    }
  }
  
  
  /*---------------------------- Variables (state) ----------------------------*/
  
  let defaultDifficulty = 0
  let board
  
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
    let playerDifficulty = defaultDifficulty
    boardInit(boardSizes[playerDifficulty])
    placeMine(playerDifficulty)
  }

  function boardInit(boardSize){
    board = new Array(boardSize)
    //create board with boardSize
    for(let i = 0; i < boardSize;i++){
      board[i] = new Array(boardSize)
      for(let j = 0; j < boardSize;j++){
        board[i][j] = new EmoGrid()
      }
    //console.log(board)
  }
}

  function placeMine(playerChoice){
    let mineNum = mineNums[playerChoice]
    for(let idx = mineNum ; idx > 0 ; idx--){
      let move = chooseEmptySpot()
      board[move[0]][move[1]].value = 9
      console.log(move , idx,board[move[0]][move[1]])
    }
    console.log(board)
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
    for (let i = 0; i < board.length; i++) {
      if(board[i]=== 1){
        squareEles[i].textContent = 'X'
      }else if(board[i] === -1){
        squareEles[i].textContent = 'O'
      }else{
        squareEles[i].textContent = ''
      }
    }
  }
  
  function updateMessage(){
    const playerMsg = turn == 1? 'X':'O'
    if(!winner && !tie){
      messageEl.textContent = `It is player ${playerMsg} turn!`
    }else if(!winner && tie){
      messageEl.textContent = `It is a tie game!`
    }else {
      messageEl.textContent = `Congratulations, player ${playerMsg} wins!`
      messageEl.classList.add('animate__animated','animate__flip')
    }
  }
  
  function handleClick (event){
    let sqIdx 
    let sqId = event.target.getAttribute('id')
    if (sqId != null){
      sqIdx = parseInt(sqId.slice(2))
    }
    if (board[sqIdx] || winner){
      boardAnimation(event)
      return
    }
    playerMove(sqIdx)
    setTimeout(() => {
      computerMove()
    }, 300)
    
  }
 
  
  function playerMove(sqIdx){
    placePiece(sqIdx)
    checkForTie()
    checkForWinner()
    switchPlayerTurn()
    render()
  }
  
  function boardAnimation(event){
    boardEl.classList.add('animate__animated','animate__headShake')
  }
  function handleAnimationEnd(event){
    event.stopPropagation();
    boardEl.classList.remove('animate__animated','animate__headShake');
    console.log('animation ended')
  }
  function placePiece(idx){
    board[idx] = turn
  }
  
  function checkForTie(){
    if(!board.includes(null)) tie = true
  }
  
  function checkForWinner(){
    let result
    for(combo of winningCombos){
      result = Math.abs(board[combo[0]] + board[combo[1]] + board[combo[2]])
      if (result === 3){
        winner = true
        return
      }
    }
  }
  
  function switchPlayerTurn(){
    if(winner){
      return
    }else{
      turn *= -1
    }
  }
  
  
  
  function render(){
    updateBoard()
    updateMessage()
  }
  
  /*-------------------------------- Game init --------------------------------*/
  init()
  