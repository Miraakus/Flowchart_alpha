'use strict';

let mx, my; // indicate the coordinates of mouse
let dragok, startX, startY; // drag related variables
let selected = null;//флаг выбора узла
let editText = false;//флаг набираемого текста узла
let dragging = false, selNode = null, selConnector = null, selConnectorNode = null,//selected related variables
    selLink = null, linkDestConnector=null, linkDestNode = null, linksToMove=[], segmentsToSave = [];//links related variables

function nodeTextEdit(node){
        let textNode = node;
        let ed = document.getElementById("tmpTextEdit");
        if (!ed)
            ed = document.createElement("TEXTAREA");
        ed.id = "tmpTextEdit";
        ed.style.display = "block";
        ed.style.font = "10px Arial";
        ed.style.position = "absolute";
        ed.style.margin = "0";
        ed.style.padding = "0";
        ed.style.left = textNode.x + offsetX + "px";
        ed.style.top = textNode.y + offsetY + "px";
        ed.style.width = textNode.width + "px";
        ed.style.height = textNode.height + "px";
		ed.value = textNode.text;
        ed.addEventListener("keyup",function(){textNode.text = ed.value});
        textfill(ctx,textNode);
        document.body.appendChild(ed).focus();
}

function linkTextEdit(link){
        let textLink = link;
        let elementT = textLink.segments[textLink.indexText];
        let elementT0 = textLink.segments[textLink.indexText-1];
        let x = (elementT.x+elementT0.x)/2;
        let y = (elementT.y+elementT0.y)/2;

        let ed = document.getElementById("tmpTextEdit");
        if (!ed)
            ed = document.createElement("TEXTAREA");
        ed.id = "tmpTextEdit";
        ed.style.display = "block";
        ed.style.font = "10px Arial";
        ed.style.position = "absolute";
        ed.style.margin = "0";
        ed.style.padding = "0";
        ed.style.left = x + offsetX - 100 + "px";
        ed.style.top = y + offsetY - 10 + "px";
        ed.style.width = 200 + "px";
        ed.style.height = 20 + "px";
        ed.value = textLink.text;
        ed.addEventListener("keyup",function(){textLink.text = ed.value});
        document.body.appendChild(ed).focus();
}

function myDoubleClick(e) {
    // tell the browser we're handling this mouse event
    e.preventDefault();
    e.stopPropagation();
    editText = true;
    if (selNode !== null){ //если узел активен, имитируем простой редактор текста с построчным переносом
        nodeTextEdit(nodes[selNode]);
    }
    if (selLink !== null){ //если связь активна, имитируем простой редактор текста с построчным переносом
        linkTextEdit(links[selLink]);
    }
	for(let i = 0; i < nodes.length; i++){
		nodes[i].isError = false;
	}
    draw();//обновляем холст
}

function DragOk(node) {//функция перетаскивания фигур
    dragok = true;//флаг передвигаемого узла
    node.isDragging = true;//флаг передвижения узлa
    ChangeCursor("move");
	//сохраняем начальную позицию узла
    node.initX = node.x;
    node.initY = node.y;
    if(node.id !== "selection")//если выделение активно
        RemoveSelection();//убираем выделенную область при движении отдельного узла
}

