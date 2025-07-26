//Ryan Ransom
//07/26/2025
//Exercise 3

let fileHandle = null;
let gameState = {
    turnCount: 0,
    winner: "",
    board: ["", "", "", "", "", "", "", "", ""]
}

/**
 * Opens a file picker dialog to select a JSON file for loading game state
 * @async
 * @function openFile
 */
async function openFile() {
    [fileHandle] = await window.showOpenFilePicker({
        types: [{
            description: "Game State",
            accept: {"application/json": [".json"]}
        }]
    });
}

/**
 * Loads game state from the selected JSON file and updates the UI
 * @async
 * @function loadState
 */
async function loadState() {
    if(fileHandle) {
        const file = await fileHandle.getFile();
        const jsonGameState = JSON.parse(await file.text());

        gameState.turnCount = jsonGameState.turnCount;
        gameState.winner = jsonGameState.winner;

        var btns = document.getElementsByClassName('tableButton');

        // Update the board array to match the button value
        for(let i = 0; i < 9; i++) {
            gameState.board[i] = jsonGameState.board[i];
            btns[i].value = gameState.board[i];
        }

        // Check if the game is over
        checkTable();
    }
}

/**
 * Saves the current game state to the selected JSON file
 * @async
 * @function saveState
 */
async function saveState() {
    if(fileHandle) {
        const writable = await fileHandle.createWritable();
        await writable.write(JSON.stringify(gameState));
        await writable.close();
    }
}

/**
 * Sets the value of a button based on the current turn and updates game state
 * @function setButton
 * @param {string} buttonId - The ID of the button to set
 */
function setButton(buttonId) {
    var button = document.getElementById(buttonId);
    if(button.value == "") {
        if(gameState.turnCount % 2 === 0) {
            button.value = "O";
        }
        else {
            button.value = "X";
        }
        gameState.turnCount++;
        
        // Update the board array to match the button value
        const buttonIndex = parseInt(buttonId.replace('button', '')) - 1;
        gameState.board[buttonIndex] = button.value;
        
        // Update the start button to show "Clear" if the game has started
        if(gameState.turnCount > 0) {
            document.getElementById("startBtn").value = "Clear";
        }

        // Check if the game is over
        checkTable();
    }
}

/**
 * Checks if three buttons form a winning combination or if the game is a draw
 * @function checkWin
 * @param {HTMLElement} x - First button element
 * @param {HTMLElement} y - Second button element
 * @param {HTMLElement} z - Third button element
 */
function checkWin(x, y, z) {
    if(x.value !== "" && x.value === y.value && y.value === z.value) {
        x.style.color = "red";
        y.style.color = "red";
        z.style.color = "red";
        gameState.winner = true;
    }
    else if(gameState.turnCount === 9) {
        gameState.winner = true;
    }
    else {
        gameState.winner = false;
    }
}

/**
 * Checks all possible winning combinations and updates game state
 * @function checkTable
 */
function checkTable() {
    var btns = document.getElementsByClassName('tableButton');
    checkWin(btns[0], btns[1], btns[2]);
    checkWin(btns[3], btns[4], btns[5]);
    checkWin(btns[6], btns[7], btns[8]);
    checkWin(btns[0], btns[3], btns[6]);
    checkWin(btns[1], btns[4], btns[7]);
    checkWin(btns[2], btns[5], btns[8]);
    checkWin(btns[0], btns[4], btns[8]);
    checkWin(btns[2], btns[4], btns[6]);

    // If the game is over, disable all buttons and update the start button
    if(gameState.winner) {
        document.getElementById("startBtn").value = "Start";
        for(let i = 0; i < 9; i++) {
            btns[i].disabled = true;
        }
    }

    // Save the game state
    saveState();
}

/**
 * Resets the game board and game state to start a new game
 * @function resetTable
 */
function resetTable() {
    var btns = document.getElementsByClassName('tableButton');
    for (var i = 0; i < btns.length; i++) {
        btns[i].value = '';
        btns[i].style.color = '';
        btns[i].disabled = false;
    }
    gameState.turnCount = 0;
    gameState.winner = false;
    
    // Reset the board array to match the cleared buttons
    gameState.board = ["", "", "", "", "", "", "", "", ""];
    
    // Save the game state
    saveState();
}