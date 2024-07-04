// NOISE NOISE NOISE NOISE NOISE NOISE NOISE NOISE NOISE NOISE NOISE NOISE NOISE NOISE 

// noise.js

export function drawNoise(ctx, canvas) {
  const width = canvas.width;
  const height = canvas.height;
  const imageData = ctx.createImageData(width, height);
  const buffer = new Uint32Array(imageData.data.buffer);
  let color;

  function animate() {
    for (let i = 0; i < buffer.length; i++) {
      color = Math.random() * 255;
      buffer[i] = (255 << 24) | (color << 16) | (color << 8) | color;
    }
    ctx.putImageData(imageData, 0, 0);
    // requestAnimationFrame(animate);
    setTimeout(() => {
    requestAnimationFrame(animate)}, 80)
  }
  animate();
}

export function callSetTimeout(canvas) {
  setTimeout(() => {
    canvas.classList.add('noise-animate');
  }, 0);
}


// NOISE NOISE NOISE NOISE NOISE NOISE NOISE NOISE NOISE NOISE NOISE NOISE NOISE NOISE