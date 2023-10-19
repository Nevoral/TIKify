export default function Link(value, canvas, node1, node2, color, top){
    const c = canvas.getContext("2d");
    this.node1 = node1;
    this.node2 = node2;
    this.val = value;
    this.color = color;
    this.top = top;
    this.angle = 0;
    this.specAngle = 225;
    const arrowWidth = 3;
    const headlen = 10  ;

    this.Draw = function () {
        const [x1, y1, x2, y2, xm, ym] = this.GetCoords(this.node1.x, this.node1.y, this.node2.x, this.node2.y, this.node2.radius)
        c.strokeStyle = this.color;
        if (this.top < 3) {
            //drawing line betven points
            c.beginPath();
            c.moveTo(x1, y1);
            c.lineTo(x2, y2);
            c.lineWidth = arrowWidth;
            c.stroke();
        }
        if (this.top > 0 && this.top < 3) {
            this.LenIndicator(xm, ym);
            this.angle = Math.atan2(this.node2.y - this.node1.y, this.node2.x - this.node1.x);
            this.Arrow(x2, y2);
        }
        if (this.top === 2) {
            this.angle = Math.atan2(this.node1.y - this.node2.y, this.node1.x - this.node2.x);
            this.Arrow(x1, y1);
        }
        if (this.top === 3) {
            const dist = Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
            const vec = [(x2 - x1) / dist, (y2 - y1) / dist];
            const cp2 = [(x2  + vec[1] * this.node1.radius / 5) - (x1 + vec[0] * 2 * dist / 3 + vec[1] * this.node1.radius),
                (y2 - vec[0] * this.node1.radius / 5) - (y1 + vec[1] * 2 * dist / 3 - vec[0] * this.node1.radius)];
            c.beginPath();
            c.moveTo(x1 + vec[1] * this.node1.radius/5, y1 - vec[0] * this.node1.radius/5);
            c.bezierCurveTo(x1 + vec[0] * dist / 3 + vec[1] * this.node1.radius,
                y1 + vec[1] * dist / 3 - vec[0] * this.node1.radius,
                x1 + vec[0] * 2 * dist / 3 + vec[1] * this.node1.radius,
                y1 + vec[1] * 2 * dist / 3 - vec[0] * this.node1.radius,
                x2  + vec[1] * this.node1.radius/5, y2 - vec[0] * this.node1.radius/5);
            c.lineWidth = arrowWidth;
            c.stroke();
            this.LenIndicator(xm + vec[1] * this.node1.radius * 0.7, ym - vec[0] * this.node1.radius * 0.7);
            this.angle = Math.atan2(cp2[1], cp2[0]);
            this.Arrow(x2  + vec[1] * this.node1.radius/5, y2 - vec[0] * this.node1.radius/5);
        }
        let arrowVec = [];
        let fp = [];
        if (this.top > 3) {
            const sp = this.GetCoordsBezier(x1, y1, this.specAngle - 10, this.node1.radius);
            const cp1 = this.GetCoordsBezier(x1, y1, this.specAngle - 40, this.node1.radius * 5);
            const cp2 = this.GetCoordsBezier(x1, y1, this.specAngle + 40 , this.node1.radius * 5);
            fp = this.GetCoordsBezier(x1, y1, this.specAngle + 10, this.node1.radius);
            c.beginPath();
            c.moveTo(sp[0], sp[1]);
            c.bezierCurveTo(cp1[0], cp1[1], cp2[0], cp2[1], fp[0], fp[1]);
            c.lineWidth = arrowWidth;
            c.stroke();
            arrowVec = [fp[0] - cp2[0], fp[1] - cp2[1]];
        }
        if (this.top === 5) {
            const mp = this.GetCoordsBezier(x1, y1, this.specAngle, this.node1.radius * 3);
            this.LenIndicator(mp[0], mp[1]);
            this.angle = Math.atan2(arrowVec[1], arrowVec[0]);
            this.Arrow(fp[0],fp[1]);
        }
        c.restore();
    }
    this.Arrow = function (x, y) {
        c.fillStyle = this.color;
        c.beginPath();
        c.moveTo(x, y);
        c.lineTo(x - headlen * Math.cos(this.angle - Math.PI / 7),
            y - headlen * Math.sin(this.angle - Math.PI / 7))

        //path from the side point of the arrow, to the other side point
        c.lineTo(x - headlen * Math.cos(this.angle + Math.PI / 7),
            y - headlen * Math.sin(this.angle + Math.PI / 7));

        //path from the side point back to the tip of the arrow, and then
        //again to the opposite side point
        c.lineTo(x, y);
        c.lineTo(x - headlen * Math.cos(this.angle - Math.PI / 7),
            y - headlen * Math.sin(this.angle - Math.PI / 7));
        c.fill();
        c.stroke();
    }
    this.LenIndicator = function(x, y) {
        c.beginPath();
        c.fillStyle = "#424547";
        c.arc(x, y, this.node1.radius * 0.7, 0, 2 * Math.PI, false);
        c.fill();

        //Draw text
        c.font = (this.node1.radius * 0.8).toString() + "px Comic Sans MS";
        c.fillStyle = "white";
        c.textAlign = "center";
        c.textBaseline = "middle";
        c.fillText(this.val, x, y);
    }

    this.GetCoords = function (x1, y1, x2, y2, radius) {
        if (x1 === x2 && y1 === y2) {
            return [x1 - canvas.left, y1 - canvas.top, x1 - canvas.left, y1 - canvas.top, x1 - canvas.left, y1 - canvas.top]
        }
        const dist = Math.sqrt((x2-x1)**2+(y2-y1)**2);
        const vec = [(x2-x1)/dist,(y2-y1)/dist];
        const koef = 1.4;
        return [x1 + vec[0] * radius * koef - canvas.left, y1 + vec[1] * radius * koef - canvas.top,
            x1 + vec[0] * (dist - radius * koef) - canvas.left, y1 + vec[1] * (dist - radius * koef) - canvas.top,
            x1 + vec[0] * (dist / 2) - canvas.left, y1 + vec[1] * (dist / 2) - canvas.top];
    }
    this.GetCoordsBezier = function (x, y, angle, radius) {
        const koef = 1.4;
        const vec = [Math.sin(angle * Math.PI / 180), Math.cos(angle * Math.PI / 180)];
        return [x + vec[0] * radius * koef, y + vec[1] * radius * koef];
    }
}

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
}
