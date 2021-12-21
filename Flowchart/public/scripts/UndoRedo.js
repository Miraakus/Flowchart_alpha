let pointer = -1, _pointer = -1; // pointer to current position of array copy

function MakeUR(){
	if(copy.length){
        let temp = JSON.parse(JSON.stringify(copy[pointer]));
        nodes.splice(0,nodes.length);
        nodes = JSON.parse(JSON.stringify(temp));
        RemoveSelection();
        selectionMode = false;
        draw();
	}
}

// reset the canvas
function reset() {
    for (let i = 0; i < nodes.length; i++){
        let node = nodes[i];
        if(node.id !== "selection")
            node.trasparence = 1.0;
    }
    nodes.splice(0, nodes.length); // remove all element of nodes
    InsertCopy([]); // insert in copy an empty array
	links.splice(0, links.length); // remove all element of links
	InsertDuplicate([]); // insert in duplicate an empty array
    selectionok = selectionMode = false;
    draw();
}

function undo() {
    if (pointer <= 0)
        return;
	if(links.length !== 0)
		return;
    pointer--;
    MakeUR();
}

function redo() {
    if(pointer === copy.length-1)
        return;
	if(links.length !== 0)
		return;
    pointer++;
    MakeUR();
}

// insert in copy an element passed like argument
function InsertCopy(element){
    copy.push(element);
    pointer++;
}

// insert in duplicate an element passed like argument
function InsertDuplicate(element){
    duplicate.push(element);
    _pointer++;
}

// copy the array nodes into array copy
function NodesToCopy(){
    if(pointer!==copy.length-1) // in the case in which pointer is not at the end of copy
        copy.splice(pointer+1,copy.length-pointer-1);
    let tmp = JSON.parse(JSON.stringify(nodes));
    InsertCopy(tmp);
}

// copy the array links into array duplicate
function LinksToDuplicate(){
    if(_pointer!==duplicate.length-1) // in the case in which pointer is not at the end of duplicate
        duplicate.splice(pointer+1,duplicate.length-_pointer-1);
    let tmp = JSON.parse(JSON.stringify(links));
    InsertDuplicate(tmp);
}
/*
function ManagerUR(){
    let old_v = JSON.parse(JSON.stringify(nodes)); // old version
    let new_v = JSON.parse(JSON.stringify(nodes)); // new version
    let flag = false;
    for(let i=0; i<new_v.length; i++){
        if(new_v[i].last){
            old_v[i].x = nodes[i].initX;
            old_v[i].y = nodes[i].initY;
            old_v[i].last = new_v[i].last = 0;
            flag = true;
        }
        else if(new_v[i].resize>=0)
            flag = true;
    }
    if(pointer!==copy.length-1){ // in the case in which pointer is not at the end of copy and a shape has been moved
        copy.splice(pointer+1,copy.length-pointer-1); // delete the following positions of pointer
        InsertCopy(new_v); // push to copy the new version of nodes
        nodes.splice(0,nodes.length);
        nodes = JSON.parse(JSON.stringify(new_v)); // copy the new version of nodes in nodes 
    }
    else if(flag) // in the case in which a shape is moved
        InsertCopy(new_v);
}*/