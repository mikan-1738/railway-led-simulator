// ==========================================
// Railway LED Simulator
// state.js
// ==========================================

let jsonData = null;
let config = null;

// ------------------------------------------
// 選択状態
// ------------------------------------------

let typeId = null;
let destinationId = null;
let nextId = null;
let informationId = null;
let information2Id = null;
let lineId = null;
let carNumberId = null;

// ------------------------------------------
// 表示モード
// ------------------------------------------

let displayMode = "normal";
let informationMode = "destination";
let typeMode = null;

let lang = "ja";
let showNext = false;

// ------------------------------------------
// シーン
// ------------------------------------------

let scene = 0;
let sceneList = [];

let typeScene = 0;
let typeSceneList = [];

let frame = 0;

// ------------------------------------------
// LED設定
// ------------------------------------------

let ledsize = 6;
let ledgap = 1;

let pitch = ledsize + ledgap;
let pitchY = ledsize * 0.9 + ledgap;

let radius = ledsize / 2;

// ------------------------------------------
// Canvas
// ------------------------------------------

let sizeLed =
    document.getElementById("led");

let currentMatrix = null;

// ------------------------------------------
// 言語
// ------------------------------------------

let langIndex = 0;

const langs = [
    "ja",
    "en"
];

// ------------------------------------------
// 交互表示
// ------------------------------------------

let alternateDisplay = false;
let alternateTimer = null;

// ------------------------------------------
// 描画タイマー
// ------------------------------------------

let renderTimer = null;
