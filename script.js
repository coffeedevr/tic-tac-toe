// node selectors
const cellbtn = document.querySelectorAll('.cell')
const currentTurnDisplay = document.querySelector('#current-turn')
const announcement = document.querySelector('#announcement')
const updateVisibility = document.querySelectorAll('.hidden')

// gameboard module: tracks turn, board and validates pieces
const gameBoard = (() => {
  const turn = 1
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
        return 'PlayerOne'
      case 'OOO':
        return 'PlayerTwo'
      default :
        return 'Nothing'
    }
  }
  return { turn, board, checkBoard }
})()

// display controller module: updates html elements
const displayController = (() => {
  const showName = (name) => { currentTurnDisplay.textContent = name }
  const displayWinner = (name) => { announcement.textContent = name }
  const placePiece = (piece, event) => {
    const cell = parseInt(event.target.id.substring(1)) - 1
    gameBoard.board[cell] = piece
    document.getElementById(event.target.id).textContent = piece
    showName()
  }
  return { showName, placePiece, displayWinner }
})()

// player object: name and piece to use
const Player = (name, piece) => {
  return { name, piece }
}

// function to tract turns
function checkTurns (turns, name) {
  if (turns > 9) {
    displayController.displayWinner(name)
    endGame()
  } else {
    const player = gameBoard.checkBoard()
    if (player !== 'Nothing') {
      displayController.displayWinner(`${player}`)
      endGame()
    }
  }
}

// function to initiate turn at game start
function updateTurn () {
  gameBoard.turn % 2 === 0
    ? displayController.showName(playerTwo.name)
    : displayController.showName(playerOne.name)
}

// function to call placepiece controller, update gameboard and validate move
function placePiece (event) {
  if (document.getElementById(event.target.id).textContent.length === 0) {
    if (gameBoard.turn % 2 === 0) {
      displayController.placePiece(playerTwo.piece, event)
      checkTurns(gameBoard.turn, playerTwo.name)
    } else {
      displayController.placePiece(playerOne.piece, event)
      checkTurns(gameBoard.turn, playerOne.name)
    }
    gameBoard.turn++
    updateTurn()
  }
}

// function to start game by adding event listeners and starts the turn
function startGame () {
  updateTurn()
  cellbtn.forEach((button) => {
    button.addEventListener('click', placePiece)
  })
  toggleElements()
}

function endGame () {
  cellbtn.forEach((button) => {
    button.removeEventListener('click', placePiece)
  })
  toggleElements()
}

function toggleElements () {
  updateVisibility.forEach((element) => {
    element.classList.toggle('hidden')
  })
}

// instantiate player objects
const playerOne = Player('Dan', 'X')
const playerTwo = Player('Ledy', 'O')

startGame()
