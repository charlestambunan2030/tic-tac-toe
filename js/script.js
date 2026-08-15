"use strict";

/*
==================================================
 TIC TAC TOE
 HTML5 + CSS3 + JavaScript + Bulma

 Architecture:

 1. Player Factory
 2. Gameboard IIFE
 3. GameController IIFE
 4. DisplayController IIFE
 5. Event Listeners

 Global code is intentionally minimized.
==================================================
*/


/*
==================================================
 1. PLAYER FACTORY
==================================================

 Creates player objects.

 Each player has:
 - name
 - marker
==================================================
*/

const Player = (name, marker) => {

    return {
        name,
        marker
    };

};


/*
==================================================
 2. GAMEBOARD MODULE
==================================================

 The Gameboard is a singleton because we only
 need one game board at a time.

 The board contains nine positions:

 0 | 1 | 2
 ----------
 3 | 4 | 5
 ----------
 6 | 7 | 8
==================================================
*/

const Gameboard = (() => {

    let board = [
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        ""
    ];


    /*
    ----------------------------------------------
    Get Board
    ----------------------------------------------
    */

    const getBoard = () => {
        return [...board];
    };


    /*
    ----------------------------------------------
    Place Marker
    ----------------------------------------------
    */

    const placeMarker = (index, marker) => {

        if (index < 0 || index > 8) {
            return false;
        }

        if (board[index] !== "") {
            return false;
        }

        board[index] = marker;

        return true;
    };


    /*
    ----------------------------------------------
    Reset Board
    ----------------------------------------------
    */

    const resetBoard = () => {

        board = [
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            ""
        ];

    };


    /*
    ----------------------------------------------
    Check Whether Board Is Full
    ----------------------------------------------
    */

    const isFull = () => {

        return board.every(
            cell => cell !== ""
        );

    };


    /*
    ----------------------------------------------
    Public API
    ----------------------------------------------
    */

    return {
        getBoard,
        placeMarker,
        resetBoard,
        isFull
    };

})();


/*
==================================================
 3. GAME CONTROLLER
==================================================

 Controls:

 - Players
 - Current player
 - Turns
 - Winning conditions
 - Tie conditions
 - Game state
==================================================
*/

