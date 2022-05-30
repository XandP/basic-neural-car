class Sensor {
    constructor(car) {
        this.car = car;
        this.rayCount = 5;
        this.rayLength = 200;
        this.raySpread=Math.PI/2;

        this.rays = [];
        this.readings = [];
    }

    update(roadBorders, traffic) {
        this.#rayCasting();

        this.readings = [];

        for(let i=0; i<this.rays.length; i++) {

            this.readings.push(
                this.#getReading(
                    this.rays[i],
                    roadBorders,
                    traffic
                )
            );
        }
    }

    #getReading(ray, roadBorders, traffic) {
        let intersections = [];

        for(let i=0; i<roadBorders.length; i++) {

            let touch = getIntersection(
                ray[0],
                ray[1],
                roadBorders[i][0],
                roadBorders[i][1],
            );

            if(touch) {
                intersections.push(touch);
            }
        }

        for(let i=0; i<traffic.length; i++) {
            let poly = traffic[i].polygon;

            for(let j=0; j<poly.length; j++) {
                let value = getIntersection(
                    ray[0],
                    ray[1],
                    poly[j],
                    poly[(j+1) % poly.length]
                );

                if(value) {
                    intersections.push(value);
                }
            }
        }

        if(intersections.length == 0) {
            return null;
        }

        else {
            let offsets = intersections.map(e=>e.offset);
            let minOffset = Math.min(...offsets);

            return intersections.find(e=>e.offset==minOffset);
        }
    }

    #rayCasting() {
        this.rays=[];

        for(let i=0; i<this.rayCount; i++) {

            let rayAngle = lerp(
                this.raySpread/2,
                -this.raySpread/2,
                this.rayCount==1? 0.5 : i/(this.rayCount-1)
            )+this.car.angle;

            let start = {x: this.car.x, y: this.car.y}
            let end = {
                x: this.car.x
                    -Math.sin(rayAngle) * this.rayLength,
                y: this.car.y
                    -Math.cos(rayAngle) * this.rayLength
            }

            this.rays.push([start, end]);
        }
    }

    draw(ctx) {
        for(let i=0; i<this.rayCount; i++) {
            let end = this.rays[i][1];

            if(this.readings[i]) {
                end = this.readings[i];
            }


            this.#mainSensor(ctx, end, i);

            this.#imaginarySensor(ctx,end, i);
        }
    }

    #mainSensor(ctx, end, i) {
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'cyan';

        ctx.moveTo(
            this.rays[i][0].x,
            this.rays[i][0].y,
        );

        ctx.lineTo(
            end.x,
            end.y,
        );

        ctx.stroke();
    }

    #imaginarySensor(ctx, end, i) {

        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'red';

        ctx.moveTo(
            this.rays[i][1].x,
            this.rays[i][1].y,
        );

        ctx.lineTo(
            end.x,
            end.y,
        );

        ctx.stroke();
    }
}