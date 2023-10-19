
export default function Wheel(canvas, radius, relX, relY, type, alphabet) {
    const c = canvas.getContext("2d");
    this.rotation = 0;
    this.selected = false;
    this.radius = radius * canvas.width;
    this.clickX = 0;
    this.clickY = 0;
    this.x = relX * canvas.width;
    this.y = relY * canvas.height;
    this.offset = 0;
    this.startOffset = 0;

    const step = (2 * Math.PI) / alphabet.length;

    this.Draw = function () {
        this.x = relX * canvas.width;
        this.y = relY * canvas.height;
        this.radius = radius * canvas.width;
        c.clearRect(this.x - this.radius * 1.1, this.y - this.radius * 1.1,
            this.radius * 2.2, this.radius * 2.2);
        this.rotation = this.rotation % (2 * Math.PI);
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
        c.fillStyle = "#e13d3d"
        c.fill();
        c.closePath();
        for (let i = 0; i < alphabet.length; i++) {
            const angle = (i * step + this.rotation) % (2 * Math.PI);
            const x = this.x + this.radius * Math.cos(angle + 3 * Math.PI / 2);
            const y = this.y + this.radius * Math.sin(angle + 3 * Math.PI / 2);

            c.save();
            c.translate(x, y);
            c.rotate(angle);
            c.beginPath();
            c.arc(0, 0, 15, 0, Math.PI*2, false);
            c.fillStyle = "#671d1d"
            c.fill();
            c.closePath();
            c.font = '20px Arial';
            c.textAlign = 'center';
            c.textBaseline = 'middle';
            c.fillStyle = '#dcdcdc';
            c.fillText(alphabet[i], 0, 0);
            c.restore();
        }       
    }
    this.UpdateRotation = function () {
        const zb = this.rotation % step;
        if (zb >= step / 2) {
            this.rotation = this.rotation - zb + step;
        } else {
            this.rotation = this.rotation - zb;
        }
        this.offset = this.GetOffset(Math.round(this.rotation / step));
        this.startOffset = this.offset;
    }

    this.Selected = function (x, y) {
        if (x >= this.x - this.radius && x <= this.x + this.radius &&
            y >= this.y - this.radius && y <= this.y + this.radius) {
            this.selected = true;
            this.clickX = x;
            this.clickY = y;
            return true;
        }
        return false;
    }

    this.GetAlphabet = function () {
        return alphabet;
    }

    this.GetOffset = function (offset) {
        if (offset === 0) {
            return 0;
        }
        if (offset > 0) {
            return offset;
        }
        return alphabet.length - offset;
    }

    this.AddStep = function () {
        this.rotation = this.rotation + step;
        this.offset = this.GetOffset(Math.round(this.rotation / step));
    }
}