// buttons.js
// Railway LED Simulator
// 操作ボタンを作る


/* =========================
   共通ボタン作成
========================= */

function createButton(text, id, onClick) {

    const button =
        document.createElement("button");

    button.type = "button";
    button.textContent = text;
    button.dataset.id = id;

    button.addEventListener(
        "click",
        () => {
            onClick(id);
        }
    );

    return button;
}


/* =========================
   カテゴリからボタンを作成
========================= */

function createCategoryButtons(
    categoryId,
    containerId,
    onClick
) {

    const category =
        getCategory(categoryId);

    const container =
        document.getElementById(containerId);


    if (!category || !container) {
        return;
    }


    container.innerHTML = "";


    /* =========================
       items形式
    ========================= */

    if (category.items) {

        for (const item of category.items) {

            const button =
                createButton(
                    item.name ??
                    item.label ??
                    item.id,
                    item.id,
                    onClick
                );

            container.appendChild(button);
        }
    }


    /* =========================
       groups形式
    ========================= */

    if (category.groups) {

        for (const group of category.groups) {

            const groupTitle =
                document.createElement("h3");

            groupTitle.textContent =
                group.name ??
                group.label ??
                group.id;

            container.appendChild(groupTitle);


            for (
                const item of group.items ?? []
            ) {

                const button =
                    createButton(
                        item.name ??
                        item.label ??
                        item.id,
                        item.id,
                        onClick
                    );

                container.appendChild(button);
            }
        }
    }
}


/* =========================
   種別
========================= */

function setupTypeButtons() {

    createCategoryButtons(
        "type",
        "typeGroup",

        (id) => {

            typeId = id;

            startAlternateDisplay();
        }
    );
}


/* =========================
   行先
========================= */

function setupDestinationButtons() {

    createCategoryButtons(
        "destination",
        "destinationGroup",

        (id) => {

            destinationId = id;

            render();
        }
    );
}


/* =========================
   情報表示
========================= */

function setupInformationButtons() {

    createCategoryButtons(
        "information",
        "informationGroup",

        (id) => {

            informationId = id;

            render();
        }
    );
}


/* =========================
   第2情報表示
========================= */

function setupInformation2Buttons() {

    createCategoryButtons(
        "information2",
        "information2Group",

        (id) => {

            information2Id = id;

            render();
        }
    );
}


/* =========================
   次駅
========================= */

function setupNextButtons() {

    createCategoryButtons(
        "next",
        "nextGroup",

        (id) => {

            nextId = id;

            render();
        }
    );
}


/* =========================
   車号
========================= */

function setupCarNumberButtons() {

    createCategoryButtons(
        "carNumber",
        "carNumberGroup",

        (id) => {

            carNumberId = id;

            render();
        }
    );
}


/* =========================
   全ボタンセットアップ
========================= */

function setupButtons() {

    setupTypeButtons();

    setupDestinationButtons();

    setupInformationButtons();

    setupInformation2Buttons();

    setupNextButtons();

    setupCarNumberButtons();
}
