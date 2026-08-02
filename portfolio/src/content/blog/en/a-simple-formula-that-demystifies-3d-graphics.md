---
key: "3d-formula"
title: "A simple formula that demystifies 3D graphics"
description: "You can produce 'three-dimensional' graphics on two-dimensional planes by playing with perspective. It is by messing with tricks that fool human perception that software manages to convey the impression of depth."
date: 2025-12-29
tags: ["Graphics", "2D", "3D"]
cover: "/blog/simple-3D/explicacao-geometrica.jpeg"
# image_credit: {
#     text: "Photo by ",
#     url: ""
# }
language: "en"
---

## Introduction

You can produce 'three-dimensional' graphics on two-dimensional planes by playing with perspective. It is by messing with tricks that fool human perception that software manages to convey the impression of depth.

There is a very simple formula that helps pull this off:
``` latex
x' = x/z
y' = y/z
```
## Shall we work it out?

Picture a two-dimensional plane. As for the coordinates, picture (0, 0) in the middle. That is, in the middle of the plane, `x` and `y` are both zero.

![Cartesian Plane](/blog/simple-3D/plano-cartesiano.png)

That is what the `x` and the `y` in the expression above stand for: the position of a point described on a Cartesian plane. (3, 3) would be a point at the top right of that image, and (-3, 0) would be a point on the left, halfway up. (0, -3) would be at the bottom, in the centre.

The `z` is nothing more than one more axis on this graph. In this case, it would be a depth axis, running from front to back. Here, the larger the `z`, the further back the point is.

![Three-dimensional Cartesian plane with an observer](/blog/simple-3D/plano-cartesiano-3d-com-observador.png)

If further back means a larger `z`, we conclude that:
- **the further back, the larger the denominator.**

and:
- **the larger the denominator, the smaller the result.**

This matches the real world. Look through a window and picture a point at the top right. Now picture that point holding the same height and the same horizontal distance relative to you, but moving backwards.

If you picture that same action on a two-dimensional plane, you will notice that what happens is:
- the point shrinks, if you gave it a size;
- it seems to move vertically and horizontally towards the origin, which in three dimensions is only an optical illusion, but in two dimensions is the plain truth.

If you are still not convinced you have grasped what is going on, run an experiment. Put two objects on a table, one behind the other. Looking at them head-on, the second object will be behind the first. The moment you move to the right, for instance, you will notice that, *from your point of view*, the object further back sits further right than the one in front.

And indeed, if we take the objects to be at `x` = -100 (they are to the left, hence the negative), the first bottle at `z` = 10 and the second at `z` = 12.5, we see that the `x'` of the first and of the second become:
``` latex
x' (first bottle) = -100/10 = -10
x'' (second bottle) = -100/12.5 = -8
```

In other words, on our two-dimensional Cartesian plane, the second bottle would sit further right, because -8 > -10.

Since bottles have size and are not merely points, the second bottle would also be a little smaller, by extension of the same principle. This will make more sense shortly.

## An important detail

On a browser screen, the origin is defined as the topmost, leftmost point. The `x` axis therefore increases to the right, and `y` increases **downwards**. This is the convention for windows. So we have to map the values correctly and flip the vertical axis.

## What's the intuition?

Intuitively, it sounds right that things further from the observer should move towards the centre (think of enormous mountains that seem to sit in the centre of your vision, however many kilometres they stretch side to side), and that this ratio depends on the distance.

It also means that things further away appear to move more slowly relative to the observer, since any distance covered by the movement gets shrunk by the division with the distance (by the `/z` in the formula).

## Why does this formula work?

The maths behind it is simple and beautiful. We are only using the fact that the ratios between the sides of triangles with the same angles will always be the same.

![Geometric Explanation](/blog/simple-3D/explicacao-geometrica.jpeg)

## Demo (code)

We can apply this formula in a 2D context and get a sense of depth. Take this simple example in javascript:

``` html
<canvas id="game"></canvas>
```

