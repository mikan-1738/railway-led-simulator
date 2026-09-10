// buttons.js
// LEDシミュレーターの操作ボタンを作る

function createButton(text, id, onClick) {
    const button = document.createElement("button");

    button.type = "button";
    button.textContent = text;
    button.dataset.id = id;

    button.addEventListener("click", () => {
        onClick(id);
    });

    return button;
}


// カテゴリからボタンを作る
function createCategoryButtons(categoryId, containerId, onClick) {
    const category = getCategory(categoryId);
    const container = document.getElementById(containerId);

    if (!category || !container) {
        return;
    }

    container.innerHTML = "";

    // 通常の items
    if (category.items) {
        for (const item of category.items) {
            const button = createButton(
                item.name ?? item.label ?? item.id,
                item.id,
                onClick
            );

            container.appendChild(button);
        }
    }

    // groups を持つカテゴリ
    if (category.groups) {
        for (const group of category.groups) {

            const groupTitle = document.createElement("h3");
            groupTitle.textContent =
                group.name ?? group.label ?? group.id;

            container.appendChild(groupTitle);

            for (const item of group.items ?? []) {
                const button = createButton(
                    item.name ?? item.label ?? item.id,
                    item.id,
                    onClick
                );

                container.appendChild(button);
            }
        }
    }
}


// 種別ボタン
function setupTypeButtons() {
    createCategoryButtons(
        "type",
        "typeGroup",
        (id) => {
            selectedType = id;
            render();
        }
    );
}


// 行先ボタン
function setupDestinationButtons() {
    createCategoryButtons(
        "destination",
        "destinationGroup",
        (id) => {
            selectedDestination = id;
            render();
        }
    );
}


// 情報表示ボタン
function setupInformationButtons() {
    createCategoryButtons(
        "information",
        "informationGroup",
        (id) => {
            selectedInformation = id;
            render();
        }
    );
}


// 第2情報表示ボタン
function setupInformation2Buttons() {
    createCategoryButtons(
        "information2",
        "information2Group",
        (id) => {
            selectedInformation2 = id;
            render();
        }
    );
}


// 次駅ボタン
function setupNextButtons() {
    createCategoryButtons(
        "next",
        "nextGroup",
        (id) => {
            selectedNext = id;
            render();
        }
    );
}


// 車号ボタン
function setupCarNumberButtons() {
    createCategoryButtons(
        "carNumber",
        "carNumberGroup",
        (id) => {
            selectedCarNumber = id;
            render();
        }
    );
}


// 全ボタンをセットアップ
function setupButtons() {
    setupTypeButtons();
    setupDestinationButtons();
    setupInformationButtons();
    setupInformation2Buttons();
    setupNextButtons();
    setupCarNumberButtons();
}
