let trashX, trashY;
trashW = 30; trashH = 30; //size and position of trash used to delete element on canvas
let trashY_actual, trashX_actual, degrees = 0; // used to manage the drawing of trash

function aroundTrash(mx, my) {
    if (Math.abs(mx - trashX_actual) < 100 && Math.abs(my - trashY_actual) < 100) {
        degrees = 90;
        draw();
        setTimeout(function () {
            degrees = 0;
            draw();
        }, 2000);
    }
}

function insideTrash(mx, my, i) {
    let temp;
    if (mx > trashX_actual && mx < trashX_actual + trashW && my > trashY_actual && my < trashY_actual + trashH) {
        if(selectionMode){
            temp = JSON.parse(JSON.stringify(nodes));
            let temp_nodes = [];
            for(let i = 0; i < nodes.length; i++) {
                let node = nodes[i];
                if(insideRectSelection(node.x,node.y) && node.id !== "selection" && !selectionok && node.isSelected){
                    temp[i].x =  temp[i].initX;
                    temp[i].y = temp[i].initY;
                }
                else 
                    temp_nodes.push(node);
            }
            copy[pointer] = JSON.parse(JSON.stringify(temp));
            nodes = JSON.parse(JSON.stringify(temp_nodes));
            // in the case in which pointer is not at the end of copy and a shape has been moved
            if(pointer!==copy.length-1)
                copy.splice(pointer+1,copy.length-pointer-1);
            InsertCopy(temp_nodes);
        }
        else{
            dragging = null;
            //DELETE ALL THE LINKS
            for (let index = 0; index < links.length; index++) {
                const element = links[index];
                if (element.from === selNode || element.to === selNode)
                    links.splice(index,1);
            }
            selNode=null;
            nodes.splice(i, 1);
            temp = JSON.parse(JSON.stringify(nodes));
            // in the case in which pointer is not at the end of copy and a shape has been moved
            if(pointer!==copy.length-1)
                copy.splice(pointer+1,copy.length-pointer-1);
            InsertCopy(temp);
        }
        ChangeCursor("default");
    }
}

//draw trash
function drawTrash() {
    trashX = parseInt(document.getElementById('canvas').offsetWidth) - 72;
    trashY = parseInt(document.getElementById('canvas').offsetHeight) - 68;
    const trash_lower = document.getElementById('trash_down');
    const trash_above = document.getElementById('trash_up');
    let scrolly = parseInt(document.getElementById("canvas").scrollTop);
    let scrollx = parseInt(document.getElementById("canvas").scrollLeft);
    trashY_actual = trashY + scrolly;
    trashX_actual = trashX + scrollx;
    ctx.globalAlpha = 1.0;
    ctx.save();
    // move to the center of the trash image
    ctx.translate(trashW / 2, trashH / 2);
    // rotate the canvas to the specified degrees
    ctx.rotate(degrees*Math.PI / 180);
    // draw the above part of trash
    if (degrees === 90)
        ctx.drawImage(trash_above, (trashY-36) + scrolly, -(trashX + 15 + scrollx), 20, 10);
    else
        ctx.drawImage(trash_above, trashX - 15 + scrollx, trashY - 25 + scrolly, 20, 10);
    ctx.restore();
    // draw the lower part of trash
    ctx.drawImage(trash_lower, trashX + scrollx, trashY + scrolly, 20,20);
}