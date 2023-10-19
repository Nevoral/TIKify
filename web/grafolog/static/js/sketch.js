import Node from "./graphNodes.js";
import Graph from "./graph.js";

const graph = document.getElementById('graph');
const c = graph.getContext('2d');

setSize(graph);
c.clearRect(0, 0, graph.width, graph.height);

const sketch = new Graph(graph);
sketch.initSketch();
sketch.Draw();
sketch.GenBackground();
sketch.UpdateDraw();
sketch.table.UpdateDraw();
setSize(graph);

window.addEventListener('resize', function () {
    setSize(graph);
    sketch.UpdateRegions();
    sketch.GenBackground();
    sketch.UpdateDraw();
    sketch.table.UpdateSize();
    sketch.table.UpdateDraw();
});

graph.onmousedown = function (event) {
    setSize(graph);
    switch (true) {
        case sketch.buttons[0].selected:
            sketch.AddNode(event.clientX, event.clientY);
            break;
        case sketch.buttons[1].selected:
            sketch.DeleteNode(event.clientX, event.clientY);
            sketch.Draw();
            break;
        case sketch.buttons[2].selected:
            sketch.SelectNode(event.clientX, event.clientY);
            if (sketch.selectedNodes.length === 2) {
                sketch.LinkNodes(0.5, 0);
            }
            break;
        case sketch.buttons[3].selected:
            sketch.SelectNode(event.clientX, event.clientY);
            if (sketch.selectedNodes.length === 2) {
                sketch.LinkNodes(2.5, 1);
            }
            break;
        case sketch.buttons[4].selected:
            sketch.SelectNode(event.clientX, event.clientY);
            if (sketch.selectedNodes.length === 2) {
                sketch.LinkNodes(2.5, 2);
            }
            break;
        case sketch.buttons[5].selected:
            sketch.SelectNode(event.clientX, event.clientY);
            if (sketch.selectedNodes.length === 2) {
                sketch.DeleteLink();
                sketch.Draw();
            }
            break;
        case sketch.buttons[6].selected:
            sketch.DragNode(event.clientX, event.clientY);
            break;
        case sketch.buttons[7].selected:
            sketch.SelectNode(event.clientX, event.clientY);
            break;

    }
    if (sketch.nearTopCursor &&
        event.clientX > sketch.controlMenu.x - sketch.controlMenu.width/2 - sketch.controlMenu.radius + sketch.canvas.left &&
        event.clientX < sketch.controlMenu.x + sketch.controlMenu.width/2 - sketch.controlMenu.radius + sketch.canvas.left) {
        sketch.controlMenu.SelectButton(event.clientX, event.clientY)
    }
    sketch.UpdateDraw();
    sketch.table.UpdateDraw();
};

graph.onmousemove = function (event) {
    setSize(graph);
    if (sketch.buttons[6].draging) {
        if (event.clientY < sketch.canvas.bottom - 15 + sketch.canvas.top && event.clientY > sketch.canvas.top + 15) {
            sketch.buttons[6].DragNode.y = event.clientY;
        }
        if (event.clientX < sketch.canvas.right - 15 + sketch.canvas.left && event.clientX > sketch.canvas.left + 15) {
            sketch.buttons[6].DragNode.x = event.clientX;
        }
        sketch.buttons[6].DragNode.UpdateCords();
    }
    sketch.nearTopCursor = event.clientY - sketch.canvas.top <= 10 ||
        (event.clientY - sketch.canvas.top <= 50 && sketch.nearTopCursor);
    // console.log(sketch);
    sketch.UpdateDraw();
    sketch.table.UpdateDraw();
};

graph.onmouseup = function (event) {
    sketch.buttons[6].draging = false;
    sketch.buttons[6].DragNode = 0;
};


function setSize(graph) {
    graph.height = (window.innerHeight - graph.getBoundingClientRect().top - 16);
    graph.width = (window.innerWidth - graph.getBoundingClientRect().left - 6);
}

function initGraphDrawing(graph, n) {
    const nodes = [];
    const links = [];
    let radius;
    return fetch('http://127.0.0.1:8090/graph/' + n.toString())
        .then(response => response.json()) // Parse the response as JSON
        .then(data => {
            const graph = JSON.parse(atob(data));
            radius = graph.radius

            //nodes
            for (let i = 0; i < graph.nodes.length; i++) {
                const node = graph.nodes[i];
                const linkin = [];
                for (let j = 0; j < graph.nodes.length; j++) {
                    linkin.push(graph.connections[j][i])
                }
                links.push(linkin)
                nodes.push(new Node(node.relx, node.rely, graph.radius, node.id, graph, '#148dd9'));
            }
            return [nodes, links, radius];
        })
        .catch(error => {
            console.error('Error:', error);
        });
}
