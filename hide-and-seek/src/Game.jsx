import React from "react";
import Board from "./Board.jsx";
import Square from "./Square.jsx";
import "./assets/board.css";
import update from "react-addons-update";

const originColor = "white";
const flippedColor = "#0C3547";
const boardRowNum = 49;

class Game extends React.Component {
	constructor(props) {
		super(props);
		var squareIndices = Array(boardRowNum).fill(Array(boardRowNum).fill(0));
		for (let i = 0; i < boardRowNum; i++) {
			for (let j = 0; j < boardRowNum; j++) {
				squareIndices[i][j] = i * boardRowNum + j;
			}
		}
		this.state = {
			mouseIsDown: false,
			squareList: squareIndices,
			boardSquareColors: Array(boardRowNum * boardRowNum).fill(
				originColor
			),
			stepNumber: 0,
			xIsNext: true
		};
		this.handleMouseFlip = this.handleMouseFlip.bind(this);
		this.handleMouseUpAndDown = this.handleMouseUpAndDown.bind(this);
	}

	handleMouseFlip(i) {
		if (!this.state.mouseIsDown) return;
		const tmpSquares = this.state.boardSquareColors.slice();

		tmpSquares[i] =
			tmpSquares[i] === originColor || tmpSquares[i] === null
				? flippedColor
				: originColor;

		this.setState({
			boardSquareColors: tmpSquares,
			// boardSquareColors: update(this.state.boardSquareColors, {
			// 	i: { $set: tmpSquares[i] }
			// }),
			xIsNext: !this.state.xIsNext
		});
	}

	handleMouseUpAndDown(e) {
		this.setState(prevState => {
			return { mouseIsDown: !prevState.mouseIsDown };
		});
		// console.log(this.state.mouseIsDown);
		// console.log("this is working!");
	}

	render() {
		var rows = this.state.squareList.map((oneRowOfIndices, rowIdx) => {
			return oneRowOfIndices.map((_, colIdx) => {
				let overallIdx = rowIdx * boardRowNum + colIdx;
				return (
					<Square
						key={overallIdx}
						color={this.state.boardSquareColors[overallIdx]}
						onMouseOver={() => this.handleMouseFlip(overallIdx)}
					/>
				);
			});
		});

		return (
			<div
				className="game"
				// onMouseUp={() => this.handleMouseUpAndDown}
			>
				<div className="game-board">
					<Board
						className="board"
						squares={this.state.boardSquareColors}
						// onClick={i => this.handleClick(i)}
						onMouseDown={this.handleMouseUpAndDown}
						onMouseUp={this.handleMouseUpAndDown}
						allRows={rows}
					/>{" "}
				</div>{" "}
				<div className="game-info">
					{" "}
					{/* <div className="status">{status}</div> */}{" "}
					{/* <ol class="moves">{moves}</ol> */}{" "}
				</div>{" "}
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
		[2, 4, 6]
	];
	for (let i = 0; i < lines.length; i++) {
		const [a, b, c] = lines[i];
		if (
			squares[a] &&
			squares[a] === squares[b] &&
			squares[b] === squares[c]
		) {
			return squares[a];
		}
	}
	for (let i = 0; i < 9; i++) {
		if (squares[i] === null) {
			return null;
		}
	}
	return "Tie";
}

export default Game;
