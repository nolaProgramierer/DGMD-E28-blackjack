document.addEventListener("DOMContentLoaded", function() {
    document.querySelector('#hit').addEventListener('click', function() {
        console.log("Hit!");
    });

    document.querySelector('#stand').addEventListener('click', function() {
        console.log("Stand!");
    })

    console.log("DOM content parsed and loaded");
});// End DOM content loaded