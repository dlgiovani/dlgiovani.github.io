/*function mudarFundo(x) {
    if (x == 0) {
        document.getElementById('info').style.backgroundImage = "none";
    }
    if (x == 1) {
        document.getElementById('info').style.backgroundImage = "url(img/colorechobg.jpg)";
    }
    if (x == 2) {
        document.getElementById('info').style.backgroundImage = "url(img/investidores.png)";
    }
    if (x == 3) {
        document.getElementById('info').style.backgroundImage = "url(img/colorechobg.jpg)";
    }
}*/




function setVw() {
    let vw = document.documentElement.clientWidth / 100;
    document.documentElement.style.setProperty('--vw', `${vw}px`);
  }
  
  setVw();
  window.addEventListener('resize', setVw);

