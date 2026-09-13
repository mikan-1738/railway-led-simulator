// bin.js
// Railway LED Simulator
// BIN形式の3色LEDデータを読み込む

function binColor(value) {
    switch (value) {
        case 10:
            // 急行・EXP
            return {
                r: 255,
                g: 40,
                b: 60
            };

        case 7:
            // 笹塚
            return {
                r: 235,
                g: 105,
                b: 10
            };

        case 9:
            // Sasazuka
            return {
                r: 100,
                g: 190,
                b: 40
            };

        default:
            // 消灯
            return {
                r: 0,
                g: 0,
                b: 0
            };
    }
}


async function loadBin(path) {

    const response = await fetch(path);

    if (!response.ok) {
        throw new Error(
            "BINを読み込めませんでした: " + path
        );
    }

    const buffer =
        await response.arrayBuffer();

    const bytes =
        new Uint8Array(buffer);

    // 先頭2バイトをヘッダーとして除外
    const pixels =
        bytes.slice(2);

    if (pixels.length !== 128 * 32) {
        throw new Error(
            "BINサイズが128×32ではありません。"
            + "\nサイズ: "
            + pixels.length
        );
    }

    const matrix =
        Array.from(
            { length: 32 },
            () =>
                Array.from(
                    { length: 128 },
                    () => ({
                        r: 0,
                        g: 0,
                        b: 0
                    })
                )
        );

    for (let y = 0; y < 32; y++) {

        for (let x = 0; x < 128; x++) {

            const value =
                pixels[y * 128 + x];

            matrix[y][x] =
                binColor(value);
        }
    }

    return matrix;
}
