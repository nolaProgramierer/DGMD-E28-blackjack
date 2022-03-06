document.addEventListener("DOMContentLoaded", function() {

    // Hide play buttons
    document.querySelector('#hit').style.visibility = 'hidden';
    document.querySelector('#stand').style.visibility = 'hidden';
    
    document.querySelector('#deal').addEventListener('click', function() {
        // Hide 'deal' button once play begins
        document.querySelector('#deal').style.display = "none";

        var deck1 = makeDeck();
        var shuffledDeck = shuffleDeck(deck1);
        var dealtCards = dealCards(shuffledDeck);
        //Show play buttons
        document.querySelector('#hit').style.visibility = 'visible';
        document.querySelector('#stand').style.visibility = 'visible';

        console.log("Let's play!");
    });

    document.querySelector('#hit').addEventListener('click', function() {
        // Player begins and continues to play each card
        hit(playingDeck);
        console.log("Hit!");
    });

    document.querySelector('#stand').addEventListener('click', function() {
        // Dealer shows cards
        stand(playingDeck);
        console.log("Stand!");
    });

    document.querySelector('#play-game').addEventListener('click', function(){
        // Reload game
        location.reload();
    });

    const suit = ['Clubs', 'Diamonds', 'Hearts', 'Spades'];
    const faceVal = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'Jack', 'Queen', 'King', 'Ace'];
    const playerHand = [];
    const dealerHand = [];
    var playingDeck = [];
    var playerCardCount = 0;

    /* For every suit, twelve objects containing suit, card face value and card rank*/
    function makeDeck() {
        const deck = [];
        for (let i = 0; i < suit.length; i++) {
            for (let j = 0; j < faceVal.length; j++) {
                deck.push({
                    suit: suit[i],
                    faceVal: faceVal[j],
                    val: assignValue(faceVal[j])
                });
            }
        }
       console.log(deck);
       return deck;
    }

    function shuffleDeck(arr) {
        let temp;
        let randomIndex;
        /*Start at end of card deck, find a random index less than
        index of current deck count, assign last card value to temp,
        assign random index value to highest card index, then assign
        temp value to random index.
        */
        for (let i = arr.length - 1; i > 0; i--) {
            randomIndex = Math.floor(Math.random() * i);
            temp = arr[i];
            arr[i] = arr[randomIndex];
            arr[randomIndex] = temp;
        }
        return arr;
    }

    function dealCards(obArr) {
        let turn = 0;
        let deltCards = 4; // For 2 players
        for (let i = 0; i < deltCards; i++) {
            if (turn % 2 == 0) {
                playerHand.push(obArr.pop());
            }
            else {
                dealerHand.push(obArr.pop());
            }
        turn++;
        }
        playingDeck = obArr;
        showDealer(dealerHand);
        showPlayer(playerHand);
        // Calcuate value of dealt cards
        initialHandValue(dealerHand);
        initialHandValue(playerHand);
        return playingDeck;
    }

    function showDealer(arr) {
        for (let i = 0; i < arr.length; i++) {
            let cardDiv = document.createElement('div');
            // Set id for generated divs in order to target styling of dealer 2nd card
            cardDiv.setAttribute(`id`, `dealer-card${i}`);
            showCardSuit(arr[i].suit, cardDiv);
            cardDiv.innerHTML += `<span>${arr[i].faceVal}</span>`;
            document.querySelector('#dealer-cards').appendChild(cardDiv);
        }
        // Check for 21 on initial deal
        if (isNatural(arr)) {
            console.log('Player wins');
        }
    }

    function showPlayer(arr) {
        for (let card in arr) {
            let cardDiv = document.createElement('div');
            showCardSuit(arr[card].suit, cardDiv);
            cardDiv.innerHTML += arr[card].faceVal;
            document.querySelector('#player-cards').appendChild(cardDiv);
        }
        // Check for 21 on initial deal
        if (isNatural(arr)) {
            console.log('Player wins');
        }
    }

    // Callculate initial value of hands dealt
    function initialHandValue(arr) {
        let initialValue = 0;
        let count = arr.reduce(function(previousVal, currentVal) {
            return previousVal + currentVal.val;
        }, initialValue);
        console.log("Initial hand value" + count);
        return count;
    }

    // Assign numerical value of cards in hand
    function assignValue(arrItem) {
        var val;
        if (Number.isInteger(parseInt(arrItem))) {
            val = parseInt(arrItem);
        } else if ( arrItem == "Ace") {
            val = 11;
        } else {
            val = 10;
        }
        return val;
    }

    // Player plays
    function hit(deck) {
        let sum = 0;
        var nextCard = deck.pop();
        // Display card in browser
        showPlayerCard(nextCard);
        playerHand.push(nextCard);
        // Add card to existing hand and total values
        sum = playerHand.reduce(function(previousVal, currentVal) {
            return parseInt(previousVal) + parseInt(currentVal.val);
        }, 0);
        // Change value of Ace card if total hand will exceed 21
        var result = playerHand.find(isAce);
        if (result && sum > 10) {
            sum -= 10;
        }
        console.log("Player hand count" + sum);
        if (sum > 21) {
            document.querySelector('#dealer-wins').style.display = "block";
            document.querySelectorAll('.cards').forEach(function(card) {
                card.classList.add('game-over');
            });
            document.querySelectorAll('.game-btns').forEach(function(btn) {
                btn.style.display = 'none';
            });
            document.querySelector('#play-game').style.visibility = "visible";
            console.log("Dealer wins");
        }
        return sum;
    }

    // Display card on each successive call
    function showPlayerCard(card) {
        let cardDiv = document.createElement('div');
        showCardSuit(card.suit, cardDiv);
        cardDiv.innerHTML += card.faceVal;
        document.querySelector('#player-cards').appendChild(cardDiv);
    }

    // Display card on each successive call
    function showDealerCard(card) {
        let cardDiv = document.createElement('div');
        showCardSuit(card.suit, cardDiv);
        cardDiv.innerHTML += card.faceVal;
        document.querySelector('#dealer-cards').appendChild(cardDiv);
    }

    // Dealer plays
    function stand(deck) {
        // Uncover second card
        document.querySelectorAll('#dealer-card1 *').forEach(function(card) {
            card.style.opacity = "1";
        });
        document.querySelector('#dealer-card1').style.borderColor = "white";
        document.querySelector('#hit').style.visibility = 'hidden';
        let sum = 0;
        if (parseInt(initialHandValue(dealerHand)) < 17) {
            console.log("Initial hand value under 17");

            while(sum < 21 && sum < 17) {
                sum = 0;
                var nextCard = deck.pop();
                dealerHand.push(nextCard);
                showDealerCard(nextCard);
                sum = dealerHand.reduce(function(previousVal, currentVal) {
                    return parseInt(previousVal) + parseInt(currentVal.val);
                }, 0);
            console.log("Dealer hand sum:" + sum);
            
            // Change value of Ace card if total hand will exceed 21
            var result = dealerHand.find(isAce);
            if (result && sum > 11) {
                sum -= 10;
            }
            }
            if (sum > 21) {
                document.querySelector('#player-wins').style.display = "block";
                document.querySelectorAll('.cards').forEach(function(card) {
                    card.classList.add('game-over');
                });
                document.querySelectorAll('.game-btns').forEach(function(btn) {
                    btn.style.display = 'none';
                });
                document.querySelector('#play-game').style.visibility = "visible";
                console.log("Dealer busted" + sum);
            }
        }
    }

    // Display icon for card suit
    function showCardSuit(card, div) {
        switch(card) {
            case "Clubs":
                div.innerHTML = "<span>&clubs;</span>";
                break;
            case "Diamonds":
                div.innerHTML = "<span style='color:red'>&diams;</span>";
                break;
            case "Hearts":
                div.innerHTML = "<span style='color:red'>&hearts;</span>";
                break;
            case "Spades":
                div.innerHTML = "<span style=>&spades;</span>";
                break;
            default:
                console.log("This is an unknown suit");
        }
    }
    console.log("DOM content parsed and loaded");

    // Check initial deal hand for natural 21
    function isNatural(hand) {
        let  sum = hand.reduce(function(previousVal, currentVal) {
            return previousVal + currentVal.val;
        }, 0);
        if (sum == 21) {
            console.log("It's a natural");
        }
    }

    // Check for 'Ace' card
    function isAce(card) {
        return card.faceVal === "Ace";
    }
});// End DOM content loaded