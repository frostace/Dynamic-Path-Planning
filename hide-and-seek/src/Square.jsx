import React from "react";
import "./assets/square.css";

function Square(props) {
	const isWall = props.isWall ? "square-wall" : "";
	return (
		<button
			// id={`square-${row}-${col}`}
			// className={`square ${extraClassName}`}
			// onMouseDown={() => onMouseDown(row, col)}
			// onMouseEnter={() => onMouseEnter(row, col)}
			// onMouseUp={() => onMouseUp()}
			// style={{ background: props.color }}
			className={`square ${isWall}`}
			onMouseOver={props.onMouseOver}
		></button>
	);
}

export default Square;
