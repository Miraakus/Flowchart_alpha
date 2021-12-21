let _canvas, _ctx, blocks = [], _BB, _offsetX, _offsetY, _WIDTH, _HEIGHT; // _canvas related references

function addBlock(block){
	blocks.push(block);
}

function addNode(node){
	nodes.push(node);
}

// clear the canvas
function clear_addon() {
    _ctx.fillStyle = "white"; //"#FAF7F8"
    _ctx.globalAlpha = 1.0;
    _ctx.rect(0, 0, _WIDTH, _HEIGHT);//рисуем белый пустой квадрат, который становится канвасом для рисования
	_ctx.fill();
}

function SetCoordinates_addon(){//установка граничных значений координат
	_BB = _canvas.getBoundingClientRect();
	_offsetX = _BB.left;
	_offsetY = _BB.top;
}

function drawBlocks(){//прорисовка блоков
	clear_addon();//очищаем холст
	for (let i = 0; i < blocks.length; i++) {//вызываем функцию draw, специфичную для каждого элемента
        let block = blocks[i];//копируем коллекцию фигур в рабочую переменную
        if (block.id === "rectangle")
            drawRect_block(block);
        else if (block.id === "rhombus")
            drawRhombus_block(block);
        else if (block.id === "parallelogram")
            drawParallelogram_block(block);
		else if (block.id === "preprocess")
            drawPreprocess_block(block);
        else if (block.id === "ellipse")
            drawEllipse_block(block);
        else if (node.id === "connector")
            drawConnector_block(node);
    }
}

function border_block(width) {
    _ctx.closePath();
    _ctx.lineWidth = width;
    _ctx.strokeStyle = "black";
    _ctx.stroke();
}

function fill_block(color) {
    _ctx.fillStyle = color;
    _ctx.fill();
}

// draw a single rectangle
function drawRect_block(block) {
    _ctx.beginPath();
    _ctx.globalAlpha = block.trasparence;
    _ctx.rect(block.x, block.y, block.width, block.height);
    border_block(1); 
    fill_block('rgb(102, 204, 0, .2)');
	textfill(_ctx,block);
}

// draw a single rhombus
function drawRhombus_block(block) {
    _ctx.beginPath();
    _ctx.moveTo(block.x, block.y + block.height); // Top
    _ctx.lineTo(block.x - block.width, block.y); // Left
    _ctx.lineTo(block.x, block.y - block.height); // Bottom
    _ctx.lineTo(block.x + block.width, block.y); // Right
    _ctx.lineTo(block.x, block.y + block.height); // Back to Top
    border_block(1); 
    fill_block('rgb(102, 204, 0, .2)');
	textfill(_ctx,block);
}

// draw a single parallelogram
function drawParallelogram_block(block) {
    _ctx.beginPath();
    _ctx.moveTo(block.x, block.y);
    _ctx.lineTo(block.x + block.width, block.y);
    let x = block.height * Math.cos(-45 * Math.PI / 180) + (block.width + block.x);
    let y = block.height * Math.sin(-45 * Math.PI / 180) + block.y;
    _ctx.lineTo(x, y);
    x -= block.width;
    _ctx.lineTo(x, y);
    border_block(1); 
    fill_block('rgb(102, 204, 0, .2)');
	textfill(_ctx,block);
}

// draw a preprocess
function drawPreprocess_block(block) {
    _ctx.beginPath();
    _ctx.globalAlpha = block.trasparence;
    _ctx.rect(block.x, block.y, block.width, block.height);
	_ctx.rect(block.x + 10, block.y, block.width - 20, block.height);
	border_block(1); 
    fill_block('rgb(102, 204, 0, .2)');
	textfill(_ctx,block);
}

// draw a single ellipse
function drawEllipse_block(block) {
    _ctx.beginPath();
    _ctx.ellipse(block.x, block.y, block.radiusY, block.radiusX, Math.PI / 2, 0, 2 * Math.PI);
    border_block(1); 
    fill_block('rgb(102, 204, 0, .2)');
	_ctx.font = "12px Arial";
    _ctx.fillStyle = "black";
    _ctx.textAlign = "center";
    _ctx.fillText(block.text, block.x, block.y + 5);
}

