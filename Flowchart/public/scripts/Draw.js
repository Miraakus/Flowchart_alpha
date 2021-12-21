let canvas, ctx, nodes = [], copy = [], links = [], duplicate = [], BB, offsetX, offsetY, WIDTH, HEIGHT; // canvas related references

function drawGrid() {
    //grid width and height
    let bw = WIDTH;
    let bh = HEIGHT;
    //padding around grid
    let p = 10;
    //size of canvas
    //var cw = bw + (p * 2) + 1;
    //var ch = bh + (p * 2) + 1;
    ctx.beginPath();//начало построения
    ctx.lineWidth = "1";//ширина линии
    ctx.strokeStyle = "grey";//цвет линии
    for (let x = 0; x <= bw; x += dim) {//строим горизонтальные линии с шагом dim = 10
        ctx.moveTo(0.5 + x + p, p);//начальная точка
        ctx.lineTo(0.5 + x + p, bh + p);//конечная точка
    }
    for (let x = 0; x <= bh; x += dim) {//строим вертикальные линии с шагом dim = 10
        ctx.moveTo(p, 0.5 + x + p);
        ctx.lineTo(bw + p, 0.5 + x + p);
    }
    ctx.closePath();//завершение построения 
    ctx.stroke();//отображения построенных линий на холсте
}

// clear the canvas
function clear() {
    ctx.fillStyle = "white";//"aliceblue"; //"#FAF7F8"
    drawRect(null, 0);//рисуем белый пустой квадрат, который становится канвасом для рисования
    ctx.fill();//ничем не заполняем
}

// redraw the scene
function draw() {
    clear();//очищаем холст
    if (choice)//если выбрана сетка
        drawGrid();//строим её
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
        else if (node.id === "selection")
            moveSelection(node);
    }
	for (let i = 0; i < links.length; i++) {
        let element = links[i];
		drawLink(ctx, element);
	}
    drawTrash();//добавляем на холст корзину
    if(selectionok)//если выделение активно
        drawSelection(0,0);//рисуем его
}

function SetCoordinates(){//установка граничных значений координат
    BB = canvas.getBoundingClientRect();//инкапсулируем все размеры экрана
    offsetX = BB.left;//извлекаем начало оси абсцисс
    offsetY = BB.top;//извлекаем начало оси ординат
}

function SetDimension(){//установка общей размерности
    WIDTH = canvas.width = /*1125*/document.getElementById('canvas').offsetWidth;//получаем фиксированную ширину холста
    HEIGHT = canvas.height = /*800*/document.getElementById('canvas').offsetHeight;//получаем фиксированную высоту холста
	
	_WIDTH = _canvas.width = document.getElementById('canvas_addon').offsetWidth;
	_HEIGHT = _canvas.height = document.getElementById('canvas_addon').offsetHeight;
	
    document.getElementById("menu_horizontal").style.width = canvas.width;//установка ширины горизонтального меню по ширине холста
    if(document.getElementById("errorText"))
    document.getElementById("errorText").style.width = canvas.width;
    
    upload();//отрисовываем содержимое холста
}

function init() {//начальная инициализация элементов страницы
    // get canvas related references
    canvas = document.getElementById("canvas");//объект метаданных холста
    ctx = canvas.getContext("2d");//получаем двумерный контекст холста
	
	_canvas = document.getElementById("canvas_addon");
	_ctx = _canvas.getContext("2d");
	
    SetCoordinates();//начальные координаты
	SetCoordinates_addon();
    SetDimension();//общая размерность
	

    // listen for mouse events
	canvas.onmousedown = myDown;
    canvas.onmouseup = myUp;
    canvas.onmousemove = myMove;
    _canvas.onmousedown = Down;
    _canvas.onmouseup = Up;
    _canvas.onmousemove = Move;
    canvas.ondblclick = myDoubleClick;
	window.onkeydown = myKey;
    window.onresize = SetDimension;
    InsertCopy([]); // insert into copy an empty array
    // call to event listen
    SetMenuEvent();
}

window.onload = init;//точка входа для компиляции кода в браузере