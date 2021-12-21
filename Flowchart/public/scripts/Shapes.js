function newRect(px, py) {
    //check if position of new rectangle go over the canvas
    if (px > WIDTH && py > HEIGHT)
        return;
    nodes.push({ x: px, y: py, width: 150, height: 60, trasparence: 0.2, text: "Text", input: false, isDragging: false, isSelected: false,
        isError: false, initX: 0, initY: 0, last: 0, pointer: pointer, connectors: [
            { x: px + 75, y: py, mode: "input",  title: "input"},
            { x: px + 75, y: py + 60, mode: "output", title: "output"},
            { x: px, y: py + 30, mode: "mixed",  title: "mixed"},
            { x: px + 150, y: py + 30, mode: "mixed",  title: "mixed"}], id: "rectangle" });
    NodesToCopy();
}

function newRhombus(px, py) {
    //check if position of new rhombus go over the canvas
    if (px > WIDTH && py > HEIGHT)
        return;
    nodes.push({ x: px, y: py, radius: 35, width: 80, height: 35, trasparence: 0.2, text: "Text", input: false, isDragging: false, isSelected: false,
        isError: false, initX: 0, initY: 0, last:0, pointer: pointer, connectors: [
            { x: px, y: py - 35, mode: "input",  title: "input"},
            { x: px, y: py + 35, mode: "output", title: "output"},
            { x: px - 80, y: py, mode: "mixed",  title: "mixed"},
            { x: px + 80, y: py, mode: "mixed",  title: "mixed"}],
			id: "rhombus" });
    NodesToCopy();
}

function newParallelogram(px, py) {
    //check if position of new parallelogram go over the canvas
    if (px > WIDTH && py > HEIGHT)
        return;
    nodes.push({ x: px, y: py, width: 120, height: 60, trasparence: 0.2, text: "Text", input: false, isDragging: false, isSelected: false,
        isError: false, initX: 0, initY: 0, last:0, pointer: pointer, connectors: [
            { x: px + 96, y: py - 43, mode: "input",  title: "input"},
            { x: px + 60, y: py, mode: "output", title: "output"},
            { x: px + 22, y: py - 22, mode: "mixed",  title: "mixed"},
            { x: px + 142, y: py - 22, mode: "mixed",  title: "mixed"}], id: "parallelogram" });
    NodesToCopy();
}

function newPreprocess(px, py) {
    //check if position of new preprocess go over the canvas
    if (px > WIDTH && py > HEIGHT)
        return;
    nodes.push({ x: px, y: py, width: 150, height: 60, trasparence: 0.2, text: "Text", input: false, isDragging: false, isSelected: false,
        isError: false, initX: 0, initY: 0, last: 0, pointer: pointer, connectors: [
            { x: px + 75, y: py, mode: "input",  title: "input"},
            { x: px + 75, y: py + 60, mode: "output", title: "output"},
            { x: px, y: py + 30, mode: "mixed",  title: "mixed"},
            { x: px + 150, y: py + 30, mode: "mixed",  title: "mixed"}], id: "preprocess" });
    NodesToCopy();
}

function newEllipse(px, py) {
    //check if position of new ellipse go over the canvas
    if (px > WIDTH && py > HEIGHT)
        return;
    nodes.push({ x: px, y: py, radiusY: 15, radiusX: 45, trasparence: 0.2, text: "Text", input: false, isDragging: false, isSelected: false,
        isError: false, initX: 0, initY: 0, last:0, connectors: [
            { x: px, y: py - 15, mode: "input",  title:  "input"},
            { x: px, y: py + 15, mode: "output", title: "output"}], id: "ellipse" });
    NodesToCopy();
}

function newConnector(px, py) {
    //check if position of new connector go over the canvas
    if (px > WIDTH && py > HEIGHT)
        return;
    nodes.push({ x: px, y: py, radius: 10, trasparence: 0.2, text: pointer, isDragging: false, isSelected: false, initX: 0,
        isError: false, initY: 0, last:0, connectors: [
            { x: px, y: py - 10, mode: "mixed",  title: "mixed"},
            { x: px, y: py + 10, mode: "mixed",  title: "mixed"},
			{ x: px + 10, y: py , mode: "mixed",  title: "mixed"},
            { x: px - 10, y: py, mode: "mixed",  title: "mixed"}], id: "connector" });
    NodesToCopy();
}

/*--------------------------------------------------------------------------------------------*/

//check if mouse's pointer is inside a rectangle
function insideRect(r, mx, my) {
    return (mx > r.x && mx < (r.x + (r.width)) && my > r.y && my < (r.y + (r.height)));
}

//check if mouse's pointer is inside a rhombus
function insideRhombus(r, mx, my) {
    let centerX = ((r.x + r.radius) + (r.x - r.radius)) / 2;
    let centerY = ((r.y) + (r.y)) / 2;
    let dx = Math.abs(mx - centerX);
    let dy = Math.abs(my - centerY);
    let d = dx / (r.width) + dy / (r.height);
    return d <= 1.0;
}