function drawConnector_block(node){
    ctx.beginPath();
    ctx.arc(node.x,node.y,node.radius,0, 2*Math.PI,false);
    border(node, 1);
    fillNode('rgb(0, 153, 255, .2)');
    ctx.font = "8px Arial";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.fillText(node.text, node.x, node.y + 5);
}

let bx, by, InitX, InitY, drag, selBlock;

function Drag_blocks(block) {//функция перетаскивания фигур
    drag = true;//флаг передвигаемого узла
    block.isDragging = true;//флаг передвижения связанной с узлом связи
    ChangeCursor("move");
}
// handle mousedown events
function Down(e) {
    // tell the browser we're handling this mouse event
    e.preventDefault();
    e.stopPropagation();
    // get the current mouse position
    bx = parseInt(e.clientX - _offsetX);
    by = parseInt(e.clientY - _offsetY);
    // test each rect to see if mouse is inside
    drag = false;
	selBlock = null;
    for (let i = 0; i < blocks.length; i++) {
        let block = blocks[i];
        if (block.id === "rectangle") {
            if (insideRect(block, bx, by)) {
                Drag_blocks(block);
			    selBlock = i;
            }
        }
        else if (block.id === "rhombus") {
            if (insideRhombus(block, bx, by)) {
                Drag_blocks(block);
				selBlock = i;
            }
        }
		else if (block.id === "parallelogram") {
            if (insideParallelogram(block, bx, by)) {
                Drag_blocks(block);
			    selBlock = i;
            }
        }
		else if (block.id === "preprocess") {
            if (insidePreprocess(block, bx, by)) {
                Drag_blocks(block);
				selBlock = i;
            }
        }
        else if (block.id === "ellipse") {
            if (insideEllipse(block, bx, by)) {
                Drag_blocks(block);
				selBlock = i;
            }
        }
    }
    // save the current mouse position
    InitX = bx;
    InitY = by;
}

// handle mouse moves
function Move(e) {
    // tell the browser we're handling this mouse event
    e.preventDefault();
    e.stopPropagation();
    SetCoordinates_addon();
    // get the current mouse position
    bx = parseInt(e.clientX - _offsetX);
    by = parseInt(e.clientY - _offsetY);
    let dx = bx - InitX;
    let dy = by - InitY;
    // if we're dragging anything...
    if (drag) {
        for (let i = 0; i < blocks.length; i++) {
            let block = blocks[i];
			if (block.isDragging){
                block.x += dx;
                block.y += dy;
				if (block.connectors!=null)
                {
                    block.connectors.forEach(connector=>{
                        connector.x += dx; connector.y += dy;
                    });
                }
			}
        }
        
        // reset the starting mouse position for the next mousemove
        InitX = bx;
        InitY = by;
    }
    for (let i = 0, inside = false; i < blocks.length; i++) {
        let block = blocks[i];
        if (block.id === "rectangle") {
            if (insideRect(block, bx, by)) {
                ChangeCursor("move");
                inside = true;
            }
        }
        else if (block.id === "rhombus") {
            if (insideRhombus(block, bx, by)) {
                ChangeCursor("move");
                inside = true;
            }
        }
		else if (block.id === "parallelogram") {
            if (insideParallelogram(block, bx, by)) {
                ChangeCursor("move");
                inside = true;
            }
        }
		else if (block.id === "preprocess") {
            if (insidePreprocess(block, bx, by)) {
                ChangeCursor("move");
                inside = true;
            }
        }
        else if (block.id === "ellipse") {
            if (insideEllipse(block, bx, by)) {
                ChangeCursor("move");
                inside = true;
            }
        }
        if(!inside){
            ChangeCursor("default");
            }
    }
	drawBlocks();
}

// handle mouseup events
function Up(e) {
    // tell the browser we're handling this mouse event
    e.preventDefault();
    e.stopPropagation();
    bx = parseInt(e.clientX - _offsetX);
    by = parseInt(e.clientY - _offsetY);
    ChangeCursor("default");
    drag = false;
	for (let i = 0; i < blocks.length; i++){
        let block = blocks[i];
        if(block.isDragging) {
            block.isDragging = drag; // clear all the dragging flags
        }
    }
}