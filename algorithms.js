let ORANGE = "orange"
let WHITE = "white"
let BLACK = "black"
let YELLOW = "yellow"
let RED = "red"
let GREEN = "green"

let SPEED = 100

/**
 * Nächste aufgabe wenn ein feld schon bereits grün oder rot ist soll ich es nicht mit schwarz übermalen können!
 */

let RECTWIDTH = 60
let RECTHEIGHT = 60
/**
 * Canvas - all settings for Canvas
 */
class Canvas{
    constructor(rectWidth = 20,rectHeight = 20,dimension = "2d", id ="canvas"){
        this.canvas = document.getElementById(id)
        this.ctx = this.canvas.getContext(dimension)
        this.rectWidth = rectWidth
        this.rectHeight = rectHeight
        this.stepX = rectWidth
        this.stepY = rectHeight
        this.color = WHITE

        this.start = undefined
        this.target = undefined
        this.walls = []
      
    }
    draw() {
        this.ctx.beginPath()
        for(let x = 0;x <= this.canvas.width; x += this.stepX ){
            this.ctx.moveTo(x,0)
            this.ctx.lineTo(x,this.canvas.height)
        }
        for(let y = 0;y <= this.canvas.height; y += this.stepY ){
            this.ctx.moveTo(0,y)
            this.ctx.lineTo(this.canvas.width,y)
        }
        this.ctx.stroke()
    }

    repeatProcess(startNode,targetNode){
        this.resetCanvas(false)
        this.setStart(startNode.x,startNode.y)
        this.setTarget(targetNode.x,targetNode.y)
        this.walls.forEach(el => {
            this.changeRectangleColor(el.x,el.y,BLACK)
        })
    }

    changeRectangleColor(x,y, color = undefined){
        if(color != undefined){
            this.color = color
        }
        // um die richtigen koordinaten zu kriegen x*= this.rectWitdh
        this.ctx.fillStyle = this.color
        x *= this.rectWidth
        y *= this.rectWidth
        this.ctx.fillRect(x , y ,this.rectWidth,this.rectHeight)
        this.ctx.stroke()
    }
    writeText(x, y, val) {
        // Text in Rechteck einfügen
        x *= this.rectWidth;
        y *= this.rectHeight;
        c.ctx.fillStyle = 'black';
        c.ctx.font = '10px Arial';
        c.ctx.textAlign = 'center';
        c.ctx.textBaseline = 'middle';
        const textWidth = c.ctx.measureText(val).width; // Breite des Textes
        c.ctx.fillText(val, x + this.rectWidth / 2, y + this.rectHeight / 2, textWidth);
    }

    getCoordinates(event){
        const map = new Map()
        const rect = this.canvas.getBoundingClientRect();
      
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
      
        const rectX = (Math.floor(x / this.rectWidth));
        const rectY = (Math.floor(y / this.rectHeight));
      
        map.set("x",rectX)
        map.set("y",rectY)
        return map
    }

    resetJustWalls(){
        let start = this.start
        let target = this.target
        this.resetCanvas(true)
        this.setStart(start.get("x"), start.get("y"))
        this.setTarget(target.get("x"),target.get("y"))
        

    }

    loadImage(x,y, img){
        const image = new Image()
        image.onload = () => {
            x *= this.rectWidth
            y *= this.rectWidth
            // x+ RECTWIDTH / 4 = damit es zentriert wird
            this.ctx.drawImage(image, x +(RECTWIDTH / 4), y+ (RECTWIDTH / 4),RECTWIDTH / 2 ,RECTWIDTH / 2)
            this.draw()
        };
        image.src = img
    }

    async setTarget(x,y){
        c.changeRectangleColor(x,y,RED)
        this.loadImage(x,y,'img/fire_home.png')
        const map = new Map()
        map.set("x", x)
        map.set("y", y)
        this.target = map
    }

    setStart(x,y){
        c.changeRectangleColor(x,y,GREEN)
        this.loadImage(x,y,'img/firetruck.png')
        const map = new Map()
        map.set("x", x)
        map.set("y", y)
        this.start = map
    }

    setWall(x,y){
        if (this.color == BLACK){ 
            const wallCoordinates = { x, y };
            if (!this.walls.some(obj => obj.x === x && obj.y === y)) {
                 this.walls.push(wallCoordinates);
            }
        }
    }

