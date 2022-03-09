document.addEventListener("DOMContentLoaded", function() {
  
    // Hide play buttons
    document.querySelector('#hit').style.visibility = 'hidden';
    document.querySelector('#stand').style.visibility = 'hidden';

    calcPlayerBankOnWager();
    

    document.querySelector('#deal').addEventListener('click', function() {
        // Hide 'deal' button once play begins
        document.querySelector('#deal').style.display = "none";
        freezeWager();

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
        document.querySelector('#bank-acct').innerHTML = calcPlayerBankOnWager();
        console.log(calcPlayerBankOnWager());
    });

    const suit = ['Clubs', 'Diamonds', 'Hearts', 'Spades'];
    const faceVal = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'Jack', 'Queen', 'King', 'Ace'];
    const playerHand = [];
    const dealerHand = [];
    var playingDeck = [];
    var amtForward = 0;
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
        // Check for 21 on initial deal, if present declare winner
        if (isNatural(arr) && !isNatural(playerHand)) {
            document.querySelector('#dealer-wins').style.display = "block";
            endGame();
            console.log('Dealer wins');
        }
    }

    function showPlayer(arr) {
        for (let card in arr) {
            let cardDiv = document.createElement('div');
            showCardSuit(arr[card].suit, cardDiv);
            cardDiv.innerHTML += arr[card].faceVal;
            document.querySelector('#player-cards').appendChild(cardDiv);
        }
        // Check for 21 on initial deal, if present declare winner
        if (isNatural(arr) && !isNatural(dealerHand)) {
            document.querySelector('#player-wins').style.display = "block";
            endGame();
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
        // After initial deal, subsequent Aces have value of 1
        var aceCount = calcAceValue(playerHand, "Ace");
        sum -= aceCount * 10;
        console.log("Player hand count" + sum);
        if (sum > 21) {
            // Show winner
            document.querySelector('#dealer-wins').style.display = "block";
            endGame();
            // Show dealer hidden card & remove border
            document.querySelectorAll('#dealer-card1 *').forEach(function(card) {
                card.style.opacity = '1';
            });
            document.querySelector('#dealer-card1').style.borderStyle = 'none';
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

        var playerHandSum = playerHand.reduce(function(previousVal, currentVal) {
            return parseInt(previousVal) + parseInt(currentVal.val);
        }, 0);
        // Uncover second card
        document.querySelectorAll('#dealer-card1 *').forEach(function(card) {
            card.style.opacity = "1";
        });
        document.querySelector('#dealer-card1').style.borderStyle = "none";
        document.querySelector('#hit').style.visibility = 'hidden';
        //isDealerWinOnFirstDeal(initialHandValue(dealerHand), initialHandValue(playerHand));
        let sum = 0;
        // If dealer's initial hand is under 17, dealer must deal until reaching at least 17
        if (parseInt(initialHandValue(dealerHand)) < 17) {
            console.log("Initial hand value under 17");
            while(sum < 17) {
                sum = 0;
                var nextCard = deck.pop();
                dealerHand.push(nextCard);
                showDealerCard(nextCard);
                sum = dealerHand.reduce(function(previousVal, currentVal) {
                    return parseInt(previousVal) + parseInt(currentVal.val);
                }, 0);
                // Aces after initial deal must have value of 1
                let result = dealerHand.find(isAce);
                if (result) {
                    sum -= 10;
                }
                if (sum > 21) {
                    document.querySelector('#player-wins').style.display = "block";
                    endGame();
                    console.log("Dealer busted" + sum);
                }
                console.log("Dealer hand sum:" + sum);
            } // end while loop
            // If hand is over 21, dealer busts.  Player wins.
            
        }
        let dealerInitialSum = dealerHand.reduce(function(previousVal, currentVal) {
            return parseInt(previousVal) + parseInt(currentVal.val);
        }, 0);
        console.log("Sum before logic" + dealerInitialSum);
        let aceCount = calcAceValue(playerHand, "Ace");
        dealerInitialSum -= aceCount * 10;

        // If dealer first two cards are greater than players cards after stand
            // dealer wins
        if ((dealerInitialSum > 16 && dealerInitialSum < 22) && playerHandSum < dealerInitialSum) {
            document.querySelector('#dealer-wins').style.display = "block";
            endGame();
            console.log("Dealer wins");
            console.log("Dealer" + dealerInitialSum);
            console.log("Player:" + playerHandSum);
        }
        if ((dealerInitialSum > 16 && dealerInitialSum < 22) && (playerHandSum > dealerInitialSum && playerHandSum < 22)) {
            document.querySelector('#player-wins').style.display = "block";
            endGame();
            console.log("Player wins");
            console.log("Dealer" + dealerInitialSum);
            console.log("Player:" + playerHandSum);
        }
        if (dealerInitialSum == playerHandSum) {
            document.querySelector('#tie').style.display = "block";
            endGame();
            console.log("Tie");
            console.log("Dealer" + dealerInitialSum);
            console.log("Player:" + playerHandSum);
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

    // Determine winner on initial deal
    function isDealerWinOnFirstDeal(dealerCount, playerCount) {
        if (dealerCount > 16 && (playerCount < dealerCount)) {
            document.querySelector('#dealer-wins').style.display = "block";
            endGame();
            console.log("Dealer wins with: " + dealerCount);
        }
    }

    function endGame() {
        // Gray out game table
        document.querySelectorAll('.cards').forEach(function(card) {
            card.classList.add('game-over');
        });
        // Remove game control buttons
        document.querySelectorAll('.game-btns').forEach(function(btn) {
        btn.style.display = 'none';
    });
        // Show button for new game
        document.querySelector('#play-game').style.visibility = "visible";
    }

    function freezeWager() {
        document.querySelector('#wager').setAttribute('disabled', '');
        console.log("Wager is frozen");
    }

    function calcPlayerBankOnWager() {
        var amount = document.querySelector('#bank-acct').innerHTML;
        document.querySelector('#wager').addEventListener('click', function(){
            var bankAmt = amount;
            var wager = document.querySelector('#wager').value;
            var currAmount = bankAmt - wager;
            console.log(currAmount);
            document.querySelector('#bank-acct').innerHTML = currAmount;
            console.log("The player is betting");
            console.log("Wager: " + wager);
            console.log("Stash: " + currAmount);
            amtForward = currAmount;
            console.log(amtForward);
        });
        return amtForward;
    }

    function setBankAcctBalance(amt) {
        document.querySelector('#bank-acct').innerHTML = amt;
        console.log(amt);
    }


    // Returns number of Aces in hand for total number of player cards
    function calcAceValue(objArr, val) {
        var count = objArr.filter(obj => obj.faceVal === val).length;
        console.log("Ace count:" + count);
        return count;
    }

    
});// End DOM content loaded