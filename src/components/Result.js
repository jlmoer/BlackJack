import React from "react";
import Button from "./Button";
import "./StyleComponent/Result.css"

class Result extends React.Component {
  render() {
    return (
      <div className="result-div" >


        <div id="myLooseModal" className="modal">

          <div className="modal-content" id="modalContent">

            <div className="img-div">
              <img className="img-result" src={this.props.resultGame}/>

              <Button
                buttonColor="reset"
                onClick={this.props.reset}
                children="Rejouer"
                className2="responsive-reset"
              />

            </div>

          </div>

        </div>


      </div>

    )
  }

}

export default Result;
