/*
    上线移动的怪 只需要有UpDestination
    左右移动的怪需要左右两边的终点位置
*/
function obj2string(o) {
    var r = [];
    if (typeof o == "string") {
        return "\"" + o.replace(/([\'\"\\])/g, "\\$1").replace(/(\n)/g, "\\n").replace(/(\r)/g, "\\r").replace(/(\t)/g, "\\t") + "\"";
    }
    if (typeof o == "object") {
        if (!o.sort) {
            for (var i in o) {
                r.push(i + ":" + obj2string(o[i]));
            }
            if (!!document.all && !/^\n?function\s*toString\(\)\s*\{\n?\s*\[native code\]\n?\s*\}\n?\s*$/.test(o.toString)) {
                r.push("toString:" + o.toString.toString());
            }
            r = "{" + r.join() + "}";
        } else {
            for (var i = 0; i < o.length; i++) {
                r.push(obj2string(o[i]))
            }
            r = "[" + r.join() + "]";
        }
        return r;
    }
    return o.toString();
}

cc.Class({
    extends: cc.Component,
    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },

        speed : cc.v2(0, 0),    //速度
        horiDestnationLeft: 1,   //水平左边的终点
        horiDestnationRight: 1, //水平右边的终点
        vertDestnation:1,
    },

    // LIFE-CYCLE CALLBACKS:

     onLoad () {
         this.node.on('init', (event) => this.init(event.detail))
     },

    start () {
        this.StartPos = this.node.position
        this.horiDirector = -1  //-1 是左边    1 是右边
        this.vertDirector = -1  //-1 是下    1 是上
        this.node.group = 'monster'
        this.turnLeft()
    },  

    init(event) {
        var tildObj = event.obj
        this.horiDestnationLeft = tildObj.getProperty("horiLeftDest")
        this.horiDestnationRight = tildObj.getProperty("horiRightDest")
        this.speed.x = tildObj.getProperty("speedX")
        this.speed.y = tildObj.getProperty("speedY")
        this.vertDestnation = tildObj.getProperty("vertDest")
    },

     update (dt) {
         if (this.speed.x > 0){
             this.node.x += this.horiDirector * this.speed.x * dt
             if (this.node.x >= this.StartPos.x + this.horiDestnationRight * Global.tildSize) 
             {
                 this.horiDirector = -1
                 this.turnLeft()
             } else if(this.node.x <= this.StartPos.x - this.horiDestnationLeft * Global.tildSize) 
             {
                 this.horiDirector = 1
                 this.turnRight()
             }
         }

         if (this.speed.y > 0){
             this.node.y += this.vertDirector * this.speed.y * dt
             if (this.node.y >= this.StartPos.y) {
                 this.vertDirector = -1
             } else if(this.node.y <= this.StartPos.y - this.vertDestnation * Global.tildSize)
             {
                 this.vertDirector = 1
             } 
         }
     },

    turnLeft() {
        this.node.scaleX = -Math.abs(this.node.scaleX);
    },

    turnRight() {
        this.node.scaleX = Math.abs(this.node.scaleX);
    },
});