    removeWallAndChangeColor(x,y){
        let index = this.walls.findIndex(obj => obj.x == x && obj.y == y)
        if(index != -1){
            this.walls.splice(index,1)
            c.changeRectangleColor(x,y,WHITE)
        }
        
    }

    setWallAndChangeColor(x,y){
        const wallCoordinates = { x, y };
        if (!this.walls.some(obj => obj.x === x && obj.y === y)) {
                this.changeRectangleColor(x,y,BLACK)
                 this.walls.push(wallCoordinates);
        }
        
    }

    resetStart(x,y){
        
        if(this.start !== undefined){
            if(this.start.get("x") == x && this.start.get("y") == y){
                this.start = undefined
                return true
            }
        }
        return false
    }
    resetTarget(x,y){
        if(this.target !== undefined){
            if(this.target.get("x") == x && this.target.get("y")== y){
                this.target = undefined
                return true
            }
        }
        return false
    }

    delWallElement(x,y){
       
        if (this.color == WHITE){  
            const wallCoordinates = {x,y}
            const index = this.walls.findIndex(obj => obj.x === wallCoordinates.x && obj.y === wallCoordinates.y);
            if (index !== -1) {
                this.walls.splice(index, 1);
                //console.log(this.walls);
            }
        }
    }

    getWall(){
        return this.walls
    }

    getTarget(){
        return this.target
    }

    getStart(){
        return this.start
    }

    checkFieldBeforeDrawing(x,y){
        let isTargetOrStart = false
        let xValOfStart
        let yValOfTarget 
        let yValOfStart
        let xValOfTarget
        if(this.start != undefined){
            xValOfStart = this.getStart().get("x")
            yValOfStart = this.getStart().get("y")
        }
    
        if(this.target != undefined){
            xValOfTarget = this.getTarget().get("x")
            yValOfTarget = this.getTarget().get("y")
        }
    
        if(x == xValOfStart && y == yValOfStart){
            isTargetOrStart = true
        }
        if(x == xValOfTarget && y == yValOfTarget)
        {
            isTargetOrStart = true 
        }
    
        return isTargetOrStart
    }

    resetCanvas(wallsTrue = true){
        this.ctx.fillStyle = WHITE;
        this.ctx.fillRect(0, 0, canvas.width, canvas.height);
        this.color = WHITE
        this.start = undefined
        this.target = undefined
        if(wallsTrue == true){
            this.walls = []
        }
       
        this.draw()
    }

    

    analyzeHeuristicOrCost(start,target, path = undefined){
        this.ctx.fillStyle = WHITE;
        this.ctx.fillRect(0, 0, canvas.width, canvas.height);
        this.color = WHITE
        this.draw()
        c.changeRectangleColor(start.x,start.y,GREEN)
        c.changeRectangleColor(target.x,target.y, RED)
        
        if(path != undefined){
                for (let i = 1; i < path.length -1; i++) {
                    c.changeRectangleColor(path[i].x, path[i].y, ORANGE)
                    if(i-1 != 0){
                    c.changeRectangleColor(path[i-1].x, path[i-1].y,ORANGE)
                }
                else{
                  c.changeRectangleColor(path[i-1].x, path[i-1].y,GREEN)
                }
            }
            let walls = c.getWall()
            for(let i = 0;i < walls.length;i++){
                        c.changeRectangleColor(walls[i].x, walls[i].y, BLACK)
            }
        }
        
    }

    setColor(expr){
        switch(expr){
            case 1:
                this.color = RED
                break;
            case 2:
                this.color = BLACK
                break;
            case 3:
                this.color = GREEN
                break;
            case 4:
                this.color = WHITE
        }
    }

}
/**
 * MouseEvents - class to handle events 
 */
