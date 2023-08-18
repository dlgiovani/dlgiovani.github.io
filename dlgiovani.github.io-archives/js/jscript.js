function copyText() {
  var copyText = document.getElementById("genPassword");

  navigator.clipboard.writeText(copyText.innerText);
  
  alert("Copied the text: " + copyText.innerText);
}

document.addEventListener('DOMContentLoaded', function() {
  const textElements = ['I solve problems.', 'I create solutions.'];
  const delay = 2000; // Delay between text changes in milliseconds
  let currentIndex = 0;
  let currentText = '';
  let isDeleting = false;

  function type() {
    const currentTextIndex = currentIndex % textElements.length;
    const fullText = textElements[currentTextIndex];

    if (isDeleting) {
      currentText = fullText.substring(0, currentText.length - 1);
    } else {
      currentText = fullText.substring(0, currentText.length + 1);
    }

    document.getElementById('solutionsHover').textContent = currentText;

    let typingSpeed = 200; // Speed of typing characters in milliseconds

    if (isDeleting) {
      typingSpeed /= 2; // Speed up deletion
    }

    // Check if the current text is fully typed or deleted
    if (!isDeleting && currentText === fullText) {
      isDeleting = true;
      typingSpeed = delay; // Pause before starting deletion
    } else if (isDeleting && currentText === 'I') {
      isDeleting = false;
      currentIndex++;
      typingSpeed = 400; // Delay before typing the next text
    }

    setTimeout(type, typingSpeed);
  }

  type();
});

document.addEventListener('DOMContentLoaded', function() {
  var navbar = document.querySelector('.navbar');
  navbar.style.display = 'none';
});