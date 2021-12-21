window.onload = init_reference;//точка входа для компиляции кода в браузере

let canvas, ctx, WIDTH, HEIGHT, nodes = [], links = [];

function init_reference() {
	canvas = document.getElementById("canvas_reference");
    ctx = canvas.getContext("2d");
    WIDTH = canvas.width = document.getElementById('canvas_reference').offsetWidth;
	HEIGHT = canvas.height = document.getElementById('canvas_reference').offsetHeight;
	
	if(document.getElementById("text_nodes").value){
	  let json = JSON.parse(document.getElementById("text_nodes").value);
      for(let i=0;i<json.length;i++){
        nodes.push(json[i]);
	   }
	}
	if(document.getElementById("text_links").value){
	links.splice(0,links.length);
	let json = JSON.parse(document.getElementById("text_links").value);
    for(let i=0;i<json.length;i++){
        links.push(json[i]);
	   }
	}
	
	drawReference();

    let timeleft = 60;
	if(timeleft > 0){
    setInterval(function(){
       document.getElementById("timer").innerHTML = timeleft;
       timeleft -= 1;
       }, 1000);
	}
	setTimeout(function() { 
    window.close();
    }, 60000);
}

function clear() {
    ctx.fillStyle = "aliceblue"; //"#FAF7F8"
    ctx.globalAlpha = 1.0;
    ctx.rect(0, 0, WIDTH, HEIGHT);//рисуем белый пустой квадрат, который становится канвасом для рисования
	ctx.fill();
}

function drawReference() {//прорисовка элементов эталонного решения в демо режиме
    clear();
    // redraw each node in the nodes[] array
    for (let i = 0; i < nodes.length; i++) {//вызываем функцию draw, специфичную для каждого элемента
        let node = nodes[i];//копируем коллекцию фигур в рабочую переменную
        if (node.id === "rectangle")
            drawRect(node, 1);
        else if (node.id === "rhombus")
            drawRhombus(node);
        else if (node.id === "parallelogram")
            drawParallelogram(node);
		else if (node.id === "preprocess")
            drawPreprocess(node);
        else if (node.id === "ellipse")
            drawEllipse(node);
		else if (node.id === "connector")
            drawConnector(node);
    }
	for (let i = 0; i < links.length; i++) {
         let element = links[i];
		 drawLink(ctx, element);
	}
}