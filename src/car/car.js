class Car {
    constructor(x, y, width, height, controlType, maxSpeed=3) {
        this.x= x
        this.y=y
        this.width=width
        this.height=height

        this.speed = 0;
        this.acceleration = 0.2;
        this.angle = 0;

        this.maxSpeed = maxSpeed;
        this.maxSpeedRev = -1.5;
        this.friction = 0.05;

        this.damaged = false;

        if(controlType !='DUMMY') {
            this.sensor = new Sensor(this);
        }

        this.controls = new Controls(controlType);
    }

    update(roadBorders, traffic) {
        if(!this.damaged) {
            this.#move();
            this.polygon = this.#createPolygon();
            this.damaged = this.#assessDamage(roadBorders, traffic);
        }

        if(this.sensor) {
            this.sensor.update(roadBorders, traffic);
        }
    }

    #assessDamage(roadBorders, traffic) {
        for(let i=0; i<roadBorders.length; i++) {
            if(polygonsIntersect(this.polygon, roadBorders[i])) {
                return true;
            }
        }

        for(let i=0; i<traffic.length; i++) {
            if(polygonsIntersect(this.polygon, traffic[i].polygon)) {
                return true;
            }
        }

        return false;
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

    #createPolygon() {
        let points=[];
        let rad = Math.hypot(this.width, this.height)/2;
        let alpha = Math.atan2(this.width, this.height);

        // 45°
        points.push({
            x: this.x-Math.sin(this.angle-alpha)*rad,
            y: this.y-Math.cos(this.angle-alpha)*rad
        })

        // 135°
        points.push({
            x: this.x-Math.sin(this.angle+alpha)*rad,
            y: this.y-Math.cos(this.angle+alpha)*rad
        })

        // 225°
        points.push({
            x: this.x-Math.sin(Math.PI+this.angle-alpha)*rad,
            y: this.y-Math.cos(Math.PI+this.angle-alpha)*rad
        })

        // 315°
        points.push({
            x: this.x-Math.sin(Math.PI+this.angle+alpha)*rad,
            y: this.y-Math.cos(Math.PI+this.angle+alpha)*rad
        })

        return points;
    }

    draw(ctx, color) {
        
        let carPaint = this.damaged? 'red' : color;

        ctx.beginPath();
        ctx.moveTo(this.polygon[0].x, this.polygon[0].y);
        ctx.fillStyle = carPaint;

        for(let i = 1; i<this.polygon.length; i++) {
            ctx.lineTo(this.polygon[i].x, this.polygon[i].y);
        }

        ctx.fill();

        if(this.sensor) {
            this.sensor.draw(ctx);
        }
    };
}