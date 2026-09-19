// ==========================================
// Railway LED Simulator
// vehicle.js
// ==========================================

let vehicleList = [];
let currentVehicle = null;


// ==========================================
// JSON読み込み共通処理
// ==========================================

async function loadJson(path) {
    const response = await fetch(path);

    if (!response.ok) {
        throw new Error(
            "ファイルを読み込めませんでした: " + path
        );
    }

    return await response.json();
}


// ==========================================
// 車両一覧読み込み
// ==========================================

async function loadVehicles() {
    const data = await loadJson(
        "vehicles/vehicles.json"
    );

    if (Array.isArray(data)) {
        vehicleList = data;
    } else if (Array.isArray(data.vehicles)) {
        vehicleList = data.vehicles;
    } else {
        throw new Error(
            "vehicles.json の形式が正しくありません。"
        );
    }

    window.vehicleList = vehicleList;

    return vehicleList;
}


// ==========================================
// config.json 読み込み
// ==========================================

async function loadConfig() {
    if (!currentVehicle) {
        throw new Error(
            "車両が選択されていません。"
        );
    }

    if (!currentVehicle.config) {
        throw new Error(
            "この車両には config.json の指定がありません。"
        );
    }

    config = await loadJson(
        currentVehicle.config
    );

    window.vehicleConfig = config;

    return config;
}


// ==========================================
// led.json 読み込み
// ==========================================

async function loadLed() {
    if (!currentVehicle) {
        throw new Error(
            "車両が選択されていません。"
        );
    }

    if (!currentVehicle.led) {
        throw new Error(
            "この車両には led.json の指定がありません。"
        );
    }

    jsonData = await loadJson(
        currentVehicle.led
    );

    window.vehicleLedData = jsonData;

    if (!jsonData) {
        throw new Error(
            "led.json が空です。"
        );
    }

    return jsonData;
}


// ==========================================
// 車両ボタン作成
// ==========================================

function createVehicleButtons() {

    const container =
        document.getElementById("vehicleSelect");

    if (!container) {
        console.error(
            "vehicleSelect が見つかりません。"
        );
        return;
    }

    container.innerHTML = "";

    vehicleList.forEach(vehicle => {

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
    });
}


// ==========================================
// 車両選択
// ==========================================

async function selectVehicle(vehicle) {

    if (!vehicle) {
        return;
    }

    try {

        currentVehicle = vehicle;

        // 既存コードとの互換用
        if (typeof selectedVehicle !== "undefined") {
            selectedVehicle = vehicle;
        }

        // ==================================
        // JSON読み込み
        // ==================================

        await loadConfig();
        await loadLed();


        // ==================================
        // 画面切り替え
        // ==================================

        const selector =
            document.getElementById(
                "vehicleSelector"
            );

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


        // ==================================
        // LEDサイズ設定
        // ==================================

        applyVehicleConfig();


        // ==================================
        // 車両UI
        // ==================================

        if (typeof setupVehicleUI === "function") {
            setupVehicleUI();
        } else if (typeof setupButtons === "function") {
            setupButtons();
        }


        // ==================================
        // 初期描画
        // ==================================

        if (typeof render === "function") {
            render();
        }

    } catch (error) {

        console.error(
            "車両読み込みエラー:",
            error
        );

        alert(
            "車両データを読み込めませんでした。\n\n" +
            error.message
        );
    }
}


// ==========================================
// config.json の設定を適用
// ==========================================

function applyVehicleConfig() {

    if (!config) {
        return;
    }

    if (!sizeLed) {
        console.error(
            "LED Canvas が見つかりません。"
        );
        return;
    }


    // ======================================
    // LEDサイズ
    // ======================================

    if (
        typeof config.ledSize === "number"
    ) {
        ledsize = config.ledSize;
    }


    // ======================================
    // LED間隔
    // ======================================

    if (
        typeof config.ledGap === "number"
    ) {
        ledgap = config.ledGap;
    }


    // ======================================
    // ピッチ
    // ======================================

    pitch =
        ledsize + ledgap;

    radius =
        ledsize / 2;


    // ======================================
    // LEDマトリクスのCanvasサイズ
    // ======================================

    if (
        typeof config.ledWidth === "number" &&
        typeof config.ledHeight === "number"
    ) {

        sizeLed.width =
            config.ledWidth * pitch;

        sizeLed.height =
            config.ledHeight * pitch;
    }


    // ======================================
    // 円形LED
    // ======================================

    if (
        config.ledShape === "circle"
    ) {

        sizeLed.height =
            config.ledHeight * pitch;
    }


    // ======================================
    // 長方形LED
    // ======================================

    if (
        config.ledShape === "rectangle"
    ) {

        const pitchY =
            ledsize * 0.9 + ledgap;

        sizeLed.height =
            config.ledHeight * pitchY;
    }


    // ======================================
    // 重要
    // cacheCanvasにも同じサイズを設定
    // ======================================

    if (
        typeof cacheCanvas !== "undefined"
    ) {

        cacheCanvas.width =
            sizeLed.width;

        cacheCanvas.height =
            sizeLed.height;
    }


    // ======================================
    // 表示サイズ調整
    // ======================================

    if (
        typeof resizeLed === "function"
    ) {
        resizeLed();
    }
}


// ==========================================
// 車両一覧初期化
// ==========================================

async function setupVehicles() {

    await loadVehicles();

    createVehicleButtons();
}


// ==========================================
// 初期化
// ==========================================

if (
    document.readyState === "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        () => {
            setupVehicles().catch(error => {

                console.error(
                    "車両一覧の読み込みに失敗:",
                    error
                );

            });
        }
    );

} else {

    setupVehicles().catch(error => {

        console.error(
            "車両一覧の読み込みに失敗:",
            error
        );

    });
}
