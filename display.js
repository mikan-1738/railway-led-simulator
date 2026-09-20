// ==========================================
// Railway LED Simulator
// display.js
// 表示データ → LED matrix
// ==========================================

const TEXT_COLOR = {
    r: 255,
    g: 242,
    b: 0
};


// ==========================================
// 表示データ取得
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
// 表示幅
// ==========================================

function getItemWidth(item, view = "normal") {

    const data =
        getDisplayData(item, view);

    if (data?.width) {
        return Number(data.width);
    }

    if (item?.text) {

        const width =
            Number(config?.ledWidth) || 128;

        return Math.min(
            width,
            Math.max(
                8,
                item.text.length * 8
            )
        );
    }

    return 0;
}


// ==========================================
// 号車
// ==========================================

function drawCarNumber(
    carNumber,
    matrix
) {

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
            0
        );
    }
}


// ==========================================
// 種別
// ==========================================

function drawType(
    type,
    matrix
) {

    if (!type) {
        return;
    }

    const data =
        getDisplayData(type);

    if (data) {

        drawImage(
            data,
            0,
            0,
            matrix
        );

        return;
    }

    if (type.text) {

        drawTextToMatrix(
            type.text,
            matrix,
            0,
            0
        );
    }
}


function drawTypeSmall(
    type,
    matrix
) {

    drawType(
        type,
        matrix
    );
}


// ==========================================
// 行先
// ==========================================

function drawDestination(
    destination,
    matrix
) {

    if (!destination) {
        return;
    }

    // BINデータ
    if (destination.binMatrix) {

        drawBinMatrix(
            destination.binMatrix,
            matrix
        );

        return;
    }

    const data =
        getDisplayData(destination);

    if (data) {

        const type =
            getItem(
                "type",
                typeId
            );

        const startX =
            type
                ? getTypeWidth(
                    type,
                    true
                )
                : 0;

        drawImage(
            data,
            startX,
            0,
            matrix
        );

        return;
    }

    // 通常テキスト
    if (destination.text) {

        drawTextToMatrix(
            destination.text,
            matrix,
            0,
            0
        );
    }
}


function drawDestinationSmall(
    destination,
    matrix
) {

    drawDestination(
        destination,
        matrix
    );
}


// ==========================================
// 案内
// ==========================================

function drawInformation(
    information,
    matrix
) {

    if (!information) {
        return;
    }

    const data =
        getDisplayData(
            information
        );

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
            0
        );
    }
}


function drawInformationSmall(
    information,
    matrix
) {

    drawInformation(
        information,
        matrix
    );
}


// ==========================================
// 案内2
// ==========================================

function drawInformation2(
    information,
    matrix
) {

    drawInformation(
        information,
        matrix
    );
}


// ==========================================
// 次駅
// ==========================================

function drawNext(
    next,
    matrix
) {

    if (!next) {
        return;
    }

    const data =
        getDisplayData(
            next
        );

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
            0
        );
    }
}


// ==========================================
// 種別の幅
// ==========================================

function getTypeWidth(
    type,
    used = false
) {

    if (!type) {
        return 0;
    }

    return getItemWidth(
        type,
        "normal"
    );
}


// ==========================================
// 号車の幅
// ==========================================

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


// ==========================================
// 全面表示判定
// ==========================================

function isTypeFullScreen(
    type
) {

    if (!type) {
        return false;
    }

    if (
        type.fullScreen === true
    ) {
        return true;
    }

    return false;
}


function isDestinationFullScreen(
    destination
) {

    if (!destination) {
        return false;
    }

    if (
        destination.fullScreen === true
    ) {
        return true;
    }

    return false;
}


function isInformationFullScreen(
    information
) {

    if (!information) {
        return false;
    }

    if (
        information.fullScreen === true
    ) {
        return true;
    }

    return false;
}


function isInformation2FullScreen(
    information
) {

    return isInformationFullScreen(
        information
    );
}


function isNextFullScreen(
    next
) {

    return isInformationFullScreen(
        next
    );
}


function isCarNumberFullScreen(
    carNumber
) {

    if (!carNumber) {
        return false;
    }

    if (
        carNumber.fullScreen === true
    ) {
        return true;
    }

    return false;
}


// ==========================================
// LED画像データをmatrixへ配置
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

    if (
        !Array.isArray(data)
    ) {
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
                matrix[targetY] &&
                matrix[targetY][targetX]
            ) {

                const r =
                    Number(
                        data[index]
                    ) || 0;

                const g =
                    Number(
                        data[index + 1]
                    ) || 0;

                const b =
                    Number(
                        data[index + 2]
                    ) || 0;

                matrix[targetY][targetX] = {
                    r,
                    g,
                    b
                };
            }

            index += 3;
        }
    }
}


// ==========================================
// テキスト → matrix
// ==========================================

function drawTextToMatrix(
    text,
    matrix,
    startX = 0,
    startY = 0
) {

    if (
        !text ||
        !matrix ||
        !config
    ) {
        return;
    }

    const width =
        Number(
            config.ledWidth
        ) || 0;

    const height =
        Number(
            config.ledHeight
        ) || 0;

    if (
        width <= 0 ||
        height <= 0
    ) {
        return;
    }

    const canvas =
        document.createElement(
            "canvas"
        );

    canvas.width = width;
    canvas.height = height;

    const tempCtx =
        canvas.getContext(
            "2d"
        );

    const fontSize =
        Math.max(
            8,
            Math.floor(
                height * 0.8
            )
        );

    tempCtx.font =
        "bold " +
        fontSize +
        "px sans-serif";

    tempCtx.textBaseline =
        "middle";

    tempCtx.textAlign =
        "left";

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

            const alpha =
                image.data[
                    index + 3
                ];

            if (
                alpha <= 80
            ) {
                continue;
            }

            const targetX =
                startX + x;

            const targetY =
                startY + y;

            if (
                matrix[targetY] &&
                matrix[targetY][targetX]
            ) {

                matrix[
                    targetY
                ][
                    targetX
                ] = {
                    r: TEXT_COLOR.r,
                    g: TEXT_COLOR.g,
                    b: TEXT_COLOR.b
                };
            }
        }
    }
}
