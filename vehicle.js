// vehicle.js
// Railway LED Simulator
// 車両一覧・車両選択・車両JSON読み込み

let vehicleList = [];
let currentVehicle = null;


// ==========================================
// JSON読み込み
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
// 車両設定読み込み
// vehicles.json の config を使用
// ==========================================

async function loadConfig() {
    if (!currentVehicle) {
        throw new Error(
            "車両が選択されていません。"
        );
    }

    config = await loadJson(
        currentVehicle.config
    );

    window.vehicleConfig = config;

    return config;
}


// ==========================================
// LED JSON読み込み
// vehicles.json の led を使用
// ==========================================

async function loadLed() {
    if (!currentVehicle) {
        throw new Error(
            "車両が選択されていません。"
        );
    }

    jsonData = await loadJson(
        currentVehicle.led
    );

    window.vehicleLedData = jsonData;

    if (!jsonData || !jsonData.categories) {
        console.warn(
            "led.json に categories がありません。"
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


// ==========================================
// 車両選択
// ==========================================

async function selectVehicle(vehicle) {
    if (!vehicle) {
        return;
    }

    try {
        currentVehicle = vehicle;

        // 車両JSONを読み込む
        await loadConfig();
        await loadLed();

        // BINデータ対応
        if (
            typeof loadVehicleBins === "function"
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

        // ボタンを作成
        setupButtons();

        // LEDサイズ設定
        applyVehicleConfig();

        // 描画
        render();

    } catch (error) {
        console.error(error);

        alert(
            "車両データを読み込めませんでした。\n" +
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

    // LEDサイズ
    if (
        typeof config.ledSize === "number"
    ) {
        ledsize = config.ledSize;
    }

    // LED間隔
    if (
        typeof config.ledGap === "number"
    ) {
        ledgap = config.ledGap;
    }

    // ピッチ
    pitch =
        ledsize + ledgap;

    radius =
        ledsize / 2;

    // Canvasサイズ
    if (
        typeof config.ledWidth === "number" &&
        typeof config.ledHeight === "number"
    ) {
        sizeLed.width =
            config.ledWidth * pitch;

        sizeLed.height =
            config.ledHeight * pitch;
    }

    // Canvasサイズを直接設定する構成にも対応
    if (
        typeof config.canvasWidth === "number"
    ) {
        sizeLed.width =
            config.canvasWidth;
    }

    if (
        typeof config.canvasHeight === "number"
    ) {
        sizeLed.height =
            config.canvasHeight;
    }
}


// ==========================================
// 車両セットアップ
// ==========================================

async function setupVehicles() {
    await loadVehicles();

    createVehicleButtons();
    }
