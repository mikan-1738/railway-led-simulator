// vehicle.js
// 車両管理

let vehicleList = [];


// 車両一覧を読み込む
async function loadVehicles() {
    try {
        const response = await fetch("vehicles/vehicles.json");

        if (!response.ok) {
            throw new Error("車両一覧を読み込めませんでした");
        }

        const data = await response.json();

        // { vehicles: [...] } と [...] の両方に対応
        vehicleList = Array.isArray(data)
            ? data
            : (data.vehicles ?? []);

        window.vehicleList = vehicleList;

        return vehicleList;

    } catch (error) {
        console.error(error);
        throw error;
    }
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

    currentVehicle = vehicle;

    const vehiclePath =
        "vehicles/" + vehicle.id;

    try {
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

        setupButtons();
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
