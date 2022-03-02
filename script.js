document.addEventListener("DOMContentLoaded", function() {
    
    document.querySelector('#deal').addEventListener('click', function() {
        var deck1 = makeDeck();
        var shuffledDeck = shuffleDeck(deck1);
        var dealtCards = dealCards(shuffledDeck);

        console.log("Let's play!");
    });

    document.querySelector('#hit').addEventListener('click', function() {
        hit(playingDeck, 10);
        console.log("Hit!");
    });


    document.querySelector('#stand').addEventListener('click', function() {
        console.log("Stand!");
    });

   

    const suit = ['Clubs', 'Diamonds', 'Hearts', 'Spades'];
    const faceVal = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'Jack', 'Queen', 'King', 'Ace'];
    const playerHand = [];
    const dealerHand = [];
    var playingDeck = [];
    var playerCardCount = 0;

    // Play Blackjack
    //var deck1 = makeDeck();
    //var shuffledDeck = shuffleDeck(deck1);
    //dealCards(shuffledDeck);


    /* For every suit, twelve objects containing suit and face value and card rank*/
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
        let deltCards = 4;
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
        initialHandValue(dealerHand);
        initialHandValue(playerHand);
        return playingDeck;
    }

    function showDealer(arr) {
        for (let card in arr) {
            let cardDiv = document.createElement('div');
            cardDiv.innerHTML = arr[card]["suit"];
            cardDiv.innerHTML += arr[card]["faceVal"];
            document.querySelector('#dealer-cards').appendChild(cardDiv);
        }
    }

    function showPlayer(arr) {
        for (let card in arr) {
            let cardDiv = document.createElement('div');
            cardDiv.innerHTML = arr[card]["suit"];
            cardDiv.innerHTML += arr[card]["faceVal"];
            document.querySelector('#player-cards').appendChild(cardDiv);
        }
    }

    function initialHandValue(arr) {
        var count = 0;
        for (let obj in arr) {
            count += arr[obj].val;
        }
        console.log("Initial hand value" + count);
        return count;
    }

    function showSuitIcon(arr) {

    }

    // Assign rank to cards based on face card
    function assignValue(arrItem) {
        var val;
        if (Number.isInteger(parseInt(arrItem))) {
            val = parseInt(arrItem);
        } else if ( arrItem == "Ace") {
            val = 10;
        } else {
            val = 10;
        }
        return val;
    }

    
    
    function hit(deck) {
        let sum = 0;
        var nextCard = deck.pop();
        showPlayerCard(nextCard);
        playerHand.push(nextCard);
        for (let item in playerHand) {
            sum += parseInt(playerHand[item].val);
        }
        console.log("Player hand count" + sum);
        return sum;
    }

    function showPlayerCard(card) {
        let cardDiv = document.createElement('div');
            cardDiv.innerHTML = card.suit;
            cardDiv.innerHTML += card.faceVal;
            document.querySelector('#player-cards').appendChild(cardDiv);
    }

    function calcHand(startVal, nextVal) {

    }


    console.log("DOM content parsed and loaded");
});// End DOM content loaded