// ==========================================
// Railway LED Simulator
// display.js
// 表示データ → LED matrix
// ==========================================

const LED_COLOR = {
    orange: { r: 255, g: 105, b: 0 },
    red:    { r: 255, g: 40,  b: 60 },
    green:  { r: 100, g: 190, b: 40 }
};

// 都営10-300形 1・2次車 3色LED
const TOEI_3COLOR_LAYOUT = {
    typeX: 0,
    typeWidth: 40,

    destinationX: 40,
    destinationWidth: 88
};


// ==========================================
// JSON表示データ
// ==========================================

function getDisplayData(item, view = "normal") {

    if (!item) {
        return null;
    }

    return (
        item.view?.[view]?.[lang] ??
        item.view?.[view]?.ja ??
        item.view?.normal?.[lang] ??
        item.view?.normal?.ja ??
        null
    );
}


// ==========================================
// 色
// ==========================================

function getItemColor(item, category = "") {

    if (item?.color) {

        if (
            typeof item.color === "object" &&
            item.color.r !== undefined
        ) {
            return {
                r: Number(item.color.r),
                g: Number(item.color.g),
                b: Number(item.color.b)
            };
        }

        if (LED_COLOR[item.color]) {
            return LED_COLOR[item.color];
        }
    }

    if (category === "type") {

        switch (item?.id) {

            case "express":
                return LED_COLOR.red;

            case "rapid":
                return LED_COLOR.green;

            case "section_express":
                return LED_COLOR.orange;

            case "local":
            default:
                return LED_COLOR.orange;
        }
    }

    return LED_COLOR.orange;
}


// ==========================================
// 種別
// ==========================================

function drawType(type, matrix) {

    if (!type) {
        return;
    }

    const data =
        getDisplayData(type);

    if (data) {

        drawImage(
            data,
            TOEI_3COLOR_LAYOUT.typeX,
            0,
            matrix
        );

        return;
    }

    if (type.text) {

        drawTextToMatrix(
            type.text,
            matrix,
            TOEI_3COLOR_LAYOUT.typeX,
            0,
            TOEI_3COLOR_LAYOUT.typeWidth,
            32,
            getItemColor(type, "type")
        );
    }
}


function drawTypeSmall(type, matrix) {

    drawType(
        type,
        matrix
    );
}


// ==========================================
// 行先
// ==========================================

function drawDestination(destination, matrix) {

    if (!destination) {
        return;
    }


    // BINデータ
    if (destination.binMatrix) {

        drawBinMatrixToArea(
            destination.binMatrix,
            matrix,
            TOEI_3COLOR_LAYOUT.destinationX,
            0,
            TOEI_3COLOR_LAYOUT.destinationWidth,
            32
        );

        return;
    }


    const data =
        getDisplayData(destination);

    if (data) {

        drawImage(
            data,
            TOEI_3COLOR_LAYOUT.destinationX,
            0,
            matrix
        );

        return;
    }


    if (destination.text) {

        drawTextToMatrix(
            destination.text,
            matrix,
            TOEI_3COLOR_LAYOUT.destinationX,
            0,
            TOEI_3COLOR_LAYOUT.destinationWidth,
            32,
            getItemColor(destination, "destination")
        );
    }
}


function drawDestinationSmall(destination, matrix) {

    drawDestination(
        destination,
        matrix
    );
}


// ==========================================
// 案内
// ==========================================

function drawInformation(information, matrix) {

    if (!information) {
        return;
    }

    const data =
        getDisplayData(information);

    if (data) {

        drawImage(
            data,
            0,
            0,
            matrix
        );

        return;
    }

    if (information.text) {

        drawTextToMatrix(
            information.text,
            matrix,
            0,
            0,
            128,
            32,
            getItemColor(
                information,
                "information"
            )
        );
    }
}


function drawInformationSmall(information, matrix) {

    drawInformation(
        information,
        matrix
    );
}


function drawInformation2(information, matrix) {

    drawInformation(
        information,
        matrix
    );
}


// ==========================================
// 次駅
// ==========================================

function drawNext(next, matrix) {

    if (!next) {
        return;
    }

    const data =
        getDisplayData(next);

    if (data) {

        drawImage(
            data,
            0,
            0,
            matrix
        );

        return;
    }

    if (next.text) {

        drawTextToMatrix(
            next.text,
            matrix,
            0,
            0,
            128,
            32,
            getItemColor(
                next,
                "next"
            )
        );
    }
}


// ==========================================
// 号車
// ==========================================

function drawCarNumber(carNumber, matrix) {

    if (!carNumber) {
        return;
    }

    const data =
        getDisplayData(carNumber);

    if (data) {

        drawImage(
            data,
            0,
            0,
            matrix
        );

        return;
    }

    if (carNumber.text) {

        drawTextToMatrix(
            carNumber.text,
            matrix,
            0,
            0,
            128,
            32,
            getItemColor(
                carNumber,
                "carNumber"
            )
        );
    }
}


// ==========================================
// 幅
// ==========================================

function getTypeWidth(
    type,
    used = false
) {

    return TOEI_3COLOR_LAYOUT.typeWidth;
}


function getCarNumberWidth(
    carNumber,
    used = false
) {

    if (!carNumber) {
        return 0;
    }

    return getItemWidth(
        carNumber,
        "normal"
    );
}


function getItemWidth(
    item,
    view = "normal"
) {

    const data =
        getDisplayData(
            item,
            view
        );

    if (data?.width) {

        return Number(
            data.width
        );
    }

    if (item?.text) {

        return Math.max(
            8,
            item.text.length * 8
        );
    }

    return 0;
}


// ==========================================
// 全面表示判定
// ==========================================

