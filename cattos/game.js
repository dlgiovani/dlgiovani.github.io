document.addEventListener("DOMContentLoaded", function() {
    let counter = 0;
    let max = 0;
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");


    const sprite = new Image();
    sprite.src = "images/nyansmol.png";
    /*
    http://www.rw-designer.com/icon-detail/6647 <- the nyan sprite
    */

    let x = 0;
    let y = Math.random() * canvas.height - sprite.height;
    if (y <= 0) {
        y *= -.7;
    };

    function getPos() {
        x = 0;
        y = Math.random() * canvas.height - sprite.height;
        if (y <= 0) {
            y *= -.7;
        }
    };
    document.addEventListener('click', function(event) {
        let mouseX = event.clientX - canvas.getBoundingClientRect().left;
        let mouseY = event.clientY - canvas.getBoundingClientRect().top;

        if (mouseX >= x && mouseX <= x + sprite.width && mouseY >= y && mouseY <= y + sprite.height) {
            getPos();
            counter++;
        }
    });

    let counterElem = document.getElementById('counter');
    let maxElem = document.getElementById('max');

    function gameLoop() {
        ctx.canvas.width = window.innerWidth;
        if (window.innerWidth <= 600) {
            ctx.canvas.height = window.innerHeight - 450;
        } else {
            ctx.canvas.height = window.innerHeight - 150;
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (counter > max) {
            max = counter;
        }

        if (x >= window.screen.width) {
            getPos();
            counter = 0;
        } else {
            x = x + (.5 + counter * .1);
        }
        ctx.drawImage(sprite, x, y);
        counterElem.innerHTML = counter;
        maxElem.innerHTML = max;

        requestAnimationFrame(gameLoop);
    }

    // Start the game loop
    gameLoop();
});
