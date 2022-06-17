var myHeaders = new Headers();

myHeaders.append('Content-Type', 'application/json');
myHeaders.append('Accept', 'application/json');
myHeaders.append('Access-Control-Allow-Credentials', 'true');
let data;
var myInit = { method: 'POST',
               headers: myHeaders,
               mode: 'cors',
               cache: 'default' };

let avg = 0;
let x = 0;
console.log("Hello, advanced user! :)")
function getCriptoInfo() {
  let obj;
  fetch("https://api.nomics.com/v1/currencies/ticker?key=689202df19036ccd2ed422ff647ba3052f95ca2a&ids=BTC,XRP,ETH,BNB,SOL,DOGE,SHIB,LTC&interval=1h,1d,30d&convert=BRL&per-page=100&page=1", myHeaders)  
  .then(response => response.json())
  .then(data => {
    //console.log(data) f*ck debug tools amir8?
    let root = document.querySelector(':root');
      
      x = parseInt(data[0].price)
      
      root.style.setProperty('--coin1graph', x.toString() + "em")
      root.style.setProperty('--coin1price', "'" + parseFloat(data[0].price).toFixed(2) + "'")
      root.style.setProperty('--coin1logo',  "url('" + data[0].logo_url + "')")

      x = parseInt(data[1].price)
      
      root.style.setProperty('--coin2graph', x.toString() + "em")
      root.style.setProperty('--coin2price', "'" + parseFloat(data[1].price).toFixed(2) + "'")
      root.style.setProperty('--coin2logo',  "url('" + data[1].logo_url + "')")

      x = parseInt(data[2].price)
      
      root.style.setProperty('--coin3graph', x.toString() + "em")
      root.style.setProperty('--coin3price', "'" + parseFloat(data[2].price).toFixed(2) + "'")
      root.style.setProperty('--coin3logo',  "url('" + data[2].logo_url + "')")

      x = parseInt(data[3].price)
      
      root.style.setProperty('--coin4graph', x.toString() + "em")
      root.style.setProperty('--coin4price', "'" + parseFloat(data[3].price).toFixed(2) + "'")
      root.style.setProperty('--coin4logo',  "url('" + data[3].logo_url + "')")

      x = parseInt(data[4].price)
      
      root.style.setProperty('--coin5graph', x.toString() + "em")
      root.style.setProperty('--coin5price', "'" + parseFloat(data[4].price).toFixed(2) + "'")
      root.style.setProperty('--coin5logo',  "url('" + data[4].logo_url + "')")

      x = parseInt(data[5].price)
      
      root.style.setProperty('--coin6graph', x.toString() + "em")
      root.style.setProperty('--coin6price', "'" + parseFloat(data[5].price).toFixed(2) + "'")
      root.style.setProperty('--coin6logo',  "url('" + data[5].logo_url + "')")

      x = parseInt(data[6].price)
      
      root.style.setProperty('--coin7graph', x.toString() + "em")
      root.style.setProperty('--coin7price', "'" + parseFloat(data[6].price).toFixed(2) + "'")
      root.style.setProperty('--coin7logo',  "url('" + data[6].logo_url + "')")

      x = parseInt(data[7].price)
      
      root.style.setProperty('--coin8graph', x.toString() + "em")
      root.style.setProperty('--coin8price', "'" + parseFloat(data[7].price).toFixed(2) + "'")
      root.style.setProperty('--coin8logo',  "url('" + data[7].logo_url + "')")

      avg = 0
      for (var i = 0; i < 8; i++) 
      {
        avg += parseInt(data[i].price, 10)
      }

      root.style.setProperty('--coinAveragePrice', avg * .05)
  })
};
console.log("Stop sniffing into my code. geez :/");
console.log("jk bro, have fun XD");


setTimeout(() => {getCriptoInfo()}, 1200);

var intervalId = window.setInterval(function(){
  getCriptoInfo();
}, 60000);



