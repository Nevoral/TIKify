export default function DrawingMenu(canvas, y, buttons) {
    this.x = canvas.width/2;
    this.y = y;
    this.radius = 20;
    this.width = buttons.length * 65 + this.radius * 2;
    this.height = 40;
    const c = canvas.getContext('2d');
    this.buttons = buttons;

    this.Draw = function() {
        this.x = canvas.width/2;
        c.beginPath();
        c.moveTo(this.x - this.width / 2 - this.radius, this.y)
        //top
        c.lineTo(this.x + this.width / 2 + this.radius, this.y)
        c.arcTo(this.x + this.width / 2, this.y, this.x + this.width / 2, this.y + this.radius, this.radius)
        //left
        c.lineTo(this.x + this.width / 2, this.y + this.height - this.radius)
        c.arcTo(this.x + this.width / 2, this.y + this.height, this.x - this.width / 2, this.y + this.height, this.radius)
        //botton
        c.lineTo(this.x - this.width / 2 + this.radius, this.y + this.height)
        c.arcTo(this.x - this.width / 2, this.y + this.height, this.x - this.width / 2, this.y, this.radius)
        //right
        c.lineTo(this.x - this.width / 2, this.y + this.radius)
        c.arcTo(this.x - this.width / 2, this.y, this.x - this.width / 2 - this.radius, this.y, this.radius)

        c.closePath();
        c.fillStyle = "#3d3d3d";
        c.fill();

        for (let i = 0; i < this.buttons.length; i++) {
            this.buttons[i].Draw(canvas.left + i * 65 + this.radius - this.width/2 + this.x, canvas.top + this.y + 2.5, 60, 35);
        }
    }
    this.SelectButton = function (x, y) {
        for (let i = 0; i < this.buttons.length; i++) {
            if (x > this.buttons[i].x && x < this.buttons[i].x + this.buttons[i].width &&
                y > this.buttons[i].y && y < this.buttons[i].y + this.buttons[i].height) {
                this.buttons[i].selected = !this.buttons[i].selected;
            } else {
                this.buttons[i].selected = false;
            }
        }
    }
}