class MouseEvents {
    constructor(obj){
        this.isLeftClick = false
        this.isMouseMove = false
        this.isMouseUp = false
        this.isRightClick = false
        this.isMouseDown = false
        this.obj = obj
        
        /**
         * case when mousedown - 
         * if left button clicked then isLeftClick equal true
         * if right button clicked then isRightClick equal true
         * isMouseDown will be direct settet to true
         */
        this.obj.canvas.addEventListener("mousedown", function(e){
            this.isMouseDown = true
            if(e.button === 0){ //loft click
                this.isLeftClick = true
            }
            else if(e.button === 2){ // right click
                this.isRightClick = true    
            }
        }.bind(this))

        this.obj.canvas.addEventListener("mousemove", function(){
            this.isMouseMove = true
        }.bind(this))
        
        this.obj.canvas.addEventListener("mouseup", function(e){
            this.isMouseUp = true
            if(e.button === 0){
                this.isLeftClick = false
            }
            else if(e.button === 2){
                this.isRightClick = false
            }
        }.bind(this))

        this.obj.canvas.addEventListener("contextmenu", function(e){
            e.preventDefault();
            this.isRightClick = true
        }.bind(this))
        
        this.obj.canvas.addEventListener("mousemove", function(e){
            //console.log(this.isMouseMove + " " + this.isLeftClick + " " + this.isMouseDown + " " + !this.isMouseUp)
            if(this.isLeftClick && this.isMouseDown && this.isMouseMove && !this.isMouseUp){
                const map = this.obj.getCoordinates(e)
                const x = map.get("x")
                const y = map.get("y")
                
                this.obj.resetStart(x,y)
                this.obj.resetTarget(x,y)

                if(this.obj.color == BLACK || this.obj.color == WHITE){
                    //console.log(this.obj.checkFieldBeforeDrawing(x,y))
                    this.obj.setWall(x,y)
                    this.obj.delWallElement(x,y)
                    this.obj.changeRectangleColor(x,y)        
                   
                }

            }else if(this.isRightClick && this.isMouseDown && this.isMouseMove && !this.isMouseUp){
                const map = this.obj.getCoordinates(e)
                const x = map.get("x")
                const y = map.get("y")
                
                let color = this.obj.color
                
                this.obj.color = WHITE
                this.obj.setWall(x,y)
                this.obj.delWallElement(x,y)
                this.obj.resetStart(x,y)
                this.obj.resetTarget(x,y)
                this.obj.changeRectangleColor(x,y,WHITE)
                this.obj.color = color
            }else{
                this.isMouseMove = false
                this.isMouseUp = false
                this.isMouseDown = false
            }
            
        }.bind(this))

        this.obj.canvas.addEventListener("click", function (e) {
            
            const map = this.obj.getCoordinates(e)
            const x = map.get("x")
            const y = map.get("y")
            //console.log(`x: ${x}, y: ${y}`)
            this.obj.resetStart(x,y)
            this.obj.resetTarget(x,y)
            //CHECKS IF START AND TARGET IS ALREADY SETTET
            if(this.obj.start == undefined && this.obj.color == GREEN ){
                this.obj.changeRectangleColor(x, y)
                this.obj.setStart(x,y) 
            }
            if(this.obj.target == undefined && this.obj.color == RED){
                this.obj.changeRectangleColor(x, y)
                this.obj.setTarget(x,y)
            }
            if(this.obj.color == BLACK || this.obj.color == WHITE){
                
                this.obj.changeRectangleColor(x, y)
                this.obj.delWallElement(x,y)
                this.obj.setWall(x,y)
            }              
            

        }.bind(this))

        this.obj.canvas.addEventListener("contextmenu", function (e) {
            const map = obj.getCoordinates(e)
            const x = map.get("x")
            const y = map.get("y")
            //console.log(`x: ${x}, y: ${y}`)
            const color = this.obj.color 
            
            //IF DELETE TARGET THE ATTRIBUTE WILL BE SETTET TO UNDEFINED TO GET LATER A NEW START OR TARGET
            this.obj.resetStart(x,y)
            this.obj.resetTarget(x,y)

            this.obj.color = WHITE
            this.obj.delWallElement(x,y)
            this.obj.setWall(x,y)
            this.obj.changeRectangleColor(x, y,WHITE)
            this.obj.color = color
        }.bind(this))

    }
}



class Graph{
    constructor(start,target){
        this.xAchse = c.canvas.width / RECTWIDTH
        this.yAchse = c.canvas.height / RECTHEIGHT
        this.adjacentMatrix = []
        this.adjacentWheights = []
        this.target = target
        this.start = start
        this.createAdjacentMatrix()
        this.visited = []
        this.queue = []
    }
    createAdjacentMatrix(){
        for(let y = 0;y < this.yAchse;y++){
            let row = []
            let costs = [] // new
            for(let x = 0;x < this.xAchse;x++){
                let map = new Map()
                let node = new Node(x,y)
               
                let currCoordinates = new Node(x,y)
                
                let cost = this.distanceBetween(currCoordinates,this.target) //path-cost
                let g = 0
                let h = 0 // heuristic
                let f = 0 // total cost of the node
                this.setAdjacent(x,y,node)
                
                map.set("node",node)
                map.set("h",h)
                map.set("g",g)
                map.set("f",f)
                row.push(map)

                costs.push({x,y,cost,h,g,f}) // new
            }
            this.adjacentMatrix.push(row)
            this.adjacentWheights.push(costs)
            
        }
        //console.log(this.adjacentMatrix)
    }

