const paths = [
    '../../assets/two_balls/runtime.js',
    '../../assets/interactive_spheres/runtime.js'
    // '../../assets/torus_knot/runtime.js'
];

const randomPath = paths[Math.floor(Math.random() * paths.length)];

import(randomPath).then(module => {
    const { Application } = module;
    const canvas = document.getElementById('canvas3d');

    if (randomPath === '../../assets/interactive_spheres/runtime.js') {
        const app = new Application(canvas);
        app.load('./assets/interactive_spheres/scene.splinecode');

    // } else if (randomPath === '../../assets/torus_knot/runtime.js') {
    //     const app = new Application(canvas);
    //     app.load('./assets/torus_knot/scene.splinecode');

    } else {
        const app = new Application(canvas);
        app.load('./assets/two_balls/scene.splinecode');

    }
}).catch(error => {
    console.error('Failed to import module:', error);
});