function isTypeFullScreen(type) {

    return !!type?.fullScreen;
}


function isDestinationFullScreen(destination) {

    return !!destination?.fullScreen;
}


function isInformationFullScreen(information) {

    return !!information?.fullScreen;
}


function isInformation2FullScreen(information) {

    return isInformationFullScreen(
        information
    );
}


function isNextFullScreen(next) {

    return isInformationFullScreen(
        next
    );
}


function isCarNumberFullScreen(carNumber) {

    return !!carNumber?.fullScreen;
}


// ==========================================
// JSON画像 → matrix
// ==========================================

function drawImage(
    displayData,
    startX,
    startY,
    matrix
) {

    if (
        !displayData ||
        !matrix
    ) {
        return;
    }

    const width =
        Number(
            displayData.width
        ) || 0;

    const height =
        Number(
            displayData.height
        ) || 0;

    const data =
        displayData.data;

    if (!Array.isArray(data)) {
        return;
    }

    let index = 0;

    for (
        let y = 0;
        y < height;
        y++
    ) {

        for (
            let x = 0;
            x < width;
            x++
        ) {

            const targetX =
                startX + x;

            const targetY =
                startY + y;

            if (
                matrix[targetY]?.[targetX]
            ) {

                matrix[targetY][targetX] = {
                    r: Number(data[index]) || 0,
                    g: Number(data[index + 1]) || 0,
                    b: Number(data[index + 2]) || 0
                };
            }

            index += 3;
        }
    }
}


// ==========================================
// BIN → 指定領域
// ==========================================

function drawBinMatrixToArea(
    binMatrix,
    matrix,
    startX,
    startY,
    targetWidth,
    targetHeight
) {

    if (
        !binMatrix ||
        !matrix
    ) {
        return;
    }

    const sourcePixels =
        binMatrix.pixels;

    if (!Array.isArray(sourcePixels)) {
        return;
    }

    const sourceHeight =
        sourcePixels.length;

    const sourceWidth =
        sourcePixels[0]?.length || 0;

    if (
        sourceWidth <= 0 ||
        sourceHeight <= 0
    ) {
        return;
    }


    for (
        let y = 0;
        y < targetHeight;
        y++
    ) {

        const sourceY =
            Math.min(
                sourceHeight - 1,
                Math.floor(
                    y *
                    sourceHeight /
                    targetHeight
                )
            );


        for (
            let x = 0;
            x < targetWidth;
            x++
        ) {

            const sourceX =
                Math.min(
                    sourceWidth - 1,
                    Math.floor(
                        x *
                        sourceWidth /
                        targetWidth
                    )
                );


            const code =
                Number(
                    sourcePixels[sourceY]?.[sourceX]
                ) || 0;


            const color =
                binColor(code);


            const targetX =
                startX + x;

            const targetY =
                startY + y;


            if (
                matrix[targetY]?.[targetX]
            ) {

                matrix[targetY][targetX] =
                    color;
            }
        }
    }
}


// 互換用
function drawBinMatrixAt(
    binMatrix,
    matrix,
    startX,
    startY,
    targetWidth,
    targetHeight
) {

    drawBinMatrixToArea(
        binMatrix,
        matrix,
        startX,
        startY,
        targetWidth,
        targetHeight
    );
}


// ==========================================
// BIN色
//
// 7  = 橙
// 9  = 緑
// 10 = 赤
// ==========================================

function binColor(code) {

    switch (
        Number(code)
    ) {

        case 10:
            return LED_COLOR.red;

        case 7:
            return LED_COLOR.orange;

        case 9:
            return LED_COLOR.green;

        default:
            return {
                r: 0,
                g: 0,
                b: 0
            };
    }
}


// ==========================================
// テキスト → matrix
// ==========================================

function drawTextToMatrix(
    text,
    matrix,
    startX = 0,
    startY = 0,
    maxWidth = 128,
    maxHeight = 32,
    color = LED_COLOR.orange
) {

    if (
        !text ||
        !matrix
    ) {
        return;
    }

    const width =
        Math.max(
            1,
            Math.floor(maxWidth)
        );

    const height =
        Math.max(
            1,
            Math.floor(maxHeight)
        );


    const canvas =
        document.createElement(
            "canvas"
        );

    canvas.width =
        width;

    canvas.height =
        height;


    const tempCtx =
        canvas.getContext(
            "2d"
        );

    if (!tempCtx) {
        return;
    }


    let fontSize =
        Math.max(
            8,
            Math.floor(
                height * 0.8
            )
        );


    tempCtx.textBaseline =
        "middle";

    tempCtx.textAlign =
        "left";


    while (
        fontSize > 8
    ) {

        tempCtx.font =
            "bold " +
            fontSize +
            "px sans-serif";

        if (
            tempCtx.measureText(text).width <=
            width
        ) {
            break;
        }

        fontSize--;
    }


    tempCtx.font =
        "bold " +
        fontSize +
        "px sans-serif";

    tempCtx.fillStyle =
        "white";


    tempCtx.fillText(
        text,
        0,
        Math.floor(
            height / 2
        )
    );


    const image =
        tempCtx.getImageData(
            0,
            0,
            width,
            height
        );


    for (
        let y = 0;
        y < height;
        y++
    ) {

        for (
            let x = 0;
            x < width;
            x++
        ) {

            const index =
                (
                    y * width +
                    x
                ) * 4;


            if (
                image.data[index + 3] <= 80
            ) {
                continue;
            }


            const targetX =
                startX + x;

            const targetY =
                startY + y;


            if (
                matrix[targetY]?.[targetX]
            ) {

                matrix[targetY][targetX] = {
                    r: color.r,
                    g: color.g,
                    b: color.b
                };
            }
        }
    }
                }
