import React from 'react';
import "./StyleComponent/Score.css"

class Score extends React.Component {

    render() {
        return (
            <div>
                <div className={this.props.nameScore}>
                    <p>{this.props.children}</p>
                </div>

                <div className={`score-div ${this.props.scoreType}`}>
                    <p className='score-count'>{this.props.score}</p>
                </div>
            </div>
        )
    };
}

export default Score;