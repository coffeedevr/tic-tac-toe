// node selectors
const currentTurnDisplay = document.querySelector('#current-turn')
const currentTurnText = document.querySelector('.current-turn-text')
const updateVisibility = document.querySelectorAll('.hidden')
const startGameBtn = document.querySelector('#startgame')
const inputone = document.querySelector('#player-one')
const inputtwo = document.querySelector('#player-two')
const formcontainer = document.querySelector('.selection-container')
const footertext = document.getElementById('footertext')

let playerOneName = ''
let playerTwoName = ''

const date = new Date()
const year = date.getFullYear()
footertext.textContent = '© ' + year + footertext.textContent

// gameboard module: tracks turn, board and validates pieces
const gameBoard = (() => {
  const turn = 0
  const board = ['', '', '', '', '', '', '', '', '']
  const checkBoard = () => {
    // check rows
    const rows = () => {
      const result = ['', '', '']

      for (let i = 1; i <= 3; i++) {
        result[0] += board[i - 1]
      }
      for (let i = 4; i <= 6; i++) {
        result[1] += board[i - 1]
      }
      for (let i = 7; i <= 9; i++) {
        result[2] += board[i - 1]
      }

      return checkCombination(result[0]) !== 'Nothing'
        ? checkCombination(result[0])
        : checkCombination(result[1]) !== 'Nothing'
          ? checkCombination(result[1])
          : checkCombination(result[2]) !== 'Nothing'
            ? checkCombination(result[2])
            : 'Nothing'
    }
    if (rows() !== 'Nothing') { return rows() }

    // check columns
    const columns = () => {
      const result = ['', '', '']

      for (let i = 1; i <= 7; i += 3) {
        result[0] += board[i - 1]
      }
      for (let i = 2; i <= 8; i += 3) {
        result[1] += board[i - 1]
      }
      for (let i = 3; i <= 9; i += 3) {
        result[2] += board[i - 1]
      }

      return checkCombination(result[0]) !== 'Nothing'
        ? checkCombination(result[0])
        : checkCombination(result[1]) !== 'Nothing'
          ? checkCombination(result[1])
          : checkCombination(result[2]) !== 'Nothing'
            ? checkCombination(result[2])
            : 'Nothing'
    }
    if (columns() !== 'Nothing') { return columns() }

    // check accross
    const across = () => {
      const result = ['', '']

      for (let i = 1; i <= 9; i += 4) {
        result[0] += board[i - 1]
      }
      for (let i = 3; i <= 7; i += 2) {
        result[1] += board[i - 1]
      }

      return checkCombination(result[0]) !== 'Nothing'
        ? checkCombination(result[0])
        : checkCombination(result[1]) !== 'Nothing'
          ? checkCombination(result[1])
          : 'Nothing'
    }
    if (across() !== 'Nothing') { return across() }
    return 'Nothing'
  }
  const checkCombination = combination => {
    switch (combination) {
      case 'XXX':
        return 'playerOne'
      case 'OOO':
        return 'playerTwo'
      default :
        return 'Nothing'
    }
  }

  // function to dynamically create board and attach event listeners
  const createBoard = () => {
    const board = document.querySelector('.board')

    for (let i = 1; i <= 9; i++) { // create grids
      const box = document.createElement('div')
      box.setAttribute('class', 'cell')
      box.setAttribute('id', 'a' + i)
      box.addEventListener('click', placePiece)
      board.appendChild(box)
    }
  }
  return { turn, board, checkBoard, createBoard }
})()

// display controller module: updates html elements
const displayController = (() => {
  const showName = (name) => { currentTurnDisplay.textContent = name }
  const displayTie = () => {
    currentTurnText.classList.toggle('strike')
    currentTurnDisplay.textContent = 'It is a tie!'
  }
  const displayWinner = (name) => {
    currentTurnText.classList.toggle('strike')
    name === 'playerOne'
      ? currentTurnDisplay.textContent = playerOneName + ' WINS!'
      : currentTurnDisplay.textContent = playerTwoName + ' WINS!'
  }
  const placePiece = (piece, event) => {
    const cell = parseInt(event.target.id.substring(1)) - 1
    gameBoard.board[cell] = piece
    document.getElementById(event.target.id).textContent = piece
    showName()
  }
  return { showName, placePiece, displayWinner, displayTie }
})()

// player object: name and piece to use
const Player = (name, piece) => {
  return { name, piece }
}

// function to track turns
function checkTurns (turns, name) {
  if (turns > 9) {
    displayController.displayTie()
    endGame()
  } else {
    const player = gameBoard.checkBoard()
    if (player !== 'Nothing') {
      displayController.displayWinner(player)
      endGame()
      console.log('hi')
    }
  }
}

// function to initiate turn at game start
function updateTurn () {
  gameBoard.turn++
  gameBoard.turn % 2 === 0
    ? displayController.showName(playerTwo.name)
    : displayController.showName(playerOne.name)
}

// function to call place piece controller, update gameboard and validate move
function placePiece (event) {
  event.stopPropagation()

  if (document.getElementById(event.target.id).textContent.length === 0) {
    if (gameBoard.turn % 2 === 0) {
      displayController.placePiece(playerTwo.piece, event)
      updateTurn()
      checkTurns(gameBoard.turn, playerTwo.name)
    } else {
      displayController.placePiece(playerOne.piece, event)
      updateTurn()
      checkTurns(gameBoard.turn, playerOne.name)
    }
  }
}

let playerOne = ''
let playerTwo = ''

startGameBtn.addEventListener('click', () => {
  startGame()
})

function startGame () {
  if (inputone.value === '' || inputtwo.value === '') { return }

  playerOneName = inputone.value.toUpperCase()
  playerTwoName = inputtwo.value.toUpperCase()

  playerOne = Player(playerOneName, 'X')
  playerTwo = Player(playerTwoName, 'O')

  gameBoard.createBoard()
  updateTurn()
  toggleElements()
}

function endGame () {
  const box = document.querySelectorAll('.cell')
  box.forEach((button) => {
    button.removeEventListener('click', placePiece)
  })
}

function toggleElements () {
  updateVisibility.forEach((element) => {
    element.classList.toggle('hidden')
  })
  formcontainer.classList.toggle('hidden')
}
// instantiate player objects
