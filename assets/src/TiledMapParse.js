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

cc.Class({
    extends: cc.Component,

    properties: {
        //地图
        curMap: cc.TiledMap,
        playerName: {
            default: 'player'
        },
        Wall: {
            default: 'wall'
        },

        ColliderPreName: cc.Prefab,

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

        collisions: [],
        collisionName: [],
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
            //this._mapSize = cc.v2(this.node.width,this.node.height);
            // var pointGroup = this._TiledMap.getObjectGroup(this.PointsName);
            // if(!pointGroup)
            //     return;
            this._layerFloor = this._TiledMap.getLayer(this.floorLayerName);
            if (!this._layerFloor) return;

            var platformGroup = this._TiledMap.getObjectGroup(this.platformGroupName)
            var ObjectGroup = this._TiledMap.getObjectGroup("objects")
            
            var group = ObjectGroup.getObjects()
            for (var i = 0; i < group.length; i++)
            {
                var obj = group[i];
                //console.log(obj.getObjectName())

                if ("monster" === obj.getObjectName())
                {
                    console.log(obj.getProperty("leftMaxX"))
                }
            }

            // var startPoint = this._TiledMap.getObjectGroup(this.playerName);
            // var endPoint = this._TiledMap.getObjectGroup(this.finishName);
            // var coinPoints = this._TiledMap.getObjectGroup(this.CoinsName);
            // var collisionPoints = this._TiledMap.getObjectGroup(this.CollisionsGroupName);
            // var destroyable_blocks = this._TiledMap.getObjectGroup(this.destroyable_blocksName);
            // var bonus_blocks = this._TiledMap.getObjectGroup(this.bonus_blocksName);
            // var enemies = this._TiledMap.getObjectGroup(this.enemyName);
            // var waters = this._TiledMap.getObjectGroup(this.waterLayerName);
            // var finish = this._TiledMap.getObjectGroup(this.finishName);
            // // var sni = this._TiledMap.getObjectGroup(this.finishName);
            // var snailBlocks = this._TiledMap.getObjectGroup(this.snailBlockName);
            // var finishPoint = finish.getObject('finishPoint');
            // var finishNode = finishPoint.sgNode;
            // var castle_finish = cc.instantiate(this.castle_finish);
            // castle_finish.x = finishNode.x;
            // castle_finish.y = finishNode.y+200;
            // this.node.addChild(castle_finish);
            // if (!startPoint || !endPoint)
            //     return;
            
            // for (var i = 1; i < 31; i++)
            //     {
            //         // this.collisionName[i] = i.toString();
            //         var collisionName = i.toString();
            //         this.collisions[i] = collisionPoints.getObject(collisionName);
            //         var collisionNode = this.collisions[i].sgNode;
            //         var node = cc.instantiate(this.ColliderPreName);
            //         // var node = new cc.Node();
            //         node.setAnchorPoint(0, 0);
            //         node.x = collisionNode.x;
            //         node.height = collisionNode.height;
            //         node.y = collisionNode.y - collisionNode.height;
            //         node.width = collisionNode.width;
            //         node.addComponent(cc.BoxCollider);
            //         node.getComponent(cc.BoxCollider).size = new cc.size(collisionNode.width, collisionNode.height);
            //         node.getComponent(cc.BoxCollider).offset = new cc.size(collisionNode.width / 2, collisionNode.height / 2);
            //         node.getComponent(cc.BoxCollider).tag = 5;
            //         this.node.addChild(node);
            //     }

        },
// 获取tiledMap上的位置
//     _getTilePos: function (posInPixel)
//         {
//             // var mapSize = this.node.getContentSize();
//             var mapSize = cc.v2(this._TiledMap.node.width, this._TiledMap.node.height);
//             var tileSize = this._TiledMap.getTileSize(); //单个瓦片的大小，单位是像素
//             var x = Math.floor(posInPixel.x / tileSize.width);
//             var y = Math.floor((mapSize.height - posInPixel.y) / tileSize.height);
//
//             return cc.p(x, y);
//         },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },

});
