async function startVehicle() {

    clearInterval(scrollTimer);
    scrollTimer = null;

    clickStartScrollBtn = false;
    scrollId = null;

    showLoading();

    try { 
        await loadLed();

        ledsize = config.ledSize;
        ledgap = config.ledGap;
        pitch = ledsize + ledgap;
        pitchY = ledsize * 0.9 + ledgap;
        radius = ledsize / 2;
        sizeLed.width = config.ledWidth * pitch;
        if (config.ledShape === "circle") {
            sizeLed.height = config.ledHeight * pitch;
        }
        if (config.ledShape === "rectangle") {
            sizeLed.height = config.ledHeight * pitchY;
        }
        cacheCanvas.width = sizeLed.width;
        cacheCanvas.height = sizeLed.height;

        resizeLed();

        setupVehicleUI();

        startRenderLoop();
    } finally {
        hideLoading();
    }
}
function resizeLed() {
    if (!config) return;
    const main = document.querySelector("main");

    const maxWidth = main.clientWidth - 40;
    const canvasWidth = sizeLed.width;
    const scale = Math.min(1, maxWidth / canvasWidth);

    sizeLed.style.width = sizeLed.width * scale + "px";
    sizeLed.style.height = sizeLed.height * scale + "px";
}
async function loadConfig() {
    const response = await fetch(selectedVehicle.config);
    config = await response.json();
}
async function loadLed() {

    // config.json
    let response = await fetch(selectedVehicle.config);
    config = await response.json();

    // led.json
    response = await fetch(selectedVehicle.led);
    jsonData = await response.json();

    response = await fetch(selectedVehicle.site);
    siteData = await response.json();

    if (!jsonData?.categories) {
        console.error("JSONが壊れてる");
        return;
    }
}
async function loadFont() {
    const response = await fetch(selectedVehicle.font);
    fontData = await response.json();
}

function setupVehicleUI() {

    if (config.hasType) {
        document.getElementById("typeGroup").hidden = false;
        createTypeButtons();
    } else {
        document.getElementById("typeGroup").hidden = true;
    }
    if (config.hasDestination) {
        document.getElementById("destinationGroup").hidden = false;
        createDestinationButtons();
    } else {
        document.getElementById("destinationGroup").hidden = true;
    }
    if (config.hasInformation) {
        document.getElementById("informationGroup").hidden = false;
        createInformationButtons();
    } else {
        document.getElementById("informationGroup").hidden = true;
    }
    if (config.hasInformation2) {
        document.getElementById("information2Group").hidden = false;
        createInformation2Buttons();
    } else {
        document.getElementById("information2Group").hidden = true;
    }
    if (config.hasLine) {
        document.getElementById("lineGroup").hidden = false;
        createLineButtons();
    } else {
        document.getElementById("lineGroup").hidden = true;
    }
    if (config.hasNext) {
        document.getElementById("nextModeGroup").hidden = false;
        createNextModeButtons();
    } else {
        document.getElementById("nextModeGroup").hidden = true;
    }
    if (config.hasCarNumber) {
        document.getElementById("carNumberGroup").hidden = false;
        createCarNumberButtons();
    } else {
        document.getElementById("carNumberGroup").hidden = true;
    }
    if (config.hasScroll) {
        document.getElementById("scroll").hidden = false;
    } else {
        document.getElementById("scroll").hidden = true;
    }
    const scrollText = document.getElementById("scrollText");
    scrollText.value = config.scrollLabel;

    setVehicleSelectButton();
    resizeButtonText();

}

let renderTimer = null;

function nextScene() {

    buildSceneList();
    buildTypeSceneList();

    scene = frame % sceneList.length;
    typeScene = frame % typeSceneList.length;

    applyScene();
    applyTypeScene();

    render();

    frame++;

    renderTimer = setTimeout(nextScene, getSceneInterval());
}

function getSceneInterval() {
    if (sceneList.length === 0) return 1000;
    let sceneInterval = config.sceneInterval;
    const jaTime = Number(document.querySelector("#jaTime input").value);
    const enTime = Number(document.querySelector("#enTime input").value);
    const infoTime = Number(document.querySelector("#infoTime input").value);
    const carNumberTime = Number(document.querySelector("#carNumberTime input").value);
    if (config.setSwitchingTime) {
        const currentScene = sceneList[scene];
        if (currentScene.information === "carNumber" || currentScene.information === "carNumber_destination") {
            sceneInterval = carNumberTime * 1000;
        }
        if (currentScene.information === "information") {
            sceneInterval = infoTime * 1000;
        }
        if (currentScene.information === "destination") {
            if (currentScene.lang === "ja") {
                sceneInterval = jaTime * 1000;
            }
            if (currentScene.lang === "en") {
                sceneInterval = enTime * 1000;
            }
        }
    } else {
        sceneInterval = config.sceneInterval;
    }
    return sceneInterval;
}

