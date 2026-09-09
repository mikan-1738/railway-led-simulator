function drawCarNumber(carNumber, matrix) {

    if (!carNumber) return;

    let usedNormal = true;
    let destinationWidth;

    const view = isCarNumberFullScreen(carNumber)
        ? "full"
        : "normal";

    const data =
        carNumber.view?.[view]?.[lang]
        ?? carNumber.view?.[view]?.ja
        ?? carNumber.view?.normal?.[lang]
        ?? carNumber.view?.normal?.ja;

    if (!data) return;

    const type = getItem("type", typeId);
    const dest = getItem("destination", destinationId);

    if (config.hasCarNumberFull) {
        destinationWidth = 0;
    }

    if (config.hasCarNumberSmall) {
        destinationWidth =
            config.carNumber === "right"
                ? getDestinationWidth(type, dest, usedNormal)
                : 0;
    }

    if (config.hasCarNumberNormal) {
        destinationWidth = getTypeWidth(type, usedNormal);
    }

    drawImage(data, destinationWidth, 0, matrix);
}

function drawType(type, matrix) {
    let usedNormal = true;
    let carNumberWidth;
    let typeLang = lang;

    if (typeMode === "information") {
        typeLang = "information";
    }

    const view = isTypeFullScreen(type)
        ? "full"
        : "normal";

    let data = null;
    
    if (config.languageSwitching) {
        data =
            type.view?.[view]?.[typeLang]
            ?? type.view?.[view]?.ja
            ?? type.view?.normal?.[typeLang]
            ?? type.view?.normal?.ja;
    } else {
        if (nextId != null) {
            data =
                type.view?.[view]?.[typeLang]
                ?? type.view?.[view]?.ja
                ?? type.view?.normal?.[typeLang]
                ?? type.view?.normal?.ja;
        } else {
            data =
                type.view?.[view]?.ja_en
                ?? type.view?.[view]?.[typeLang]
                ?? type.view?.[view]?.ja
                ?? type.view?.normal?.ja_en
                ?? type.view?.normal?.[typeLang]
                ?? type.view?.normal?.ja;
        }
    }

    const carNumber = getItem("carNumber", carNumberId)
    
    if (config.hasCarNumberSmall) {
        carNumberWidth = getCarNumberWidth(carNumber, usedNormal)
    } else {
        carNumberWidth = 0;
    }

    if (!data) return;

    drawImage(data, carNumberWidth, 0, matrix);
}

function drawTypeSmall(type, matrix) {

    let usedNormal = true;
    let carNumberWidth;
    let typeLang = lang;

    if (typeMode === "information") {
        typeLang = "information";
    }

    const view = isTypeFullScreen(type)
        ? "full"
        : "normal";

    let data =
        type.view?.[view]?.[lang]
        ?? type.view?.[view]?.ja;

    if (view === "normal") {
        usedNormal = true;
    }

    if (!data) {
        data =
            type.view?.normal?.[lang]
            ?? type.view?.normal?.ja;
