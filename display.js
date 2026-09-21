// ==========================================
// Railway LED Simulator
// display.js
// 都営10-300形 1・2次車 実車表示パターン対応
// ==========================================

const LED_COLOR = {
    orange: { r: 255, g: 105, b: 0 },
    red:    { r: 255, g: 40,  b: 60 },
    green:  { r: 100, g: 190, b: 40 }
};

const TOEI_3COLOR_LAYOUT = {
    typeX: 0,
    typeWidth: 40,
    destinationX: 40,
    destinationWidth: 88
};

// ==========================================
// 実車表示パターン
//
// 東京都交通局
// 「新宿線 10-300形車両 1,2次車
//  前面・側面・運行番号表示器表示一覧」
// の表示写真を128×32 LEDへ変換したもの。
// 2bit/LED:
//   0 = 消灯
//   1 = 橙
//   2 = 緑
//   3 = 赤
// ==========================================

const TOEI_3COLOR_PATTERNS = {
    "local:sasazuka":"AAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFQAAABUAVAFQAAAUAAAAAAAAAAAAAAAAAVVVVUAAAAAFAAAAFQBUAFAAAFQAFQAAAAAAAAAAAAUFVVVVUAAAABVVVAAVQVUBUAAAVQBVQAAAAAAAAAAABQVAAAVQAAAAVVVUABVVVVVQAAFVVVVVVAAAAAAAAAAFVUAABVAAAAFVAVQAVVVVVVAAAVVVVVVUAAAAAAAAABVUBVVVQAAABVQBUABVVVVVUAAFVVVVVQAAAAAAAAAAVVQFVVQAAAAVVQVAAVVVVVVQAAVVVVVUAAAAAAAAAABVQAFUAAAAABQFVQABVVVVVVAABQFVQEQAAAAAAAAAABVAAVQAAAAAAAVVAAVVFVVVUAAAAABAFAAAAAAAAAAABQAFVAAAAAAABVUAAVVVVVVQAAAEAEAUAAAAAAAAAAAFABVVVQAAAAAVBUABVVVVVVAAAFVFVFUAAAAAAAAAAAUAVVVUAAAAAVQBVVFVVVVVUAAFVVVVVVAAAAAAAAAABQBVVVAAAAAVVAFVUVVVVVVQAAVVVVVVUAAAAAAAAAAFAFVVUAAAABVVVVUAVVVVVVAAAFVFVVUAAAAAAAAAAAVAVVVQAAAAAVVVVABVAVUBUAAAFQFQVAAAAAAAAAAABVVVVVAAAAAAVAFUAFQAVABQAAAVAVVUAAAAAAAAAAAVVUFVVAAAAABQAFQAVABUAFAAABUBVVQAAAAAAAAAAFUAAVVUAAAAAFQBVABUAFQAUAAAFQFVVAAAAAAAAAAAVAAFVVQAAAAAVVVUAFQBVABQAAAVAFVQAAAAAAAAAAAAAFUFVQAAAABVVVQAVAFUAFAAABVAVVAAAAAAAAAAAAABVAVVQAAAABAAUAAQAVQAUAAAFVVVVVAAAAAAAAAAAAFAFUEAAAAAAAAAAAAAVABQAAAVVVVVVAAAAAAAAAAAAABVAAAAAAAAAAAAAAAUAFAAAAVVVVVQAAAAAAAAAAAAABQAAAAAAAAAAAAAABQAUAAAAAAAVAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFVABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAVUAAVUAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAVQAFVQAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAVVQBVVABQAAAAAAAAAgCAAAAgACAAIAAAAAAAAAABUBUFUFVQAFAAAAAAAAAAgAAAAAAAIAAAAAAAAAAAAAVVVQVVVVQBUAAAAAAAAAKgoAKggAAgACgAAAAAAAFQVVVVVVVVVUVAAAAAAACoAqigAqKgACAAKAAAAAAAA==",
    "local:shinjuku":"AAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFQAAABUAVAFQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAAABABUAFAAAAVAAAFUAAAAAAAAAAAABVAAAAAAABVVVAAVQVUBUAAAFVABVVQAAAAAAAAAAVVVVVVAAAAAVVVVABVVVVVQAAFVVRVVQAAAAAAAAAAFVVVVVVAAAABVBVQAVVVVVVAABVVVVVAAAAAAAAAAAAVVAFRVUAAAAVQBUABVVVVVUAABVVUFQAAAAAAAAAAAAVUAVFVAAAAFVQVAAVVVVVVQAABVVAVAAAAAAAAAAAAAVVVVVUAAAAAFVQABVVVVVVAAAVVVFVAAAAAAAAAAAABVVVVVAAAAAAVVAAVVFVVRUAAFVVVVVVQAAAAAAAAAAFQVVVQAAAAABVUAAVVVVVVQAAVVVVVVVQAAAAAAAAABUBVVVAAAAAAVBUABVVVVVVAAAFVUFVVUAAAAAAAAAAFQFVVUAAAAAVQBVVFVVVVVUAAAVVQFQVAAAAAAAAAABVBVVVUAAAEVVAFVUVVVVVVQAAFVVRVBUAAAAAAAAAAFUFVQVQAAARVVVVUAVVVVVVAAAVVVFUFQAAAAAAAAAAVQVAAVAAAAAVVVVABVAVUBUAAAVVUFQFAAAAAAAAAAAVBUAFUAAAABVAFUAFQAVABQAABVVAVBUAAAAAAAAAAAUFVVVQAAAAFQAFQAVABUAFAAAFVVBUFQAAAAAAAAAABQVVVVAAAAAVQBVABUAFQAUAABVVVVQVAAAAAAAAAAAFBVVVUAAAAAVVVUAFQAVABQAAVVVVVBUAAAAAAAAAAAUFQAVQAAAABVVVQAVAFUAFAABVVQVQFQAAAAAAAAAABQVABVAAAAABVVUAAQAVQAUAAFVUBVAVAAAAAAAAAAAFVVVVUAAAAAAAAAAAAAVABQAAAFQFQBUAAAAAAAAAAAVVVVVQAAAAAAAAAAAAAUAFAAAAVAEABQAAAAAAAAAAAAVVVUAAAAAAAAAAAAABQAUAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFVABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAVUABVUAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQVQAVVQAUAAAAAAAAAoAAAAAAAAAAAAAAAAAAAAAAQFVVQBVVABQAAAAAAAACgAAAAAAAIAAAAAAAAAAAAABQFUFQFVQAFAAAAAAAAAAAAAAAAgAgAAAAAAAAAAAAAVVVQVUVVQBUAAAAAAAAAAAAAAAAAqAAAAAAAAAAAFVVVVVVVVVVVVAAAAAAAAqAAKgAAAAqoAAgAAAAAAAA==",
    "local:motoyawata":"AANVwA8BVVVUBQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFVVUAFVBVQBQAAAAFQAAAAAAAABAAAAAAAABVVAAAAAVVVQAFUFVAVAAAAAVAAAAAAAAAVAAAAAUAVVVUAAAABVVVAAVVVVVUAAAABUAAAAAAAABUAAAAFUBVVVQAAAAVVVUAFVVVVVQAAAAVUAAAAAABQBQAAABVUBVVVAAAAFVAVAAVVVVVVAAVVVVVVVAAAAFAFAAAAVVUFVVUAAABVUBQABVVVVVUABVVVVVVVAAAAUAUAAABVVVVVVQAAAFVVVAAVVVVVVQAFVVVVVVQAAABQBUAAAFVVVVVVAAAAABVQABVVVVVVAAAAFVUAAAAAAFABQAAAVVVVVVUAAAAAFVAAFVVVVVUAAAAFVQAAAAABUAFAAABVVQFVUAAAAABVVAAVVVVVVQAAABVVAAAAAAFQAVAAAFVVQVVQAAAAFVAVVRVVVVVVAAAAFVVAAAAAAUABUAAAVVVVVVUAABFVUBVVBVVVVVUAAABVVUAAAAAFQABQAABVVVVVVUAAFVVVVVUFVVVVVQAAAFVVUAAAAAVAAFAAAFVVVVVVQAARVVVVUAVUFVVVAAABVVVUAAAAFQAAVAAAVVVVVVVAAAAVVVVABVAFUBUAAAVVVVQAAAAVAABUAABVVVVVVUAAAAVAFUAFQAVABQAAFVVVVQAAAFQAABQAAFVVVVVVAAAABQAFQAVABUAFAAFVVVVVUAABVAAAFQAAVVVVVVUAAAAFQFVABUAFQAUABVVVVVVUAAVQAAAFQAAVVVVVVQAAAAVVVUAFQBVABQABQAVUAFQAFVAAAAFQAAFQVVVVAAAABVVVQAVAFUAFAAAAAVAAAAAVQAAAAVQAAUAVVVUAAAABAAEAAAAFAAUAAAABUAAAABUAAAAAVAABQBVVVQAAAAAAAAAAAAEABQAAAAFQAAAAAAAAAAAAAAFAFVVVAAAAAAAAAAAAAAAFAAAAAEAAAAAAAAAAAAAAAAAEAAQAAAAAAAAAAAABQAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAVVABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAVVAFVUAFAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAVQAVVQAUAAAACIAACgAAAAAAAAAACAAAAAAAAAAAQAVVQBVVABQAAAAIiAAAAAAAgCgAACgAAAAAAAAAAAFUFVFUVVQAFAAAAAAIAAAAAACACIiACAAAIAAAAABABVVVUVVVVQBQAAAAAACAAAAAAKgqgoAqAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==",
    "local:hashimoto":"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFQAAABUAVAFQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAAAFQBUAFAABVVVUBQAAAAAAAAAAAABUAFQAAAAABVVVAAVQVUBUAAFVVVVVAAAFVVVVVQAAAVQAVQAAAAAVVVUABVVVVVQAABVVVVUAABVVVVVVQAAFVQBVAAAAAFVAVQAVVVVVVAAAFVVVVAAAFQAVQAVAABVVAFVAAAAAVQBUABVVVVVUAABVVVVUAAAUAAUAAUAAVVUBUVAAAAFVQVAAVVVVVVQABVVVVVUAABQABQABQABVVAVAUAAAAAFVQABVVVVVVABVVBVVVUAAFAAFAAFAABVUFQBUAAAAAVVAAVVFVVRUAFVUFQVVQAAUAAUAAUAAFVBVQFUAAAABVUAAVVVVVVQAAFQVBVVQABUAFUAFQAAVVVVVVQAAAAVBUABVVVVVVAABVVVFVVAAFVVVVVVAABVVUVVUAAABVQBVVFVVVVVUAFVVVVVVUAAVVVVVVUAAVVVAAAAAAAVVAFVUVVVVVVQAVVVVVVVAABVAVUAFQABVVVAAAAAABVVVVUAVVVVVVAABVVVVVAAAFQAVAAFAAFVVVVVUAAAAVVVVABVAVUBUAABUFVVQAAAUAAUAAUAAVVVVVVUAAAAVAFUAFQAVABQAAFQVVVAAABQABQABQABVVFVAVQAAABQAFQAVABUAFAAAVBVVVQAAFAAFAAFAAFVVVQAVAAAAFQBVABUAFQAUAAFQFVVVAAAUAAUAAUAAVVVVABUAAAAVVVUAFQBVABQABVAVVVUAABUAFUAFQABVVFUAFAAAABVVVQAVAFUAFAAFQBVVVAAAFVVVVVVAAFVQFUBUAAAABAAUAAQAVQAUABVAFQVVQAAVVVVVVUAAFUAVVVQAAAAAAAAAAAAVABQAVQAVAVVQABVVVVVVQAAFQBVVVAAAAAAAAAAAAAUAFAFUAAUAVUAAFAAAAAVAAAEABVQQAAAAAAAAAAAABQAUAFAAAABVAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFVABQAAAAAApAAAAAAAAAAAAAAAAAAAAAAAAAAAVQABVUAFAAAAAABUAAAAAAAAAAAAAAAAAAAAAAAAAAAVQAFVQAUAAAAAAAAAAoAACAAAAAAAAAAAAAAAAAAQAVVQBVVABQAAAAAAAAACgAAqAAAAAAAAAAAAAAAAABUBUFQFVQAFAAAAAAAAAAgAAAgAAIAAKgAAAAAAAAAAVVVQVUVVQBUAAAAAAAAACIAAAAAqgACoAAAAAAAAFQVVVVVVVVVQVAAAAAAAAAgCgCgAACqAAKAAAAAAAAA==",
    "local:takaosanguchi":"AAAAAAAAVQFUBQAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAABUAAABUAVQBQAAAABVAAAAAAAAAAAAAAVVVUQAAAAAAVVVQAFUFVAVAABVVVVVVAAAAAAAAAAAFVVVVUAAAAABVVVAAVVVVVUAAFVVVVVVAAAAAAAAAAAVVVVVUAAAAAVVVUAFVVVVVQAAVVVVVVQAAAAAAAAAABVVVVVQAAAAFVBVAAVVVVVVAAAFVVVVQAAAAAAAAAAAFVVVVVAAAABVUFQAFVVVVVUAAAFVVVUAAAAAAAAAAAAVVVVVUAAAAFBVUAAVVVVVVQAAAVVVVQAAAAAAAAAAABVVVVVAAAAAABVQABVVVVVVAAABVVVVAAAAAAAAAAAAFQVVVQAAAAAAFVAAFVVVVVUAAABVVVUAAAAAAAAAAAAUBVVVAAAAAABQVAAVVVVVVQAAAVVVVUAAAAAAAAAAABVVVVQAAAAAFUAVVQVVVVVVAAAVVVVVUAAAAAAAAAAAFRVVAAAAABFVUBVVBVVVVVUAAFVVVVUAAAAAAAAAAAUBVUAAAAAEVVVVVUFVVVVVQAAVVVVVVQAAAAAAAAAABQFVVVAAAAAFVVVUAVQFVAVAABVVVVVVAAAAAAAAAAAFVVVVUAAAAAVVFVABUAFQAUAAFVVVVQUAAAAAAAAAAAVFVUAAAAAAAVABUAFQAVABQAAVVVVVVQAAAAAAAAAABQAVQAAAAAABUAVQAVABUAFAABVVVVVVAAAAAAAAAAAFQBVVUAAAAAFVVVABUAFQAUAAFVVVVVUAAAAAAAAAAAVVVVVQAAAAAVVVUAFQBVABQAAVRVVUVQAAAAAAAAAAFVVVQAAAAAABVVVQAVAFUAFAABUAAAAVAAAAAAAAAAAVABVABAAAAAAAAAAAAAVAAUAAFQAAABUAAAAAAAAAAFQABVVVAAAAAAAAAAAAAAABQAAVAAAAVQAAAAAAAAAAUAAFVVQAAAAAAAAAAAAAAAFAAAQAAAAUAAAAAAAAAAAAAAFVUAAAAAAAAAAAAABQAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAAFVABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAVVABVUAFAAAAAAAAAAJAAAAAAAAAAAAAAAAAAAAAAAFVQAVVQAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAVVQBVVABQAAAAAAAAAAACiAAKAAAAAAAAAAAAAAAVVVUFUFVUAFAAAAAAAAAAAACIgAIgAAAAAAAAAAAFAFVVVUVVVVUBUAAAAAAAAAAACqqgqqoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==",
    "local:keio_tama_center":"AABXzAQBVVVXAAAAAABQAAAAAAAAUAAAAAAAAAAAAAAAAFVVUAFVBVQFQAAAAFAAAAAAAABQAAAAABABVAAAAAAAVVVQAFUFVAVAAAABVAAAAAAAAFAAAAAAVAVVVUAAAABVVVAAVVVVVUAFVVVVVVQAAAAAUAAAAABVBVVVUAAAAVVVUAFVVVVVQBVVVVVVVQAAAAFUAAAAABUFQAVQAAAFVAVAAVVVVVVABVVVVVVUAAFVVVVVVAAABAUAAVAAABVUBQAFVVVVVUAAVVVVVVAABVVVVVVVAAAABQABUAAAVVVUAAVVVVVVQABVVVVVQAABVVVVVVQAAEAFAAFQAABABVQABVVVVVVAAVVVVVVQAAAAAVQAAAABUAUAAVAAAAAFVAAFVVVVVUABVVVVVVAAAAABVAAAAABUBUAFUAAAABVVAAVVVVVVQAFVVQVVUAAAAAFUAAAAABAFVVVQAAAFVAVVRVVVVVVAAVVVBVVQAAAAAVQAAAAAAAVVVUAABFVUBVVBVVVVVUABVVVVVVAAAAAFVQAAAAAAFUFUAAAFVVVVVUFVVVVVQAFVVVVVUAAAAAVVAAAAAAVVAFAAAARVVVVUAVQFVVVAAVVVVVVQAAAABQUAAAAABVUAUAAAAAVVVVABUAFUBUABVVVVVVAAAAAFBQAAAAAVVQBUAAAAAVAFUAFQAVABQAFVVVVVUAAAABQBQAAAABVVAFQAAAABQAFQAVABUAFAAVVVVVVQAAAAVAFAAAAAVVUAVQAAAAFQFVABUAFQAUABVVVVVVAAAAFQAFAAAAFVVAAVAAAAAVVVUAFQBVABQAFUBVQFUAAABVAAVAAAAVVUABVAAAABVVVQAVAFUAFAAVABUAFQAAAVQAAVQAAFVVAABVAAAABAAAAAQAFAAUABUAFQAVAAAVUAAAVUAAVVUAABVAAAAAAAAAAAAEABQAFQAVAFUAAFVAAAAVUABVVAAABUAAAAAAAAAAAAAAFAAEAAQAFAAAFAAAAAFAAAAAAAAAAAAAAAAAAAAABQAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFVABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAVVABVUAFAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAVQAVVQAUAAAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAQAVVQFVVABQAAAAAAAACiIAAAAAACgAoAAAgAAAAAABUFVFAFVQAFAAAAAAAAACIiAAAAAAAACoAACAAAAAAAVVVUVVVVQBUAAAAAqAAiqgCqAAAiooAqgAAqAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==",
const TOEI_PATTERN_CACHE = {};

function getToeiPatternKey(type, destination) {
    if (!type || !destination) return null;

    const key = type.id + ":" + destination.id;

    return Object.prototype.hasOwnProperty.call(
        TOEI_3COLOR_PATTERNS,
        key
    ) ? key : null;
}

function decodeToeiPattern(key) {
    if (!key) return null;

    if (TOEI_PATTERN_CACHE[key]) {
        return TOEI_PATTERN_CACHE[key];
    }

    const encoded = TOEI_3COLOR_PATTERNS[key];

    if (!encoded) return null;

    const bytes = atob(encoded);
    const matrix = [];

    let valueIndex = 0;

    for (let y = 0; y < 32; y++) {
        const row = [];

        for (let x = 0; x < 128; x++) {
            const byte =
                bytes[Math.floor(valueIndex / 4)].charCodeAt(0);

            const shift =
                6 - (valueIndex % 4) * 2;

            const code =
                (byte >> shift) & 3;

            let color;

            switch (code) {
                case 1:
                    color = LED_COLOR.orange;
                    break;

                case 2:
                    color = LED_COLOR.green;
                    break;

                case 3:
                    color = LED_COLOR.red;
                    break;

                default:
                    color = { r: 0, g: 0, b: 0 };
                    break;
            }

            row.push({
                r: color.r,
                g: color.g,
                b: color.b
            });

            valueIndex++;
        }

        matrix.push(row);
    }

    TOEI_PATTERN_CACHE[key] = matrix;

    return matrix;
}

function drawToeiCombinedPattern(type, destination, matrix) {
    const key =
        getToeiPatternKey(type, destination);

    if (!key) return false;

    const pattern =
        decodeToeiPattern(key);

    if (!pattern) return false;

    for (let y = 0; y < 32; y++) {
        for (let x = 0; x < 128; x++) {
            matrix[y][x] = pattern[y][x];
        }
    }

    return true;
}

// ==========================================
// JSON表示データ
// ==========================================

function getDisplayData(item, view = "normal") {
    if (!item) return null;

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
                return LED_COLOR.green;

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
    if (!type) return;

    const destination =
        getItem("destination", destinationId);

    if (getToeiPatternKey(type, destination)) {
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
    drawType(type, matrix);
}

// ==========================================
// 行先
// ==========================================

function drawDestination(destination, matrix) {
    if (!destination) return;

    const type =
        getItem("type", typeId);

    if (drawToeiCombinedPattern(
        type,
        destination,
        matrix
    )) {
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

// ==========================================
// 情報表示
// ==========================================

function drawInformation(information, matrix) {
    if (!information) return;

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
            getItemColor(information, "information")
        );
    }
}

function drawInformation2(information, matrix) {
    if (!information) return;

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
            getItemColor(information, "information")
        );
    }
}

