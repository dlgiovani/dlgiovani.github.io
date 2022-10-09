function copyText() {
  var copyText = document.getElementById("genPassword");

  navigator.clipboard.writeText(copyText.innerText);
  
  alert("Copied the text: " + copyText.innerText);
}