// handle mousedown events
function myDown(e) {
    selLink = null;//анулируем флаг выбора связи
    // tell the browser we're handling this mouse event
    e.preventDefault();
    e.stopPropagation();
    // get the current mouse position
    mx = parseInt(e.clientX - offsetX);
    my = parseInt(e.clientY - offsetY);
    // test each rect to see if mouse is inside
    dragok = false;
    ManagerSelection();
    let selIndex = null;//индекс выбранной фигуры для дальнейшей работы со связями
    for (let i = 0; i < nodes.length; i++) {
        let node = nodes[i];
        if (node.id === "rectangle") {
            if (insideRect(node, mx, my)) {
                    DragOk(node);
                    selIndex = i;
            }
        }
        else if (node.id === "rhombus") {
            if (insideRhombus(node, mx, my)) {
                DragOk(node);
                selIndex = i;
            }
        }
		else if (node.id === "parallelogram") {
            if (insideParallelogram(node, mx, my)) {
                DragOk(node);
                selIndex = i;
            }
        }
		else if (node.id === "preprocess") {
            if (insidePreprocess(node, mx, my)) {
                DragOk(node);
                selIndex = i;
            }
        }
        else if (node.id === "ellipse") {
            if (insideEllipse(node, mx, my)) {
                DragOk(node);
                selIndex = i;
            }
        }
		else if (node.id === "connector") {
            if (insideConnector(node, mx, my)) {
                DragOk(node);
                selIndex = i;
            }
        }
		else if (node.id === "selection"){
            if(insideRectSelection(mx,my))
                DragOk(node);
        }
    }
    
	if (editText)//если на предыдущем узле открыт редактор
        {
        editText=false;
        let ed = document.getElementById("tmpTextEdit");
		if(ed)
        document.body.removeChild(ed);//убираем область редактирования
	    for(let i = 0; i < notificationPointers.length; i++){
		    let edit = document.getElementById("errorTextEdit"+notificationPointers[i]);
		    if(edit)
            document.body.removeChild(edit);
	        }
		notificationPointers = [];
        } 
		
    if (selConnector!=null)//если внутри узлового порта
    {
        dragging="newlink";//устанавливаем флаг новой связи
        return;
    }
    if (selIndex !== null){//если выбран узел
	    selNode = selIndex;
        // Dispatch/Trigger/Fire the event
        let event = new CustomEvent("selectionChanged", {"detail": selNode});
        document.dispatchEvent(event);
		
		dragging="move";//устанавливаем флаг передвижения связи
        for (let j = 0; j < links.length; j++) {
             const elementLinked = links[j];
             if (elementLinked.to === selNode || elementLinked.from === selNode){//если узел является началом или концом связи
                   linksToMove.push(j);//добавим его индекс в коллекцию передвигаемых связей
                   }
        }
        for (let i = 0; i < nodes.length; i++) {//перебераем все остальные узлы
            if (i !== selNode){//кроме выбранного
                 for (let j = 0; j < links.length; j++) {
                       const elementLinked = links[j];
                      if (elementLinked.to === i || elementLinked.from === i){//если узел является вторым концом связи
                            linksToMove.push(j);//то добавим его индекс в коллекцию передвигаемых связей
                      }
                 }
            }
        }
    }
    else//если ни один из узлов не активен
    {
        //deselect
        selNode=null;
        dragging=null;

        //CHECK LINKS
        for (let index = 0; index < links.length; index++) {
            const element = links[index];
            if (OverLink({x:mx,y:my}, element)===true){//если курсор поверх связи
                highlight(ctx, element);//врубаем подсветку
                dragging="linkedit";//предварительно устанавливаем флаг редактирования связи
                selLink=index;//предварительно получаем её индекс
                break;
            }
        }
    }
    // save the current mouse position
    startX = mx;
    startY = my;
    draw();
    WriteCoordinates(mx, my);//текущие координаты
}

