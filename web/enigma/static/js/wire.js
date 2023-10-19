export default function Wire(canvas, plug1, plug2) {
    const c = canvas.getContext("2d");
    this.plug1 = plug1;
    this.plug2 = plug2;

    this.Draw = function () {
        c.beginPath();
        c.moveTo(this.plug1.x, this.plug1.y);
        c.lineTo(this.plug2.x, this.plug2.y);
        c.stroke();
        c.closePath();
    }
}