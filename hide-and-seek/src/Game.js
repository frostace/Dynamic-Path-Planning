import React from 'react'
import Board from "./Board"

const originColor = "#59CBE8"
const flippedColor = "black"

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            boardStatus: {
                squares: Array(9).fill(originColor),
            },
            stepNumber: 0,
            xIsNext: true
        };
        this.handleClick = this.handleClick.bind(this)
    }

    handleClick(i) {
        const squares = this.state.boardStatus.squares.slice();

        console.log(squares)
        squares[i] = (squares[i] === originColor || squares[i] === null) ? flippedColor : originColor;
        this.setState({
            boardStatus: {squares},
            xIsNext: !this.state.xIsNext,
        });
    }

    render() {
        // const winner = calculateWinner(this.state.boardStatus.squares);

        // let status;
        // if (winner && winner === "Tie") {
        //     status = "Tie";
        // } else if (winner){
        //     status = 'Winner: ' + winner;
        // } else {
        //     status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        // }

        return (
            <div className="game">
                <div className="game-board">
                    <Board 
                        squares = {this.state.boardStatus.squares}
                        onClick = {(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    {/* <div className="status">{status}</div> */}
                    {/* <ol class="moves">{moves}</ol> */}
                </div>
            </div>
        );
    }
}

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[b] === squares[c]) {
            return squares[a];
        }
    }
    for (let i = 0; i < 9; i++) {
        if (squares[i] === null) {
            return null;
        }
    }
    return 'Tie';
}

export default Game