import React from "react";
import Square from "./Square.jsx";

class Board extends React.Component {
	// constructor(props){
	//     super(props);
	//     this.state = {
	//         squares: Array(9).fill(null),
	//         xIsNext: true,
	//     };
	// }

	// renderSquare(i) {
	//     return (
	//         <Square
	//             color={this.props.squares[i]}
	//             onClick={() => this.props.onClick(i)}
	//         />
	//     );
	// }

	render() {
		console.log(this.props.allRows);
		var board_rows = this.props.allRows.map((oneRowOfSquares, i) => {
			return (
				<div key={i} className="board-row">
					{oneRowOfSquares}
				</div>
			);
		});

		console.log(board_rows);

		return (
			<div
				onMouseDown={() => this.props.onMouseDown}
				onMouseUp={() => this.props.onMouseDown}
			>
				{board_rows}
			</div>
		);
	}
}

export default Board;