    euclideanDistance(node, target){
        //  distance from between current node and target node
        const xPosition = node.x
        const yPosition = node.y
        const xTarget = target.x
        const yTarget = target.y
        const dx = xTarget - xPosition
        const dy = yTarget - yPosition
        return Math.sqrt(dx*dx + dy*dy)
    }

    distanceBetween(node, goal){
        const xPosition = node.x
        const yPosition = node.y
        const xTarget = goal.x
        const yTarget = goal.y
        return Math.abs(xTarget - xPosition) + Math.abs( yTarget - yPosition)
    }

    heuristic(node,goal){
        const xPosition = node.x
        const yPosition = node.y
        const xTarget = goal.x
        const yTarget = goal.y
        return Math.abs(xTarget - xPosition) + Math.abs( yTarget - yPosition)
   
    }

    getNodeWithMap(position){
        return this.getNode(position.get("x"),position.get("y"))
    }
    getNode(x,y){
        return this.adjacentMatrix[y][x].get("node")
    }

    getHeuristic(x,y){
        return this.adjacentMatrix[y][x].get("h")
    }
    setHeuristic(x,y, val){
        this.adjacentWheights[y][x].h = val
       
        this.adjacentMatrix[y][x].set("h",val)
    }
    getfScore(x,y){
        return this.adjacentMatrix[y][x].get("f")
    }
    setfScore(x,y, val){
        this.adjacentWheights[y][x].f = val
        this.adjacentMatrix[y][x].set("f", val)
    }
    getGCost(x,y){
        return this.adjacentMatrix[y][x].get("g")
    }
    setGCost(x,y,val){
        this.adjacentWheights[y][x].g = val
        this.adjacentMatrix[y][x].set("g", val)
    }
    getAdjacent(x,y){
        return this.getNode(x,y).adjacent
    }
    setAdjacent(x,y, node){       

        let adjacentNode = node.adjacent
        const rechts = [(x+1),y ]
        // THIS: \ 
        const diagonalUnderRight = [(x+1) , (y+1)]
        const diagonalAboveLeft = [(x-1),(y-1)]
        const links = [(x-1),y]
        // THIS: /
        const diagonalUnderLeft = [(x-1),(y+1)]
        const diagonalAboveRight = [(x+1),(y-1)]
        const oben = [x,(y-1)]
        const unten =[x,(y+1)]       
        adjacentNode.push(oben)
        
        adjacentNode.push(rechts)
        //adjacentNode.push(diagonalUnderRight)
        
        adjacentNode.push(unten)
        adjacentNode.push(links)
        //adjacentNode.push(diagonalAboveLeft)
        let val = adjacentNode.filter(val => val[0] >= 0 && val[0] < this.xAchse && val[1] >= 0 && val[1] < this.yAchse)    
        
        let start  = new Node(x,y)

        let edgeList = []
        val.forEach(indexVal => {
          
            let end = new Node(indexVal[0],indexVal[1])   
            let edge = new Edge(start,end, this.euclideanDistance(end,this.target))
            edgeList.push(edge)
        })
        node.adjacent = edgeList
        //console.log(node.adjacent)
    }
    checkWall(node){
        let walls = c.walls
        for(let i = 0;i < walls.length;i++){
            let check = walls[i]
            if(check.x == node.x && check.y == node.y){
                return true
            }
        }
        return false
    } 
    sleep(ms){
        return new Promise(resolve => setTimeout(resolve,ms))
    }

