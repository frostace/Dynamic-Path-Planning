import React from "react";
import "./assets/square.css";

function Square(props) {
	return (
		<button
			style={{ background: props.color }}
			className="square"
			onMouseOver={props.onMouseOver}
		></button>
	);
}

export default Square;
