let choice = false; // = true => grid, else false
let dim = 10; //indicate the dimension of the grid's squares
// variable used to handle download functionality
let json = null;
let shapes = ["rectangle", "connector", "rhombus", "parallelogram", "preprocess", "ellipse"];
let operations = ["comment", "reset_img", "undo_img", "redo_img", "selection_img", "upload_img", "download_img"];
let notificationPointers = [];

function SetMenuEvent() {
	if(document.getElementById("menu_vertical")!=null){
    for(let i = 0; i<shapes.length; i++) {
        document.getElementById(shapes[i]).onclick = function () { myClick(this.id)};
        document.getElementById(shapes[i]).onmouseover = function () { myOver() };
        document.getElementById(shapes[i]).onmouseout = function () { myOut() };
       }
	}
    for(let i = 0; i<operations.length; i++) {
        document.getElementById(operations[i]).onmouseover = function () { myOver() };
        document.getElementById(operations[i]).onmouseout = function () { myOut() };
    }
    document.getElementById("comment").onclick = function () { myClick("text") };
    document.getElementById("reset_img").onclick = function () { reset() };
    document.getElementById("undo_img").onclick = function () { undo() };
    document.getElementById("redo_img").onclick = function () { redo() };
    document.getElementById("selection_img").onclick = function () { selection() };
    document.getElementById("download_img").onclick = function () { download() };
    document.getElementById("upload_img").onclick = function () { upload() };
	if(document.getElementById("myBox")!=null){
       document.getElementById("myBox").onmouseup = function () { draw() };
       document.getElementById("myBox").onwheel = function () { draw() }; // on wheel is the event associated at the wheel's (of mouse) move
	}
	else {
	   document.getElementById("myBox_learner").onmouseup = function () { draw() };
       document.getElementById("myBox_learner").onwheel = function () { draw() }; // on wheel is the event associated at the wheel's (of mouse) move
	}
}

// handle onclick events
function myClick(t) {
    selected = t;
}

function myOver() {
    document.body.style.cursor = "pointer";
}

function myOut() {
    document.body.style.cursor = "default";
}

// handle the choice of the grid
function Choice() {
    if (grid.choice.checked)
        choice = true;
    else
        choice = false;
    draw();
}

// handle the dimension of the grid
function Quantity() {
    dim = document.getElementsByName("quantity")[0].value * 10;
    if (choice)
        draw();
}

function errorTextGeneral(message){
		editText = true;
		let edit = document.getElementById("errorText");
		    edit.strokeStyle = "red";
            edit.style.font = "18px Arial";
            edit.style.margin = "0";
            edit.style.padding = "0";
            if(message === "  Блок-схема спроектирована без ошибок!"){
                edit.strokeStyle = "green";
                edit.style.color = "green";
            }
            if(edit.value){
                edit.value += message;
            }
            else{
                edit.value = message;
            }
        edit.focus();
}

function errorTextEdit(node, message){
        let textNode = node;
		editText = true;
        edit = document.createElement("TEXTAREA");
        edit.id = "errorTextEdit" + textNode.pointer;
        edit.style.display = "block";
        edit.style.font = "12px Arial";
		edit.fillStyle = "red";
        edit.style.position = "absolute";
        edit.style.margin = "0";
        edit.style.padding = "0";
		edit.style.color = "red";
        edit.style.left = textNode.x + offsetX + "px";
        edit.style.top = textNode.y + offsetY + "px";
        edit.style.width = textNode.width + 50 + "px";
        edit.style.height = textNode.height + "px";
		edit.value = message + textNode.pointer;
        errorTextGeneral(edit.value);
        document.body.appendChild(edit).focus();
		notificationPointers.push(textNode.pointer);
}

// handle the upload functionality
function upload(){
	if(document.getElementById("text_nodes").value){
	   nodes.splice(0,nodes.length);
       copy.splice(0,copy.length);
	   json = JSON.parse(document.getElementById("text_nodes").value);
       for(let i=0;i<json.length;i++){
           nodes.push(json[i]);
           selected = null;
           pointer = -1;
           InsertCopy([]); // add an empty array to the start of array copy
           NodesToCopy(); // copy all elements of nodes into array copy
	      }
	}
	
	if(document.getElementById("text_links").value){
	   links.splice(0,links.length);
       duplicate.splice(0,duplicate.length);
	   json = JSON.parse(document.getElementById("text_links").value);
       for(let i=0;i<json.length;i++){
           links.push(json[i]);
           selLink = null;
           _pointer = -1;
           InsertDuplicate([]); // add an empty array to the start of array copy
           LinksToDuplicate(); // copy all elements of nodes into array copy
	      }
	   }
	
	if(document.getElementById("text_blocks").value){
	    blocks.splice(0,blocks.length);
	    let temp = JSON.parse(document.getElementById("text_blocks").value);
        for(let i=0;i<temp.length;i++){
        blocks.push(temp[i]);
		selBlock = null;
	       }
	   }
    if(document.getElementById("check") && document.getElementById("check").value){
		let message = "  Блок-схема спроектирована без ошибок!";
		errorTextGeneral(message);
	}
	else{
		if(document.getElementById("check_nodes") && document.getElementById("check_nodes").value){
		    let message = "   Число узлов не соответствует алгоритму решения задачи.\n";
		    errorTextGeneral(message);
        }
	
	    if(document.getElementById("check_links") && document.getElementById("check_links").value){
		    let message = "   Число связей не соответствует алгоритму решения задачи.\n";
		    errorTextGeneral(message);
        }

        if(document.getElementById("text_content").value){
        let temp = document.getElementById("text_content").value;
		let message = "   Ошибочное определение содержимого объекта с индексом ";
		    for(let i=0;i<temp.length;i++){
			    for(let j=0;j<nodes.length;j++){
				    if(nodes[j].pointer == temp[i]){
					    nodes[j].isError = true;
					    errorTextEdit(nodes[j], message);
				    }
			    }
		    }
        }
		
		if(document.getElementById("text_type").value){
            let temp = document.getElementById("text_type").value;
		    let message = "   Ошибочное определение типа объекта с индексом ";
		    for(let i=0;i<temp.length;i++){
			    for(let j=0;j<nodes.length;j++){
				    if(nodes[j].pointer == temp[i]){
					    nodes[j].isError = true;
					    errorTextEdit(nodes[j], message);
				    }
			    }
		    }
        }
		
		/*if(document.getElementById("text_index").value){
            let temp = document.getElementById("text_index").value;
		    let message = "   Неверный порядок следования объекта с индексом ";
		    for(let i=0;i<temp.length;i++){
			    for(let j=0;j<nodes.length;j++){
				    if(nodes[j].pointer == temp[i]){
					    nodes[j].isError = true;
					    errorTextEdit(nodes[j], message);
				    }
			    }
		    }
        }*/
	}
	
	draw();
	drawBlocks();
}

// handle the download functionality
function download() {
        if(nodes.length)
        document.getElementById("text_nodes").value = JSON.stringify(nodes);
		if(links.length)
        document.getElementById("text_links").value = JSON.stringify(links);
	    if(blocks.length)
        document.getElementById("text_blocks").value = JSON.stringify(blocks);
}