    async showCostCanvas(show){
        let val = undefined
       
        for(let y = 0;y < this.adjacentWheights.length;y++){
            for(let x= 0;x < this.adjacentWheights[y].length;x++ ){
                if(show == "h"){
                    val = "h = " + this.adjacentWheights[y][x].h
                 
                }else if(show == "g"){
                    val  = val = "g = " +  this.adjacentWheights[y][x].g
                }else if(show == "f"){
                    val  = val = "f = " +  this.adjacentWheights[y][x].f
                }
                c.writeText(x,y,val )
            }
        }
    }
    async printAlgorithm(path,target){
        if(path != undefined){
            for (let i = 1; i < path.length ; i++) {
                const node = path[i]      
                c.changeRectangleColor(path[i].x, path[i].y, ORANGE)
                c.loadImage(node.x,node.y,"img/firetruck.png")
                if(i-1 != 0){
                    c.changeRectangleColor(path[i-1].x, path[i-1].y,ORANGE)
                }
                else{
                    c.changeRectangleColor(path[i-1].x, path[i-1].y,GREEN)
                }
        
                await this.sleep(SPEED)
            }
            
            c.changeRectangleColor(target.x,target.y,RED)
            c.loadImage(target.x,target.y,"img/home.png")
        }
        
    }
    isEqual(start,target){
        return start.x == target.x && start.y == target.y
    }

    removeValueFromArray(arr, val) {
        for (let i = arr.length - 1; i >= 0; i--) {
          if (arr[i] === val) {
            arr.splice(i, 1);
          }
        }
        return arr;
    }
  
    async dfs(start, target) {
        if (this.isEqual(start,target)) {
            return [];
        }
        let startId = start.x + "_" + start.y
        this.visited.push(startId);
        const adjacent = this.getAdjacent(start.x, start.y);
        for (let i = 0; i < adjacent.length; i++) {
            let neighbour = adjacent[i].end
            let neighbourId = neighbour.x +"_"+neighbour.y
            if (!this.visited.includes(neighbourId) && !this.checkWall(neighbour)) {
                if(!this.isEqual(neighbour,target)){
                    c.changeRectangleColor(neighbour.x, neighbour.y, "blue")
                    await this.sleep(SPEED)
                }
                let path = await this.dfs(neighbour, target);
                if (path != null) {
                    return [start].concat(path);
                }
            }
        }
        return null;
    }

    async bfs(start,target){
        let startId = start.x + "_" + start.y
        let parents = {}
        let path = []
    
        this.visited.push(startId)
        this.queue.push(start)
       
        while(this.queue.length > 0 ){
            let node = this.queue.shift()
            let adjacent = this.getAdjacent(node.x,node.y)
           
            for(let i = 0; i < adjacent.length;i++){
                let neighbour = adjacent[i].end
                let neighbourId = neighbour.x +"_"+neighbour.y
                if(!this.visited.includes(neighbourId) && !this.checkWall(neighbour)){

                    parents[neighbourId] = node
                    if (this.isEqual(neighbour,target)) {
                        let current = neighbour
                        while (current !== start) {
                            path.unshift(current)
                            current = parents[current.x + "_" + current.y]
                        }
                        path.unshift(start)
                       
                        return path;
                    }
                    c.changeRectangleColor(neighbour.x,neighbour.y, "blue")
                    await this.sleep(SPEED)
                    this.visited.push(neighbourId)
                    this.queue.push(neighbour)
                }
            }
            
        }
        
        return null
    }

    async ucs(start, target) {
        let queue = new PriorityQueue();
        let startId = start.x + "_" + start.y;

        let path = {};
        path[startId] = [start];
      
        queue.push(start, 0);
        this.visited.push(startId);
      
        while (!queue.isEmpty()) {
          let item = queue.dePop();
          let node = item.node;
          let nodeCost = item.priority;
          let adjacent = this.getAdjacent(node.x, node.y);
      
          for (let i = 0; i < adjacent.length; i++) {
            let neighbour = adjacent[i].end;
            let neighbourCost = this.distanceBetween(neighbour,this.target);
            let neighbourId = neighbour.x + "_" + neighbour.y;
            let nodeId = node.x + "_" + node.y; 
    
            if (this.isEqual(neighbour, target)) {
              
              path[neighbourId] = path[nodeId].concat([neighbour]);
             
              return path[neighbourId];
            }
          
            if (!this.visited.includes(neighbourId)  && !this.checkWall(neighbour)) {
              let totalCost = neighbourCost + nodeCost;
              this.setGCost(neighbour.x, neighbour.y, totalCost); // Kosten setzen
              queue.push(neighbour, totalCost);
              this.visited.push(neighbourId);
          
              path[neighbourId] = path[nodeId].concat([neighbour]);
          
              c.changeRectangleColor(neighbour.x, neighbour.y, "blue");
              await this.sleep(SPEED);
            }
          }
        }
        return null
    }

