export default function SketchButton(canvas, name, selected, icon) {
    const c = canvas.getContext('2d');
    this.x = 0;
    this.y = 0;
    this.width = 0;
    this.height = 0;
    this.name = name;
    this.selected = selected;
    this.icon = icon;
    this.draging = false;
    this.DragNode = 0;

    this.Draw = function(x,y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        if (this.selected) {
            c.fillStyle = "#232323";
            c.fillRect(this.x - canvas.left, this.y - canvas.top, this.width, this.height);
        } else {
            c.strokeStyle = "#232323";
            c.beginPath();
            c.rect(this.x - canvas.left, this.y - canvas.top, this.width, this.height)
            c.closePath();
            c.stroke()
        }
        if (this.icon.attributes.src.value === "") {
            c.font = "15px Comic Sans MS";
            c.fillStyle = "#adaaaa";
            c.textAlign = "center";
            c.textBaseline = "middle";
            c.fillText(this.name, this.x + this.width / 2 - canvas.left, this.y + this.height / 2 - canvas.top);
        } else {
            c.drawImage(this.icon, this.x + this.width / 2 - this.height / 2 - canvas.left, this.y - canvas.top, this.height, this.height);
        }
    }
}