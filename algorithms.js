let ORANGE = "orange"
let WHITE = "white"
let BLACK = "black"
let YELLOW = "yellow"
let RED = "red"
let GREEN = "green"

let SPEED = 200

/**
 * Nächste aufgabe wenn ein feld schon bereits grün oder rot ist soll ich es nicht mit schwarz übermalen können!
 */

let RECTWIDTH = 100
let RECTHEIGHT = 100
/**
 * Canvas - all settings for Canvas
 */
class Canvas{
    constructor(rectWidth = 20,rectHeight = 20,dimension = "2d"){
        this.canvas = document.getElementById("canvas")
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

    

    loadImage(x,y, img){
        this.img = new Image();
        this.img.onload = () => {
            x *= this.rectWidth
            y *= this.rectWidth
            // x+ RECTWIDTH / 4 = damit es zentriert wird
            this.ctx.drawImage(this.img, x +(RECTWIDTH / 4), y+ (RECTWIDTH / 4),RECTWIDTH / 2 ,RECTWIDTH / 2)
            this.draw()
        };
        this.img.src = img
    }

    setTarget(x,y){
        this.loadImage(x,y,'img/fire_home.png')
        const map = new Map()
        map.set("x", x)
        map.set("y", y)
        this.target = map
    }

    setStart(x,y){
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

    resetCanvas(){
        this.ctx.fillStyle = WHITE;
        this.ctx.fillRect(0, 0, canvas.width, canvas.height);
        this.color = WHITE
        this.start = undefined
        this.target = undefined
        this.draw()
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

class Graph{
    constructor(target){
        this.xAchse = c.canvas.width / RECTWIDTH
        this.yAchse = c.canvas.height / RECTHEIGHT
        this.adjacentMatrix = []
        this.target = target
        this.createAdjacentMatrix()
        this.visited = new Set()
        this.stack = []
    }
    createAdjacentMatrix(){
        
        for(let y = 0;y < this.yAchse;y++){
            let row = []
            for(let x = 0;x < this.xAchse;x++){
                let map = new Map()
                let node = new Node(x,y)
                
                let currCoordinates = new Node(x,y)
                
                let cost = this.euclideanDistance(currCoordinates)
                this.setAdjacent(x,y,node)
                
                map.set("node",node)
                map.set("cost",cost) 
                row.push(map)
            }
            this.adjacentMatrix.push(row)
            
        }
        //console.log(this.adjacentMatrix)
    }
    euclideanDistance(node){
        const xPosition = node.x
        const yPosition = node.y
        const xTarget = this.target.x
        const yTarget = this.target.y
        const dx = xTarget - xPosition
        const dy = yTarget - yPosition
        return Math.sqrt(dx*dx + dy*dy)
    }
    getNodeWithMap(position){
        return this.getNode(position.get("x"),position.get("y"))
    }
    getNode(x,y){
        return this.adjacentMatrix[y][x].get("node")
    }
    getCost(x,y){
        return this.adjacentMatrix[y][x].get("cost")
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
        adjacentNode.push(rechts)
        //adjacentNode.push(diagonalUnderRight)
        //adjacentNode.push(diagonalAboveLeft)
        adjacentNode.push(links)
        adjacentNode.push(oben)
        adjacentNode.push(unten)
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

    async printAlgorithm(path,target){
        for (let i = 1; i < path.length; i++) {
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

    dfs(start, target, graph) {
        if (start.x == target.x && start.y == target.y) {
            return [];
        }
        let startId = start.x + "_" + start.y
        this.visited.add(startId);
        const adjacent = this.getAdjacent(start.x, start.y);
        for (let i = 0; i < adjacent.length; i++) {
            let neighbour = adjacent[i]
            let neighbourId = neighbour.end.x +"_"+neighbour.end.y
            if (!this.visited.has(neighbourId) && !this.checkWall(neighbour.end)) {
                let path = this.dfs(neighbour.end, target, graph, this.visited);
                if (path != null) {
                    return [start].concat(path);
                }
            }
        }
        return null;
    }
}

const c = new Canvas(RECTWIDTH, RECTHEIGHT);
c.draw()
var g = undefined
t = new MouseEvents(c)
document.getElementById("start").addEventListener("click", function(){
    let targetNode = new Node(c.getTarget().get("x"),c.getTarget().get("y"))
    let startNode = new  Node(c.getStart().get("x"),c.getStart().get("y"))
    g = new Graph(targetNode)
    let path = g.dfs(startNode,targetNode,g)
    g.printAlgorithm(path,targetNode)
})
