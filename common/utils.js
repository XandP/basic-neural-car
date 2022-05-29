function lerp(A,B,t) {
    return A+(B-A)*t;
};

function getIntersection(A, B, C ,D) {
    let tTop = (D.x-C.x)*(A.y-C.y)-(D.y-C.y)*(A.x-C.x);
    let uTop = (C.y-A.y)*(A.x-B.x)-(C.x-A.x)*(A.y-B.y);
    let bottom = (D.y-C.y)*(B.x-A.x)-(D.x-C.x)*(B.y-A.y);

    if (bottom != 0) {
        let t=tTop/bottom;
        let u=uTop/bottom;

        if(t>=0 && t<=1 && u>=0 && u<=1) {
            return {
                x:lerp(A.x, B.x, t),
                y:lerp(A.y, B.y, t),
                offset: t
            }
        }
    }

    return null;
}