//check if mouse's pointer is inside a parallelogram
function insideParallelogram(r, mx, my) {
    return (mx > r.x + 17 && my > (r.height * Math.sin(-45 * Math.PI / 180) + r.y) &&
	mx < (r.height * Math.cos(-45 * Math.PI / 180) + (r.x + r.width)) - 17 && my < r.y );
}

//check if mouse's pointer is inside a preprocess
function insidePreprocess(r, mx, my) {
    return insideRect(r, mx, my);
}

//check if mouse's pointer is inside an ellipse
function insideEllipse(r, mx, my) {
    let eq = (Math.pow((mx - r.x), 2) / Math.pow(r.radiusX, 2)); // radiusX is horizontal semi-axis
    let eq2= (Math.pow((my - r.y), 2) / Math.pow(r.radiusY, 2)); // radiusY is vertical semi-axis
    return (eq + eq2) <= 1.0;
}

//check if mouse's pointer is inside a connector
function insideConnector(r, mx, my) {
    return ( ((mx - r.x)*(mx - r.x) + (my - r.y)*(my - r.y)) <= 400 );
}

/*------------------------------------------------------------------*/

// draw border
function border(node, width) {
    ctx.closePath();
    ctx.lineWidth = width;
    if(!node.isError){
		   ctx.strokeStyle = "black";
		}
    else {
		   ctx.strokeStyle = "red";
		}
    ctx.stroke();
}

function fillNode(color) {
    ctx.fillStyle = color;
    ctx.fill();
}

// draw a single rectangle
function drawRect(node,flag) {
    ctx.beginPath();
    if(!flag){
        ctx.globalAlpha = 1.0;
        ctx.rect(0, 0, WIDTH, HEIGHT);
    }
    else if(flag===1) {
        ctx.rect(node.x, node.y, node.width, node.height);
        border(node, 1);
        fillNode('rgb(0, 153, 255, .2)');
        textfill(ctx,node);
		ctx.font = "8px Arial";
		ctx.fillText(node.pointer, node.x + 5, node.y - 5);
        addConnectors(node);
    }
    else if(flag===2) {
        ctx.globalAlpha = 1.0;
        ctx.rect(sel_x, sel_y, sel_w, sel_h);
    }
}

// draw a single rhombus
function drawRhombus(node) {
    ctx.beginPath();   
    ctx.moveTo(node.x, node.y + node.height); // Top
    ctx.lineTo(node.x - node.width, node.y); // Left
    ctx.lineTo(node.x, node.y - node.height); // Bottom
    ctx.lineTo(node.x + node.width, node.y); // Right
    ctx.lineTo(node.x, node.y + node.height); // Back to Top
	border(node, 1);
    fillNode('rgb(0, 153, 255, .2)');
	textfill(ctx,node);
	ctx.font = "8px Arial";
	ctx.fillText(node.pointer, node.x - 40, node.y - node.height + 10);
    addConnectors(node);
}

// draw a single parallelogram
function drawParallelogram(node) {
    ctx.beginPath();
    ctx.fillStyle = 'green';
    ctx.moveTo(node.x, node.y);
    ctx.lineTo(node.x + node.width, node.y);
    let x = node.height * Math.cos(-45 * Math.PI / 180) + (node.width + node.x);
    let y = node.height * Math.sin(-45 * Math.PI / 180) + node.y;
    ctx.lineTo(x, y);
    x -= node.width;
    ctx.lineTo(x, y);
	border(node, 1);
    fillNode('rgb(0, 153, 255, .2)');
	textfill(ctx,node);
	ctx.font = "8px Arial";
	ctx.fillText(node.pointer, node.x + 25 , node.y - 30);
    addConnectors(node);
}

// draw a preprocess
function drawPreprocess(node) {
    ctx.beginPath();
    ctx.rect(node.x, node.y, node.width, node.height);
	ctx.rect(node.x + 10, node.y, node.width - 20, node.height);
    border(node, 1); 
    fillNode('rgb(0, 153, 255, .2)');
	textfill(ctx,node);
	ctx.font = "8px Arial";
	ctx.fillText(node.pointer, node.x + 5, node.y - 5);
    addConnectors(node);
}

// draw a single ellipse
function drawEllipse(node) {
    ctx.beginPath();
    ctx.ellipse(node.x, node.y, node.radiusY, node.radiusX, Math.PI / 2, 0, 2 * Math.PI);
    border(node, 1);
    fillNode('rgb(0, 153, 255, .2)');
	ctx.font = "12px Arial";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.fillText(node.text, node.x, node.y + 5);
    addConnectors(node);
}

function drawConnector(node){
    ctx.beginPath();
    ctx.arc(node.x,node.y,node.radius,0, 2*Math.PI,false);
    border(node, 1);
    fillNode('rgb(0, 153, 255, .2)');
    ctx.font = "8px Arial";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.fillText(node.text, node.x, node.y + 5);
    addConnectors(node);
}

function addConnectors(node){
    if (node.connectors!=null)
    {
        node.connectors.forEach(connector=>{
            drawConnectors(connector.x,connector.y);
        });
    }
}