    async astar(start, target) {
        let openList = new PriorityQueue();
        let openListId = [];
        let closedList = [];
        openList.push(start, 0);
        openListId.push(start.x + "_" + start.y);
        this.setGCost(start.x, start.y, 0);
        start.parent = null;
    
        while (!openList.isEmpty()) {
            let current = openList.dePop().node;
            this.removeValueFromArray(openListId, current.x + "_" + current.y);
            closedList.push(current.x + "_" + current.y);
    
            if (this.isEqual(current, target)) {
                let path = [current];
                let parent = current.parent;
                while (parent !== null) {
                    path.unshift(parent);
                    parent = parent.parent;
                }
                return path;
            }
        
            const adjacent = this.getAdjacent(current.x, current.y);
            for (let i = 0; i < adjacent.length; i++) {
                let neighbour = adjacent[i].end;
                if (closedList.includes(neighbour.x + "_" + neighbour.y) || this.checkWall(neighbour)) {
                    continue;
                }
               if(!this.isEqual(neighbour,target)){
                c.changeRectangleColor(neighbour.x, neighbour.y, "blue");
                await this.sleep(SPEED);
               }
                
                
                
                let tentative_gScore = this.getGCost(current.x, current.y) + this.distanceBetween(current, neighbour);
                let tentative_fScore = tentative_gScore + this.heuristic(neighbour, target);

                if (!openListId.includes(neighbour.x + "_" + neighbour.y)) {    
                    openList.push(neighbour, tentative_fScore);
                    openListId.push(neighbour.x + "_" + neighbour.y)
                    neighbour.parent = current
                    this.setGCost(neighbour.x, neighbour.y, tentative_gScore)
                    this.setfScore(neighbour.x, neighbour.y, tentative_fScore)
                    this.setHeuristic(neighbour.x,neighbour.y, this.heuristic(neighbour,target))
                } else if (tentative_fScore < this.getfScore(neighbour.x, neighbour.y)) {
                    this.setfScore(neighbour.x, neighbour.y, tentative_fScore)
                    this.setHeuristic(neighbour.x,neighbour.y,  this.heuristic(neighbour, target))
                    neighbour.parent = current
                    this.setGCost(neighbour.x, neighbour.y, tentative_gScore)
                    
                }
            }
        }
        return null; 
    }

    async dijkstra(start, target) {
        let queue = new PriorityQueue();
        let distance = new Map();
        let id = new Set();
    
        distance.set(start, 0);
        id.add(start.x + "_" + start.y);
        queue.push(start, 0);
    
        start.parent = null;
    
        while (!queue.isEmpty()) {
            const item = queue.dePop();
            const currentNode = item.node;
            const currentDistance = item.priority;
            
            if (this.isEqual(currentNode, target)) {
                let path = [currentNode];
                let parent = currentNode.parent;
                while (parent != null) {
                    path.unshift(parent);
                    parent = parent.parent;
                }
                return path;
            }
    
            if (currentDistance > distance.get(currentNode) || this.checkWall(currentNode)) {
                continue;
            }

            let adjacent = this.getAdjacent(currentNode.x, currentNode.y);
            for (let i = 0; i < adjacent.length; i++) {
               
                let neighbour = adjacent[i].end;
                
                let neighbourWheight =  this.euclideanDistance(currentNode, neighbour)          
                let dist = currentDistance + neighbourWheight;
                
                if ((!id.has(neighbour.x + "_" + neighbour.y) || dist < distance.get(neighbour)) && !this.checkWall(neighbour)) {
                    this.setGCost(neighbour.x,neighbour.y,dist)
                    if (!this.isEqual(neighbour, start) && !this.isEqual(neighbour, target) ) {
                        c.changeRectangleColor(neighbour.x, neighbour.y, "blue");
                        await this.sleep(SPEED);
                    }
                    distance.set(neighbour, dist);
                    id.add(neighbour.x + "_" + neighbour.y);
                    queue.push(neighbour, dist);
                    neighbour.parent = currentNode;
                    
                }
              
            }
        }
    
        return null;
    }
    
}

class PriorityQueue{
    constructor()
    {
        this.items = []
    }
    push(node, priority) {
        let index = this.items.findIndex((item) => priority <= item.priority)
        if (index === -1) {
          index = this.items.length
        }
        this.items.splice(index, 0, { node, priority });
    }
    
    dePop(){
        if(!this.isEmpty()){
            return this.items.splice(0,1)[0]
        }
        return false
    }

    print(){
        console.log(this.items)
    }

