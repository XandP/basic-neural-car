class Car {
    constructor(x, y, width, height) {
        this.x= x
        this.y=y
        this.width=width
        this.height=height

        this.speed = 0;
        this.acceleration = 0.2;
        this.angle = 0;

        this.maxSpeed = 3;
        this.maxSpeedRev = -1.5;
        this.friction = 0.05;

        this.controls = new Controls;
    }

    directional() {

        // Stops rotating without accelerating
        if (this.speed == 0)
            return


        let revert = this.speed > 0? true : false;

        if(this.controls.left) {
            this.angle = revert? this.angle + 0.03 : this.angle - 0.03;
        }

        if(this.controls.right) {
            this.angle = revert? this.angle - 0.03 : this.angle + 0.03;
        }
    }

    update() {
        this.#move();
    }

    #move() {
        // Direction
        if(this.controls.forward) {
            this.speed += this.acceleration;
        }

        if(this.controls.backward) {
            this.speed -= this.acceleration;
        }

        this.directional();



        // Speed cap
        if(this.speed > this.maxSpeed) {
            this.speed = this.maxSpeed;
        }

        if(this.speed < this.maxSpeedRev) {
            this.speed = this.maxSpeedRev;
        }

        if(Math.abs(this.speed)<this.friction) {
            this.speed = 0;
        }


        // Friction
        if(this.speed > 0) {
            this.speed -= this.friction;
        }

        if(this.speed < 0) {
            this.speed += this.friction;
        }


        this.x-=Math.sin(this.angle)*this.speed;
        this.y-=Math.cos(this.angle)*this.speed;
    }

    draw(ctx) {
        let carPaint = ctx.createLinearGradient(0, 15, 0, -10);

        ctx.save();

        carPaint.addColorStop(1, "red");
        carPaint.addColorStop(0, "blue");
        ctx.fillStyle = carPaint;

        ctx.translate(this.x, this.y);
        ctx.rotate(-this.angle);

        ctx.beginPath();
        ctx.fillRect(
            -this.width/2,
            -this.height/2,
            this.width,
            this.height
        );

        ctx.restore();
    };
}