let selectionMode = false, selectionok = false; // boolean that indicates if the selection mode is active
let sel_x, sel_y; // initial coordinates of selection's rectangle
let sel_w, sel_h; // width and height of selection's rectangle

function newSelection(px,py,w,h){
    nodes.push({ x: px, y: py, width: w, height: h, isDragging: false, id: "selection" });
}

/**
 * @return {number}
 */
function ShapeInsideSelection(flag){
    // flag is used to know if ShapeInsideSelection is called from ManagerSelection or myMove
    let shape = 0;
    for (let i = 0; i < nodes.length; i++) {
        let node = nodes[i];
        if(insideRectSelection(node.x,node.y) && node.id !== "selection"){
            shape++;
            if(!flag){
                node.initX = node.x;
                node.initY = node.y;
                node.isSelected = true;
                node.trasparence = 0.1;
            }
        }
    }
    if(!shape)
        RemoveSelection();
    return shape;
}

function insideRectSelection(x, y){
    let inside = false;
    if(x > sel_x && x < (sel_x + sel_w) && y > sel_y && y < (sel_y + sel_h))
        inside = true;
    else if(x < sel_x && x > (sel_x + sel_w) && y < sel_y && y > (sel_y + sel_h))
        inside = true;
    else if(x < sel_x && x > (sel_x + sel_w) && y > sel_y && y < (sel_y + sel_h))
        inside = true;
    else if(x > sel_x && x < (sel_x + sel_w) && y < sel_y && y > (sel_y + sel_h))
        inside = true;
    return inside;
}

function drawSelection(dx,dy){
    sel_w+=dx;
    sel_h+=dy;
    drawRect(null, 2);
    border(2, "red");
}

function moveSelection(node){
    sel_x = node.x;
    sel_y = node.y;
    drawRect(null, 2);
    border(2, "red");
}

function RemoveSelection(){
    for(let i = 0; i < nodes.length; i++){
        let node = nodes[i];
        if(node.id === "selection"){
            nodes.splice(i,1);
            selectionok = false;
        }
        node.isSelected = false;
        node.trasparence = 1.0;
    }
    draw();
}

function selection(){
    if(!selectionMode) 
        selectionMode = true;
    else {
        selectionMode = false;
        RemoveSelection();
    }
}

function ManagerSelection(){
    if(selectionMode && links.length === 0){
        if(selectionok){
            selectionok = false;
            // check the number of shape inside selection's rectangle and if the number is 0 => delete it
            if(ShapeInsideSelection(0))
                newSelection(sel_x,sel_y,sel_w,sel_h);
            selected = null;
        }
        else if(!insideRectSelection(mx,my)){
            selectionok = true;
            sel_x = mx;
            sel_y = my;
            sel_h = sel_w = 0;
            for(let i = 0; i < nodes.length; i++){
                if(nodes[i].id === "selection"){
                    nodes[i].x = sel_x;
                    nodes[i].y = sel_y;
                }
                nodes[i].trasparence = 1.0;
            }
            draw();
        }
    }
}