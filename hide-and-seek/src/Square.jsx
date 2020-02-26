import React, { Component } from "react";
import "./assets/square.css";

function Square(props) {
	// console.log(props);
	const { col, row, isFinish, isStart, isWall } = props;
	const extraClassName = isFinish
		? "square-finish"
		: isStart
		? "square-start"
		: isWall
		? "square-wall"
		: "";

	return (
		<button
			id={props.id}
			// className={`square ${extraClassName}`}
			// onMouseDown={() => onMouseDown(row, col)}
			// onMouseEnter={() => onMouseEnter(row, col)}
			// onMouseUp={() => onMouseUp()}
			// style={{ background: props.color }}
			className={`square ${extraClassName}`}
			onMouseOver={props.onMouseOver}
			onClick={props.onClick}
		></button>
	);
}

export default Square;
