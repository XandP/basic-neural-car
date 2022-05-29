let canvas = document.getElementById('myCanvas');
canvas.width = 200;

let ctx = canvas.getContext('2d');
let car = new Car(100, 100, 30, 50);

var carPaint = ctx.createLinearGradient(0, 15, 0, -10);
car.draw(ctx);


animate();

function animate() {
    car.update();
    canvas.height = window.innerHeight;
    carPaint.addColorStop(1, "red");
    carPaint.addColorStop(0, "blue");
    ctx.fillStyle = carPaint;
    car.draw(ctx);

    requestAnimationFrame(animate);
}