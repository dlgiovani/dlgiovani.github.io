// function setVw() {
//     let vw = document.documentElement.clientWidth / 100;
//     document.documentElement.style.setProperty('--vw', `${vw}px`);
//   }
  
//   setVw();
//   window.addEventListener('resize', setVw);

var prevScrollpos = window.pageYOffset;
window.onscroll = function() {scrollFunction()};

function scrollFunction()
{
    if (document.body.scrollTop > 4 || document.documentElement.scrollTop > 4) 
    {
        document.getElementById("header").style.height = "2.8em";
        var currentScrollPos = window.pageYOffset;
        if (prevScrollpos > currentScrollPos) {
          document.getElementById("header").style.top = "0";
        } else {
          document.getElementById("header").style.top = "-2.8em";
        }
        prevScrollpos = currentScrollPos;
    }
    else
    {
        document.getElementById("header").style.height = "3.5em";
    }
}
