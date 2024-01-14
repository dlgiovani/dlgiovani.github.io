var audio = new Audio('assets/Driftveil-City.mp3');
audio.loop = true;

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomAnimation() {
    var randomValue = Math.random();

    var result = (randomValue < 0.5) ? 'moveImage ' : 'moveImage2 ';
  
    return result;
  }

function createRandomImage() {
    var gang = new Image();
    gang.src = 'assets/naruto-samba.gif';
    gang.style.position = 'absolute';
    gang.style.width = getRandomInt(50, 150) + 'px';
    gang.style.left = getRandomInt(0, window.innerWidth - parseInt(gang.style.width)) + 'px';
    gang.style.top = '0px';
    gang.style.mixBlendMode = 'multiply';
    gang.style.borderRadius = '5px'

    document.body.appendChild(gang);

    var animationDuration = getRandomInt(500, 8000);
    gang.style.animation = getRandomAnimation() + animationDuration + 'ms linear';

    setTimeout(function () {
        document.body.removeChild(gang);
    }, animationDuration);
}

function toggleDiv() {
    var coverDiv = document.getElementById("coverDiv");
    coverDiv.style.display = "none";

    var contentContainer = document.getElementById("contentContainer");
    contentContainer.style.display = "flex";

    audio.play()
    setInterval(createRandomImage, getRandomInt(1000, 3000));
    
}

