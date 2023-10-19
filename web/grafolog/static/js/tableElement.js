    export default function tableElement(canvas, i, j, width, height, margin) {
    const c = canvas.getContext('2d');
    this.i = i;
    this.j = j;
    this.width = width;
    this.height = height;
    this.margin = margin;
    this.selected = false;

    this.Draw = function (row, col, val, type) {
        this.i = row;
        this.j = col;
        if (this.selected) {
            c.fillStyle = '#148dd9';
            c.fillRect(canvas.left + this.margin + this.i * this.width + 1,
                canvas.top + this.margin + this.j * this.height + 1,
                this.width - 2, this.height - 2);

        }
        switch (true) {
            case type === 0:
                c.fillStyle = "rgb(44,44,44)";
                break;
            case type === 1:
                c.fillStyle = "rgb(44,44,44)";
                break;
            case type === 2:
                c.fillStyle = "rgba(240, 240, 240, 80)";
                break;
            default:
                c.fillStyle = "rgba(115,115,115,0.70)";
                break;
        }
        c.fillText(val, canvas.left + this.margin + this.i * this.width + this.width / 2,
            canvas.top + this.margin + this.j * this.height + this.height / 2);
    }

    this.UpdateSize = function (width, height) {
        this.width = width;
        this.height = height;
    }
}