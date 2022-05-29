let canvas = document.getElementById('myCanvas');
canvas.width = 200;

let ctx = canvas.getContext('2d');
let road = new Road(canvas.width/2, canvas.width*0.9, 3);
let car = new Car(road.getLaneCenter(2), 100, 30, 50);

car.draw(ctx);


animate();

function animate() {
    car.update();

    canvas.height = window.innerHeight;

    ctx.save();
    ctx.translate(0,-car.y+canvas.height*0.7);
    road.draw(ctx);
    car.draw(ctx);

    ctx.restore();
    requestAnimationFrame(animate);
}