export default function Plug(canvas, relx, rely, radius, val) {
    this.radius = radius;
    this.val = val;
    this.x = relx * canvas.width;
    this.y = rely * canvas.height;
    this.selected = false;

    const c = canvas.getContext('2d');

    this.Draw = function () {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI*2, false);
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
        c.fillText(this.val,  this.x, this.y);
    }

    this.Selected = function (x, y) {
        if (x >= this.x - this.radius && x <= this.x + this.radius &&
        y >= this.y - this.radius && y <= this.y + this.radius) {
            this.selected = !this.selected;
            return !!this.selected;
        }
        return false;
    }

    this.UpdateCords = function () {
        this.x = relx * canvas.width;
        this.y = rely * canvas.height;
    }
}