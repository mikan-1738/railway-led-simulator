// vehicle.js
// 車両管理

let vehicleList = [];
let currentVehicle = null;


// JSONを読み込む
async function loadJson(path) {
    const response = await fetch(path);

    if (!response.ok) {
        throw new Error(
            "ファイルを読み込めませんでした: " + path
        );
    }

    return await response.json();
}


// 車両一覧を読み込む
async function loadVehicles() {
    vehicleList = await loadJson(
        "vehicles/vehicles.json"
    );

    // { vehicles: [...] } に対応
    if (!Array.isArray(vehicleList)) {
        vehicleList = vehicleList.vehicles ?? [];
    }

    window.vehicleList = vehicleList;

    return vehicleList;
}


// 車両設定を読み込む
async function loadConfig(vehiclePath) {
    const config = await loadJson(
        vehiclePath + "/config.json"
    );

    window.vehicleConfig = config;

    // LEDキャンバスのサイズ
    if (
        typeof config.ledWidth === "number" &&
        typeof config.ledHeight === "number"
    ) {
        led.width = config.ledWidth;
        led.height = config.ledHeight;
    }

    // LED表示設定
    if (typeof config.ledSize === "number") {
        window.ledSize = config.ledSize;
    }

    if (typeof config.ledGap === "number") {
        window.ledGap = config.ledGap;
    }

    return config;
}


// LEDデータを読み込む
async function loadLed(vehiclePath) {
    const data = await loadJson(
        vehiclePath + "/led.json"
    );

    jsonData = data;

    return data;
}


// 車両ボタンを作成
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

        button.addEventListener("click", () => {
            selectVehicle(vehicle);
        });

        container.appendChild(button);
    }
}


// 車両を選択
async function selectVehicle(vehicle) {
    if (!vehicle) {
        return;
    }

    try {
        currentVehicle = vehicle;

        const vehiclePath =
            "vehicles/" + vehicle.id;

        await loadConfig(vehiclePath);
        await loadLed(vehiclePath);

        const selector =
            document.getElementById("vehicleSelector");

        const simulator =
            document.getElementById("simulator");

        if (selector) {
            selector.hidden = true;
        }

        if (simulator) {
            simulator.hidden = false;
        }

        // 操作ボタンを作成
        setupButtons();

        // 初期描画
        render();

    } catch (error) {
        console.error(error);

        alert(
            "車両データを読み込めませんでした。\n" +
            error.message
        );
    }
}


// 車両管理を開始
async function setupVehicles() {
    await loadVehicles();
    createVehicleButtons();
}
