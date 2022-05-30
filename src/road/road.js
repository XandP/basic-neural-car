class Road {
    constructor(x, width, laneCount=1) {
        this.x=x;
        this.width=width
        this.laneCount=laneCount

        this.left=x-width/2;
        this.right=x+width/2;

        let bigInt = 1000000;
        this.top = -bigInt;
        this.bottom = bigInt


        let topLeft = {x:this.left, y:this.top};
        let topRight = {x:this.right, y:this.top};
        let bottomLeft = {x:this.left, y:this.bottom};
        let bottomRight = {x:this.right, y:this.bottom};

        this.borders = [
            [topLeft, bottomLeft],
            [topRight, bottomRight],
        ]
    }

    getLaneCentralized(laneIndex) {
        let laneWidth = this.width/this.laneCount;

        return this.left+laneWidth/2+laneIndex*laneWidth;
    }

    draw(ctx) {
        ctx.lineWidth=5;
        ctx.strokeStyle="white";

        for(let i=1; i<=this.laneCount-1; i++) {
            let x = lerp(
                this.left,
                this.right,
                i/this.laneCount
            );

            ctx.setLineDash([20,20]);
            ctx.beginPath();
            ctx.moveTo(x,this.top);
            ctx.lineTo(x,this.bottom);
            ctx.stroke();
        }

        ctx.setLineDash([])

        this.borders.forEach(border => {
            ctx.beginPath();
            ctx.moveTo(border[0].x, border[0].y);
            ctx.lineTo(border[1].x, border[1].y);
            ctx.stroke();
        });
    };
}