import tableElement from "./tableElement.js";

export default function ConnTable(canvas, links, nodes) {
    const c = canvas.getContext('2d');
    this.tableEl = []

    const radius = 5; // Radius of rounded corners
    const margin = 10;

    this.wField = (canvas.width - 2.4 * margin) / (links.length + 1);
    this.hField = (canvas.height - 2.4 * margin) / (links.length + 1);

    // Draw vertical lines
    const offset = 1.2 * margin;

    for (let i = 0; i <= links.length; i++) {
        let elements = [];
        for (let j = 0; j <= links.length; j++) {
            elements.push(new tableElement(canvas, j, i, this.wField, this.hField, offset));
        }
        this.tableEl.push(elements);
    }

    this.UpdateDraw = function () {
        c.clearRect(canvas.left, canvas.top, canvas.width, canvas.height);
        this.Background();
        this.Table();
        this.tableEl[0][0].Draw(0, 0, "\\", 0);
        for (let i = 1; i <= nodes.length; i++) {
            this.tableEl[i][0].Draw(i, 0, nodes[i - 1], 0);
            this.tableEl[0][i].Draw(0, i, nodes[i - 1], 0);
            for (let j = 1; j <= nodes  .length; j++) {
                if (links[i - 1][j - 1] !== 0) {
                    this.tableEl[i][j].Draw(i, j, links[i - 1][j - 1], 1);
                    continue;
                }
                this.tableEl[i][j].Draw(i, j, links[i - 1][j - 1], 5);
            }
        }
    }

    this.UpdateSize = function () {
        this.wField = (canvas.width - 2.4 * margin) / (links.length + 1);
        this.hField = (canvas.height - 2.4 * margin) / (links.length + 1);
        for (let i = 0; i < this.tableEl.length; i++) {
            for (let j = 0; j < this.tableEl.length; j++) {
                this.tableEl[i][j].UpdateSize(this.wField, this.hField);
            }
        }
    }

    this.UpdateCanvas = function (can) {
        canvas.updateSize(Math.floor(can.width / 2) - can.getBoundingClientRect().left,
        Math.floor(can.height / 2) - can.getBoundingClientRect().top,
        can.getBoundingClientRect().left + Math.floor(can.width / 2),
            can.getBoundingClientRect().top);
    }

    this.DeleteRowCol = function () {
        const len = this.tableEl.length;
        for (let i = 0; i < len; i++) {
            this.tableEl[i].splice(len - 1, 1);
        }
        this.tableEl.splice(len - 1, 1);
    }

    this.AddRowCol = function () {
        const arr = [];
        const len = this.tableEl.length;
        for (let i = 0; i < len; i++) {
            arr.push(new tableElement(canvas, len, i, this.wField, this.hField, offset));
            this.tableEl[i].push(new tableElement(canvas, i, len, this.wField, this.hField, offset));
        }
        arr.push(new tableElement(canvas, len, len, this.wField, this.hField, offset));
        this.tableEl.push(arr);
    }

    this.SelectNode = function (node, val) {
        for (let i = 0; i < this.tableEl.length; i++) {
            this.tableEl[i][node].selected = val;
            this.tableEl[node][i].selected = val;
        }
    }

    this.Table = function () {
        // Draw vertical lines
        c.strokeStyle = "rgba(94,94,94,0.98)";
        c.lineWidth = 1;

        c.font = (this.hField * 0.8).toString() + "px Comic Sans MS";
        c.textAlign = "center";
        c.textBaseline = "middle";
        for (let i = 0; i < links.length; i++) {
            this.Borders(canvas.left + (i + 1) * this.wField + offset, canvas.top + offset,
                canvas.left + (i + 1) * this.wField + offset, canvas.bottom - offset);
            this.Borders(canvas.left + offset, canvas.top + (i + 1) * this.hField + offset,
                canvas.right - offset, canvas.top + (i + 1) * this.hField + offset);
        }
    }

    this.Borders = function (x1, y1, x2, y2) {
        c.beginPath();
        c.moveTo(x1, y1);
        c.lineTo(x2, y2);
        c.closePath();
        c.stroke();
    }

    this.Background = function () {
        // Add a shadow effect
        c.shadowBlur = margin; // Shadow blur radius
        c.shadowColor = "rgba(0, 0, 0, 0.5)"; // Shadow color (with opacity)
        c.shadowOffsetX = -margin; // Horizontal shadow offset
        c.shadowOffsetY = margin; // Vertical shadow offset

        // Draw the rounded rectangle
        c.fillStyle = "rgba(240, 240, 240, 80)"; // Fill color
        c.strokeStyle = "rgba(200, 200, 200, 80)"; // Stroke color
        c.lineWidth = 1; // Stroke width
        c.beginPath();
        c.moveTo(canvas.left + margin + radius, canvas.top + margin); // Move to top-left corner
        c.lineTo(canvas.right - margin - radius, canvas.top + margin); // Top edge
        c.arcTo(canvas.right - margin, canvas.top + margin,
            canvas.right - margin, canvas.top + margin + radius, radius); // Top-right corner
        c.lineTo(canvas.right - margin, canvas.bottom - margin - radius); // Right edge
        c.arcTo(canvas.right - margin, canvas.bottom - margin,
            canvas.right - margin - radius, canvas.bottom - margin, radius); // Bottom-right corner
        c.lineTo(canvas.left + margin + radius, canvas.bottom - margin); // Bottom edge
        c.arcTo(canvas.left + margin, canvas.bottom - margin,
            canvas.left + margin, canvas.bottom - margin - radius, radius); // Bottom-left corner
        c.lineTo(canvas.left + margin, canvas.top + margin + radius); // Left edge
        c.arcTo(canvas.left + margin, canvas.top + margin,
            canvas.left + margin + radius, canvas.top + margin, radius); // Top-left corner
        c.closePath();

        c.fill(); // Fill the rectangle
        c.stroke(); // Draw the stroke

        c.shadowBlur = 0;
        c.shadowColor = "transparent";
        c.shadowOffsetX = 0;
        c.shadowOffsetY = 0;
    }
}