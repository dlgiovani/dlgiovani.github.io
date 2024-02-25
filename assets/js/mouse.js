// UPDATE: I was able to get this working again... Enjoy!

var cursor = document.querySelector('.cursor');
var a = document.querySelectorAll('a');

document.addEventListener('mousemove', function(e){
  cursor.style.transform = `translate3d(calc(${e.clientX}px - 50%), calc(${e.clientY}px - 50%), 0)`
});

document.addEventListener('mousedown', function(){
  cursor.classList.add('click');
});

document.addEventListener('mouseup', function(){
  cursor.classList.remove('click')
});

a.forEach(item => {
  item.addEventListener('mouseover', () => {
    cursor.classList.add('hover');
  });
  item.addEventListener('mouseleave', () => {
    cursor.classList.remove('hover');
  });
})

function updateGradient(event) {
  const containers = document.querySelectorAll('.illuminated');
  containers.forEach(container => {
      const rect = container.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;
      const gradientX = (mouseX - 80) ;
      const gradientY = (mouseY - 80) ;
      const gradient = `radial-gradient(circle at ${gradientX}% ${gradientY}%, #444, #111)`;
      container.style.background = gradient;
  });
}

// Event listener for mousemove
document.addEventListener('mousemove', updateGradient);