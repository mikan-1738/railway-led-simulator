// ==========================================
// Railway LED Simulator
// vehicle.js
// ==========================================

let vehicleList = [];
let currentVehicle = null;

// ------------------------------------------
// JSON読み込み
// ------------------------------------------

async function loadJson(path) {
    const response = await fetch(path);

    if (!response.ok) {
        throw new Error(
            `JSONを読み込めませんでした: ${path}\n` +
            `HTTP ${response.status}`
        );
    }

    return await response.json();
}

// ------------------------------------------
// vehicles.json
// ------------------------------------------

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

    return vehicleList;
}

// ------------------------------------------
// config.json
// ------------------------------------------

async function loadConfig() {
    if (!currentVehicle) {
        throw new Error(
            "車両が選択されていません。"
        );
    }

    if (!currentVehicle.config) {
        throw new Error(
            "config.json の指定がありません。"
        );
    }

    config = await loadJson(
        currentVehicle.config
    );

    return config;
}

// ------------------------------------------
// led.json
// ------------------------------------------

async function loadLed() {
    if (!currentVehicle) {
        throw new Error(
            "車両が選択されていません。"
        );
    }

    if (!currentVehicle.led) {
        throw new Error(
            "led.json の指定がありません。"
        );
    }

    jsonData = await loadJson(
        currentVehicle.led
    );

    if (!jsonData) {
        throw new Error(
            "led.json が空です。"
        );
    }

    if (!Array.isArray(jsonData.categories)) {
        throw new Error(
            "led.json に categories がありません。"
        );
    }

    return jsonData;
}

// ------------------------------------------
// 車両ボタン作成
// ------------------------------------------

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
            vehicle.name || vehicle.id;

        button.addEventListener(
            "click",
            () => {
                selectVehicle(vehicle);
            }
        );

        container.appendChild(button);
    });
}

// ------------------------------------------
// 車両選択
// ------------------------------------------

async function selectVehicle(vehicle) {

    try {

        currentVehicle = vehicle;

        console.log(
            "車両選択:",
            currentVehicle.name
        );

        // config.json
        await loadConfig();

        console.log(
            "config.json 読み込み完了:",
            config
        );

        // led.json
        await loadLed();

        console.log(
            "led.json 読み込み完了:",
            jsonData
        );

        // BINなどを使う場合
        if (
            typeof loadVehicleBins ===
            "function"
        ) {
            await loadVehicleBins(
                currentVehicle,
                jsonData
            );
        }

        // 車両選択画面を隠す
        const selector =
            document.getElementById(
                "vehicleSelector"
            );

        if (selector) {
            selector.hidden = true;
        }

        // シミュレーターを表示
        const simulator =
            document.getElementById(
                "simulator"
            );

        if (simulator) {
            simulator.hidden = false;
        }

        // LEDサイズ設定
        applyVehicleConfig();

        // ボタン
        if (
            typeof setupButtons ===
            "function"
        ) {
            setupButtons();
        }

        // 描画
        if (
            typeof render ===
            "function"
        ) {
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

// ------------------------------------------
// 車両ごとのLED設定
// ------------------------------------------

function applyVehicleConfig() {

    if (!config) {
        return;
    }

    if (!sizeLed) {
        console.error(
            "LED Canvas がありません。"
        );
        return;
    }

    // LEDサイズ
    if (
        typeof config.ledSize ===
        "number"
    ) {
        ledsize =
            config.ledSize;
    }

    // LED間隔
    if (
        typeof config.ledGap ===
        "number"
    ) {
        ledgap =
            config.ledGap;
    }

    pitch =
        ledsize + ledgap;

    radius =
        ledsize / 2;

    // LEDドット数からCanvasサイズを計算
    if (
        typeof config.ledWidth ===
        "number" &&
        typeof config.ledHeight ===
        "number"
    ) {

        sizeLed.width =
            config.ledWidth *
            pitch;

        sizeLed.height =
            config.ledHeight *
            pitch;

    }

    // 明示的なCanvasサイズがある場合
    if (
        typeof config.canvasWidth ===
        "number"
    ) {
        sizeLed.width =
            config.canvasWidth;
    }

    if (
        typeof config.canvasHeight ===
        "number"
    ) {
        sizeLed.height =
            config.canvasHeight;
    }

    // キャッシュCanvas
    if (
        typeof cacheCanvas !==
        "undefined"
    ) {

        cacheCanvas.width =
            sizeLed.width;

        cacheCanvas.height =
            sizeLed.height;
    }

    // CSSサイズ調整
    if (
        typeof resizeLed ===
        "function"
    ) {
        resizeLed();
    }
}

// ------------------------------------------
// 初期化
// ------------------------------------------

async function setupVehicles() {

    try {

        await loadVehicles();

        console.log(
            "vehicles.json 読み込み完了:",
            vehicleList
        );

        createVehicleButtons();

    } catch (error) {

        console.error(
            "車両一覧の読み込みに失敗:",
            error
        );

        alert(
            "車両一覧を読み込めませんでした。\n\n" +
            error.message
        );
    }
            }
