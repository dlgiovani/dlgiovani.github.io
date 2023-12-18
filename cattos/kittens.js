document.addEventListener('DOMContentLoaded', function(e) {
    e.preventDefault();
    for (let x = 50; x <= 1200; x += 50) {
        for (let y = 50; y <= 1200; y += 50) {
            let factor = x - y
            if (factor * factor > 40000) {
                continue;
            }
            const img = document.createElement('img');

            img.src = `https://placekitten.com/${x}/${y}`;
            img.style = 'max-width: 100vw;';

            document.body.appendChild(img);
        }
    }
});
