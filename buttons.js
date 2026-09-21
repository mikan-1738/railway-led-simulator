function createTypeButtons() {

    const container = document.getElementById("typeButtons");
    container.innerHTML = "";

    const typeCategory = getCategory("type");
    if (!typeCategory) return;

    const normalBtn = document.createElement("button");
    container.classList.remove("groupedButtons", "normalButtons");

    if (config.typeDistinction) {
        container.classList.add("groupedButtons");
    } else {
        container.classList.add("normalButtons");
    }

    normalBtn.textContent = "種別なし";
    normalBtn.addEventListener("click", () => {
        setSelected(container, normalBtn);
        typeId = null;
        const typeLabel = document.getElementById("type");
        typeLabel.textContent = "種別:なし"
        frame = 0;
        if (config.setSwitchingTime) {
            setTimeSetting();
        }
        startRenderLoop();
    });

    container.appendChild(normalBtn);

    if (config.typeDistinction) {

        typeCategory.groups.forEach(group => {

            // ===== 無表示グループ =====
            if (group.name === "無表示") {

                group.items.forEach(item => {

                    const btn = document.createElement("button");

                    const label =
                        item.view?.normal?.ja?.name ??
                        item.view?.normal?.en?.name ??
                        item.view?.full?.ja?.name ??
                        item.view?.full?.en?.name ??
                        item.name ??
                        "no-name";

                    btn.textContent = label;

                    btn.addEventListener("click", () => {
                        setSelected(container, btn);
                        typeId = item.id;
                        const typeLabel = document.getElementById("type");
                        const typeName = getName("type", typeId)
                        typeLabel.textContent = "種別:" + typeName
                        frame = 0;
                        if (config.setSwitchingTime) {
                            setTimeSetting();
                        }
                        startRenderLoop();
                    });

                    container.appendChild(btn);
                });

                return;
            }

            // ===== 路線グループ =====

            const header = document.createElement("div");
            header.className = "groupHeader";
            header.textContent = "▸ " + group.name;

            const groupContainer = document.createElement("div");
            groupContainer.className = "groupButtons";
            groupContainer.hidden = true;

            header.addEventListener("click", () => {

                groupContainer.hidden = !groupContainer.hidden;

                header.textContent =
                    (groupContainer.hidden ? "▸ " : "▾ ") + group.name;

            });

            container.appendChild(header);
            container.appendChild(groupContainer);

            group.items.forEach(item => {

                const btn = document.createElement("button");

                const label =
                    item.view?.normal?.ja?.name ??
                    item.view?.normal?.en?.name ??
                    item.view?.full?.ja?.name ??
                    item.view?.full?.en?.name ??
                    item.name ??
                    "no-name";

                btn.textContent = label;

                if (label.length > 6) {
                    btn.style.fontSize = "10px";
                }

                btn.addEventListener("click", () => {
                    setSelected(container, btn);
                    typeId = item.id;
                    const typeLabel = document.getElementById("type");
                    const typeName = getName("type", typeId)
                    typeLabel.textContent = "種別:" + typeName
                    frame = 0;
                    if (config.setSwitchingTime) {
                        setTimeSetting();
                    }
                    startRenderLoop();
                });

            groupContainer.appendChild(btn);

            });

        });
    } else {
        const container = document.getElementById("typeButtons");

        const category = getCategory("type");

        category?.items.forEach(item => {

            const btn = document.createElement("button");
            const label =
                item.view?.normal?.ja?.name ??
                item.view?.normal?.en?.name ??
                item.view?.full?.ja?.name ??
                item.view?.full?.en?.name ??
                item.name ??
                "no-name";
            btn.textContent = label;

            if (label.length > 6) {
                btn.style.fontSize = "10px";
            }

            btn.addEventListener ("click", () => {
                setSelected(container, btn);
                typeId = item.id;
                const typeLabel = document.getElementById("type");
                const typeName = getName("type", typeId)
                typeLabel.textContent = "種別:" + typeName
                frame = 0;
                if (config.setSwitchingTime) {
                    setTimeSetting();
                }
                startRenderLoop();
            });

            container.appendChild(btn);
        });
    }
}