function startRenderLoop() {
    if (renderTimer !== null) {
        clearTimeout(renderTimer);
    }

    nextScene();
}

function buildSceneList() {

    sceneList = [];
    const type = getItem("type", typeId);

    if (informationId != null) {
        if (config.informationPosition === "next") {
            if (config.informationAhead) {
                sceneList.push({
                    lang: "ja",
                    information: "information_next",
                    next: false
                });
            }
        }
    }

    if(nextId != null) {
        sceneList.push({
            lang: "ja",
            information: "destination",
            next: true,
        });
    } else {
        if (!config.informationAhead) {
            if (destinationId != null) {
                if (config.destinationPosition === "normal") {
                    sceneList.push({
                        lang: "ja",
                        information: "destination",
                        next: false,
                    });
                }
                if (config.destinationPosition === "next") {
                    sceneList.push({
                        lang: "ja",
                        information: "destination_next",
                        next: false,
                    });
                }
            } else {
                sceneList.push({
                    lang: "ja",
                    information: "destination",
                    next: false,
                });
            }
        } else {
            if (informationId === null) {
                sceneList.push({
                    lang: "ja",
                    information: "destination",
                    next: false,
                });
            }
        }
    }

    if (informationId != null) {
        if (config.informationAhead) {
            if (hasEnglishInformation()) {
                sceneList.push({
                    lang: "en",
                    information: "information_next",
                    next: false
                });
            }
        }
    }

    if (config.languageSwitching) {
        if (hasEnglishType()) {
            if (nextId != null) {
                sceneList.push({
                    lang: "en",
                    information: "destination",
                    next: true
                });
            } else {
                if (!config.destinationLanguageSwitching) {
                    if (informationId === null) {
                        sceneList.push({
                            lang: "en",
                            information: "destination",
                            next: false
                        });
                    } else {
                        sceneList.push({
                            lang: "en",
                            information: "information",
                            next: false
                        });
                    }
                } else {
                    sceneList.push({
                        lang: "en",
                        information: "destination",
                        next: false
                    });
                }
            }
        }
        if (typeId === null) {
            if (nextId != null) {
                sceneList.push({
                    lang: "en",
                    information: "destination",
                    next: true
                });
            } else {
                if (destinationId != null) {
                    if (config.destinationPosition === "normal") {
                        sceneList.push({
                            lang: "en",
                            information: "destination",
                            next: false,
                        });
                    }
                    if (config.destinationPosition === "next") {
                        sceneList.push({
                            lang: "en",
                            information: "destination_next",
                            next: false,
                        });
                    }
                } else {
                    sceneList.push({
                        lang: "en",
                        information: "destination",
                        next: false,
                    });
                }
            }
        }
    } else {
        if (nextId != null || scrollId != null) {
            sceneList.push({
                lang: "en",
                information: "destination",
                next: true
            });
        }
    }

    if (config.destinationLanguageSwitching) {
        if (!config.languageSwitching) {
            if (hasEnglishDestination()) {
                if (nextId != null) {
                    sceneList.push({
                        lang: "en",
                        information: "destination",
                        next: true
                    });
                } else {
                    sceneList.push({
                        lang: "en",
                        information: "destination",
                        next: false
                    });
                }
            }
        }
    }

    if (hasInformationDestination()) {
        if (nextId != null) {
            sceneList.push({
                lang: "info",
                information: "destination",
                next: true
            });
        } else {
            sceneList.push({
                lang: "info",
                information: "destination",
                next: false
            });
        }
    }

    if (informationId != null) {
        if (config.informationPosition === "normal") {
            if (scrollId === null) {
                if (nextId != null) {
                    if (information2Id === null) {
                        sceneList.push({
                            lang: "ja",
                            information: "information",
                            next: true
                        });
                        if (config.informationLanguageSwitching) {
                            sceneList.push({
                                lang: "en",
                                information: "information",
                                next: true
                            });
                        }
                    } else {
                        if (config.hasInformationCombined) {
                            sceneList.push({
                                lang: "ja",
                                information: "information_information2",
                                next: false
                            })
                            if (config.informationLanguageSwitching) {
                                sceneList.push({
                                    lang: "en",
                                    information: "information_information2",
                                    next: false
                                });
                            }
                        } else {
                            sceneList.push({
                                lang: "ja",
                                information: "information",
                                next: true
                            });
                            if (config.informationLanguageSwitching) {
                                sceneList.push({
                                    lang: "en",
                                    information: "information",
                                    next: true
                                });
                            }
                        }
                    }
                } else {
                    if (!config.languageSwitching || config.languageSwitching && config.destinationLanguageSwitching) {
                        sceneList.push({
                            lang: "ja",
                            information: "information",
                            next: false
                        });
                        if (config.informationLanguageSwitching) {
                            if (hasEnglishInformation()) {
                                sceneList.push({
                                    lang: "en",
                                    information: "information",
                                    next: false
                                });
                            }
                        }
                    }
                }
            } else {
                const info = getItem ("information", informationId);
                const hasInformationSmall1 = !!info.view.small1 || !!info.view.full_small1;
                if (!hasInformationSmall1) {
                    sceneList.push({
                        lang: "ja",
                        information: "information",
                        next: false
                    });
                } else {
                    sceneList.push({
                        lang: "ja",
                        information: "information_small1",
                        next: false
                    });
                    sceneList.push({
                        lang: "ja",
                        information: "information_small2",
                        next: false
                    });
                }
            }
        }
        if (config.informationPosition === "next") {
            if (!config.informationAhead) {
                sceneList.push({
                    lang: "ja",
                    information: "information_next",
                    next: false
                });
                if (config.informationLanguageSwitching) {
                    if (hasEnglishInformation()) {
                        sceneList.push({
                            lang: "en",
                            information: "information_next",
                            next: false
                        });
                    }
                }
            }
        }
    }

    if (information2Id != null) {
        if (nextId != null) {
            if (informationId != null) {
                if (!config.hasInformationCombined) {
                    sceneList.push({
                        lang: "ja",
                        information: "information2",
                        next: true
                    });
                }
            } else {
                sceneList.push({
                    lang: "ja",
                    information: "information2",
                    next: true
                });
            }
        } else {
            sceneList.push({
                lang: "ja",
                information: "information2",
                next: false
            });
        }
    }

    if (lineId != null) {
        if (nextId != null) {
            sceneList.push({
                lang: "ja",
                information: "line",
                next: true
            });
        } else {
            sceneList.push({
                lang: "ja",
                information: "line",
                next: false
            });
        }
    }

    if (carNumberId != null) {
        if (config.hasCarNumberFull) {
            if (nextId != null) {
                sceneList.push({
                    lang: "ja",
                    information: "carNumber",
                    next: true
                });
            } else {
                sceneList.push({
                    lang: "ja",
                    information: "carNumber",
                    next: false
                });
            }
            if (hasEnglishCarNumber()) {
                if (nextId != null) {
                    sceneList.push({
                        lang: "en",
                        information: "carNumber",
                        next: true
                    });
                } else {
                    sceneList.push({
                        lang: "en",
                        information: "carNumber",
                        next: false
                    });
                }
            }
        }
        if (!isTypeFullScreen(type)) {
            if (config.hasCarNumberNormal) {
                if (nextId != null) {
                    sceneList.push({
                        lang: "ja",
                        information: "carNumber_destination",
                        next: true
                    });
                } else {
                    sceneList.push({
                        lang: "ja",
                        information: "carNumber_destination",
                        next: false
                    });
                }
                if (hasEnglishCarNumber()) {
                    if (nextId != null) {
                        sceneList.push({
                            lang: "en",
                            information: "carNumber_destination",
                            next: true
                        });
                    } else {
                        sceneList.push({
                            lang: "en",
                            information: "carNumber_destination",
                            next: false
                        });
                    }
                }
            }
        }
    }

    if (config.next_normal) {
        if (nextId != null) {
            sceneList.push({
                lang: "ja",
                information: "destination",
                next: false
            });
            sceneList.push({
                lang: "en",
                information: "destination",
                next: false
            });
        }
    }

}

function applyScene() {
    lang = sceneList[scene].lang;
    informationMode = sceneList[scene].information;
    showNext = sceneList[scene].next;
}

let typeTimer = null;

function buildTypeSceneList() {
    typeSceneList = [];
    typeSceneList.push({
        typeInfo: null
    });
    if (hasTypeInformation()) {
        typeSceneList.push({
            typeInfo: "information"
        });
    }
}

function applyTypeScene() {
    typeMode = typeSceneList[typeScene].typeInfo;
}

function initSimulator() {

    if (renderTimer !== null) {
        clearInterval(renderTimer);
        renderTimer = null;
    }

    if (typeTimer !== null) {
        clearInterval(typeTimer);
        typeTimer = null;
    }

    if (config) {
        clearMatrix();
        drawMatrix(createEmptyMatrix());
    }

    document.getElementById("typeButtons").innerHTML = "";
    document.getElementById("destinationButtons").innerHTML = "";
    document.getElementById("informationButtons").innerHTML = "";
    document.getElementById("information2Buttons").innerHTML = "";
    document.getElementById("lineButtons").innerHTML = "";
    document.getElementById("nextModeButtons").
