const gameBoard = () => {
    const cell = () => {
        let value = ''
        const getValue = () => value
        const setValue = newValue => {
            if (value === '') value = newValue
        }
        const reset = () => value = ''
        return { getValue, setValue, reset }
    }
    const board = []
    for (let r = 0; r < 3; r++) {
        const row = []
        for (let c = 0; c < 3; c++) {
            row.push(cell())
        }
        board.push(row)
    }
    const resetAll = () => board.forEach(row => row.forEach(cell => cell.reset()))
    const getCellValue = (r, c) => board[r][c].getValue()
    const setCell = (r, c, v) => board[r][c].setValue(v)
    return { getCellValue, setCell, resetAll }
}

const player = (name, marker, boardAPI) => {
    let winner = false
    const getName = () => name
    const checkWinner = (r, c) => {
        const val = (x, y) => boardAPI.getCellValue(x, y)
        if (val(r, 0) === marker && val(r, 1) === marker && val(r, 2) === marker) winner = true
        if (val(0, c) === marker && val(1, c) === marker && val(2, c) === marker) winner = true
        if (r === c && val(0, 0) === marker && val(1, 1) === marker && val(2, 2) === marker) winner = true
        if (r + c === 2 && val(0, 2) === marker && val(1, 1) === marker && val(2, 0) === marker) winner = true
        return winner
    }
    return { getName, checkWinner, marker }
}

const computerPlayer = (name, marker, boardAPI) => {
    const base = player(name, marker, boardAPI)
    const coords = []
    const resetCoords = () => {
        coords.length = 0
        for (let r = 0; r < 3; r++) {
            for (let c = 0; c < 3; c++) {
                coords.push({ r, c })
            }
        }
    }
    resetCoords()
    const makeMove = () => {
        const getRand = () => Math.floor(Math.random() * coords.length)
        while (coords.length) {
            const i = getRand()
            const { r, c } = coords[i]
            if (boardAPI.getCellValue(r, c) !== '') {
                coords.splice(i, 1)
            } else {
                coords.splice(i, 1)
                return { row: r, col: c }
            }
        }
        return null
    }
    return { ...base, makeMove, resetCoords }
}

const viewManager = boardAPI => {
    const cells = Array.from(document.querySelectorAll('.cell'))
    const msg = document.getElementById('message')
    const btn = document.getElementById('reset')
    const rc = idx => [Math.floor(idx / 3), idx % 3]
    const render = () => {
        cells.forEach((el, i) => {
            const [r, c] = rc(i)
            el.textContent = boardAPI.getCellValue(r, c)
        })
    }
    const bindHandler = fn => {
        cells.forEach((el, i) => {
            const [r, c] = rc(i)
            el.addEventListener('click', () => fn(r, c))
        })
    }
    const setMessage = t => { msg.textContent = t }
    const bindReset = fn => { btn.addEventListener('click', fn) }
    return { render, bindHandler, bindReset, setMessage }
}

const gameController = (() => {
    const boardAPI = gameBoard()
    const view = viewManager(boardAPI)
    const p1 = player('You', 'X', boardAPI)
    const p2 = computerPlayer('Computer', 'O', boardAPI)
    let current = p1
    let over = false

    const full = () => {
        for (let r = 0; r < 3; r++) {
            for (let c = 0; c < 3; c++) {
                if (boardAPI.getCellValue(r, c) === '') return false
            }
        }
        return true
    }

    const swap = () => {
        current = current === p1 ? p2 : p1
    }

    const handleMove = (r, c) => {
        if (over || boardAPI.getCellValue(r, c) !== '') return
        boardAPI.setCell(r, c, current.marker)
        view.render()
        if (current.checkWinner(r, c)) {
            view.setMessage(`${current.getName()} wins!`)
            over = true
            return
        }
        if (full()) {
            view.setMessage("It's a tie!")
            over = true
            return
        }
        swap()
        if (current.makeMove) {
            const mv = current.makeMove()
            if (mv) handleMove(mv.row, mv.col)
        }
    }

    const resetGame = () => {
        boardAPI.resetAll()
        view.render()
        view.setMessage('')
        over = false
        current = p1
        p2.resetCoords()
    }

    const init = () => {
        view.bindHandler((r, c) => {
            if (over || current !== p1) return
            handleMove(r, c)
        })
        view.bindReset(resetGame)
        view.render()
    }

    return { init }
})()

document.addEventListener('DOMContentLoaded', () => {
    gameController.init()
})
