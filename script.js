document.addEventListener("DOMContentLoaded", function() {
    
    document.querySelector('#deal').addEventListener('click', function() {
        // Hide button once play begins
        document.querySelector('#deal').style.display = "none";

        var deck1 = makeDeck();
        var shuffledDeck = shuffleDeck(deck1);
        var dealtCards = dealCards(shuffledDeck);

        console.log("Let's play!");
    });

    document.querySelector('#hit').addEventListener('click', function() {
        hit(playingDeck);
        console.log("Hit!");
    });

    document.querySelector('#stand').addEventListener('click', function() {
        stand(playingDeck);
        console.log("Stand!");
    });

    document.querySelector('#play-game').addEventListener('click', function(){
        location.reload();
    });

    const suit = ['Clubs', 'Diamonds', 'Hearts', 'Spades'];
    const faceVal = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'Jack', 'Queen', 'King', 'Ace'];
    const playerHand = [];
    const dealerHand = [];
    var playingDeck = [];
    var playerCardCount = 0;

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
        for (let i = 0; i < arr.length; i++) {
            let cardDiv = document.createElement('div');
            /*if (i == 1) {
                cardDiv.classList.add('hidden-card');
            }*/
            showCardSuit(arr[i].suit, cardDiv);
            cardDiv.innerHTML += arr[i].faceVal;
            document.querySelector('#dealer-cards').appendChild(cardDiv);
        }
    }

    function showPlayer(arr) {
        for (let card in arr) {
            let cardDiv = document.createElement('div');
            showCardSuit(arr[card].suit, cardDiv);
            cardDiv.innerHTML += arr[card].faceVal;
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
        if (sum > 21) {
            document.querySelector('#dealer-wins').style.display = "block";
            document.querySelectorAll('.cards').forEach(function(card) {
                card.classList.add('game-over');
            });
            document.querySelectorAll('.game-btns').forEach(function(btn) {
                btn.style.display = 'none';
            });
            document.querySelector('#play-game').style.visibility = "visible";
        }
        console.log("Dealer wins");
        return sum;
    }

    function showPlayerCard(card) {
        let cardDiv = document.createElement('div');
        showCardSuit(card.suit, cardDiv);
        cardDiv.innerHTML += card.faceVal;
        document.querySelector('#player-cards').appendChild(cardDiv);
    }

    function showDealerCard(card) {
        let cardDiv = document.createElement('div');
        showCardSuit(card.suit, cardDiv);
        cardDiv.innerHTML += card.faceVal;
        document.querySelector('#dealer-cards').appendChild(cardDiv);
    }

    function stand(deck) {
        // Uncover second card
        document.querySelectorAll('.hidden-card').forEach(function(card){
            card.classList.remove('.hidden-card');
        });
        let sum = 0;
        if (parseInt(initialHandValue(dealerHand)) < 17) {
            console.log("Initial hand value under 17");

            while(sum < 21 && sum < 17) {
                sum = 0;
                var nextCard = deck.pop();
                dealerHand.push(nextCard);
                showDealerCard(nextCard);
                for (let item in dealerHand) {
                    sum += parseInt(dealerHand[item].val);
                }
                console.log("Dealer hand sum:" + sum);
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
});// End DOM content loaded