// script.js
// Railway LED Simulator - メイン制御

let jsonData = null;
let currentVehicle = null;


// JSONを読み込む
async function loadJson(path) {
    const response = await fetch(path);

    if (!response.ok) {
        throw new Error("JSONの読み込みに失敗しました: " + path);
    }

    return await response.json();
}


// 車両設定を読み込む
async function loadConfig(vehiclePath) {
    const config = await loadJson(
        vehiclePath + "/config.json"
    );

    window.vehicleConfig = config;

    // LEDサイズを設定
    if (config.ledWidth && config.ledHeight) {
        led.width = config.ledWidth;
        led.height = config.ledHeight;
    }

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


// 車両を開始
async function startVehicle(vehicle) {
    try {
        currentVehicle = vehicle;

        const vehiclePath =
            "vehicles/" + vehicle;

        await loadConfig(vehiclePath);
        await loadLed(vehiclePath);

        setupVehicleUI();

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

        setupButtons();

        // 初期表示
        render();

    } catch (error) {
        console.error(error);
        alert(
            "車両データの読み込みに失敗しました。\n" +
            error.message
        );
    }
}


// 車両選択画面を作る
function setupVehicleUI() {
    const container =
        document.getElementById("vehicleSelect");

    if (!container) {
        return;
    }

    container.innerHTML = "";

    const vehicles =
        window.vehicleList ?? [];

    for (const vehicle of vehicles) {
        const button =
            document.createElement("button");

        button.type = "button";
        button.textContent =
            vehicle.name ?? vehicle.id;

        button.addEventListener("click", () => {
            startVehicle(vehicle.id);
        });

        container.appendChild(button);
    }
}


// ページ起動時
async function init() {
    try {
        const data =
            await loadJson("vehicles/vehicles.json");

        window.vehicleList =
            data.vehicles ?? data;

        setupVehicleUI();

    } catch (error) {
        console.error(error);

        alert(
            "車両一覧を読み込めませんでした。"
        );
    }
}


// HTMLの読み込みが終わったら開始
document.addEventListener(
    "DOMContentLoaded",
    init
);
