
    function addLink(link){
        links.push(link);
    }

    /**
     * @return {number}
     */
    function InsideConnectors(node,mx,my){
        for (let index = 0; index < node.connectors.length; index++) {
            let element = node.connectors[index];
            if ( ((mx - element.x)*(mx - element.x) + (my - element.y)*(my - element.y)) <= 100 )
            {
                return index;
            }
        }
        return null;
    }

    function highlightConnectors(x,y, title){
        ctx.beginPath();
        ctx.lineWidth=1;
        ctx.strokeStyle = "red";
        ctx.arc(x,y,3,0,2*Math.PI,false);
        ctx.stroke();
		/*this.title = title;
        if (this.title!==null)
        {
			ctx.font = 10 + "px Arial";
            ctx.fillStyle = "black";
            ctx.textAlign = "center";
            ctx.fillText(title,x,y+10);
        }*/
    }

    function connectorCoords(connector){
        return {x:connector.x,
            y:connector.y};
    }

    function drawConnectors(x, y){
        ctx.beginPath();
        ctx.lineWidth=1;
        ctx.fillStyle="green";
        ctx.strokeStyle = "black";
        ctx.arc(x,y,2,0, 2*Math.PI,false);
        ctx.fill();
        ctx.stroke();
    }

    function Link(from, to, selConnector, linkDestConnector, text, mode){
        this.from=from;
        this.to=to;
        this.connectorFrom=selConnector;
        this.connectorTo=linkDestConnector;
        this.segments=[];
        this.strokeStyle="black";
        this.strokeStyleHighlight="red";
        this.indexText=0;
        this.text=text;
        if (mode!=null){
		     this.mode=mode.toLowerCase();
		}
        else{
            this.mode="straight";
		}
    
        if (this.mode==="straight" || this.mode==null)
        {
            let C1=connectorCoords(nodes[this.from].connectors[this.connectorFrom]);
            let C2=connectorCoords(nodes[this.to].connectors[this.connectorTo]);
			this.segments=[{x:C1.x,y:C1.y}];
			if(segmentsToSave.length !== null){
			for (let i = 1; i < segmentsToSave.length; i++)
				 this.segments.push(segmentsToSave[i]);
			}
            this.segments.push({x:C2.x,y:C2.y});
			segmentsToSave = [];
            this.indexText=1;
        }
    }
	
	function reSegment(link){
        if (link != null && (link.mode==="straight" || link.mode==null)) {
            let C1=connectorCoords(nodes[link.from].connectors[link.connectorFrom]);
            let C2=connectorCoords(nodes[link.to].connectors[link.connectorTo]);
            link.segments.splice(0,1,{x:C1.x,y:C1.y});
			link.segments.splice(link.segments.length-1,1,{x:C2.x,y:C2.y});
            link.indexText=1;
        }
    }
	
	function highlight(ctx, link) {
        //SEGMENT
        ctx.beginPath();
        ctx.strokeStyle = link.strokeStyleHighlight;
        const element = link.segments[0];
        ctx.moveTo(element.x,element.y);
        for (let index = 1; index < link.segments.length; index++) {
             let element = link.segments[index];
             ctx.lineTo(element.x,element.y);
            }
        let element1 = link.segments[link.segments.length-1];
        ctx.stroke();
        //ENDPOINT
        ctx.beginPath();
        ctx.fillStyle=link.strokeStyleHighlight;
        ctx.strokeStyle = link.strokeStyleHighlight;
        ctx.arc(element1.x,element1.y,2*2,0,2*Math.PI,false);
        ctx.fill();
    }
    
    function distance(a,b){
        return Math.sqrt((a.x-b.x)*(a.x-b.x) + (a.y-b.y)*(a.y-b.y));
    }

    /**
     * @return {boolean}
     */
    function Between(a,c,b){
        return distance(a,c)+distance(c,b)-distance(a,b)<1;
    }

    /**
     * @return {boolean}
     */
    function OverLink(point, link){
        for (let index = 1; index < link.segments.length; index++) {
             let element = link.segments[index];
             let element0 = link.segments[index-1];
             if (Between(element0,point,element))
                 return true;
        }
        return false;
    }
	
	function arrow(context, fromx, fromy, tox, toy) {
        let headlen = 15; // length of head in pixels
        let dx = tox - fromx;
        let dy = toy - fromy;
        let angle = Math.atan2(dy, dx);
        context.beginPath();
        context.moveTo(fromx, fromy);
        context.lineTo(tox, toy);
        context.stroke();
        context.beginPath();
        context.fillStyle="black";
        context.moveTo(tox, toy);
        context.lineTo(tox - headlen * Math.cos(angle - Math.PI / 10), toy - headlen * Math.sin(angle - Math.PI / 10));
        context.lineTo(tox - headlen * Math.cos(angle + Math.PI / 10), toy - headlen * Math.sin(angle + Math.PI / 10));
        context.fill();
    }        
    
    function drawLink(ctx, link){
        //PATH
        ctx.beginPath();
        ctx.lineWidth=1;
        ctx.strokeStyle = link.strokeStyle;
        const element = link.segments[0];
        ctx.moveTo(element.x,element.y);
        for (let index = 1; index < link.segments.length-1; index++) {
            const element = link.segments[index];
            ctx.lineTo(element.x,element.y);
        }
        ctx.stroke();
        //TEXT
        let elementT=link.segments[link.indexText];
        let elementT0=link.segments[link.indexText-1];
        ctx.beginPath();
        ctx.textAlign = "center";
        ctx.fillStyle = "black";
        if(link.text === "Yes" || link.text === "Да" || link.text === "yes" || link.text === "да")
            ctx.fillStyle = "green";
        if(link.text === "No" || link.text === "Нет" || link.text === "no" || link.text === "нет")
            ctx.fillStyle = "red";
        ctx.font = "12px Arial";
        ctx.fillText(link.text,(elementT.x+elementT0.x)/2,(elementT.y+elementT0.y)/2 - 6);
        ctx.fill();

        elementT=link.segments[link.segments.length-2];
        elementT0=link.segments[link.segments.length-1];
        arrow(ctx,elementT.x,elementT.y,elementT0.x,elementT0.y);
    }
	
	function textfill(context,node) {
        let fontSize = 12;
        let lines = [];
        let width = 0, i, j;
        let result;
        let color = "black";
        let text = node.text;
        let max_width = node.width;
        // Font and size is required for ctx.measureText()
        context.font   = fontSize + "px Arial";
        context.textAlign="center";
        // Start calculation
        while (text.length) {
            for( i=text.length; context.measureText(text.substr(0,i)).width > max_width-14; i--);
                result = text.substr(0, i);
                if (i !== text.length)
                    for (j = 0; result.indexOf(" ", j) !== -1; j = result.indexOf(" ", j) + 1);
                        lines.push(result.substr(0, j || result.length));
                        width = Math.max(width, context.measureText(lines[lines.length - 1]).width);
                        text = text.substr(lines[lines.length - 1].length, text.length);
        }
            
        context.font = fontSize + "px Arial";
        context.fillStyle = color;
        // Render
        if(node.id === "rectangle" || node.id === "preprocess") {
            let OffSet=(node.height-(lines.length+1)*(fontSize+5))/2;
            for ( i=0, j=lines.length; i<j; ++i ) {
                context.fillText(lines[i], node.x+node.width/2 , node.y + 10 + fontSize + (fontSize + 2) * i + OffSet);
              }
		    }
		    else if(node.id === "rhombus") {
            let OffSet=(node.height-(lines.length+1)*(fontSize+5))/2 - 10;
            for ( i=0, j=lines.length; i<j; ++i ) {
                context.fillText(lines[i], node.x, node.y + 5 + fontSize + (fontSize + 2) * i + OffSet);
              }
		    }
		    else if(node.id === "parallelogram") {
            let OffSet=(node.height-(lines.length+1)*(fontSize+5))/2 - 20;
            for ( i=0, j=lines.length; i<j; ++i ) {
                context.fillText(lines[i], node.x + node.width/1.5, node.y - node.height/3.5 + fontSize + (fontSize + 2) * i + OffSet);
              }
		    }
        }