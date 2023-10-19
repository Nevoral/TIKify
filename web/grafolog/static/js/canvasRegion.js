export default function CanvasRegion(canvas, width, height, offsetX, offsetY) {
    this.width = width;
    this.height = height;
    this.left = offsetX;
    this.top = offsetY;
    this.right = offsetX + width;
    this.bottom = offsetY + height;

    // canvas.getContext('2d').fillRect(this.left, this.top, this.width, this.height);

    this.getContext = function (param) {
        return canvas.getContext(param);
    }

    this.updateSize = function (width, height, offsetX, offsetY) {
        this.width = width;
        this.height = height;
        this.left = offsetX;
        this.top = offsetY;
        this.right = offsetX + width;
        this.bottom = offsetY + height;
    }
}