function createCarNumberButtons() {

    const container = document.getElementById("carNumberButtons");
    container.innerHTML = "";

    const carNumberCategory = getCategory("carNumber");
    if (!carNumberCategory) return;

    const normalBtn = document.createElement("button");
    container.classList.remove("groupedButtons", "normalButtons");

    if (config.carNumberDistinction) {
        container.classList.add("groupedButtons");
    } else {
        container.classList.add("normalButtons");
    }

    normalBtn.textContent = "号車なし";

    normalBtn.addEventListener ("click", () => {
        setSelected(container, normalBtn);
        carNumberId = null;
        const carNumberLabel = document.getElementById("carNumber");
        carNumberLabel.textContent = "号車:なし"
        frame = 0;
        if (config.setSwitchingTime) {
            setTimeSetting();
        }
        startRenderLoop();
    });

    container.appendChild(normalBtn);

    if (config.carNumberDistinction) {

        carNumberCategory.groups.forEach(group => {

            // ===== 無表示グループ =====
            if (group.name === "無表示") {

                group.items.forEach(item => {

                    const btn = document.createElement("button");

                    const label =
                        item.view?.normal?.ja?.name ??
                        item.view?.normal?.en?.name ??
                        item.view?.full?.ja?.name ??
                        item.view?.full?.en?.name ??
                        item.name ??
                        "no-name";

                    btn.textContent = label;

                    btn.addEventListener("click", () => {
                        setSelected(container, btn);
                        carNumberId = item.id;
                        const carNumberLabel = document.getElementById("carNumber");
                        const carNumberName = getName("carNumber", carNumberId)
                        carNumberLabel.textContent = "号車:" + carNumberName
                        frame = 0;
                        if (config.setSwitchingTime) {
                            setTimeSetting();
                        }
                        startRenderLoop();
                    });

                    container.appendChild(btn);
                });

                return;
            }

            // ===== 路線グループ =====

            const header = document.createElement("div");
            header.className = "groupHeader";
            header.textContent = "▸ " + group.name;

            const groupContainer = document.createElement("div");
            groupContainer.className = "groupButtons";
            groupContainer.hidden = true;

            header.addEventListener("click", () => {

                groupContainer.hidden = !groupContainer.hidden;

                header.textContent =
                    (groupContainer.hidden ? "▸ " : "▾ ") + group.name;

            });

            container.appendChild(header);
            container.appendChild(groupContainer);

            group.items.forEach(item => {

                const btn = document.createElement("button");

                const label =
                    item.view?.normal?.ja?.name ??
                    item.view?.normal?.en?.name ??
                    item.view?.full?.ja?.name ??
                    item.view?.full?.en?.name ??
                    item.name ??
            "no-name";

                btn.textContent = label;

                btn.addEventListener("click", () => {
                    setSelected(container, btn);
                    carNumberId = item.id;
                    const carNumberLabel = document.getElementById("carNumber");
                    const carNumberName = getName("carNumber", carNumberId)
                    carNumberLabel.textContent = "号車:" + carNumberName
                    frame = 0;
                    if (config.setSwitchingTime) {
                        setTimeSetting();
                    }
                    startRenderLoop();
                });

            groupContainer.appendChild(btn);

            });

        });
    } else {
        const container = document.getElementById("carNumberButtons");

        const category = getCategory("carNumber");

        category?.items.forEach(item => {

            const btn = document.createElement("button");
            const label =
                item.view?.normal?.ja?.name ??
                item.view?.normal?.en?.name ??
                item.view?.full?.ja?.name ??
                item.view?.full?.en?.name ??
                item.name ??
                "no-name";
            btn.textContent = label;

            btn.addEventListener ("click", () => {
                setSelected(container, btn);
                carNumberId = item.id;
                const carNumberLabel = document.getElementById("carNumber");
                const carNumberName = getName("carNumber", carNumberId)
                carNumberLabel.textContent = "号車:" + carNumberName
                frame = 0;
                if (config.setSwitchingTime) {
                    setTimeSetting();
                }
                startRenderLoop();
            });

            container.appendChild(btn);
        });
    }
}

