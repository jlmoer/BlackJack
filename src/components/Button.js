import React from "react";
import "./StyleComponent/Button.css";

class Button extends React.Component {
  render() {
    return (
      <div>
        <button
          onClick={this.props.onClick}
          type={this.props.type}
          className={`btn ${this.props.buttonColor} ${this.props.className2}`}
        >
          {this.props.children}
        </button>
      </div>
    );
  }
}

export default Button;
