import React from "react";
import "./App.css";

// IMAGES

// import back from "./assets/images/back.png";
// import logo from "./assets/images/Logo.png";
// import lose from "./assets/images/lose.png";
// import win from "./assets/images/win.png";

// COMPONENTS
import Button from "./components/Button.js";
import Cards from "./components/Cards";
import Players from "./components/Player";
import Result from "./components/Result";
import Score from "./components/Score";
import Header from "./components/Header";
import Footer from "./components/Footer";

// VARIABLES DE STOCKAGE DU DECK
let cardsDeck = [];

// PANSEMENT pour le stockage du score de la banque (A REGLER):
let tempScore = 0;

// CLASSE PRINCIPALE
class App extends React.Component {
  constructor() {
    super();

    this.state = {
      cardCount: 0,
      bankCards: [],
      bankCardValue: [],
      playerCard: [],
      playerCardValue: [],
      scoreBank: 0,
      scorePlayer: 0,
      totalScoreBank: 0,
      totalScorePlayer: 0,
      messageResult: "",
    };

    // Bind fonction onCLick tirage des cartes du joueur
    this.drawCard = this.drawCard.bind(this);
    this.reset = this.reset.bind(this);
    this.autoBankDraw = this.autoBankDraw.bind(this);
  }

  // DEMARRAGE DU JEU --> APPEL DE L'API / TIRAGE CARTES / REGLES SPECIALES et AJOUT DU SCORE INITIAL

  reset() {
    console.log("test cardsDeck", cardsDeck);
    this.setState({
      cardCount: 0,
      bankCards: [],
      bankCardValue: [],
      playerCard: [],
      playerCardValue: [],
      scoreBank: 0,
      scorePlayer: 0,
      messageResult: "",
    });

    tempScore = 0;
    // Requête initial de l'API

    fetch("https://deckofcardsapi.com/api/deck/new/draw/?count=52")
      .then((res) => res.json())
      .then((res) => {
        cardsDeck.push(res);
        console.log(cardsDeck);

        // Récupération de l'image de la carte tirée par la banque
        this.setState({
          bankCards: [
            cardsDeck[0].cards[0].image,
            cardsDeck[0].cards[1].image,
            ...this.state.bankCards,
          ],

          // Ajout des valeurs cartes banque pour règle spéciale des 21
          bankCardValue: [
            cardsDeck[0].cards[0].value,
            cardsDeck[0].cards[1].value,
            ...this.state.bankCardValue,
          ],

          //rajout des deux cartes du joueur a l'initialisation de la partie (nico)

          playerCard: [
            cardsDeck[0].cards[2].image,
            cardsDeck[0].cards[3].image,
            ...this.state.playerCard,
          ],

          // Ajout des valeurs cartes joueur pour règle spéciale des 21
          playerCardValue: [
            cardsDeck[0].cards[2].value,
            cardsDeck[0].cards[3].value,
            ...this.state.playerCardValue,
          ],

          cardCount: this.state.cardCount + 4,
        });

        // REGLE SPECIALE DU SCORE 21 TETE + AS POUR LE PLAYER
        if (
          this.state.playerCardValue.toString().match(/QUEEN|JACK|KING|10/) &&
          this.state.playerCardValue.toString().match(/ACE/) &&
          this.state.playerCardValue.length === 2
        ) {
          this.setState({
            scorePlayer: 10,
          });
        }

        // REGLE SPECIALE DU SCORE 21 TETE + AS POUR LA BANQUE
        if (
          this.state.bankCardValue.toString().match(/QUEEN|JACK|KING|10/) &&
          this.state.bankCardValue.toString().match(/ACE/) &&
          this.state.bankCardValue.length === 2
        ) {
          this.setState({
            scoreBank: 10,
          });
        }

        // BOUCLE TIRAGE INITIAL CARTES BANQUES
        for (let i = 0; i < 2; i++) {
          // Score spécifiques pour les "têtes" (+10 ou +1 pour l'AS)
          if (
            cardsDeck[0].cards[i].value === "QUEEN" ||
            cardsDeck[0].cards[i].value === "KING" ||
            cardsDeck[0].cards[i].value === "JACK"
          ) {
            tempScore += 10;
            this.setState({
              scoreBank: 10 + this.state.scoreBank,
            });
          } else if (cardsDeck[0].cards[i].value === "ACE") {
            tempScore += 1;
            this.setState({
              scoreBank: 1 + this.state.scoreBank,
            });
          } else {
            tempScore += parseInt(cardsDeck[0].cards[i].value);
            this.setState({
              // Score des cartes "standards"
              scoreBank:
                parseInt(cardsDeck[0].cards[i].value) + this.state.scoreBank,
            });
          }
        }

        //répétition de la boucle précédente adaptée cette fois-ci pour les cartes du joueur

        for (let i = 2; i < 4; i++) {
          if (
            cardsDeck[0].cards[i].value === "QUEEN" ||
            cardsDeck[0].cards[i].value === "KING" ||
            cardsDeck[0].cards[i].value === "JACK"
          ) {
            this.setState({
              scorePlayer: 10 + this.state.scorePlayer,
            });
          } else if (cardsDeck[0].cards[i].value === "ACE") {
            this.setState({
              scorePlayer: 1 + this.state.scorePlayer,
            });
          } else {
            this.setState({
              // Score des cartes "standards"
              scorePlayer:
                parseInt(cardsDeck[0].cards[i].value) + this.state.scorePlayer,
            });
          }
        }
      });
  }