// handle mouse moves
function myMove(e) {
    // tell the browser we're handling this mouse event
    e.preventDefault();
    e.stopPropagation();
    // get the current mouse position
    mx = parseInt(e.clientX - offsetX);
    my = parseInt(e.clientY - offsetY);
    let dx = mx - startX;
    let dy = my - startY;

    // if we're dragging anything...
    if (dragok || selectionok) {
        // calculate the distance the mouse has moved
        // since the last mousemove
        if(selectionok)
            drawSelection(dx, dy);
        // move each rect that isDragging
        // by the distance the mouse has moved
        // since the last mousemove
        for (let i = 0; i < nodes.length; i++) {
            let node = nodes[i];
			//расчёт координат всех компонентов области выделения при движении
            if(insideRectSelection(node.x,node.y) && node.id !== "selection" && !selectionok && node.isSelected){
                node.x += dx;
                node.y += dy;
                if (node.connectors!=null)//вместе с портами
                {
                    node.connectors.forEach(connector=>{
                       connector.x += dx; connector.y += dy;
                    });
                }
            }
            else if (node.isDragging) {//то же самое для одного выбранного узла
				        node.x += dx;
					    node.y += dy;
						if (node.connectors!=null){
                            node.connectors.forEach(connector=>{
                            connector.x += dx; connector.y += dy;
                         });
						}
                // check if a polygon is inside or around the "trash"
                aroundTrash(mx,my);
                insideTrash(mx, my, i);
            }
        }
        // redraw the scene with the new rect positions
        draw();
        // reset the starting mouse position for the next mousemove
        startX = mx;
        startY = my;
    }
    for (let i = 0, inside = false; i < nodes.length; i++) {
        let node = nodes[i];
        if (node.id === "rectangle") {
            if (insideRect(node, mx, my)) {
                ChangeCursor("move");
                inside = true;
            }
        }
        else if (node.id === "rhombus") {
            if (insideRhombus(node, mx, my)) {
                ChangeCursor("move");
                inside = true;
            }
        }
		else if (node.id === "parallelogram") {
            if (insideParallelogram(node, mx, my)) {
                ChangeCursor("move");
                inside = true;
            }
        }
		else if (node.id === "preprocess") {
            if (insidePreprocess(node, mx, my)) {
                ChangeCursor("move");
                inside = true;
            }
        }
        else if (node.id === "ellipse") {
            if (insideEllipse(node, mx, my)) {
                ChangeCursor("move");
                inside = true;
            }
        }
		else if (node.id === "connector") {
            if (insideConnector(node, mx, my)) {
                ChangeCursor("move");
                inside = true;
            }
        }
		else if (node.id === "selection"){
            if(insideRectSelection(mx,my)){
                ChangeCursor("move");
                inside = true;
            }
        }
        if(!inside){
            ChangeCursor("default");
        }
    }
	
    switch (dragging) {
        case "newlink"://если новая связь
		    draw();
            ctx.beginPath();
            var aC=connectorCoords(nodes[selConnectorNode].connectors[selConnector]);//то извлекаем индекс активного порта
            ctx.moveTo(aC.x,aC.y);//строим линию с центра порта
			if(segmentsToSave.length !== null){
			for (let i = 1; i < segmentsToSave.length; i++)
			      ctx.lineTo(segmentsToSave[i].x,segmentsToSave[i].y);
			}
            ctx.lineTo(mx,my);//к текущей позиции курсора
            ctx.stroke();
			
            linkDestNode=null;
            //CHECK DESTINATION connector
            for (let j = 0; j < nodes.length; j++) {
                if (j!==selConnectorNode)//если не активный узел
                {
                    let node = nodes[j];

                    let i=InsideConnectors(node,mx,my);
                    if (i!=null){//и курсор внутри одного из его портов
                        if ((node.connectors[i].mode !== nodes[selConnectorNode].connectors[selConnector].mode
                            || node.connectors[i].mode === "mixed"))//и тип порта совместим с таковым в начале связи
                        {
                            linkDestNode=j;//фиксируем дальний узел
                            linkDestConnector=i;//и его активный порт
                            highlightConnectors(node.connectors[i].x,node.connectors[i].y, node.connectors[i].title);//активируем подсветку этого порта
                        }
                        break;
                    }
                }
            }
            break;
		case "move"://в случае движения
                linksToMove.forEach(elementLinked => {//перебираем индексы всех передвигаемых связей
                    reSegment(links[elementLinked]);//и перерисовываем их
                });
                break;
        default://в случае обычного движения курсора по холсту
            if (selNode !== null){//если поверх узла
                //CHECK CONNECTOR
                let found=false;
                for (let j = 0; j < nodes.length; j++) {
                    let node = nodes[j];
                    let i = InsideConnectors(node,mx,my);
                    if (i!==null){//если внутри порта, то устанавливаем связанные флаги
                            selConnector=i;
                            selConnectorNode=j;
                            highlightConnectors(node.connectors[selConnector].x, node.connectors[selConnector].y,
                                node.connectors[selConnector].title);//врубаем подсветку порта
                            found=true;
                            break;
                    }
                }
                if (!found){//сбрасываем флаги порта, если он не активен
                    selConnector=null;
                    selConnectorNode=null;
                }
            }
            else//если в пустой области холста
            {
                let found=false;
                for (let j = 0; j < nodes.length; j++) {
                    let node = nodes[j];
                    if(!selectionMode){
                        let i = InsideConnectors(node,mx,my);
                        if (i!==null){//внутри порта, но вне узла, то устанавливаем флаги
                             selConnector=i;
                             selConnectorNode=j;
                             highlightConnectors(node.connectors[selConnector].x, node.connectors[selConnector].y,
                             node.connectors[selConnector].title);//врубаем подсветку порта
                             found=true;
                             break;
                        }
					}
                }
                if (!found){//сбрасываем флаги порта, если он не активен
                    selConnector=null;
                    selConnectorNode=null;
                }
            }
            break;
    }
	 pointer = nodes.length;//счетчик узлов на холсте
	_pointer = links.length;//счетчик связей на холсте
}

