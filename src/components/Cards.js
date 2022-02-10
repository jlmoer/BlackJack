import React from "react";
import "../components/StyleComponent/Cards.css"

class Cards extends React.Component {
  render() {
    return (

      <div>

        <div>

          <ul className="cards-ul">

            {this.props.cards.map((item, index) => {
              return (

                <li key={index}>
                  <img className="cards" src={item} />
                </li>

              );
            })}
          </ul>

        </div>

      </div>

    );
  }
}

export default Cards;
