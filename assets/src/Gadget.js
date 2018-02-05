
cc.Class({
    extends: cc.Component,
    properties: {
        speed : cc.v2(0, 0),    //速度
        horiDestnation: 1, //水平的终点  统一起点在左 终点在右
        vertDestnation:1, //垂直的终点  统一起点在下 终点在上
    },

     onLoad () {
         this.node.on('init', (event) => this.init(event.detail))
         cc.director.getCollisionManager().enabled = true;
         cc.director.getCollisionManager().enabledDebugDraw = true;
     },

    start () {
        this.StartPos = this.node.position
        this.horiDirector = -1  //-1 是左边    1 是右边
        this.vertDirector = 1  //-1 是下    1 是上
        this.node.group = 'floor'
        this.hero = this.node.parent.getChildByName("image_hero")
        this.isFollow = false
    },  

    init(event) {
        var tildObj = event.obj
        this.destinationX = tildObj.getProperty("destinationX")
        this.destinationY = tildObj.getProperty("destinationY")
        this.speed.x = tildObj.getProperty("speedX")
        this.speed.y = tildObj.getProperty("speedY")
        this.offsetX = 0
        this.offsety = 0
    },

     update (dt) {
         if (this.speed.x > 0){
             this.node.x += this.horiDirector * this.speed.x * dt
             this.offsetX = this.horiDirector * this.speed.x * dt
             if (this.node.x >= this.StartPos.x + this.destinationX * Global.tildSize) 
             {
                 this.horiDirector = -1
             } else if (this.node.x <= this.StartPos.x) 
             {
                 this.horiDirector = 1
             }
         }

         if (this.speed.y > 0){
             this.node.y += this.vertDirector * this.speed.y * dt
             this.offsety = this.vertDirector * this.speed.y * dt
             if (this.node.y <= this.StartPos.y) {
                 this.vertDirector = 1
             } else if (this.node.y >= this.StartPos.y + this.destinationY * Global.tildSize)
             {
                 this.vertDirector = -1
             } 
         }

         if(this.isFollow)
         {
             this.hero.x += this.offsetX
             this.hero.y += this.offsety
         }

     },
});