  //
  componentDidUpdate(_prevProps, prevState) {
    if (prevState.messageResult !== this.state.messageResult) {
      cardsDeck = [];
    }

    // GUARD FIN DE PARTIE SI SCORE JOUEUR = 21

    if (prevState.scorePlayer !== this.state.scorePlayer) {
      if (this.state.scorePlayer === 21 || tempScore > 21) {
        setTimeout(
          () =>
            this.setState({
              messageResult: "WINNER",
              totalScorePlayer: this.state.totalScorePlayer + 1,
            }),
          1500
        );
      } else if (this.state.scorePlayer > 21) {
        setTimeout(
          () =>
            this.setState({
              messageResult: "LOOSER",
              totalScoreBank: this.state.totalScoreBank + 1,
            }),
          1500
        );
      }
    }

    //REGLE DE LA LIMITE DE 5 CARTES PAR PARTIE
    if (prevState.playerCard.length !== this.state.playerCard.length) {
      if (this.state.playerCard.length === 5) {
        this.endGame();
      }
    }
  }

  // FONCTION DE TIRAGE AUTOMATIQUE D'UNE CARTE POUR LA BANQUE

  autoBankDraw() {
    let bankScore = cardsDeck[0].cards[this.state.cardCount].value;
    bankScore = parseInt(bankScore);

    // Récupération de l'image et valeur de la carte tirée
    this.setState({
      bankCards: [
        cardsDeck[0].cards[this.state.cardCount].image,
        ...this.state.bankCards,
      ],
      bankCardValue: [
        cardsDeck[0].cards[this.state.cardCount].value,
        ...this.state.bankCardValue,
      ],
    });
    console.log(this.state.bankCardValue);
    console.log("TEMPSCORE", tempScore);

    // Score spécifiques pour les "têtes" (+10 ou +1 pour l'AS)
    if (
      cardsDeck[0].cards[this.state.cardCount].value === "QUEEN" ||
      cardsDeck[0].cards[this.state.cardCount].value === "KING" ||
      cardsDeck[0].cards[this.state.cardCount].value === "JACK"
    ) {
      tempScore += 10;
      this.setState({
        scoreBank: 10 + this.state.scoreBank,
        cardCount: this.state.cardCount + 1,
      });
      console.log("TEMPSCORE", tempScore);
    } else if (cardsDeck[0].cards[this.state.cardCount].value === "ACE") {
      tempScore += 1;
      this.setState({
        scoreBank: 1 + this.state.scoreBank,
        cardCount: this.state.cardCount + 1,
      });
      console.log("TEMPSCORE", tempScore);
    } else {
      //Score des cartes standards
      tempScore += bankScore;
      this.setState({
        scoreBank: bankScore + this.state.scoreBank,
        cardCount: this.state.cardCount + 1,
      });
      console.log("TEMPSCORE", tempScore);
    }
  }

