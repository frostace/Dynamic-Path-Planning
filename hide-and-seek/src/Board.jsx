import React from "react";
import Square from "./Square.jsx";

class Board extends React.Component {
	render() {
		var board_rows = this.props.allRows.map((oneRowOfSquares, i) => {
			return (
				<div key={i} className="board-row">
					{oneRowOfSquares}
				</div>
			);
		});

		return (
			<div
				onMouseDown={this.props.onMouseDown}
				onMouseUp={this.props.onMouseUp}
			>
				{board_rows}
			</div>
		);
	}
}

export default Board;
