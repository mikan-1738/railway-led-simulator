// ==========================================
// Railway LED Simulator
// render.js
// ==========================================

// ------------------------------------------
// 描画
// ------------------------------------------

function render() {

    if (
        !config ||
        !sizeLed
    ) {
        return;
    }

    const matrix =
        createDisplayMatrix();

    currentMatrix =
        matrix;

    drawMatrix(
        matrix,
        cacheCtx
    );

    drawCacheToCanvas();
}


// ------------------------------------------
// 表示matrix作成
// ------------------------------------------

function createDisplayMatrix() {

    const matrix =
        createEmptyMatrix();

    const type =
        getItem(
            "type",
            typeId
        );

    const destination =
        getItem(
            "destination",
            destinationId
        );

    const next =
        getItem(
            "next",
            nextId
        );

    const information =
        getItem(
            "information",
            informationId
        );

    const information2 =
        getItem(
            "information2",
            information2Id
        );

    const carNumber =
        getItem(
            "carNumber",
            carNumberId
        );


    // --------------------------------------
    // 号車
    // --------------------------------------

    if (
        config.hasCarNumberSmall &&
        carNumber
    ) {

        drawCarNumber(
            carNumber,
            matrix
        );
    }


    // --------------------------------------
    // 種別
    // --------------------------------------

    if (type) {

        if (
            isTypeFullScreen(
                type
            )
        ) {

            drawType(
                type,
                matrix
            );

        } else {

            drawType(
                type,
                matrix
            );
        }
    }


    // --------------------------------------
    // 全面表示
    // --------------------------------------

    const fullType =
        isTypeFullScreen(
            type
        );

    if (
        fullType
    ) {

        return matrix;
    }


    // --------------------------------------
    // 行先
    // --------------------------------------

    if (
        informationMode ===
        "destination"
    ) {

        if (
            destination
        ) {

            drawDestination(
                destination,
                matrix
            );
        }
    }


    // --------------------------------------
    // 案内
    // --------------------------------------

    if (
        informationMode ===
        "information"
    ) {

        if (
            information
        ) {

            drawInformation(
                information,
                matrix
            );
        }
    }


    // --------------------------------------
    // 案内2
    // --------------------------------------

    if (
        informationMode ===
        "information2"
    ) {

        if (
            information2
        ) {

            drawInformation2(
                information2,
                matrix
            );
        }
    }


    // --------------------------------------
    // 号車
    // --------------------------------------

    if (
        informationMode ===
        "carNumber"
    ) {

        if (
            carNumber
        ) {

            drawCarNumber(
                carNumber,
                matrix
            );
        }
    }


    // --------------------------------------
    // 次駅
    // --------------------------------------

    if (
        showNext &&
        next
    ) {

        drawNext(
            next,
            matrix
        );
    }


    return matrix;
}


// ------------------------------------------
// 空のmatrix
// ------------------------------------------

function createEmptyMatrix() {

    const width =
        Number(
            config?.ledWidth
        ) || 0;

    const height =
        Number(
            config?.ledHeight
        ) || 0;

    return Array.from(
        {
            length: height
        },
        () =>
            Array.from(
                {
                    length: width
                },
                () => ({
                    r: 0,
                    g: 0,
                    b: 0
                })
            )
    );
}


// ------------------------------------------
// matrixをCanvasへ描画
// ------------------------------------------

function drawMatrix(
    matrix,
    targetCtx
) {

    if (
        !matrix ||
        !targetCtx ||
        !config
    ) {
        return;
    }

    targetCtx.setTransform(
        1,
        0,
        0,
        1,
        0,
        0
    );

    targetCtx.globalAlpha =
        1;

    targetCtx.fillStyle =
        "rgb(0,0,0)";

    targetCtx.fillRect(
        0,
        0,
        sizeLed.width,
        sizeLed.height
    );


    const width =
        Number(
            config.ledWidth
        ) || 0;

    const height =
        Number(
            config.ledHeight
        ) || 0;


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

            const pixel =
                matrix[y]?.[x] ?? {
                    r: 0,
                    g: 0,
                    b: 0
                };


            if (
                config.ledShape ===
                "rectangle"
            ) {

                drawLEDRectangle(
                    targetCtx,
                    x,
                    y,
                    pixel
                );

            } else {

                drawLEDCircle(
                    targetCtx,
                    x,
                    y,
                    pixel
                );
            }
        }
    }
}


// ------------------------------------------
// 円形LED
// ------------------------------------------

function drawLEDCircle(
    targetCtx,
    x,
    y,
    color
) {

    targetCtx.fillStyle =
        `rgb(
            ${color.r},
            ${color.g},
            ${color.b}
        )`;

    targetCtx.beginPath();

    targetCtx.arc(
        x * pitch + radius,
        y * pitch + radius,
        radius,
        0,
        Math.PI * 2
    );

    targetCtx.fill();
}


// ------------------------------------------
// 長方形LED
// ------------------------------------------

function drawLEDRectangle(
    targetCtx,
    x,
    y,
    color
) {

    targetCtx.fillStyle =
        `rgb(
            ${color.r},
            ${color.g},
            ${color.b}
        )`;

    targetCtx.fillRect(
        x * pitch,
        y * pitchY,
        ledsize,
        ledsize * 0.9
    );
}


// ------------------------------------------
// cacheCanvas → 表示Canvas
// ------------------------------------------

function drawCacheToCanvas() {

    if (
        !sizeLed ||
        !cacheCanvas ||
        !ctx
    ) {
        return;
    }

    ctx.setTransform(
        1,
        0,
        0,
        1,
        0,
        0
    );

    ctx.globalAlpha =
        1;

    ctx.clearRect(
        0,
        0,
        sizeLed.width,
        sizeLed.height
    );

    ctx.drawImage(
        cacheCanvas,
        0,
        0
    );
}


// ------------------------------------------
// Canvasクリア
// ------------------------------------------

function clearMatrix() {

    if (
        !sizeLed ||
        !ctx
    ) {
        return;
    }

    ctx.setTransform(
        1,
        0,
        0,
        1,
        0,
        0
    );

    ctx.fillStyle =
        "rgb(0,0,0)";

    ctx.fillRect(
        0,
        0,
        sizeLed.width,
        sizeLed.height
    );


    if (
        cacheCanvas &&
        cacheCtx
    ) {

        cacheCtx.setTransform(
            1,
            0,
            0,
            1,
            0,
            0
        );

        cacheCtx.fillStyle =
            "rgb(0,0,0)";

        cacheCtx.fillRect(
            0,
            0,
            cacheCanvas.width,
            cacheCanvas.height
        );
    }
}
