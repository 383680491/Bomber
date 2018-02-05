
cc.Class({
    extends: cc.Component,

    properties: {
        speed: cc.v2(0, 0),
        maxSpeed: cc.v2(2000, 2000),
        gravity: -1000,
        drag: 1000,
        direction: 0,
        jumpSpeed: 300
    },

    // use this for initialization
    onLoad: function () {
        //add keyboard input listener to call turnLeft and turnRight
        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            onKeyPressed: this.onKeyPressed.bind(this),
            onKeyReleased: this.onKeyReleased.bind(this),
        }, this.node);

        this.collisionX = 0;
        this.collisionY = 0;

        this.prePosition = cc.v2();
        this.preStep = cc.v2();

        this.touchingNumber = 0;

        this.gravityTemp = this.gravity;
    },

    onEnable: function () {
        cc.director.getCollisionManager().enabled = true;
        cc.director.getCollisionManager().enabledDebugDraw = true;
    },

    onDisable: function () {
        cc.director.getCollisionManager().enabled = false;
        cc.director.getCollisionManager().enabledDebugDraw = false;
    },

    onKeyPressed: function (keyCode, event) {
        switch (keyCode) {
            case cc.KEY.a:
            case cc.KEY.left:
                this.playerLeft()
                break;
            case cc.KEY.d:
            case cc.KEY.right:
                this.playerRight()
                break;
            case cc.KEY.w:
            case cc.KEY.up:
                this.playerUp()
                break;
        }
    },

    onKeyReleased: function (keyCode, event) {
        switch (keyCode) {
            case cc.KEY.a:
            case cc.KEY.left:
            case cc.KEY.d:
            case cc.KEY.right:
                this.direction = 0;
                break;
        }
    },

    playerLeft() {
        if (this.direction !== -1 && this.jumpCount == 0 && !this.isDied) {
            //this.player_walk();
        }
        this.turnLeft();
        this.direction = -1;
    },
    playerRight() {
        if (this.direction !== 1 && this.jumpCount == 0 && !this.isDied) {
            //this.player_walk();
        }
        this.turnRight();
        this.direction = 1;
    },
    playerUp() {
        this.resetGadget()
        if (!this.jumping && !this.isDied)// 如果活着的没在跳跃状态，并且玩家着地
        {
            //this.player_jump();
            this.gravity = this.gravityTemp;
            this.speed.y = this.jumpSpeed;
            this.jumping = true;
        }
    },

    playerDown() {

    },

    player_idle() {
        // this.anim.play("player_idle");
    },

    player_walk() {
        // this.anim.play("player_walk");
    },

    player_jump() {
        // cc.audioEngine.play(this.jumpAudio, false, Global.volume);
        // this.anim.play("player_jump");
    },

    player_hunker() {
        // this.anim.play("player_hunker");
    },

    onCollisionEnter: function (other, self) {
        console.log('other.tag = ' + other.tag)
        switch (other.tag) {
            case Global.CollisideTag.FLOOR://coin.tag = 1
                this.collisionFloor(other, self);
                break;
        }
    },

    collisionFloor: function (other, self){
        this.node.color = cc.Color.RED;

        this.touchingNumber++;

        // 1st step 
        // get pre aabb, go back before collision
        var otherAabb = other.world.aabb;
        var otherPreAabb = other.world.preAabb.clone();

        var selfAabb = self.world.aabb;
        var selfPreAabb = self.world.preAabb.clone();

        // 2nd step
        // forward x-axis, check whether collision on x-axis
        selfPreAabb.x = selfAabb.x;
        otherPreAabb.x = otherAabb.x;

        if (cc.Intersection.rectRect(selfPreAabb, otherPreAabb)) {
            if (this.speed.x < 0 && (selfPreAabb.xMax > otherPreAabb.xMax)) {
                this.node.x = otherPreAabb.xMax - this.node.parent.x + selfPreAabb.width / 2;
                this.collisionX = -1;
            }
            else if (this.speed.x > 0 && (selfPreAabb.xMin < otherPreAabb.xMin)) {
                this.node.x = otherPreAabb.xMin - selfPreAabb.width / 2 - this.node.parent.x;
                this.collisionX = 1;
            }

            this.speed.x = 0;
            other.touchingX = true;
            return;
        }

        // 3rd step
        // forward y-axis, check whether collision on y-axis
        selfPreAabb.y = selfAabb.y;
        otherPreAabb.y = otherAabb.y;

        if (cc.Intersection.rectRect(selfPreAabb, otherPreAabb)) {
            if (this.speed.y < 0 && (selfPreAabb.yMax > otherPreAabb.yMax)) {
                this.node.y = otherPreAabb.yMax - this.node.parent.y;
                this.jumping = false;
                this.collisionY = -1;
            }
            else if (this.speed.y > 0 && (selfPreAabb.yMin < otherPreAabb.yMin)) {

                this.node.y = otherPreAabb.yMin - selfPreAabb.height - this.node.parent.y;
                this.collisionY = 0;
            }

            this.speed.y = 0;
            other.touchingY = true;
        }
    },

    onCollisionStay: function (other, self) {
        if (this.collisionY === -1) {
            if (other.node.group === 'floor') {
                var gadget = other.node.getComponent('Gadget');   //原来这是获得脚本的方法 Gadget 是一个脚本
                if (gadget) {
                    this.gravity = 0;
                    gadget.isFollow = true;
                    //  this.node.x += gadget.offsetX;
                    //  if (gadget.offsety > 0)
                    //  {
                    //      this.node.y += gadget.offsety;
                    //  } 
                }
            }

            // this.node.y = other.world.aabb.yMax;

            // var offset = cc.v2(other.world.aabb.x - other.world.preAabb.x, 0);

            // var temp = cc.affineTransformClone(self.world.transform);
            // temp.tx = temp.ty = 0;

            // offset = cc.pointApplyAffineTransform(offset, temp);
            // this.node.x += offset.x;
        }
    },

    onCollisionExit: function (other) {
        this.touchingNumber--;
        if (this.touchingNumber === 0) {
            this.node.color = cc.Color.WHITE;
        }

        if (other.touchingX) {
            this.collisionX = 0;
            other.touchingX = false;
        }
        else if (other.touchingY) {
            other.touchingY = false;
            this.collisionY = 0;
            this.jumping = true;
        }

        this.resetGadget()
        this.gravity = this.gravityTemp;
    },

    update: function (dt) {
        if (this.collisionY === 0) {
            this.speed.y += this.gravity * dt;
            if (Math.abs(this.speed.y) > this.maxSpeed.y) {
                this.speed.y = this.speed.y > 0 ? this.maxSpeed.y : -this.maxSpeed.y;
            }
        }

        if (this.direction === 0) {
            if (this.speed.x > 0) {
                this.speed.x -= this.drag * dt;
                if (this.speed.x <= 0) this.speed.x = 0;
            }
            else if (this.speed.x < 0) {
                this.speed.x += this.drag * dt;
                if (this.speed.x >= 0) this.speed.x = 0;
            }
        }
        else {
            this.speed.x += (this.direction > 0 ? 1 : -1) * this.drag * dt;
            if (Math.abs(this.speed.x) > this.maxSpeed.x) {
                this.speed.x = this.speed.x > 0 ? this.maxSpeed.x : -this.maxSpeed.x;
            }
        }

        if (this.speed.x * this.collisionX > 0) {
            this.speed.x = 0;
        }

        this.prePosition.x = this.node.x;
        this.prePosition.y = this.node.y;

        this.preStep.x = this.speed.x * dt;
        this.preStep.y = this.speed.y * dt;

        this.node.x += this.speed.x * dt;
        this.node.y += this.speed.y * dt;
    },


    turnLeft() {
        this.node.scaleX = -Math.abs(this.node.scaleX);
    },

    turnRight() {
        this.node.scaleX = Math.abs(this.node.scaleX);
    },

    resetGadget(){
        var parent = this.node.parent.parent;
        var scripeObj = parent.getComponent("TiledMapParse")
        for (var i = 0; i < scripeObj.gadgetList.length; i++)
        {
            var sObj = scripeObj.gadgetList[i].getComponent("Gadget")
            console.log('fuck you  hahahah')
            sObj.isFollow = false;
        }
    },
});
