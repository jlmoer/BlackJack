import React from 'react';
import "./StyleComponent/Players.css"

class Player extends React.Component {

    render() {
        return (
            <div className="player-container">
                <p style={{color: this.props.color}}>{this.props.children}</p>
                <img className="player-img" src={this.props.playerImg} alt={this.props.altPlayer} />
            </div>
        )
    }
}

export default Player