function createDestinationButtons() {

    const container = document.getElementById("destinationButtons");
    container.innerHTML = "";

    const destinationCategory = getCategory("destination");
    if (!destinationCategory) return;

    const normalBtn = document.createElement("button");
    container.classList.remove("groupedButtons", "normalButtons");

    if (config.destinationDistinction) {
        container.classList.add("groupedButtons");
    } else {
        container.classList.add("normalButtons");
    }

    normalBtn.textContent = "行先なし";

    normalBtn.addEventListener ("click", () => {
        setSelected(container, normalBtn);
        destinationId = null;
        const destinationLabel = document.getElementById("destination");
        destinationLabel.textContent = "行先:なし"
        frame = 0;
        if (config.setSwitchingTime) {
            setTimeSetting();
        }
        startRenderLoop();
    });

    container.appendChild(normalBtn);

    if (config.destinationDistinction) {

        destinationCategory.groups.forEach(group => {

            // ===== 無表示グループ =====
            if (group.name === "無表示") {

                group.items.forEach(dest => {

                    const btn = document.createElement("button");

                    const label =
                        dest.view?.normal?.ja?.name ??
                        dest.view?.normal?.en?.name ??
                        dest.view?.small?.ja?.name ??
                        dest.view?.small?.en?.name ??
                        dest.view?.full?.ja?.name ??
                        dest.view?.full?.en?.name ??
                        dest.name ??
                        "no-name";

                    btn.textContent = label;

                    btn.addEventListener("click", () => {
                        setSelected(container, btn);
                        destinationId = dest.id;
                        const destinationLabel = document.getElementById("destination");
                        const destinationName = getName("destination", destinationId)
                        destinationLabel.textContent = "行先:" + destinationName
                        frame = 0;
                        if (config.setSwitchingTime) {
                            setTimeSetting();
                        }
                        startRenderLoop();
                    });

                    container.appendChild(btn);
                });

                return;
            }

            // ===== 路線グループ =====

            const header = document.createElement("div");
            header.className = "groupHeader";
            header.textContent = "▸  " + group.name;

            const groupContainer = document.createElement("div");
            groupContainer.className = "groupButtons";
            groupContainer.hidden = true;

            header.addEventListener("click", () => {

                groupContainer.hidden = !groupContainer.hidden;

                header.textContent =
                    (groupContainer.hidden ? "▸  " : "▾  ") + group.name;

            });

            container.appendChild(header);
            container.appendChild(groupContainer);

            group.items.forEach(dest => {

                const btn = document.createElement("button");

                const label =
                    dest.view?.normal?.ja?.name ??
                    dest.view?.normal?.en?.name ??
                    dest.view?.small?.ja?.name ??
                    dest.view?.small?.en?.name ??
                    dest.view?.full?.ja?.name ??
                    dest.view?.full?.en?.name ??
                    dest.name ??
                    "no-name";

                btn.textContent = label;

                if (label.length > 6) {
                    btn.style.fontSize = "10px";
                }

                btn.addEventListener("click", () => {
                    setSelected(container, btn);
                    destinationId = dest.id;
                    const destinationLabel = document.getElementById("destination");
                    const destinationName = getName("destination", destinationId)
                    destinationLabel.textContent = "行先:" + destinationName
                    frame = 0;
                    if (config.setSwitchingTime) {
                        setTimeSetting();
                    }
                    startRenderLoop();
                });

            groupContainer.appendChild(btn);

            });

        });
    } else {
        const container = document.getElementById("destinationButtons");

        const category = getCategory("destination");

        category?.items.forEach(dest => {

            const btn = document.createElement("button");
            const label =
                dest.view?.normal?.ja?.name ??
                dest.view?.normal?.en?.name ??
                dest.view?.small?.ja?.name ??
                dest.view?.small?.en?.name ??
                dest.view?.full?.ja?.name ??
                dest.view?.full?.en?.name ??
                dest.name ??
                "no-name";
            btn.textContent = label;

            if (label.length > 6) {
                btn.style.fontSize = "10px";
            }

            btn.addEventListener ("click", () => { 
                setSelected(container, btn);
                destinationId = dest.id;
                const destinationLabel = document.getElementById("destination");
                const destinationName = getName("destination", destinationId)
                destinationLabel.textContent = "行先:" + destinationName
                frame = 0;
                if (config.setSwitchingTime) {
                    setTimeSetting();
                }
                startRenderLoop();
            });

            container.appendChild(btn);
        });
    }
}

