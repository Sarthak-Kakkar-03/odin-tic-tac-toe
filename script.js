const gameBoard = () => {
    const cell = () => {
        let value = '';
        const getValue = () => value;
        const setValue = (newValue) => {
            if (value === '') value = newValue;
        };
        const reset = () => value = '';
        return { getValue, setValue, reset };
    };

    const board = [];
    for (let row = 0; row < 3; row++) {
        const currentRow = [];
        for (let col = 0; col < 3; col++) {
            currentRow.push(cell());
        }
        board.push(currentRow);
    }

    const resetAll = () => {
        board.forEach(row => row.forEach(cell => cell.reset()));
    };

    const getCellValue = (row, col) => board[row][col].getValue();

    const setCell = (row, col, val) => board[row][col].setValue(val);

    return { getCellValue, setCell, resetAll };
};

const player = (playerName, playerMarker, boardAPI) => {
    let name = playerName;
    let marker = playerMarker;
    let winner = false;

    const setName = (newName) => { name = newName; };
    const setMarker = (newMarker) => { marker = newMarker; };
    const getName = () => {return name;};

    const checkWinner = (row, col) => {
        const val = (r, c) => boardAPI.getCellValue(r, c);

        if (val(row, 0) === marker && val(row, 1) === marker && val(row, 2) === marker) {
            winner = true;
        }

        if (val(0, col) === marker && val(1, col) === marker && val(2, col) === marker) {
            winner = true;
        }

        if (row === col && val(0, 0) === marker && val(1, 1) === marker && val(2, 2) === marker) {
            winner = true;
        }

        if (row + col === 2 && val(0, 2) === marker && val(1, 1) === marker && val(2, 0) === marker) {
            winner = true;
        }

        return winner;
    };

    const isWinner = () => winner;

    return { setName, setMarker, getName, checkWinner, isWinner };
};