  // Fonction tirage cartes joueur et ajout au score
  drawCard() {
    let playerScore = cardsDeck[0].cards[this.state.cardCount].value;

    console.log(playerScore);

    playerScore = parseInt(playerScore);

    // Récupération de l'image et valeur de la carte tirée
    this.setState({
      playerCard: [
        cardsDeck[0].cards[this.state.cardCount].image,
        ...this.state.playerCard,
      ],
      playerCardValue: [
        cardsDeck[0].cards[this.state.cardCount].value,
        ...this.state.playerCardValue,
      ],
    });
    console.log(this.state.playerCardValue);

    // Score spécifiques pour les "têtes" (+10 ou +1 pour l'AS)
    if (
      cardsDeck[0].cards[this.state.cardCount].value === "QUEEN" ||
      cardsDeck[0].cards[this.state.cardCount].value === "KING" ||
      cardsDeck[0].cards[this.state.cardCount].value === "JACK"
    ) {
      this.setState({
        scorePlayer: 10 + this.state.scorePlayer,
        cardCount: this.state.cardCount + 1,
      });
    } else if (cardsDeck[0].cards[this.state.cardCount].value === "ACE") {
      this.setState({
        scorePlayer: 1 + this.state.scorePlayer,
        cardCount: this.state.cardCount + 1,
      });
    } else {
      //Score des cartes standards
      this.setState({
        scorePlayer: playerScore + this.state.scorePlayer,
        cardCount: this.state.cardCount + 1,
      });
    }
  }

  // FONCTION DE FIN DE PARTIE
  endGame() {
    console.log("endGame");

    // APPEL FONCTION DE TIRAGE AUTOMATIQUE D'UNE CARTE SI LA BANQUE EST EN DESSOUS DE 17 AU MOMENT DE TERMINER LE JEU
    console.log("TEMPSCORE", tempScore);
    if (this.state.scorePlayer !== 0 && this.state.scoreBank !== 0) {
      if (tempScore < 17) {
        this.autoBankDraw();
      }

      // WIN ou LOOSE : Comparaison des scores
      if (
        (this.state.scorePlayer <= 21 && this.state.scorePlayer > tempScore) ||
        tempScore > 21
      ) {
        setTimeout(
          () =>
            this.setState({
              messageResult: "WINNER",
              totalScorePlayer: this.state.totalScorePlayer + 1,
            }),
          1500
        );
      } else {
        setTimeout(
          () =>
            this.setState({
              messageResult: "LOOSER",
              totalScoreBank: this.state.totalScoreBank + 1,
            }),
          1500
        );
      }
    } else {
      // GUARD : Evite de finir le jeu avant d'avoir commencé
      alert("Lance d'abord le jeu");
    }
  }

  // RENDER
  render() {
    if (this.state.messageResult === "WINNER") {
      return (
        <Result
          resultGame={require("./assets/images/win.jpg")}
          reset={this.reset}
        />
      );
    } else if (this.state.messageResult === "LOOSER") {
      return (
        <Result
          resultGame={require("./assets/images/lose.jpg")}
          reset={this.reset}
        />
      );
    } else if (this.state.messageResult === "") {
      return (
        <div className="app-container">
          {/* Header */}

          <Header />

          <div className="content-container">
            {/* High Page */}

            <div className="title-container">
              <img className="logo" src={require("./assets/images/Logo.png")} />

              <h1>BlackJack</h1>
            </div>

            {/* Croupier Part */}

            <div className="main-container">
              <div className="title-score-div">
                <h3 className="title-score-">Score Total</h3>
                <h3 className="title-score-">Score cartes</h3>
              </div>
              <div className="game-container">
                <div className="player-container croupier-container">
                  <div className="card-container">
                    <Score
                      score={this.state.totalScoreBank}
                      scoreType="total-score"
                      children="Dealer"
                      nameScore="score-div-left"
                    />
                    <Cards cards={this.state.bankCards} />
                    <Score
                      score={this.state.scoreBank}
                      scoreType="current-score"
                      children="Dealer"
                      nameScore="score-div-right"
                    />
                  </div>
                </div>

                {/* Player Part */}

                <div className="player-container player1-container">
                  <div className="card-container">
                    <Score
                      score={this.state.totalScorePlayer}
                      scoreType="total-score"
                      children="Joueur"
                      nameScore="score-div-left"
                    />
                    <Cards cards={this.state.playerCard} />
                    <Score
                      score={this.state.scorePlayer}
                      scoreType="current-score"
                      children="Joueur"
                      nameScore="score-div-right"
                    />
                  </div>
                </div>
              </div>

              <Players children="Votre Main" color="#fff" />
            </div>

            {/* Choice Button */}

            <div className="btn-group">
              <Button
                buttonColor="reset"
                onClick={this.reset}
                children="Jouer"
              />
              <Button
                buttonColor="draw"
                onClick={this.drawCard}
                children="Tirer Carte"
              />
              <Button
                buttonColor="stop"
                onClick={() => this.endGame()}
                children="Passer"
              />
            </div>
          </div>

          {/* Footer */}
          <footer className="footer">
            <Footer />
          </footer>
        </div>
      );
    }
  }
}

export default App;
