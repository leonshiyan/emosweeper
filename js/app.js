  /*-------------------------------- Constants --------------------------------*/
  const boardSizes = [8,10,12] // 0 easy 1 medium 3 hard
  const mineNums = [10,15,20]
  const bomb = '💣'

  const  EmoGrid = class {
    constructor(value){
      this.value = value // value 1~8 = nearby mine, 9 = mine
      this.revealed = false
      this.flagged = false
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
];
  /*---------------------------- Variables (state) ----------------------------*/
  
  let currentDifficulty = 0
  let playerDifficulty = 0
  let board
  let lose =  false
  
  /*------------------------ Cached Element References ------------------------*/
  const messageEl = document.getElementById('message')
  const boardEl = document.querySelector('.board')
  const resetBtnEl = document.querySelector('.reset-button')
  const difficultiesEl = document.querySelector('.difficulties-button')
  const bombsEl = document.getElementById('bombs')

  //console.log(resetBtnEl)
  /*----------------------------- Event Listeners -----------------------------*/
  boardEl.addEventListener('click',handleClick)
  resetBtnEl.addEventListener('click',init)
  difficultiesEl.addEventListener('click',chooseDifficulty)
  
  /*-------------------------------- Functions --------------------------------*/
  function chooseDifficulty(event){
    console.log()
    if(event.target.id === 'easy'){
      currentDifficulty = 0
    }else if(event.target.id === 'medium'){
      currentDifficulty = 1
    }else if(event.target.id === 'hard'){
      currentDifficulty = 2
    }
    init()
  }


  function init(){
    playerDifficulty = currentDifficulty
    lose = false
    bombsEl.textContent = `Number of bombs ${mineNums[playerDifficulty]}`
    messageEl.textContent='👇Make your first move👇'
    boardInit(boardSizes[playerDifficulty])
    placeMine(playerDifficulty)
    drawBoard()
    render()
    }

  //Create html elements
  function drawBoard(){
    const size = boardSizes[playerDifficulty]
    boardEl.textContent = ''
    boardEl.style.gridTemplateRows = `repeat(${size}, 10vmin)`
    boardEl.style.gridTemplateColumns = `repeat(${size}, 10vmin)`
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
      for (let j = 0; j < board.length ; j++){
        if(board[i,j].value !== 9) moves.push([i,j])
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
    for (let i = 0; i < size; i++) {
      for(let j = 0; j < size; j++) {
        //squareEles[i*size + j].textContent = board[i][j].revealed?board[i][j].value:'😂'
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
        }else squareEles[i*size + j].textContent = '😂'
      }
    }
  }

  function revealAll(){
    const size = boardSizes[playerDifficulty]
    for (let i = 0; i < size; i++) {
      for(let j = 0; j < size; j++) {
        board[i][j].revealed = true
      }
    }
  }
  
  function updateMessage(){
    if(lose == true){
      messageEl.textContent = 'Boom!You lose!'
    }

  }
  
  function handleClick (event){
    let sqIdx 
    let sqId = event.target.getAttribute('id')
    if (sqId != null){
      sqIdx = parseInt(sqId)
    }
    let move = convertId(sqIdx)
    if(!lose)checkTile (move)
    if(lose) revealAll()
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
      lose = true
    }else if (board[r][c].value ===0){
      dfs(r,c)
    }else{
      board[r][c].revealed = true
    }
    //console.log(board[r][c])
  }

  //Recursive function to reveal 0s and adjacent 0s
  function dfs(r,c){
    let nr = board.length
    let nc = board[0].length
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
    let c = id%boardSizes[playerDifficulty]
    return [r,c]
  }

  function checkForWinner(){
  }
  
  function render(){
    updateBoard()
    updateMessage()
  }
  
  /*-------------------------------- Game init --------------------------------*/
  init()
  