function createNextModeButtons() {

    const container = document.getElementById("nextModeButtons");
    container.innerHTML = "";

    const nextModeCategory = getCategory("next");
    if (!nextModeCategory) return;

    const normalBtn = document.createElement("button");
    container.classList.remove("groupedButtons", "normalButtons");

    if (config.nextModeDistinction) {
        container.classList.add("groupedButtons");
    } else {
        container.classList.add("normalButtons");
    }

    normalBtn.textContent = "次駅なし";

    normalBtn.addEventListener ("click", () => {
        setSelected(container, normalBtn);
        displayMode = "normal";
        langIndex = 0;
        nextId = null;
        const nextModeLabel = document.getElementById("nextMode");
        nextModeLabel.textContent = "次駅:なし"
        frame = 0;
        if (config.setSwitchingTime) {
            setTimeSetting();
        }
        startRenderLoop();
    });

    container.appendChild(normalBtn);

    if (config.nextModeDistinction) {

        nextModeCategory.groups.forEach(group => {

            // ===== 無表示グループ =====
            if (group.name === "無表示") {

                group.items.forEach(item => {

                    const btn = document.createElement("button");

                    const label =
                        item.view?.normal?.ja?.name ??
                        item.view?.normal?.en?.name ??
                        item.name ??
                        "no-name";

                    btn.textContent = label;

                    btn.addEventListener("click", () => {
                        setSelected(container, btn);
                        nextId = item.id;
                        const nextModeLabel = document.getElementById("nextMode");
                        const nextModeName = getName("next", nextId)
                        nextModeLabel.textContent = "次駅:" + nextModeName
                        frame = 0;
                        if (config.setSwitchingTime) {
                            setTimeSetting();
                        }
                        startRenderLoop();
                    });

                    container.appendChild(btn);
                });

                return;
            }

            // ===== 路線グループ =====

            const header = document.createElement("div");
            header.className = "groupHeader";
            header.textContent = "▸ " + group.name;

            const groupContainer = document.createElement("div");
            groupContainer.className = "groupButtons";
            groupContainer.hidden = true;

            header.addEventListener("click", () => {

                groupContainer.hidden = !groupContainer.hidden;

                header.textContent =
                    (groupContainer.hidden ? "▸ " : "▾ ") + group.name;

            });

            container.appendChild(header);
            container.appendChild(groupContainer);

            group.items.forEach(item => {

                const btn = document.createElement("button");

                const label =
                    item.view?.normal?.ja?.name ??
                    item.view?.normal?.en?.name ??
                    item.name ??
                    "no-name";

                btn.textContent = label;

                if (label.length > 6) {
                    btn.style.fontSize = "10px";
                }

                btn.addEventListener("click", () => {
                    setSelected(container, btn);
                    displayMode = "next";
                    langIndex = 0;
    
