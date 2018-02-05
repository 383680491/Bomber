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
            this.playLastPos = this.player.position
            this.gadgetList = [];
            this.mapTildSize = this._TiledMap.getMapSize()
            this.mapSize = cc.size(this.mapTildSize.width * Global.tildSize, this.mapTildSize.height * Global.tildSize)
            this._layerFloor = this._TiledMap.getLayer(this.floorLayerName);
            this.fogLayer = this._TiledMap.getLayer("fog");
            //fogLayer.node.active = false

            if (!this._layerFloor) return;

            var platformGroup = this._TiledMap.getObjectGroup(this.platformGroupName)
            var platGroups = platformGroup.getObjects()

            for (var i = 0; i < platGroups.length; i++) 
            {
                var collisionNode = platGroups[i].sgNode;
                //console.log(platGroups[i].getObjectName())
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
        this.updateBattleFog()
    },

    mapScrollPosition:function(dt){
        var x = Math.max(this.player.x, this.ScreenFollowPoint.x);
        var y = Math.max(this.player.y, this.ScreenFollowPoint.y);

        x = Math.min(x, this.mapSize.width - cc.winSize.width / 2 - 80);
        y = Math.min(y, this.mapSize.height - cc.winSize.height / 2);

        var viewPointX = this.ScreenFollowPoint.x - x;
        var viewPointY = this.ScreenFollowPoint.y - y;
        this.gameLayer.setPosition(viewPointX, viewPointY);
    },

    updateBattleFog:function()
    {
        var pos = this.positionToTileCoord(this.player.position)
        if (this.playLastPos.x != this.player.x || this.playLastPos.y != this.player.y)
        {
            this.updateWarFog(pos)
            this.playLastPos = pos;
        }
    },

    //瓦片地图从0,0开始  由上而下 由左到右
    positionToTileCoord: function(pos)
    {
        var x = Math.floor(pos.x / Global.tildSize);
        var y = Math.floor((this.mapTildSize.height) - pos.y / Global.tildSize);
        return cc.v2(x, y)
    },


    updateWarFog: function(heroTileCoord)
    {
        this.updateLogicTileInfo(heroTileCoord);
        this.updateLogicTileInfo(cc.v2(heroTileCoord.x, heroTileCoord.y - 1));
        this.updateLogicTileInfo(cc.v2(heroTileCoord.x, heroTileCoord.y - 2));
        this.updateLogicTileInfo(cc.v2(heroTileCoord.x, heroTileCoord.y - 3));
        this.updateLogicTileInfo(cc.v2(heroTileCoord.x, heroTileCoord.y + 1));
    
        this.updateLogicTileInfo(cc.v2(heroTileCoord.x + 1, heroTileCoord.y));
        this.updateLogicTileInfo(cc.v2(heroTileCoord.x + 1, heroTileCoord.y + 1));
        this.updateLogicTileInfo(cc.v2(heroTileCoord.x + 1, heroTileCoord.y - 1));
        this.updateLogicTileInfo(cc.v2(heroTileCoord.x + 1, heroTileCoord.y - 2));
        this.updateLogicTileInfo(cc.v2(heroTileCoord.x + 1, heroTileCoord.y - 3));
    
        this.updateLogicTileInfo(cc.v2(heroTileCoord.x - 1, heroTileCoord.y));
        this.updateLogicTileInfo(cc.v2(heroTileCoord.x - 1, heroTileCoord.y + 1));
        this.updateLogicTileInfo(cc.v2(heroTileCoord.x - 1, heroTileCoord.y - 1));
        this.updateLogicTileInfo(cc.v2(heroTileCoord.x - 1, heroTileCoord.y - 2));
        this.updateLogicTileInfo(cc.v2(heroTileCoord.x - 1, heroTileCoord.y - 3));
    
        this.updateLogicTileInfo(cc.v2(heroTileCoord.x - 2, heroTileCoord.y));
        this.updateLogicTileInfo(cc.v2(heroTileCoord.x - 2, heroTileCoord.y + 1));
        this.updateLogicTileInfo(cc.v2(heroTileCoord.x - 2, heroTileCoord.y - 1));
        this.updateLogicTileInfo(cc.v2(heroTileCoord.x - 2, heroTileCoord.y - 2));
        this.updateLogicTileInfo(cc.v2(heroTileCoord.x - 2, heroTileCoord.y - 3));
    },


    sureTileCroodValid: function(crood)
    {
        crood.x = crood.x < 0 ? 0 : crood.x;
        crood.x = crood.x >= this.mapTildSize.width ? this.mapTildSize.width - 1 : crood.x;
        crood.y = crood.y < 0 ? 0 : crood.y;
        crood.y = crood.y >= this.mapTildSize.height ? this.mapTildSize.height - 1 : crood.y;
    
        return crood;
    },

    //http://www.benmutou.com/archives/455

    updateLogicTileInfo: function(tileCrood) 
    {
        if (this.setTileInfo(this.sureTileCroodValid(tileCrood), 4))
        {
            this.setTileInfo(this.sureTileCroodValid(cc.v2(tileCrood.x + 1, tileCrood.y)), 8);
            this.setTileInfo(this.sureTileCroodValid(cc.v2(tileCrood.x, tileCrood.y + 1)), 1);
            this.setTileInfo(this.sureTileCroodValid(cc.v2(tileCrood.x + 1, tileCrood.y + 1)), 2);
        }
    },

    setTileInfo: function (crood, textureIndex)
    {
        var tileSprite = this.fogLayer.getTileAt(crood);
        if (tileSprite.userdata == null)
        {   
            tileSprite.userdata = [textureIndex]
        }
        else
        {
            if (this.IsValidFun(tileSprite.userdata, textureIndex) === false)
                return
                    
            var total = this.TotalNumFun(tileSprite.userdata)
            if (total == 15)
                return
            
            tileSprite.userdata.push(textureIndex)
        }
    
        var total = this.TotalNumFun(tileSprite.userdata);
        this.fogLayer.setTileGID(64 + Global.mapFogTextureIndex[total], crood);
    
        return true
    },


    TotalNumFun: function(list)
    {
        var argv = 0;
        for (i = 0; i < list.length; i++)
        {
            argv = argv + list[i];
        }

        return argv;
    },

    IsValidFun: function(list, varg)
    {
        var flag = true; //每一个列表里面 有且只能有 单独一个  1、2、4、8
        for (i = 0; i < list.length; i++)
        {
            if(list[i] === varg)
            {
                flag = false;
                break;
            }
        }
    
        return flag;
    },


});