    isEmpty(){
        return this.items.length == 0
    }
 
}
class Node{
    constructor(x,y){
        this.x = x
        this.y = y
        this.adjacent = []
    }
}

class Edge{
    constructor(start,end, cost){
        this.start = start
        this.end = end
        this.cost = cost
    }
}
class Maze{
    constructor(canvas){
        this.walls = []
        this.c = canvas
        this.c.resetCanvas()
        this.adjacentMatrix = []
        this.xAchse = canvas.canvas.width / RECTWIDTH
        this.yAchse = canvas.canvas.height / RECTHEIGHT
        this.createAdjacentMatrix()
        this.parent = []
       
      
    }
    sleep(ms){
        return new Promise(resolve => setTimeout(resolve,ms))
    }

    createAdjacentMatrix(){
        for(let y = 0;y < this.yAchse;y++){
            let row = []
            for(let x = 0;x < this.xAchse;x++){
               const node = new Node(x,y)
               const edges = []
               this.setAdjacent(x,y,node)
                for(let adjacent of node.adjacent){
                    let adjNode = new Node(adjacent[0],adjacent[1])
                    let edge = new Edge(node,adjNode,Math.floor(Math.random() * 20))

                    edges.push(edge)
                }
                const arr = {
                    node: node,
                    edges: edges
                }
               row.push(arr)
            }
            this.adjacentMatrix.push(row)            
        }
    }

    getNode(x,y){
        return this.adjacentMatrix[y][x].node
    }
    getEdges(x,y){
        return this.adjacentMatrix[y][x].edges
    }

    setAdjacent(x,y,node){       
        const rechts = [(x+1),y ]
        const links = [(x-1),y]
        const oben = [x,(y-1)]
        const unten =[x,(y+1)]       
        node.adjacent.push(oben)
        node.adjacent.push(rechts)        
        node.adjacent.push(unten)
        node.adjacent.push(links)
        node.adjacent = node.adjacent.filter(val => val[0] >= 0 && val[0] < this.xAchse && val[1] >= 0 && val[1] < this.yAchse)           
    }

    getAdjacent(x,y){
        return this.getNode(x,y).adjacent
    }

    getAllEdges(){
        let edges = []
        for(let y = 0;y < this.yAchse;y++){
            for(let x = 0;x < this.xAchse;x++){
                for(let ed of this.getEdges(x,y)){
                    edges.push(ed)
                }
            }         
        }
        return edges
    }

    async randomizedDFS(node = new Node(0,0)){
        let visited = []
        let stack = []

        for(let i= 0;i < this.yAchse;i++){
            for(let j= 0;j < this.xAchse;j++){
                c.setWallAndChangeColor(j,i)
            }  
        }

        visited.push(node.x + "_" + node.y)
        stack.push(node)

        while(stack.length > 0){
            let current = stack.pop()
            visited.push(current.x + "_" + current.y)
            
            const adjacent = this.getAdjacent(current.x,current.y)
            
            adjacent.sort(() => Math.random() - 0.5); 

            for(let i = 0; i < adjacent.length; i++){
                const [x,y] = adjacent[i]
                let neighbour = this.getNode(x,y)
                if (!visited.includes(neighbour.x + "_" + neighbour.y)) {
                    this.c.removeWallAndChangeColor(current.x, current.y);
                    await this.sleep(SPEED)
                    stack.push(neighbour);
                    visited.push(neighbour.x + "_" + neighbour.y)
                  }
            }

        }
  
    }

    sortEdges(edges){
        return edges.sort((element , element2) =>  element.cost - element2.cost
        )
    }
    MakeSet(node) {
        this.parent[node.x + "_" + node.y] = node;
      }
      
      find(parent, node) {
        if (parent[node.x + "_" + node.y] === node) {
          return node;
        }
        return this.find(parent, parent[node.x + "_" + node.y]);
      }
      
      Union(start, end) {
        let xRoot = this.find(this.parent, start);
        let yRoot = this.find(this.parent, end);
      
        if (xRoot !== yRoot) {
          this.parent[yRoot.x + "_" + yRoot.y] = xRoot;
        }
      }

