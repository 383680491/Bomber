var minTilesCount = 2;
var mapMoveStep = 1;
var minMoveValue = 50;
var MoveDirection = cc.Enum({
    NONE: 0,
    UP: 1,
    DOWN: 2,
    LEFT: 3,
    RIGHT: 4
});

import "MonsterReptMove"

cc.Class({
    extends: cc.Component,

    properties: {
        playerName: {
            default: 'player'
        },
        Wall: {
            default: 'wall'
        },
        _isMapLoaded: {
            default: false,
            serializable: false,
        },

        floorLayerName: {
            default: 'floor'
        },

        platformGroupName: {
            default: 'platform'
        },

        ColliderPreName: cc.Prefab,
        MonsterReptMovePre: cc.Prefab,
        Gadget: cc.Prefab,
        ScreenFollowPoint:cc.v2(0, 0),
        curMap: cc.TiledMap,
        player: cc.Node,
        gameLayer: cc.Node,
    },

    onLoad(){
        console.log('map onLoad')
        this._TiledMap = this.curMap.getComponent('cc.TiledMap');
    },
    start: function (error)
        {
        console.log('map start')
            if (error)
                return;
            //this._MapTileSize = this._TiledMap.getTileSize();
            this.gadgetList = [];
            this.mapTildSize = this._TiledMap.getMapSize()
            this.mapSize = cc.size(this.mapTildSize.width * Global.tildSize, this.mapTildSize.height * Global.tildSize)
            this._layerFloor = this._TiledMap.getLayer(this.floorLayerName);
            if (!this._layerFloor) return;

            var platformGroup = this._TiledMap.getObjectGroup(this.platformGroupName)
            var platGroups = platformGroup.getObjects()

            for (var i = 0; i < platGroups.length; i++) 
            {
                var collisionNode = platGroups[i].sgNode;
                //console.log(platGroups[i].getObjectName())
                if (platGroups[i].getObjectName() == '3')
                {
                    console.log('collisionNode.x =====' + collisionNode.x)
                    console.log('collisionNode.y =====' + collisionNode.y)
                }

                var node = cc.instantiate(this.ColliderPreName);
                node.active = true
                node.position = cc.p(collisionNode.x + collisionNode.width / 2, collisionNode.y - collisionNode.height + collisionNode.height / 2)
                node.height = collisionNode.height;
                node.width = collisionNode.width;
                node.getComponent(cc.BoxCollider).size = cc.size(collisionNode.width, collisionNode.height);
                node.getComponent(cc.BoxCollider).enabled = true;
                node.group = 'floor'
                node.getComponent(cc.BoxCollider).tag = Global.CollisideTag.FLOOR;
                this.gameLayer.addChild(node);
            }
            
            var ObjectGroup = this._TiledMap.getObjectGroup("objects")
            var group = ObjectGroup.getObjects()
            for (var i = 0; i < group.length; i++)
            {
                var obj = group[i];
                if ("mstReptMove" === obj.getObjectName())
                {
                    var node = cc.instantiate(this.MonsterReptMovePre);
                    node.active = true
                    this.gameLayer.addChild(node);
                    node.emit('init', { 'obj': obj})
                    var collisionNode = obj.sgNode
                    node.position = cc.p(collisionNode.x, collisionNode.y + node.getContentSize().height / 2)
                    node.getComponent(cc.BoxCollider).enabled = true;
                }
                else if ("gadget" === obj.getObjectName())     //升降梯
                {
                    var node = cc.instantiate(this.Gadget);
                    node.active = true
                    this.gameLayer.addChild(node);
                    node.emit('init', { 'obj': obj })
                    var collisionNode = obj.sgNode
                    node.position = cc.p(collisionNode.x, collisionNode.y + node.getContentSize().height / 2)
                    node.getComponent(cc.BoxCollider).enabled = true;
                    node.group = 'floor'
                    node.getComponent(cc.BoxCollider).tag = Global.CollisideTag.FLOOR;
                    this.gadgetList.push(node)
                }
            }
        },

    update:function(dt) {
        this.mapScrollPosition(dt)
    },

    mapScrollPosition:function(dt){
        var x = Math.max(this.player.x, this.ScreenFollowPoint.x);
        var y = Math.max(this.player.y, this.ScreenFollowPoint.y);

        x = Math.min(x, this.mapSize.width - cc.winSize.width / 2 - 80);
        y = Math.min(y, this.mapSize.height - cc.winSize.height / 2);

        var viewPointX = this.ScreenFollowPoint.x - x;
        var viewPointY = this.ScreenFollowPoint.y - y;
        this.gameLayer.setPosition(viewPointX, viewPointY);
    }
});
