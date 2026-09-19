// ==========================================
// Railway LED Simulator
// render.js
// ==========================================


// ==========================================
// 種別変更時の交互表示
// ==========================================

function startAlternateDisplay() {

    if (typeof alternateTimer !== "undefined") {

        if (alternateTimer) {
            clearInterval(alternateTimer);
            alternateTimer = null;
        }

    }

    if (typeof alternateDisplay !== "undefined") {
        alternateDisplay = false;
    }

    const destination =
        getItem(
            "destination",
            destinationId
        );

    if (!destination?.alternate) {
        render();
        return;
    }

    alternateTimer = setInterval(() => {

        alternateDisplay =
            !alternateDisplay;

        render();

    }, destination.alternate.duration ?? 3000);
}


// ==========================================
// メイン描画
// ==========================================

function render() {

    if (!config) {
        return;
    }

    if (!sizeLed) {
        return;
    }


    // ======================================
    // Canvasサイズをconfigに合わせる
    // ======================================

    if (
        typeof config.ledWidth === "number" &&
        typeof config.ledHeight === "number"
    ) {

        const currentWidth =
            config.ledWidth * pitch;

        const currentHeight =
            config.ledHeight * pitch;

        if (
            sizeLed.width !== currentWidth
        ) {
            sizeLed.width =
                currentWidth;
        }

        if (
            sizeLed.height !== currentHeight
        ) {
            sizeLed.height =
                currentHeight;
        }

        if (typeof cacheCanvas !== "undefined") {

            cacheCanvas.width =
                sizeLed.width;

            cacheCanvas.height =
                sizeLed.height;
        }
    }


    // ======================================
    // 何も選択されていない場合
    // ======================================

    if (
        typeId == null &&
        destinationId == null &&
        nextId == null &&
        informationId == null &&
        information2Id == null &&
        lineId == null &&
        carNumberId == null
    ) {

        const emptyMatrix =
            createEmptyMatrix();

        drawMatrix(
            emptyMatrix,
            cacheCtx
        );

        drawCacheToCanvas();

        return;
    }


    // ======================================
    // 空のLEDマトリクスを作る
    // ======================================

    const matrix =
        createEmptyMatrix();


    // ======================================
    // JSONデータ取得
    // ======================================

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


    // ======================================
    // 表示モード
    // ======================================

    const mode =
        informationMode || "destination";


    // ======================================
    // 種別
    // ======================================

    if (type) {

        const position =
            config.destinationPosition ??
            "normal";

        if (position === "next") {

            if (
                typeof isTypeFullScreen ===
                "function" &&
                isTypeFullScreen(type)
            ) {

                drawType(
                    type,
                    matrix
                );

            } else {

                if (
                    typeof drawTypeSmall ===
                    "function"
                ) {

                    drawTypeSmall(
                        type,
                        matrix
                    );

                }

            }

        } else {

            if (
                typeof drawType ===
                "function"
            ) {

                drawType(
                    type,
                    matrix
                );

            }

        }
    }


    // ======================================
    // 種別が全面表示の場合
    // ======================================

    let fullType = false;

    if (
        typeof isTypeFullScreen ===
        "function"
    ) {

        fullType =
            isTypeFullScreen(type);
    }


    if (!fullType) {


        // ==================================
        // 行先
        // ==================================

        if (
            mode === "destination" &&
            destinationId != null
        ) {

            if (showNext) {

                if (
                    typeof drawDestinationSmall ===
                    "function"
                ) {

                    drawDestinationSmall(
                        destination,
                        matrix
                    );

                }

            } else {

                if (
                    typeof drawDestination ===
                    "function"
                ) {

                    drawDestination(
                        destination,
                        matrix
                    );

                }
            }
        }


        // ==================================
        // 行先＋次駅
        // ==================================

        if (
            mode === "destination_next" &&
            destinationId != null
        ) {

            if (
                typeof drawDestination ===
                "function"
            ) {

                drawDestination(
                    destination,
                    matrix
                );

            }
        }


        // ==================================
        // 情報
        // ==================================

        if (
            mode === "information" &&
            informationId != null
        ) {

            if (
                information?.view?.small &&
                typeof drawInformationSmall ===
                "function"
            ) {

                drawInformationSmall(
                    information,
                    matrix
                );

            } else {

                if (
                    typeof drawInformation ===
                    "function"
                ) {

                    drawInformation(
                        information,
                        matrix
                    );

                }
            }
        }


        // ==================================
        // 情報2
        // ==================================

        if (
            mode === "information2" &&
            information2Id != null
        ) {

            if (
                typeof drawInformation2 ===
                "function"
            ) {

                drawInformation2(
                    information2,
                    matrix
                );

            }
        }


        // ==================================
        // 情報＋次駅
        // ==================================

        if (
            mode === "information_next"
        ) {

            if (
                destinationId != null &&
                typeof drawDestinationSmall ===
                "function"
            ) {

                drawDestinationSmall(
                    destination,
                    matrix
                );

            }

            if (
                informationId != null &&
                typeof drawInformation ===
                "function"
            ) {

                drawInformation(
                    information,
                    matrix
                );

            }
        }


        // ==================================
        // 車号
        // ==================================

        if (
            mode === "carNumber" &&
            carNumberId != null
        ) {

            if (
                typeof drawCarNumber ===
                "function"
            ) {

                drawCarNumber(
                    carNumber,
                    matrix
                );

            }
        }


        // ==================================
        // 車号＋行先
        // ==================================

        if (
            mode === "carNumber_destination" &&
            carNumberId != null
        ) {

            if (
                typeof drawCarNumber ===
                "function"
            ) {

                drawCarNumber(
                    carNumber,
                    matrix
                );

            }
        }


        // ==================================
        // 次駅
        // ==================================

        if (
            showNext &&
            nextId != null &&
            next
        ) {

            if (
                mode === "destination" ||
                mode === "information"
            ) {

                if (
                    typeof drawNext ===
                    "function"
                ) {

                    drawNext(
                        next,
                        matrix
                    );

                }
            }
        }


        // ==================================
        // 車号＋小型行先など
        // ==================================

        if (
            mode === "carNumber_destination" &&
            destinationId != null
        ) {

            if (
                typeof drawDestinationSmall ===
                "function"
            ) {

                drawDestinationSmall(
                    destination,
                    matrix
                );

            }
        }
    }


    // ======================================
    // 車号小型表示
    // ======================================

    if (
        config.hasCarNumberSmall &&
        carNumber
    ) {

        if (
            typeof drawCarNumber ===
            "function"
        ) {

            drawCarNumber(
                carNumber,
                matrix
            );

        }
    }


    // ======================================
    // LEDマトリクスを描画
    // ======================================

    drawMatrix(
        matrix,
        cacheCtx
    );


    // ======================================
    // キャッシュCanvas → 本物のCanvas
    // ======================================

    drawCacheToCanvas();
}


