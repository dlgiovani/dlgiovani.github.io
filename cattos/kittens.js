document.addEventListener('DOMContentLoaded', function(e) {
    e.preventDefault();
    for (let x = 50; x <= 1200; x += 50) {
        for (let y = 50; y <= 1200; y += 50) {
            // Create image element
            let factor = x - y
            if (factor * factor > 40000) {
                continue;
            }
            const img = document.createElement('img');

            // Set image source using template literal
            img.src = `https://placekitten.com/${x}/${y}`;
            img.style = 'max-width: 100vw;';

            // Append image to body
            document.body.appendChild(img);
        }
    }
});
