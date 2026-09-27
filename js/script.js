async function startVehicle() {

    clearInterval(scrollTimer);
    scrollTimer = null;

    clickStartScrollBtn = false;
    scrollId = null;

    showLoading();

    try {

        await loadLed();

        ledsize = config.ledSize;
        ledgap = config.ledGap;
        pitch = ledsize + ledgap;
        pitchY = ledsize * 0.9 + ledgap;
        radius = ledsize / 2;

        sizeLed.width = config.ledWidth * pitch;

        if (config.ledShape === "circle") {
            sizeLed.height = config.ledHeight * pitch;
        }

        if (config.ledShape === "rectangle") {
            sizeLed.height = config.ledHeight * pitchY;
        }

        cacheCanvas.width = sizeLed.width;
        cacheCanvas.height = sizeLed.height;

        resizeLed();

        setupVehicleUI();

        startRenderLoop();

    } catch (error) {

        console.error(error);

        hideLoading();

        const message =
            "読み込みエラー\n\n" +
            error.name + "\n" +
            error.message;

        alert(message);

        throw error;

    } finally {

        hideLoading();

    }
}


function resizeLed() {

    if (!config) return;

    const main = document.querySelector("main");

    const maxWidth = main.clientWidth - 40;
    const canvasWidth = sizeLed.width;

    const scale = Math.min(1, maxWidth / canvasWidth);

    sizeLed.style.width = sizeLed.width * scale + "px";
    sizeLed.style.height = sizeLed.height * scale + "px";
}


async function loadConfig() {

    const response = await fetch(selectedVehicle.config);

    if (!response.ok) {
        throw new Error(
            "config.json: HTTP " + response.status
        );
    }

    config = await response.json();

}


async function loadLed() {

    console.log("=== loadLed 開始 ===");


    // =========================
    // config.json
    // =========================

    console.log(
        "config:",
        selectedVehicle.config
    );

    let response =
        await fetch(selectedVehicle.config);

    if (!response.ok) {
        throw new Error(
            "config.json の読み込みに失敗しました: HTTP " +
            response.status
        );
    }

    config = await response.json();

    console.log(
        "config.json 読み込み成功"
    );


    // =========================
    // led.json
    // =========================

    console.log(
        "led:",
        selectedVehicle.led
    );

    response =
        await fetch(selectedVehicle.led);

    if (!response.ok) {
        throw new Error(
            "led.json の読み込みに失敗しました: HTTP " +
            response.status
        );
    }

    jsonData = await response.json();

    console.log(
        "led.json 読み込み成功"
    );

    console.log(
        "categories:",
        jsonData.categories
    );


    if (!jsonData?.categories) {
        throw new Error(
            "led.json に categories がありません"
        );
    }


    // =========================
    // site.json
    // =========================

    console.log(
        "site:",
        selectedVehicle.site
    );

    response =
        await fetch(selectedVehicle.site);

    if (!response.ok) {
        throw new Error(
            "site.json の読み込みに失敗しました: HTTP " +
            response.status
        );
    }

    siteData = await response.json();

    console.log(
        "site.json 読み込み成功"
    );


    console.log(
        "=== loadLed 完了 ==="
    );

}


async function loadFont() {

    const response =
        await fetch(selectedVehicle.font);

    if (!response.ok) {
        throw new Error(
            "font の読み込みに失敗しました: HTTP " +
            response.status
        );
    }

    fontData = await response.json();

}


function setupVehicleUI() {

    console.log("=== setupVehicleUI 開始 ===");


    if (config.hasType) {

        document.getElementById("typeGroup").hidden = false;

        console.log("createTypeButtons");

        createTypeButtons();

    } else {

        document.getElementById("typeGroup").hidden = true;

    }


    if (config.hasDestination) {

        document.getElementById("destinationGroup").hidden = false;

        console.log("createDestinationButtons");

        createDestinationButtons();

    } else {

        document.getElementById("destinationGroup").hidden = true;

    }


    if (config.hasInformation) {

        document.getElementById("informationGroup").hidden = false;

        console.log("createInformationButtons");

        createInformationButtons();

    } else {

        document.getElementById("informationGroup").hidden = true;

    }


    if (config.hasInformation2) {

        document.getElementById("information2Group").hidden = false;

        createInformation2Buttons();

    } else {

        document.getElementById("information2Group").hidden = true;

    }


    if (config.hasLine) {

        document.getElementById("lineGroup").hidden = false;

        createLineButtons();

    } else {

        document.getElementById("lineGroup").hidden = true;

    }


    if (config.hasNext) {

        document.getElementById("nextModeGroup").hidden = false;

        createNextModeButtons();

    } else {

        document.getElementById("nextModeGroup").hidden = true;

    }


    if (config.hasCarNumber) {

        document.getElementById("carNumberGroup").hidden = false;

        createCarNumberButtons();

    } else {

        document.getElementById("carNumberGroup").hidden = true;

    }


    if (config.hasScroll) {

        document.getElementById("scroll").hidden = false;

    } else {

        document.getElementById("scroll").hidden = true;

    }


    const scrollText =
        document.getElementById("scrollText");

    scrollText.value =
        config.scrollLabel;


    setVehicleSelectButton();

    resizeButtonText();


    console.log("=== setupVehicleUI 完了 ===");

}


let renderTimer = null;


function nextScene() {

    buildSceneList();

    buildTypeSceneList();


    scene =
        frame % sceneList.length;

    typeScene =
        frame % typeSceneList.length;


    applyScene();

    applyTypeScene();

    render();


    frame++;


    renderTimer =
        setTimeout(
            nextScene,
            getSceneInterval()
        );

}


function getSceneInterval() {

    if (sceneList.length === 0) {
        return 1000;
    }


    let sceneInterval =
        config.sceneInterval;


    const jaTime =
        Number(
            document.querySelector(
                "#jaTime input"
            ).value
        );

    const enTime =
        Number(
            document.querySelector(
                "#enTime input"
            ).value
        );

    const infoTime =
        Number(
            document.querySelector(
                "#infoTime input"
            ).value
        );

    const carNumberTime =
        Number(
            document.querySelector(
                "#carNumberTime input"
            ).value
        );


    if (config.setSwitchingTime) {

        const currentScene =
            sceneList[scene];


        if (
            currentScene.information ===
            "carNumber" ||
            currentScene.information ===
            "carNumber_destination"
        ) {

            sceneInterval =
                carNumberTime * 1000;

        }


        if (
            currentScene.information ===
            "information"
        ) {

            sceneInterval =
                infoTime * 1000;

        }


        if (
            currentScene.information ===
            "destination"
        ) {

            if (currentScene.lang === "ja") {

                sceneInterval =
                    jaTime * 1000;

            }

            if (currentScene.lang === "en") {

                sceneInterval =
                    enTime * 1000;

            }

        }

    } else {

        sceneInterval =
            config.sceneInterval;

    }


    return sceneInterval;

            }
