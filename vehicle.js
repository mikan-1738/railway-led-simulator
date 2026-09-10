// vehicle.js
// Railway LED Simulator
// 車両データの読み込み・車両選択を担当

let vehicleList = [];
let currentVehicle = null;


/* =========================
   JSON読み込み
========================= */

async function loadJson(path) {
    const response = await fetch(path);

    if (!response.ok) {
        throw new Error(
            "ファイルを読み込めませんでした: " + path
        );
    }

    return await response.json();
}


/* =========================
   車両一覧読み込み
========================= */

async function loadVehicles() {
    const data = await loadJson(
        "vehicles/vehicles.json"
    );

    // 配列形式
    if (Array.isArray(data)) {
        vehicleList = data;
    }

    // { "vehicles": [...] } 形式
    else if (Array.isArray(data.vehicles)) {
        vehicleList = data.vehicles;
    }

    else {
        throw new Error(
            "vehicles.json の形式が正しくありません。"
        );
    }

    window.vehicleList = vehicleList;

    return vehicleList;
}


/* =========================
   車両設定読み込み
========================= */

async function loadConfig(vehiclePath) {

    const data = await loadJson(
        vehiclePath + "/config.json"
    );

    // display.js / render.js から使えるようにする
    config = data;

    // 外部から確認できるようにもしておく
    window.vehicleConfig = data;


    /* =========================
       LEDサイズ
    ========================= */

    if (
        typeof data.ledWidth === "number" &&
        typeof data.ledHeight === "number"
    ) {
        led.width = data.ledWidth;
        led.height = data.ledHeight;
    }


    /* =========================
       LEDドットサイズ
    ========================= */

    if (typeof data.ledSize === "number") {
        ledsize = data.ledSize;
    }


    /* =========================
       LEDドット間隔
    ========================= */

    if (typeof data.ledGap === "number") {
        ledgap = data.ledGap;
    }


    /* =========================
       LEDピッチ・半径
    ========================= */

    pitch = ledsize + ledgap;
    radius = ledsize / 2;


    return data;
}


/* =========================
   LEDデータ読み込み
========================= */

async function loadLed(vehiclePath) {

    const data = await loadJson(
        vehiclePath + "/led.json"
    );

    jsonData = data;

    return data;
}


/* =========================
   車両選択ボタン作成
========================= */

function createVehicleButtons() {

    const container =
        document.getElementById("vehicleSelect");

    if (!container) {
        return;
    }

    container.innerHTML = "";


    for (const vehicle of vehicleList) {

        const button =
            document.createElement("button");

        button.type = "button";

        button.textContent =
            vehicle.name ?? vehicle.id;


        button.addEventListener(
            "click",
            () => {
                selectVehicle(vehicle);
            }
        );


        container.appendChild(button);
    }
}


/* =========================
   車両選択
========================= */

async function selectVehicle(vehicle) {

    if (!vehicle) {
        return;
    }


    try {

        currentVehicle = vehicle;


        const vehiclePath =
            "vehicles/" + vehicle.id;


        // 設定読み込み
        await loadConfig(vehiclePath);


        // LEDデータ読み込み
        await loadLed(vehiclePath);


        /* =========================
           車両選択画面を隠す
        ========================= */

        const selector =
            document.getElementById(
                "vehicleSelector"
            );


        /* =========================
           シミュレーターを表示
        ========================= */

        const simulator =
            document.getElementById(
                "simulator"
            );


        if (selector) {
            selector.hidden = true;
        }


        if (simulator) {
            simulator.hidden = false;
        }


        /* =========================
           操作ボタン作成
        ========================= */

        setupButtons();


        /* =========================
           初回描画
        ========================= */

        render();


    } catch (error) {

        console.error(error);


        alert(
            "車両データを読み込めませんでした。\n" +
            error.message
        );
    }
}


/* =========================
   車両システム初期化
========================= */

async function setupVehicles() {

    await loadVehicles();

    createVehicleButtons();
    }