const GameController = (() => {

    let players = [];

    let currentPlayerIndex = 0;

    let gameOver = false;

    let winningCombination = [];


    /*
    ----------------------------------------------
    Winning Combinations
    ----------------------------------------------
    */

    const WINNING_COMBINATIONS = [

        // Rows
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],

        // Columns
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],

        // Diagonals
        [0, 4, 8],
        [2, 4, 6]

    ];


    /*
    ----------------------------------------------
    Start Game
    ----------------------------------------------
    */

    const startGame = (
        playerOneName,
        playerTwoName
    ) => {

        players = [
            Player(
                playerOneName || "Player 1",
                "X"
            ),

            Player(
                playerTwoName || "Player 2",
                "O"
            )
        ];

        currentPlayerIndex = 0;

        gameOver = false;

        winningCombination = [];

        Gameboard.resetBoard();

    };


    /*
    ----------------------------------------------
    Get Current Player
    ----------------------------------------------
    */

    const getCurrentPlayer = () => {

        return players[currentPlayerIndex];

    };


    /*
    ----------------------------------------------
    Get Players
    ----------------------------------------------
    */

    const getPlayers = () => {

        return [...players];

    };


    /*
    ----------------------------------------------
    Check Winner
    ----------------------------------------------
    */

    const checkWinner = () => {

        const board = Gameboard.getBoard();

        for (
            const combination
            of WINNING_COMBINATIONS
        ) {

            const [
                a,
                b,
                c
            ] = combination;


            if (
                board[a] !== "" &&
                board[a] === board[b] &&
                board[a] === board[c]
            ) {

                winningCombination =
                    combination;

                return true;
            }

        }

        return false;

    };


    /*
    ----------------------------------------------
    Get Winning Combination
    ----------------------------------------------
    */

    const getWinningCombination = () => {

        return [...winningCombination];

    };


    /*
    ----------------------------------------------
    Play Round
    ----------------------------------------------
    */

    const playRound = (index) => {

        if (gameOver) {

            return {
                success: false,
                message: "The game is already over."
            };

        }


        const player =
            getCurrentPlayer();


        const moveSuccessful =
            Gameboard.placeMarker(
                index,
                player.marker
            );


        /*
        ------------------------------------------
        Cell Already Occupied
        ------------------------------------------
        */

        if (!moveSuccessful) {

            return {
                success: false,
                message: "That cell is already occupied."
            };

        }


        /*
        ------------------------------------------
        Check Winner
        ------------------------------------------
        */

        if (checkWinner()) {

            gameOver = true;

            return {
                success: true,
                status: "win",
                player,
                winningCombination:
                    getWinningCombination()
            };

        }


        /*
        ------------------------------------------
        Check Tie
        ------------------------------------------
        */

        if (Gameboard.isFull()) {

            gameOver = true;

            return {
                success: true,
                status: "tie"
            };

        }


        /*
        ------------------------------------------
        Switch Player
        ------------------------------------------
        */

        currentPlayerIndex =
            currentPlayerIndex === 0
                ? 1
                : 0;


        return {
            success: true,
            status: "continue",
            player: getCurrentPlayer()
        };

    };


    /*
    ----------------------------------------------
    Check Game Over
    ----------------------------------------------
    */

    const isGameOver = () => {

        return gameOver;

    };


    /*
    ----------------------------------------------
    Reset Game
    ----------------------------------------------
    */

    const resetGame = () => {

        Gameboard.resetBoard();

        currentPlayerIndex = 0;

        gameOver = false;

        winningCombination = [];

    };


    /*
    ----------------------------------------------
    Public API
    ----------------------------------------------
    */

    return {

        startGame,
        getCurrentPlayer,
        getPlayers,
        playRound,
        getWinningCombination,
        isGameOver,
        resetGame

    };

})();


/*
==================================================
 4. DISPLAY CONTROLLER
==================================================

 Handles all DOM-related operations.

 Game logic does not directly manipulate
 the DOM.
==================================================
*/

