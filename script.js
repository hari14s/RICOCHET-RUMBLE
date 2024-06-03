let currentPlayer = 1; // Player 1 starts
let timer = 10; // Timer in seconds
let timerInterval;
let selectedPiece = null;
let selectedPiecePosition = null;
const board = document.getElementById('board');
const currentPlayerDisplay = document.getElementById('current-player');
const startButton = document.getElementById('start');
const pauseButton = document.getElementById('pause');
const resumeButton = document.getElementById('resume');
const resetButton = document.getElementById('reset');
const timerDisplay = document.getElementById('timer');
initializeBoard();

// Function to initialize the game board
function initializeBoard() {
    // Create cells for the board
    for (let i = 0; i < 64; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.addEventListener('click', function () {
            handleCellClick(this, i);
        });
        board.appendChild(cell);
    }
    // Place pieces on the board
    placePieces();
}

function placePieces() {
    // Place cannon at the end of each row
    placePiece(0, 0, 'cannon', 1);
    placePiece(7, 7, 'cannon', 2);

    // Place tank and titan for each player
    placePiece(0, 7, 'tank', 1);
    placePiece(0, 4, 'titan', 1);
    placePiece(7, 0, 'tank', 2);
    placePiece(7, 3, 'titan', 2);

    // Place semi ricochet and ricochet
    placePiece(0, 2, 'semi-ricochet', 1);
    placePiece(7, 5, 'semi-ricochet', 2);
    placePiece(0, 6, 'ricochet', 1);
    placePiece(7, 1, 'ricochet', 2);
}

// Function to place a piece on the board
function placePiece(x, y, type, player) {
    const cell = board.children[x * 8 + y]; 
    const piece = document.createElement('div');
    piece.classList.add('piece', type);  
    piece.setAttribute('data-player', player);
    if(player== 1){
        if(type == 'cannon'){
            piece.textContent= 'cannon1';
        }
        else if(type == 'titan') {
            piece.textContent= 'titan1';
        }
        else if(type== 'tank') {
            piece.textContent= 'tank1'
        }
    }
    if(player== 2){
        if(type == 'cannon'){
            piece.textContent= 'cannon2';
        }
        else if(type == 'titan') {
            piece.textContent= 'titan2';
        }
        else if(type== 'tank') {
            piece.textContent= 'tank2'
        }
    }
    cell.appendChild(piece);
}

 // Function to handle cell click
 function handleCellClick(cell, index) {
    const rowIndex = Math.floor(index / 8);
    const colIndex = index % 8;

    // If there's a selected piece, try to move it
    if (selectedPiece) {
        if (cell.classList.contains('highlight')) {
            movePiece(selectedPiece, selectedPiecePosition, rowIndex, colIndex);
            fireBullet(currentPlayer); 
            clearHighlights();
            selectedPiece = null;
            selectedPiecePosition = null;
            switchPlayer();
            resetTimer();
            startTimer();
            return;
        } else {
            clearHighlights();
            selectedPiece = null;
            selectedPiecePosition = null;
        }
    }

    // Check if the clicked cell contains a piece
    const piece = cell.querySelector('.piece');
    if (piece && parseInt(piece.getAttribute('data-player')) === currentPlayer) {
        selectedPiece = piece;
        selectedPiecePosition = { rowIndex, colIndex };
        highlightPossibleMoves(piece, rowIndex, colIndex);
    }
}

// Function to highlight possible moves
function highlightPossibleMoves(piece, rowIndex, colIndex) {
    // Clear previous highlights
    clearHighlights();

    // Get possible moves for the piece
    const possibleMoves = calculatePossibleMoves(piece, rowIndex, colIndex);

    // Highlight the possible moves
    possibleMoves.forEach(move => {
        const cellIndex = move[0] * 8 + move[1];
        board.children[cellIndex].classList.add('highlight');
    });
}

// Function to calculate possible moves for a piece
function calculatePossibleMoves(piece, rowIndex, colIndex) {
    const type = piece.classList[1];
    const directions = type === 'cannon' ? 
        [[0, 1], [0, -1]] : // Cannon 
        [[0, 1], [0, -1], [1, 0], [-1, 0], [1, 1], [-1, -1], [1, -1], [-1, 1]]; // Other pieces

    const possibleMoves = directions.map(dir => [rowIndex + dir[0], colIndex + dir[1]])
                                    .filter(pos => pos[0] >= 0 && pos[0] < 8 && pos[1] >= 0 && pos[1] < 8)
                                    .filter(pos => !board.children[pos[0] * 8 + pos[1]].querySelector('.piece'));
    return possibleMoves;
}

// Function to move a piece to a new position
function movePiece(piece, fromPosition, toRow, toCol) {
    const fromCell = board.children[fromPosition.rowIndex * 8 + fromPosition.colIndex];
    const toCell = board.children[toRow * 8 + toCol];
    fromCell.removeChild(piece);
    toCell.appendChild(piece);
}

// Function to clear previous highlights
function clearHighlights() {
    const highlightedCells = document.querySelectorAll('.highlight');
    highlightedCells.forEach(cell => {
        cell.classList.remove('highlight');
    });
}

// Function to switch the player
function switchPlayer() {
    currentPlayer = currentPlayer === 1 ? 2 : 1;
    currentPlayerDisplay.textContent = `Player ${currentPlayer}'s Turn`;

}

// Function to start the timer
function startTimer() {
    timerInterval = setInterval(() => {
        timer--;
        updateTimerDisplay();
        if (timer <= 0) {
            endGame(currentPlayer === 1 ? 2 : 1); // Other player wins
        }
    }, 1000);
}

// Function to reset the timer
function resetTimer() {
    clearInterval(timerInterval);
    timer = 10;
    updateTimerDisplay();
}

// Function to update the timer display
function updateTimerDisplay() {
    timerDisplay.textContent = 'Time: ' + timer + 's';
}

// Function to pause the game
function pauseGame() {
    clearInterval(timerInterval);
}

// Function to resume the game
function resumeGame() {
    startTimer();
}

// Function to reset the game
function resetGame() {
    clearInterval(timerInterval);
    timer = 10;
    currentPlayer = 1;
    selectedPiece = null;
    selectedPiecePosition = null;
    clearBoard();
    updateTimerDisplay();
    currentPlayerDisplay.textContent = "Player 1's Turn";
}

// Function to clear the game board
function clearBoard() {
    board.innerHTML = '';
    initializeBoard();
}

// Function to end the game
function endGame(winner) {
    clearInterval(timerInterval);
    alert('Player ' + winner + ' wins!');
}

// Event listeners for buttons
startButton.addEventListener('click', () => {
    resetGame();
    startTimer();
});
pauseButton.addEventListener('click', pauseGame); 
resumeButton.addEventListener('click', resumeGame);
resetButton.addEventListener('click', resetGame);

 