``` javascript
const BACKGROUND = "#101010";
const FOREGROUND = "#00FF00";

const FPS = 60;


game.width = Math.min(window.screen.width, 800);
game.height = Math.min(window.screen.width, 800);

const ctx = game.getContext("2d");

function clear() {
  ctx.fillStyle = BACKGROUND;
  ctx.fillRect(0, 0, game.width, game.height);
}

function toScreen(p) {
  return {
    x: ((p.x + 1) * game.width) / 2,
    y: ((p.y * -1 + 1) * game.height) / 2,
  };
}

function point({ x, y }) {
  const pointSize = 5;
  ctx.fillStyle = FOREGROUND;
  ctx.fillRect(x - pointSize / 2, y - pointSize / 2, pointSize, pointSize);
}

function line(p1, p2) {
  ctx.strokeStyle = FOREGROUND;
  ctx.beginPath();
  ctx.moveTo(p1.x, p1.y);
  ctx.lineTo(p2.x, p2.y);
  ctx.stroke();
}

function project({ x, y, z }) {
  return {
    x: x / z,
    y: y / z,
  };
}

const vertices = [
  { x: -0.25, y: 0.25, z: 0.25 },
  { x: 0.25, y: 0.25, z: 0.25 },
  { x: 0.25, y: -0.25, z: 0.25 },
  { x: -0.25, y: -0.25, z: 0.25 },

  { x: -0.25, y: 0.25, z: -0.25 },
  { x: 0.25, y: 0.25, z: -0.25 },
  { x: 0.25, y: -0.25, z: -0.25 },
  { x: -0.25, y: -0.25, z: -0.25 },
];

const faces = [
  [0, 1, 2, 3],
  [4, 5, 6, 7],
  [0, 4],
  [1, 5],
  [2, 6],
  [3, 7],
];

function rotate_xz({ x, y, z }, angle) {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  return {
    x: x * c - z * s,
    y,
    z: x * s + z * c,
  };
}

function translate_z({ x, y, z }, dz) {
  return { x, y, z: z + dz };
}

let dz = 1;
let angle = 0;


function increment_dz(dt) {
  dz += .25 * dt;
}

function decrement_dz(dt) {
  dz -= .25 * dt;
}

let action = increment_dz;

function frame() {
  const dt = 1 / FPS;

  if (dz > 1.4) {
    action = decrement_dz;
  }
  
  if (dz < .4) {
    action = increment_dz;
  }
  
  action(dt);

  angle += Math.PI/3 * dt;
  clear();
  for (const v of vertices) {
    point(toScreen(project(translate_z(rotate_xz(v, angle), dz))));
  }
  for (const f of faces) {
    for (let i = 0; i < f.length; ++i) {
      const a = vertices[f[i]];
      const b = vertices[f[(i + 1) % f.length]];
      line(
        toScreen(project(translate_z(rotate_xz(a, angle), dz))),
        toScreen(project(translate_z(rotate_xz(b, angle), dz))),
      );
    }
  }
  setTimeout(frame, 1000 / FPS);
}
setTimeout(frame, 1000 / FPS);
```

## Demo (result)

<canvas id="game"></canvas>

<script>
const BACKGROUND = "#101010";
const FOREGROUND = "#00FF00";

const FPS = 60;


game.width = Math.min(window.screen.width, 800);
game.height = Math.min(window.screen.width, 800);

const ctx = game.getContext("2d");

function clear() {
  ctx.fillStyle = BACKGROUND;
  ctx.fillRect(0, 0, game.width, game.height);
}

function toScreen(p) {
  return {
    x: ((p.x + 1) * game.width) / 2,
    y: ((p.y * -1 + 1) * game.height) / 2,
  };
}

function point({ x, y }) {
  const pointSize = 5;
  ctx.fillStyle = FOREGROUND;
  ctx.fillRect(x - pointSize / 2, y - pointSize / 2, pointSize, pointSize);
}

function line(p1, p2) {
  ctx.strokeStyle = FOREGROUND;
  ctx.beginPath();
  ctx.moveTo(p1.x, p1.y);
  ctx.lineTo(p2.x, p2.y);
  ctx.stroke();
}

function project({ x, y, z }) {
  return {
    x: x / z,
    y: y / z,
  };
}

const vertices = [
  { x: -0.25, y: 0.25, z: 0.25 },
  { x: 0.25, y: 0.25, z: 0.25 },
  { x: 0.25, y: -0.25, z: 0.25 },
  { x: -0.25, y: -0.25, z: 0.25 },

  { x: -0.25, y: 0.25, z: -0.25 },
  { x: 0.25, y: 0.25, z: -0.25 },
  { x: 0.25, y: -0.25, z: -0.25 },
  { x: -0.25, y: -0.25, z: -0.25 },
];

const faces = [
  [0, 1, 2, 3],
  [4, 5, 6, 7],
  [0, 4],
  [1, 5],
  [2, 6],
  [3, 7],
];

function rotate_xz({ x, y, z }, angle) {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  return {
    x: x * c - z * s,
    y,
    z: x * s + z * c,
  };
}

function translate_z({ x, y, z }, dz) {
  return { x, y, z: z + dz };
}

let dz = 1;
let angle = 0;


function increment_dz(dt) {
  dz += .25 * dt;
}

function decrement_dz(dt) {
  dz -= .25 * dt;
}

let action = increment_dz;

function frame() {
  const dt = 1 / FPS;

  if (dz > 1.4) {
    action = decrement_dz;
  }
  
  if (dz < .4) {
    action = increment_dz;
  }
  
  action(dt);

  angle += Math.PI/3 * dt;
  clear();
  for (const v of vertices) {
    point(toScreen(project(translate_z(rotate_xz(v, angle), dz))));
  }
  for (const f of faces) {
    for (let i = 0; i < f.length; ++i) {
      const a = vertices[f[i]];
      const b = vertices[f[(i + 1) % f.length]];
      line(
        toScreen(project(translate_z(rotate_xz(a, angle), dz))),
        toScreen(project(translate_z(rotate_xz(b, angle), dz))),
      );
    }
  }
  setTimeout(frame, 1000 / FPS);
}
setTimeout(frame, 1000 / FPS);
</script>


## See more

See more about this in the [video](https://www.youtube.com/watch?v=qjWkNZ0SXfo) by the Tsoding channel.
