// buttons.js
// Railway LED Simulator
// 操作ボタンを作る

function createButton(text, id, onClick) {
    const button = document.createElement("button");

    button.type = "button";
    button.textContent = text;
    button.dataset.id = id;

    button.addEventListener("click", () => {

        const parent = button.parentElement;

        if (parent) {
            parent.querySelectorAll("button").forEach((btn) => {
                btn.classList.remove("selected");
            });
        }

        button.classList.add("selected");

        onClick(id);
    });

    return button;
}


function createCategoryButtons(categoryId, containerId, onClick) {

    const category = getCategory(categoryId);
    const container = document.getElementById(containerId);

    if (!category || !container) {
        return;
    }

    container.innerHTML = "";


    // 通常のitems
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


    // groups形式
    if (category.groups) {

        for (const group of category.groups) {

            const groupTitle = document.createElement("h3");

            groupTitle.textContent =
                group.name ??
                group.label ??
                group.id;

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


function setupButtons() {

    setupTypeButtons();

    setupDestinationButtons();

    setupInformationButtons();

    setupInformation2Buttons();

    setupNextButtons();

    setupCarNumberButtons();
}