// ==========================================
// 次駅
// ==========================================

function drawNext(next, matrix) {
    if (!next) return;

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
            getItemColor(next, "next")
        );
    }
}

// ==========================================
// 車両番号
// ==========================================

function drawCarNumber(carNumber, matrix) {
    if (!carNumber) return;

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
            getItemColor(carNumber, "carNumber")
        );
    }
}

// ==========================================
// 文字描画
// ==========================================

function drawTextToMatrix(
    text,
    matrix,
    x,
    y,
    width,
    height,
    color
) {
    if (!text) return;

    const canvas =
        document.createElement("canvas");

    canvas.width = width;
    canvas.height = height;

    const ctx =
        canvas.getContext("2d");

    ctx.clearRect(
        0,
        0,
        width,
        height
    );

    ctx.fillStyle = "rgb(" +
        color.r + "," +
        color.g + "," +
        color.b + ")";

    ctx.font =
        Math.max(
            8,
            Math.floor(height * 0.75)
        ) + "px sans-serif";

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillText(
        text,
        width / 2,
        height / 2
    );

    const image =
        ctx.getImageData(
            0,
            0,
            width,
            height
        );

    for (let yy = 0; yy < height; yy++) {
        if (!matrix[yy + y]) continue;

        for (let xx = 0; xx < width; xx++) {
            if (!matrix[yy + y][xx + x]) continue;

            const index =
                (yy * width + xx) * 4;

            const alpha =
                image.data[index + 3];

            if (alpha > 80) {
                matrix[yy + y][xx + x] = {
                    r: color.r,
                    g: color.g,
                    b: color.b
                };
            }
        }
    }
}

// ==========================================
// 画像描画
// ==========================================

function drawImage(
    src,
    x,
    y,
    matrix
) {
    if (!src) return;

    const image =
        new Image();

    image.onload = () => {
        const canvas =
            document.createElement("canvas");

        canvas.width =
