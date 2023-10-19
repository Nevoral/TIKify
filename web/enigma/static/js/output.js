export default function Output(canvas, relx, rely, radius, val) {
    this.radius = radius;
    this.val = val;
    this.selected = false;

    const c = canvas.getContext('2d');

    this.Draw = function () {
        const x = canvas.width / 3 + relx * canvas.width / 3;
        const y = rely * canvas.height;
        c.clearRect(x - this.radius, y - this.radius,
            this.radius * 2, this.radius * 2);
        c.beginPath();
        c.arc( x, y, this.radius, 0, Math.PI*2, false);
        if (this.selected) {
            c.fillStyle = "#bea032"
        } else {
            c.fillStyle = "#6c6868";
        }
        c.fill();
        c.closePath();
        c.font = '20px Arial';
        c.textAlign = 'center';
        c.textBaseline = 'middle';
        c.fillStyle = '#313131';
        c.fillText(this.val,  x, y);
    }
}