    async randomKruskal() {
        let visited = [];
        let edges = this.getAllEdges();
        edges = this.sortEdges(edges);
      
        for (let i = 0; i < this.yAchse; i++) {
            for (let j = 0; j < this.xAchse; j++) {
                c.setWallAndChangeColor(j, i);
            }
        }
    
        for (let edg of edges) {
            this.MakeSet(edg.start);
            this.MakeSet(edg.end);
        }
    
        for (let i = 0; i < edges.length; i++) {
            let startNode = edges[i].start;
            let endNode = edges[i].end;
    
            let start = this.find(this.parent, startNode);
            let end = this.find(this.parent, endNode);
    
            if (start !== end) {
                this.Union(start, end);
                let endNodeId = endNode.x + "_" + endNode.y;
                let startNodeId = startNode.x + "_" + startNode.y;
                
                if (!visited.includes(startNodeId) && !visited.includes(endNodeId)) {
                   visited.push(startNodeId);
                    visited.push(endNodeId);
                    if (Math.random() < 0.85) { // verringert die wahrscheinlichkeit das mehr walls entfernt werden 
                       
                            this.c.removeWallAndChangeColor(startNode.x , startNode.y);
                            this.c.removeWallAndChangeColor(endNode.x , endNode.y);
                        
                    }
             
               await this.sleep(SPEED);
            }
        }
        }
    }

}

const c = new Canvas(RECTWIDTH, RECTHEIGHT);
c.draw()
var g = undefined
t = new MouseEvents(c)
var cost = false
var heuristic = false
var path = undefined

var maze = new Maze(c)



let options = {
    bfs: false,
    dfs: false,
    ucs: false,
    astar: false,
    dijkstra:false
}



function setOptionFalse(){
    for(let option in options){
        options[option] = false
    }
}



document.getElementById("chooseMaze").addEventListener("change", function(e){
    switch(e.target.value){
        case "1":
            maze = new Maze(c)
            maze.randomizedDFS()
            break
        case "2":
            maze = new Maze(c)
            maze.randomKruskal()
            break
    }
})

document.getElementById("chooseAlgorithm").addEventListener("click", function(e){
    switch(e.target.value){
        case "1":
            setOptionFalse()
            options.dfs = true
            break
        case "2":
            setOptionFalse()
            options.bfs = true
            break
        case "3":
          
            setOptionFalse()
            options.ucs = true
            break
        case "4":
            setOptionFalse()
            options.astar = true
            break
        case "5":
            setOptionFalse()
            options.dijkstra = true
            break
    }
})

document.getElementById("start").addEventListener("click", async function(){
    let targetNode;
    let startNode;

    if(c.getTarget() != undefined && c.getStart() != undefined){
        c.draw();
      
        targetNode = new Node(c.getTarget().get("x"), c.getTarget().get("y"));
        startNode = new Node(c.getStart().get("x"), c.getStart().get("y"));

         c.repeatProcess(startNode, targetNode);

        if(options.bfs){
            
            g = new Graph(startNode, targetNode);
            path = await g.bfs(startNode, targetNode);
            g.printAlgorithm(path, targetNode);
        }
        else if(options.dfs){
            g = new Graph(startNode, targetNode);
            path = await g.dfs(startNode, targetNode);
            g.printAlgorithm(path, targetNode);
        }
        else if(options.ucs){
            g = new Graph(startNode, targetNode);
            path = await g.ucs(startNode, targetNode);
            g.printAlgorithm(path, targetNode);
        }
        else if(options.astar){
            g = new Graph(startNode, targetNode);
            path = await g.astar(startNode, targetNode);
            g.printAlgorithm(path, targetNode);
        }
        else if(options.dijkstra){
            g = new Graph(startNode, targetNode);
            path = await g.dijkstra(startNode, targetNode);
            g.printAlgorithm(path, targetNode);
        }   

    }else{
        console.log("BITTE START UND ZIEL KNOTEN AUSWÄHLEN");
    }

});

async function handler(type){
    if(c.getTarget() != undefined && c.getStart() != undefined){
        let targetNode = new Node(c.getTarget().get("x"),c.getTarget().get("y"))
        let startNode = new  Node(c.getStart().get("x"),c.getStart().get("y"))
        if(g == undefined){
            g = new Graph(startNode, targetNode)
        }
        if(startNode && targetNode != undefined){
            if(type == "h"){
                c.analyzeHeuristicOrCost(startNode,targetNode,path)    
                await g.showCostCanvas("h")
            }else if(type == "g"){
                c.analyzeHeuristicOrCost(startNode,targetNode,path)    
                await g.showCostCanvas("g")
            }else if(type == "f"){
                c.analyzeHeuristicOrCost(startNode,targetNode,path)    
                await g.showCostCanvas("f")
            }
        }
    
    }
}
