/*

    Blackjack Game

    A player gets 2 cards from the start - can get up to 21
    A dealer gets 2 cards(one of them you cannot see) - can get up to 21, but when dealing only up to 17

    To do:

    2. Fix UI/UX - make it look nice. Change alerts into an UI boxes that say that you win-lose or push

*/ 


const buttonStartGame = document.getElementById('buttonStartGame');
const playAgainButton = document.createElement('button');
playAgainButton.innerHTML = `Play Again`;
playAgainButton.className = 'btn_PlayAgain';

const gameScreen = document.getElementById('game');
let gameStarted = false;
let gameLock = false;

let playerMoney = 500;
let spanPlayerMoney = document.getElementById('spanPlayerMoney');
updateUI(spanPlayerMoney, `Balance: $${loadMoney()}`);

buttonStartGame.addEventListener('click', startGame);
playAgainButton.addEventListener('click', reloadGame);

function startGame() {
    let inputGameMoney = document.getElementById('inputGameMoney').value;
    
    if(inputGameMoney <= playerMoney) {
            if(inputGameMoney != '' && inputGameMoney > 0) {
                if(gameStarted == false) {
                    playerMoney = playerMoney - inputGameMoney;
                    saveInfo();
                    updateUI(spanPlayerMoney, `Balance: $${loadMoney()}`);
                    gameStarted = true;
                    let playerCards = [getRandomCard(1, 11), getRandomCard(1, 10)];
                    let dealerCards = [getRandomCard(1, 11), getRandomCard(1, 10)];
                    let totalPlayerCards = calculateTotal(playerCards);
                    let totalDealerCards = calculateTotal(dealerCards);

                    const hitButton = document.createElement('button');
                    hitButton.innerHTML = `Hit`;
                    hitButton.className = 'btn_Hit';
                    hitButton.addEventListener('click', () => {
                        if(gameLock == false) {
                            playerCards.push(getRandomCard(1, 11));
                            totalPlayerCards = calculateTotal(playerCards);
                            if(totalPlayerCards > 21) {
                                updateUI(playerCardText, `Your Cards: ${totalPlayerCards}`);
                                updateUI(dealerCardText, `Dealer Cards: ${totalDealerCards}`);
                                saveInfo();
                                gameLock = true;
                                gameScreen.appendChild(playAgainButton);
                                gameScreen.appendChild(showGUI("You busted!", "The dealer won."));
                            } else if(totalPlayerCards == 21) {
                                updateUI(playerCardText, `Your Cards: ${totalPlayerCards}`);
                                updateUI(dealerCardText, `Dealer Cards: ${totalDealerCards}`);
                                gameLock = true;
                                gameScreen.appendChild(playAgainButton);
                                gameScreen.appendChild(showGUI("Blackjack!", "The dealer has lost."));
                                playerMoney += inputGameMoney * 2.5;
                                saveInfo();
                            } else {
                                updateUI(playerCardText, `Your Cards: ${totalPlayerCards}`);
                            }
                        } else {
                            gameScreen.appendChild(showGUI("ERROR!", "You cannot hit because the game ended already."));
                        }
                    });

                    const standButton = document.createElement('button');
                    standButton.innerHTML = `Stand`;
                    standButton.className = 'btn_Stand';
                    standButton.addEventListener('click', () => {
                        if(gameLock == false) {
                            while(totalDealerCards < 17) {
                                dealerCards.push(getRandomCard(1, 11));
                                totalDealerCards = calculateTotal(dealerCards);
                            }
                            if(totalDealerCards > totalPlayerCards && totalDealerCards <= 21) {
                                updateUI(dealerCardText, `Dealer Cards: ${totalDealerCards}`);
                                saveInfo();
                                gameScreen.appendChild(playAgainButton);
                                gameScreen.appendChild(showGUI("You lost!", "The dealer won."));
                            } else if(totalDealerCards == totalPlayerCards) {
                                updateUI(dealerCardText, `Dealer Cards: ${totalDealerCards}`);
                                gameScreen.appendChild(playAgainButton);
                                gameScreen.appendChild(showGUI("Push!", "You and the dealer have a push."));
                                playerMoney = playerMoney + Number(inputGameMoney);
                                saveInfo();
                            } else {
                                updateUI(dealerCardText, `Dealer Cards: ${totalDealerCards}`);
                                gameScreen.appendChild(playAgainButton);
                                gameScreen.appendChild(showGUI("You won!", "The dealer has lost."));
                                playerMoney += inputGameMoney * 2;
                                saveInfo();
                               
                            }   
                        } else {
                            gameScreen.appendChild(showGUI("ERROR!", "You cannot stand because the game ended already."));
                        }
                        gameLock = true;
                    });
                    
                    const playerCardText = document.createElement('span');
                    playerCardText.innerHTML = `Your Cards: ${totalPlayerCards}`;

                    const dealerCardText = document.createElement('span');
                    dealerCardText.innerHTML = `Dealer Cards: ${dealerCards[0]}(one hidden)`;

                    gameScreen.appendChild(playerCardText);
                    gameScreen.appendChild(dealerCardText);
                    gameScreen.appendChild(hitButton);
                    gameScreen.appendChild(standButton);
                } else {
                    alert('You are already in a game!');
                }
        } else {
           gameScreen.appendChild(showGUI("ERROR!", "You need to enter a bet amount."));
        }

    } else {
        gameScreen.appendChild(showGUI("ERROR!", "You do not have enough money."));
    }   
}
window.onload = loadMoney();

function loadMoney() {
    playerMoney = Number(localStorage.getItem('money'));
    return playerMoney;
}

function showGUI(headText, text) {
    const GUI_div = document.createElement('div');
    setTimeout(() => {
        GUI_div.remove();
    }, 10000);
    GUI_div.id = 'GUI_div';
    const GUI_div_text = document.createElement('p');
    const GUI_div_headText = document.createElement('h1');

    GUI_div_headText.textContent = headText;
    GUI_div_text.textContent = text;

    GUI_div.id = 'GUI_div';

    GUI_div.appendChild(GUI_div_headText);
    GUI_div.appendChild(GUI_div_text);
    return GUI_div;
}

function givePlayerMoney(money) {
    playerMoney = playerMoney + money;
    window.location.reload();
    saveInfo();
}

function saveInfo() {
    localStorage.setItem('money', JSON.stringify(playerMoney));
    updateUI(spanPlayerMoney, `Balance: $${playerMoney}`);
}

function calculateTotal(cards) {
    return cards.reduce((sum, card) => sum + card, 0);
}

function getRandomCard(min, max) {
    const randomCard = Math.floor(Math.random() * (max - min + 1) + min);
    return randomCard;
}

function updateUI(target, value) {
    target.textContent = value;
}

function reloadGame() {
    gameScreen.innerHTML = '';
    gameStarted = false;
    gameLock = false;
    startGame();
}



