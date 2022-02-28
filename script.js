document.addEventListener("DOMContentLoaded", function() {
    document.querySelector('#hit').addEventListener('click', function() {
        console.log("Hit!");
    });

    document.querySelector('#stand').addEventListener('click', function() {
        console.log("Stand!");
    });

   

    const suit = ['Clubs', 'Diamonds', 'Hearts', 'Spades'];
    const faceVal = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'Jack', 'Queen', 'King', 'Ace'];

    var deck1 = makeDeck();
    shuffleDeck(deck1);
    // Make a deck of cards
    function makeDeck() {
        const deck = [];
        for (let i = 0; i < suit.length; i++) {
            for (let j = 0; j < faceVal.length; j++) {
                deck.push({
                    suit: suit[i],
                    faceVal: faceVal[j]
                });
            }
        }
       console.log(deck);
       return deck;
    }

    function shuffleDeck(arr) {
        let temp;
        let randomIndex;
        for (let i = arr.length - 1; i > 0; i--) {
            randomIndex = Math.floor(Math.random() * i);
            temp = arr[i];
            arr[i] = arr[randomIndex];
            arr[randomIndex] = temp;
        }
        console.log(arr);
    }

    console.log("DOM content parsed and loaded");
});// End DOM content loaded