// handle mouseup events
function myUp(e) {
    // tell the browser we're handling this mouse event
    e.preventDefault();
    e.stopPropagation();
    mx = parseInt(e.clientX - offsetX);
    my = parseInt(e.clientY - offsetY);
    //check if i have selected an object from menu
    if (selected != null) {//если выбрана фигура с панели, то создаем её объект
	    pointer++;
        if (selected === "rectangle")
            newRect(mx, my);
        else if (selected === "rhombus")
            newRhombus(mx, my);
        else if (selected === "parallelogram")
            newParallelogram(mx, my);
		else if (selected === "preprocess")
            newPreprocess(mx, my);
        else if (selected === "ellipse")
            newEllipse(mx, my);
		else if (selected === "connector")
            newConnector(mx, my);
        selected = null;
        selectionMode = false;
        selectionok = false;
        draw();
        return;
    }
    if (dragging!=null){
        if (dragging==="newlink"){//если новая связь
		    let flag;
		    for (let i = 0; i < links.length; i++) {
                  let element = links[i];
				  if((element.from === selConnectorNode && element.to === linkDestNode) ||
				     (element.from === linkDestNode && element.to === selConnectorNode))
					 flag = true;//между двумя узлами допустима лишь одна связь
	        }
            if (linkDestNode!=null && !flag)//если есть дальний узел и не существует связи с идентичными узлами
            {
                addLink(new Link(selConnectorNode, linkDestNode, selConnector, linkDestConnector,"","straight"));//создаём новый объект связи без текста
                dragging=null;
				linkDestNode=null;
                selConnectorNode=null;
                selConnector=null;
                linkDestConnector=null;
				segmentsToSave = [];
				flag = false;
            }
            else {//иначе
				dragging="newlink";//всё ещё новая связь
				segmentsToSave.push({x:mx,y:my});//и сохраняем новый сегмент пути
			}
		}
            draw();
    }
    ChangeCursor("default");
    dragok = false;
	for (let i = 0; i < nodes.length; i++){
        let node = nodes[i];
        if(node.isDragging) {
            node.isDragging = dragok; // clear all the dragging flags
            if(node.x !== node.initX && node.y !== node.initY){
                node.last = 1;
            }
        }
    }
    WriteCoordinates(mx, my);//текущие координаты
	download();//автосохранение состояния объектов холста
	
	/*let bl = false;
    for (let i = 0; i < nodes.length; i++){
        let node = nodes[i];
        if(node.isDragging) {
            node.isDragging = dragok; // clear all the dragging flags
            if(node.x !== node.initX && node.y !== node.initY){
                node.last = 1;
                bl = true;
            }
        }
    }
    if(bl)
        ManagerUR();*/
}

function myKey(e){
    if (e.key==="Delete"){
		dragging = null;
        if (selNode!=null){
			//DELETE ALL THE LINKS
            for (let index = 0; index < links.length; index++) {
                  let element = links[index];
                  if (element.from === selNode || element.to === selNode){
                       links.splice(index,1);
					   for (let indexer = 0; indexer < linksToMove.length; indexer++) {
						     let linked = linksToMove[indexer];
							 if(linked === index)
								 linksToMove.splice(indexer,1);
					   }
				  }
            }
            //DELETE NODE
            nodes.splice(selNode,1);
			selNode = null;
			let tmp = JSON.parse(JSON.stringify(nodes));
            // in the case in which pointer is not at the end of copy and a shape has been moved
            if(pointer !== copy.length-1)
                copy.splice(pointer+1,copy.length-pointer-1);
            InsertCopy(tmp);
        }
        if (selLink !== null)
        {
            links.splice(selLink,1);
            selLink = null;
        }
		if (selBlock !== null && selNode === null)
        {
            blocks.splice(selBlock,1);
            selBlock=null;
			drawBlocks();
        }
        ChangeCursor("default");
		segmentsToSave = [];
		if(selectionMode){
		    selectionMode = selectionok = false;
		    RemoveSelection();
		}
		draw();
		download();//автосохранение состояния объектов холста
    }
	
	if(e.ctrlKey){
		if(e.key === "c" || e.key === "C" || e.key === "с"|| e.key === "С"){
		    if(selNode != null){
		        addBlock(nodes[selNode]);
			}
		    drawBlocks();
		}
		else if(e.key === "v" || e.key === "V" || e.key === "м" || e.key === "М"){
			if(selBlock != null){
			    blocks[selBlock].pointer = ++selNode;
		        addNode(blocks[selBlock]);
				NodesToCopy();
			}
		    draw();
		}
	}
}

// show coordinates of mouse
function WriteCoordinates(mx, my) {
    document.getElementById("coordinates").innerHTML = mx + ", " + my;
}

// change the mouse's icon
function ChangeCursor(val) {
    document.body.style.cursor = val;
}