// ==========================================
// 空のLEDマトリクス作成
// ==========================================

function createEmptyMatrix() {

    const width =
        Number(config?.ledWidth) || 0;

    const height =
        Number(config?.ledHeight) || 0;

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


// ==========================================
// LEDマトリクス描画
// ==========================================

function drawMatrix(
    matrix,
    targetCtx = ctx
) {

    if (!config) {
        return;
    }

    if (!targetCtx) {
        return;
    }


    const width =
        Number(config.ledWidth) || 0;

    const height =
        Number(config.ledHeight) || 0;


    // ======================================
    // 背景
    // ======================================

    targetCtx.setTransform(
        1,
        0,
        0,
        1,
        0,
        0
    );

    targetCtx.globalAlpha = 1;

    targetCtx.fillStyle =
        "rgb(0,0,0)";

    targetCtx.fillRect(
        0,
        0,
        sizeLed.width,
        sizeLed.height
    );


    // ======================================
    // LEDを1個ずつ描画
    // ======================================

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

            drawLED(
                targetCtx,
                x,
                y,
                pixel
            );
        }
    }
}


// ==========================================
// LED 1個を描画
// ==========================================

function drawLED(
    targetCtx,
    x,
    y,
    color
) {

    if (!targetCtx) {
        return;
    }

    const r =
        Number(color?.r) || 0;

    const g =
        Number(color?.g) || 0;

    const b =
        Number(color?.b) || 0;


    targetCtx.fillStyle =
        `rgb(${r},${g},${b})`;


    const ledShape =
        config?.ledShape ?? "circle";


    if (ledShape === "rectangle") {

        targetCtx.fillRect(
            x * pitch,
            y * (
                ledsize * 0.9 +
                ledgap
            ),
            ledsize,
            ledsize
        );

        return;
    }


    // ======================================
    // 円形LED
    // ======================================

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


// ==========================================
// Canvasキャッシュを本体へ表示
// ==========================================

function drawCacheToCanvas() {

    if (!sizeLed) {
        return;
    }

    if (
        typeof cacheCanvas ===
        "undefined"
    ) {
        return;
    }

    if (!cacheCanvas) {
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

    ctx.globalAlpha = 1;


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


// ==========================================
// RGB画像データをLEDマトリクスへ配置
// ==========================================

function drawImage(
    displayData,
    startX,
    startY,
    matrix
) {

    if (!displayData) {
        return;
    }

    if (!matrix) {
        return;
    }


    const data =
        displayData.data ?? [];

    let index = 0;


    for (
        let y = 0;
        y < displayData.height;
        y++
    ) {

        for (
            let x = 0;
            x < displayData.width;
            x++
        ) {

            const targetY =
                startY + y;

            const targetX =
                startX + x;


            if (
                matrix[targetY] &&
                matrix[targetY][targetX]
            ) {

                matrix[targetY][targetX] = {
                    r: data[index] ?? 0,
                    g: data[index + 1] ?? 0,
                    b: data[index + 2] ?? 0
                };
            }


            index += 3;
        }
    }
}


// ==========================================
// Canvasを黒にする
// ==========================================

function clearMatrix() {

    if (!ctx || !sizeLed) {
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

    ctx.globalAlpha = 1;


    ctx.fillStyle =
        "rgb(0,0,0)";


    ctx.fillRect(
        0,
        0,
        sizeLed.width,
        sizeLed.height
    );


    if (
        typeof cacheCanvas !==
        "undefined" &&
        cacheCanvas
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
