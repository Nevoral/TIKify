export default function Node(relx, rely, radius, id, canvas, color) {
    const c = canvas.getContext('2d');
    this.x = 0;
    this.y = 0;
    this.relX = relx;
    this.relY = rely;
    this.radius = radius;
    this.id = id;
    this.selected = false;

    this.Draw = function () {
        this.x = canvas.width * this.relX + canvas.left;
        this.y = canvas.height * this.relY + canvas.top;
        c.beginPath();
        c.strokeStyle = color;
        c.fillStyle = "#424547";
        c.lineWidth = 5;
        if (this.selected) {
            c.shadowBlur = 10;
            c.shadowColor = "black";
        }
        c.arc(this.x - canvas.left, this.y - canvas.top,this.radius,0,2 * Math.PI, false);
        c.closePath();
        c.fill();
        c.stroke();

        c.font= (radius*0.8).toString() + "px Comic Sans MS";
        c.fillStyle = "white";
        c.textAlign = "center";
        c.textBaseline = "middle";
        c.fillText(this.id, this.x - canvas.left, this.y - canvas.top);
        c.lineWidth = 1;
        c.shadowBlur = 0;
        c.shadowColor = "red";
    }
    this.UpdateCords = function () {
        this.relX = (this.x - canvas.left) / canvas.width;
        this.relY = (this.y - canvas.top) / canvas.height;
    }
    this.IsNodeSelected = function(x, y) {
        return x < this.x + this.radius &&
            x > this.x - this.radius &&
            y < this.y + this.radius &&
            y > this.y - this.radius;
    }
}