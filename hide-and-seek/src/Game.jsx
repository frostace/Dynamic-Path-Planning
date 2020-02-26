import React from "react";
import Board from "./Board.jsx";
import Square from "./Square.jsx";
import "./assets/board.css";
import update from "react-addons-update";

const originColor = "white";
const flippedColor = "#0C3547";
const boardRowNum = 49;
const START_NODE_ROW = 10;
const START_NODE_COL = 15;
const FINISH_NODE_ROW = 10;
const FINISH_NODE_COL = 35;

class Game extends React.Component {
	constructor(props) {
		super(props);
		var squareIndices = [...Array(boardRowNum)].map(x =>
			Array(boardRowNum).fill(0)
		);
		for (var i = 0; i < boardRowNum; i++) {
			for (var j = 0; j < boardRowNum; j++) {
				squareIndices[i][j] = i * boardRowNum + j;
			}
		}
		this.state = {
			mouseIsDown: false,
			squareList: squareIndices,
			boardSquareNodes: [],
			boardSquareIsWall: [...Array(boardRowNum)].map(x =>
				Array(boardRowNum).fill(false)
			),
			stepNumber: 0,
			xIsNext: true
		};
		this.handleMouseFlip = this.handleMouseFlip.bind(this);
		this.handleMouseUpAndDown = this.handleMouseUpAndDown.bind(this);
	}

	componentDidMount() {
		const nodes = getInitialGrid();
		this.setState({ boardSquareNodes: nodes });
	}

	handleMouseFlip(i, j) {
		if (!this.state.mouseIsDown) return;
		const tmpSquares = this.state.boardSquareNodes.slice();
		tmpSquares[i][j].isWall = !tmpSquares[i][j].isWall;

		this.setState({
			boardSquareNodes: tmpSquares,
			// boardSquareIsWall: update(this.state.boardSquareIsWall, {
			// 	i: { $set: tmpSquares[i] }
			// }),
			xIsNext: !this.state.xIsNext
		});
	}

	handleMouseClick(i, j) {
		const tmpSquares = this.state.boardSquareNodes.slice();
		tmpSquares[i][j].isWall = !tmpSquares[i][j].isWall;

		this.setState({
			boardSquareNodes: tmpSquares,
			// boardSquareIsWall: update(this.state.boardSquareIsWall, {
			// 	i: { $set: tmpSquares[i] }
			// }),
			xIsNext: !this.state.xIsNext
		});
	}

	handleMouseUpAndDown(e) {
		this.setState(prevState => {
			return { mouseIsDown: !prevState.mouseIsDown };
		});
	}

	render() {
		var rows = this.state.boardSquareNodes.map(
			(oneRowOfIndices, rowIdx) => {
				return oneRowOfIndices.map((node, colIdx) => {
					// console.log(squIdx, overallIdx);
					const {
						row,
						col,
						nodeIdx,
						isFinish,
						isStart,
						isWall
					} = node;
					return (
						<Square
							id={`square-${rowIdx}-${colIdx}`}
							key={nodeIdx}
							isStart={isStart}
							isFinish={isFinish}
							isWall={isWall}
							// color={this.state.boardSquareIsWall[overallIdx]}
							onMouseOver={() =>
								this.handleMouseFlip(rowIdx, colIdx)
							}
							onClick={() =>
								this.handleMouseClick(rowIdx, colIdx)
							}
						/>
					);
				});
			}
		);

		return (
			<div
				className="game"
				// onMouseUp={() => this.handleMouseUpAndDown}
			>
				<div className="game-board">
					<Board
						className="board"
						// squares={this.state.boardSquareIsWall}
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

const getInitialGrid = () => {
	const grid = [];
	for (let row = 0; row < boardRowNum; row++) {
		const currentRow = [];
		for (let col = 0; col < boardRowNum; col++) {
			currentRow.push(createNode(col, row));
		}
		grid.push(currentRow);
	}
	return grid;
};

const createNode = (col, row) => {
	return {
		col,
		row,
		nodeIdx: row * boardRowNum + col,
		isStart: row === START_NODE_ROW && col === START_NODE_COL,
		isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
		isVisited: false,
		isWall: false,
		distance: Infinity,
		previousNode: null
	};
};

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