const DisplayController = (() => {

    /*
    ----------------------------------------------
    DOM Elements
    ----------------------------------------------
    */

    const setupSection =
        document.querySelector(
            "#setup-section"
        );

    const gameSection =
        document.querySelector(
            "#game-section"
        );

    const startButton =
        document.querySelector(
            "#start-game-button"
        );

    const restartButton =
        document.querySelector(
            "#restart-button"
        );

    const newPlayersButton =
        document.querySelector(
            "#new-players-button"
        );

    const playerOneInput =
        document.querySelector(
            "#player-one-name"
        );

    const playerTwoInput =
        document.querySelector(
            "#player-two-name"
        );

    const playerOneDisplay =
        document.querySelector(
            "#player-one-display"
        );

    const playerTwoDisplay =
        document.querySelector(
            "#player-two-display"
        );

    const statusMessage =
        document.querySelector(
            "#status-message"
        );

    const resultMessage =
        document.querySelector(
            "#result-message"
        );

    const playerOneCard =
        document.querySelector(
            "#player-one-card"
        );

    const playerTwoCard =
        document.querySelector(
            "#player-two-card"
        );

    const cells =
        document.querySelectorAll(
            ".game-cell"
        );


    /*
    ----------------------------------------------
    Show Game
    ----------------------------------------------
    */

    const showGame = () => {

        setupSection.classList.add(
            "is-hidden"
        );

        gameSection.classList.remove(
            "is-hidden"
        );

    };


    /*
    ----------------------------------------------
    Show Setup
    ----------------------------------------------
    */

    const showSetup = () => {

        gameSection.classList.add(
            "is-hidden"
        );

        setupSection.classList.remove(
            "is-hidden"
        );

    };


    /*
    ----------------------------------------------
    Render Board
    ----------------------------------------------
    */

    const renderBoard = () => {

        const board =
            Gameboard.getBoard();


        cells.forEach(
            (cell, index) => {

                const marker =
                    board[index];

                cell.textContent =
                    marker;


                /*
                Clear previous classes
                */

                cell.classList.remove(
                    "mark-x",
                    "mark-o"
                );


                /*
                Apply marker class
                */

                if (marker === "X") {

                    cell.classList.add(
                        "mark-x"
                    );

                }

                if (marker === "O") {

                    cell.classList.add(
                        "mark-o"
                    );

                }


                /*
                Disable occupied cells
                */

                cell.disabled =
                    marker !== "";

            }
        );

    };


    /*
    ----------------------------------------------
    Update Status
    ----------------------------------------------
    */

    const updateStatus = () => {

        const player =
            GameController.getCurrentPlayer();


        statusMessage.textContent =
            `${player.name}'s turn (${player.marker})`;

    };


    /*
    ----------------------------------------------
    Update Player Names
    ----------------------------------------------
    */

    const updatePlayerNames = () => {

        const players =
            GameController.getPlayers();


        playerOneDisplay.textContent =
            players[0].name;

        playerTwoDisplay.textContent =
            players[1].name;

    };


    /*
    ----------------------------------------------
    Highlight Current Player
    ----------------------------------------------
    */

    const highlightCurrentPlayer = () => {

        const currentPlayer =
            GameController.getCurrentPlayer();


        playerOneCard.classList.remove(
            "active"
        );

        playerTwoCard.classList.remove(
            "active"
        );


        if (
            currentPlayer.marker === "X"
        ) {

            playerOneCard.classList.add(
                "active"
            );

        } else {

            playerTwoCard.classList.add(
                "active"
            );

        }

    };


    /*
    ----------------------------------------------
    Clear Result
    ----------------------------------------------
    */

    const clearResult = () => {

        resultMessage.textContent = "";

        resultMessage.classList.add(
            "is-hidden"
        );

    };


    /*
    ----------------------------------------------
    Display Result
    ----------------------------------------------
    */

    const displayResult = (result) => {

        resultMessage.classList.remove(
            "is-hidden"
        );


        if (result.status === "win") {

            resultMessage.classList.remove(
                "is-warning"
            );

            resultMessage.classList.add(
                "is-success"
            );

            resultMessage.textContent =
                `Winner: ${result.player.name} (${result.player.marker})`;

        }


        if (result.status === "tie") {

            resultMessage.classList.remove(
                "is-success"
            );

            resultMessage.classList.add(
                "is-warning"
            );

            resultMessage.textContent =
                "It's a tie! No player won.";

        }

    };


    /*
    ----------------------------------------------
    Highlight Winning Cells
    ----------------------------------------------
    */

    const highlightWinner = () => {

        const winningCells =
            GameController.getWinningCombination();


        winningCells.forEach(
            index => {

                cells[index].classList.add(
                    "winner"
                );

            }
        );

    };


    /*
    ----------------------------------------------
    Disable Board
    ----------------------------------------------
    */

    const disableBoard = () => {

        cells.forEach(
            cell => {

                cell.disabled = true;

            }
        );

    };


    /*
    ----------------------------------------------
    Reset Visual Board
    ----------------------------------------------
    */

    const resetVisualBoard = () => {

        cells.forEach(
            cell => {

                cell.textContent = "";

                cell.disabled = false;

                cell.classList.remove(
                    "mark-x",
                    "mark-o",
                    "winner"
                );

            }
        );

        clearResult();

    };


    /*
    ----------------------------------------------
    Handle Cell Click
    ----------------------------------------------
    */

    const handleCellClick = (
        event
    ) => {

        const index =
            Number(
                event.currentTarget.dataset.index
            );


        const result =
            GameController.playRound(
                index
            );


        /*
        ------------------------------------------
        Invalid Move
        ------------------------------------------
        */

        if (!result.success) {

            statusMessage.textContent =
                result.message;

            statusMessage.classList.remove(
                "is-info"
            );

            statusMessage.classList.add(
                "is-danger"
            );

            setTimeout(
                () => {

                    statusMessage.classList.remove(
                        "is-danger"
                    );

                    statusMessage.classList.add(
                        "is-info"
                    );

                    updateStatus();

                },
                1200
            );

            return;

        }


        /*
        ------------------------------------------
        Render
        ------------------------------------------
        */

        renderBoard();


        /*
        ------------------------------------------
        Winner
        ------------------------------------------
        */

        if (result.status === "win") {

            displayResult(result);

            highlightWinner();

            disableBoard();

            statusMessage.textContent =
                `${result.player.name} wins!`;

            return;

        }


        /*
        ------------------------------------------
        Tie
        ------------------------------------------
        */

        if (result.status === "tie") {

            displayResult(result);

            disableBoard();

            statusMessage.textContent =
                "Game over — it's a tie!";

            return;

        }


        /*
        ------------------------------------------
        Continue
        ------------------------------------------
        */

        updateStatus();

        highlightCurrentPlayer();

    };


    /*
    ----------------------------------------------
    Start New Game
    ----------------------------------------------
    */

    const handleStartGame = () => {

        const playerOneName =
            playerOneInput.value.trim();

        const playerTwoName =
            playerTwoInput.value.trim();


        GameController.startGame(
            playerOneName,
            playerTwoName
        );


        updatePlayerNames();

        resetVisualBoard();

        showGame();

        renderBoard();

        updateStatus();

        highlightCurrentPlayer();

    };


    /*
    ----------------------------------------------
    Restart Existing Game
    ----------------------------------------------
    */

    const handleRestartGame = () => {

        GameController.resetGame();

        resetVisualBoard();

        renderBoard();

        updateStatus();

        highlightCurrentPlayer();

    };


    /*
    ----------------------------------------------
    Return To Player Setup
    ----------------------------------------------
    */

    const handleNewPlayers = () => {

        GameController.resetGame();

        resetVisualBoard();

        playerOneInput.value = "";

        playerTwoInput.value = "";

        showSetup();

    };


    /*
    ----------------------------------------------
    Event Listeners
    ----------------------------------------------
    */

    startButton.addEventListener(
        "click",
        handleStartGame
    );


    restartButton.addEventListener(
        "click",
        handleRestartGame
    );


    newPlayersButton.addEventListener(
        "click",
        handleNewPlayers
    );


    cells.forEach(
        cell => {

            cell.addEventListener(
                "click",
                handleCellClick
            );

        }
    );


    /*
    ----------------------------------------------
    Keyboard Support
    ----------------------------------------------
    */

    playerOneInput.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Enter"
            ) {

                handleStartGame();

            }

        }
    );


    playerTwoInput.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Enter"
            ) {

                handleStartGame();

            }

        }
    );


    /*
    ----------------------------------------------
    Initial State
    ----------------------------------------------
    */

    renderBoard();

})();


/*
==================================================
 5. CONSOLE TESTING EXAMPLES
==================================================

 The application logic can be tested by calling
 the modules from the browser console.

 Example:

 GameController.startGame(
     "Alice",
     "Bob"
 );

 GameController.playRound(0);
 GameController.playRound(3);
 GameController.playRound(1);
 GameController.playRound(4);
 GameController.playRound(2);

 The result should be:

 Alice wins with X.

 Another example:

 GameController.startGame(
     "Alice",
     "Bob"
 );

 GameController.playRound(0);
 GameController.playRound(1);
 GameController.playRound(2);
 GameController.playRound(4);
 GameController.playRound(3);
 GameController.playRound(5);
 GameController.playRound(7);
 GameController.playRound(6);
 GameController.playRound(8);

 Result:

 Tie.
==================================================
*/