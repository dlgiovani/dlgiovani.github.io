// NOISE NOISE NOISE NOISE NOISE NOISE NOISE NOISE NOISE NOISE NOISE NOISE NOISE NOISE 

// noise.js

export function drawNoise(ctx, canvas) {
  const width = canvas.width;
  const height = canvas.height;
  const imageData = ctx.createImageData(width, height);
  const buffer = new Uint32Array(imageData.data.buffer);
  let color;

  function animate() {
    for (let i = 0; i < buffer.length -2; i+=2) {
      color = Math.random() * 50 - 10;
      buffer[i] = (255 << 24) | (color << 16) | (color << 8) | color;
      buffer[i+1] = (255 << 24) | (color << 16) | (color << 8) | color;
    }
    ctx.putImageData(imageData, 0, 0);
    // requestAnimationFrame(animate);
    setTimeout(() => {
      requestAnimationFrame(animate)}, 50)
    }
  animate();
}

export function callSetTimeout(canvas) {
  setTimeout(() => {
    canvas.classList.add('noise-animate');
  }, 0);
}


// NOISE NOISE NOISE NOISE NOISE NOISE NOISE NOISE NOISE NOISE NOISE NOISE NOISE NOISE