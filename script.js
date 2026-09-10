// script.js
// Railway LED Simulator
// アプリ全体の初期化を担当する

async function init() {
    try {
        // 車両一覧を読み込む
        await setupVehicles();

        console.log("Railway LED Simulator 起動完了");

    } catch (error) {
        console.error(error);

        alert(
            "シミュレーターの初期化に失敗しました。\n" +
            error.message
        );
    }
}


// ページ読み込み完了後に起動
document.addEventListener(
    "DOMContentLoaded",
    init
);
