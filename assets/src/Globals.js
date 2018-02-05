window.Global = {
    isGotCoin: false,
    addSpeed: 1,
    level2Open:false,
    enemyIsAlive:true,
    playIsAlive:true,
    volume:0,
    tildSize:64,

    CollisideTag: cc.Enum({
        FLOOR: 1,
    }),

    mapFogTextureIndex: [
        1, 5, 9, 13,
        2, 6, 10, 14,
        3, 7, 11, 15,
        4, 8, 12, 16
    ],
};