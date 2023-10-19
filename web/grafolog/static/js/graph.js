import Node from "./graphNodes.js";
import Link from "./graphLinks.js";
import SketchButton from "./button.js";
import DrawingMenu from "./controlMenu.js";
import CanvasRegion from "./canvasRegion";
import ConnTable from "./conTable";

export default function Graph(sketchCanvas) {
    this.canvas = new CanvasRegion(sketchCanvas,
        Math.floor(sketchCanvas.width / 2),
        sketchCanvas.height,
        sketchCanvas.getBoundingClientRect().left,
        sketchCanvas.getBoundingClientRect().top);

    const visualizationRegion = new CanvasRegion(sketchCanvas,
        Math.floor(sketchCanvas.width / 2) - sketchCanvas.getBoundingClientRect().left,
        Math.floor(sketchCanvas.height / 2) - sketchCanvas.getBoundingClientRect().top,
        sketchCanvas.getBoundingClientRect().left + Math.floor(sketchCanvas.width / 2),
        sketchCanvas.getBoundingClientRect().top + Math.floor(sketchCanvas.height / 2));

    const c = this.canvas.getContext('2d');
    this.nodes = [];
    this.nodesID = [];
    this.links = [];
    this.arrows = [];
    this.radius = 25;
    this.controlMenu = 0;
    this.buttons = [];
    this.nearTopCursor = false;
    this.selectedNodes = [];
    this.background = [];
    this.table = [];

    // Get the HTML element
    const data = document.getElementById("graph").getAttribute("data-graph-config");

    if (data !== "") {
        const graph = JSON.parse(data);
        this.radius = graph.radius

        //nodes
        for (let i = 0; i < graph.nodes.length; i++) {
            const node = graph.nodes[i];
            const linkin = [];
            for (let j = 0; j < graph.nodes.length; j++) {
                linkin.push(graph.connections[j][i])
            }
            this.links.push(linkin)
            this.nodes.push(new Node(node.relx, node.rely, graph.radius, node.id, this.canvas, '#148dd9'));
            this.nodesID.push(node.id);
        }
    }
    this.table = new ConnTable(new CanvasRegion(sketchCanvas,
        Math.floor(sketchCanvas.width / 2) - sketchCanvas.getBoundingClientRect().left,
        Math.floor(sketchCanvas.height / 2) - sketchCanvas.getBoundingClientRect().top,
        sketchCanvas.getBoundingClientRect().left + Math.floor(sketchCanvas.width / 2),
        sketchCanvas.getBoundingClientRect().top),
        this.links, this.nodesID);

    this.Draw = function () {
        this.arrows = [];
        const skip = [];
        for (let i = 0; i < this.nodes.length; i++) {
            this.nodes[i].Draw();
            for (let j = 0; j < this.nodes.length; j++) {
                let cont = false;
                for (let k = 0; k < skip.length; k++) {
                    if (skip[k][0] === i && skip[k][1] === j) {
                        cont = true;
                        skip.splice(k, 1);
                        break;
                    }
                }
                if (cont) {
                    continue
                }
                if (this.links[i][j] >= 1 && this.links[j][i] >= 1 && this.links[i][j] === this.links[j][i] && i !== j) {
                    this.arrows.push(new Link(this.links[i][j], this.canvas, this.nodes[i], this.nodes[j], '#424547', 2));
                    skip.push([j,i]);
                } else if (this.links[i][j] >= 1 && this.links[j][i] >= 1 && this.links[i][j] !== this.links[j][i] && i !== j) {
                    this.arrows.push(new Link(this.links[i][j], this.canvas, this.nodes[i], this.nodes[j], '#424547', 3));
                    this.arrows.push(new Link(this.links[j][i], this.canvas, this.nodes[j], this.nodes[i], '#424547', 3));
                    skip.push([j,i]);
                } else if (this.links[i][j] >= 1 && this.links[j][i] === 0) {
                    this.arrows.push(new Link(this.links[i][j], this.canvas, this.nodes[i], this.nodes[j], '#424547', 1));
                    skip.push([j,i]);
                } else if (this.links[i][j] > 0 && this.links[i][j] < 1 && this.links[j][i] > 0 && this.links[j][i] < 1 && i !== j) {
                    this.arrows.push(new Link(this.links[i][j], this.canvas, this.nodes[i], this.nodes[j], '#424547', 0));
                    skip.push([j,i]);
                } else if (this.links[i][j] > 0 && this.links[i][j] < 1 && i === j) {
                    this.arrows.push(new Link(this.links[i][j], this.canvas, this.nodes[i], this.nodes[j], '#424547', 4));
                } else if (this.links[i][j] >= 1 && i === j) {
                    this.arrows.push(new Link(this.links[i][j], this.canvas, this.nodes[i], this.nodes[j], '#424547', 5));
                }
            }
        }
    }

    this.initSketch = function () {
        const names = ["o", "x", "-", "->", "<->", "~", "drag", "sol"];
        const icon = ["node.png", "deleteNode.png", "minus.png",
            "arrow.png", "doubleArrow.png", "deleteArrow.png", "dragAndDrop.png", "solution.svg"];
        for (let i = 0; i < names.length; i++) {
            const img = new Image();
            img.onload = () => {
                c.globalCompositeOperation = "source-out";
            }
            img.src = "/grafolog/assets/" + icon[i];
            this.buttons.push(new SketchButton(this.canvas, names[i], false, img));
        }
        this.controlMenu = new DrawingMenu(this.canvas, 0, this.buttons);
    }

    this.UpdateDraw = function () {
        c.clearRect(0, 0, this.canvas.width + this.canvas.left, this.canvas.height + this.canvas.top);
        c.putImageData(this.background, 0, 0); //starting point of canvas not whole page
        for(let i=0; i < this.nodes.length; i++) {
            this.nodes[i].Draw();
        }
        for (let k = 0; k < this.arrows.length; k++) {
            this.arrows[k].Draw();
        }
        if (this.nearTopCursor) {
            this.controlMenu.Draw();
        }
    }

    this.UpdateRegions = function () {
        this.canvas.updateSize(
            Math.floor(sketchCanvas.width / 2),
            sketchCanvas.height,
            sketchCanvas.getBoundingClientRect().left,
            sketchCanvas.getBoundingClientRect().top);
        this.table.UpdateCanvas(sketchCanvas);

        visualizationRegion.updateSize(
            Math.floor(sketchCanvas.width / 2) - sketchCanvas.getBoundingClientRect().left,
            Math.floor(sketchCanvas.height / 2) - sketchCanvas.getBoundingClientRect().top,
            sketchCanvas.getBoundingClientRect().left + Math.floor(sketchCanvas.width / 2),
            sketchCanvas.getBoundingClientRect().top + Math.floor(sketchCanvas.height / 2));
    }

    this.GenBackground = function() {
        this.background = c.createImageData(this.canvas.width + this.canvas.left, this.canvas.height + this.canvas.top);
        const w = 30;
        const rows = Math.floor((this.canvas.height + this.canvas.top) / w);
        const columns = Math.floor((this.canvas.width + this.canvas.left) / w);
        for (let row = 0; row <= rows; row++) {
            for (let col = 0; col <= columns; col++) {
                if (col === columns) {
                    const wide = (this.canvas.width + this.canvas.left) % w;
                    this.DrawRect(col * w, row * w, wide, w, (row + col) % 2 === 0 ? 200 : 240);
                    continue;
                }
                if (row === rows) {
                    const height = (this.canvas.height + this.canvas.top) % w;
                    this.DrawRect(col * w, row * w, w, height, (row + col) % 2 === 0 ? 200 : 240);
                    continue;
                }
                this.DrawRect(col * w, row * w, w, w, (row + col) % 2 === 0 ? 200 : 240);
            }
        }
    }

    this.DrawRect = function(x, y, w, h, color) {
        for (let r = y; r < y + h; r++) {
            for (let c = x; c < x + w; c++) {
                const index = 4 * (r * (this.canvas.width + this.canvas.left) + c);
                this.background.data[index] = color; // Red channel
                this.background.data[index + 1] = color; // Green channel
                this.background.data[index + 2] = color; // Blue channel
                this.background.data[index + 3] = 80; // Alpha channel
            }
        }
    }

    this.DragNode = function (x, y) {
        for (let i = 0; i < this.nodes.length; i++) {
            if (this.nodes[i].IsNodeSelected(x,y)) {
                this.buttons[6].draging = true;
                this.buttons[6].DragNode = this.nodes[i];
                break;
            }
        }
    }

    this.SelectNode = function (x, y) {
        for (let i = 0; i < this.nodes.length; i++) {
            if (this.nodes[i].IsNodeSelected(x, y)) {
                this.nodes[i].selected = !this.nodes[i].selected;
                if (this.nodes[i].selected) {
                    this.selectedNodes.push(i);
                    this.table.SelectNode(i + 1, true);
                } else {
                    this.table.SelectNode(i + 1, false);
                    for (let j = 0; j < this.selectedNodes.length; j++) {
                        if (this.selectedNodes[j] === i) {
                            this.selectedNodes.splice(j, 1);
                        }
                    }
                    for (let j = 0; j < this.selectedNodes.length; j++) {
                        this.table.SelectNode(this.selectedNodes[j] + 1, true);
                    }
                }
                break;
            }
        }
    }

    this.AddNode = function (x, y) {
        if (y - this.canvas.top > 30 && x - this.canvas.left < this.canvas.right - 15) {
            for (let i = 0; i < this.nodes.length; i++) {
                this.links[i].push(0);
            }
            this.links.push(new Array(this.nodes.length + 1).fill(0));
            if (this.nodes.length === 0) {
                this.nodes.push(new Node(x / this.canvas.width, y / this.canvas.height, this.radius, 1, this.canvas, '#148dd9'));
                this.nodesID.push(1);
            } else {
                this.nodes.push(new Node((x - this.canvas.left) / this.canvas.width, (y - this.canvas.top) / this.canvas.height, this.radius, this.nodes[this.nodes.length - 1].id + 1, this.canvas, '#148dd9'));
                this.nodesID.push(this.nodes[this.nodes.length - 1].id);
            }
            this.table.AddRowCol();
            this.table.UpdateSize();
        }
    }

    this.DeleteNode = function (x, y) {
        for (let i = 0; i < this.nodes.length; i++) {
            if (this.nodes[i].IsNodeSelected(x,y)) {
                this.nodes.splice(i, 1);
                this.nodesID.splice(i, 1);
                for (let j = 0; j < this.links.length; j++) {
                    this.links[j].splice(i, 1);
                }
                this.links.splice(i, 1);
                this.table.DeleteRowCol();
                this.table.UpdateSize();
                break;
            }
        }
    }

    this.LinkNodes = function (value, type) {
        this.arrows.push(new Link(value, this.canvas, this.nodes[this.selectedNodes[0]], this.nodes[this.selectedNodes[1]], '#424547', type));
        this.links[this.selectedNodes[0]][this.selectedNodes[1]] = value;
        if (type !== 1) {
            this.links[this.selectedNodes[1]][this.selectedNodes[0]] = value;
        }
        this.Unselect(2);
        this.selectedNodes = [];
    }

    this.DeleteLink = function () {
        for (let i = 0; i < this.arrows.length; i++) {
            if ((this.nodes[this.selectedNodes[0]] === this.arrows[i].node1 && this.nodes[this.selectedNodes[1]] === this.arrows[i].node2) ||
                (this.nodes[this.selectedNodes[0]] === this.arrows[i].node2 && this.nodes[this.selectedNodes[1]] === this.arrows[i].node1)) {
                this.arrows.splice(i, 1);
                console.log(i)
                break;
            }
        }
        this.links[this.selectedNodes[0]][this.selectedNodes[1]] = 0;
        this.links[this.selectedNodes[1]][this.selectedNodes[0]] = 0;
        this.Unselect(2);
        this.selectedNodes = [];
    }

    this.Unselect = function(len) {
        for (let i = 0; i < len; i++) {
            this.nodes[this.selectedNodes[i]].selected = false;
            this.table.SelectNode(this.selectedNodes[i] + 1, false);
        }
    }

    this.SaveGraphJSON = function () {

    }
}

