var debug = false;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function injectHelper() {
    await sleep(2000);
    myVideoHelper = null;
    i = 0;
    while (myVideoHelper == null && i < 50) {
        console.log("Try to get the video attemp ", i)
        await sleep(2000)
        myVideoHelper = document.getElementById("screen_html5_api")
        i++;
    }
    if (myVideoHelper == null) {
        console.log("Injecting failed")
        return
    }
    console.log("We get the video");
    console.log("Adding the listeners");
    document.addEventListener("keydown", function (event) {
        event.preventDefault();
        const key = event.key; // "ArrowRight", "ArrowLeft", "ArrowUp", or "ArrowDown"
        switch (key) { // change to event.key to key to use the above variable
            case "ArrowLeft":
                // Left pressed
                updateSteps("SX");
                break;
            case "ArrowRight":
                // Right pressed
                updateSteps("DX");
                break;
            case "ArrowUp":
                // Up pressed
                updateSpeed("FASTER");
                break;
            case "ArrowDown":
                // Down pressed
                updateSpeed("SLOWER");
                break;
            case " ":
                document.getElementById("playOrPause").click();
                break;
        }
    });

    console.log("Finished.")
}

// Author Saman Fekri
function round(value, precision) {
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
}

injectHelper();

if (window.location.href.includes(".webex.com")) {
    basebar = false;
    var step = 10;
    var sliderBTNw = false;

    function updateSteps(desired = "DX") {
        if (!basebar) {
            try {
                basebar = document.getElementById("baseBar");
                sliderBTNw = document.getElementsByClassName("el-slider__button-wrapper")[0];
            } catch (e) {
                console.warn("0", e);
            }
        }
        try {
            try {
                $("#screen").simulate("drag-n-drop", {dx: 1});
            } catch (e) {
                if (debug) {
                    console.warn(e);
                }
            }
            ;
            setTimeout(function () {
                const timePieces = document.getElementById("timeIndicator").innerHTML.split("&nbsp;/&nbsp;")[1].split(":");
                let maxSeconds = 1;
                if (timePieces.length === 1) {
                    maxSeconds = parseInt(timePieces[0]);
                } else if (timePieces.length === 2) {
                    maxSeconds = parseInt(timePieces[0]) * 60 + parseInt(timePieces[1]);
                } else if (timePieces.length === 3) {
                    maxSeconds = parseInt(timePieces[0]) * 3600 + parseInt(timePieces[1]) * 60 + parseInt(timePieces[2]);
                }
                const dx = basebar.getBoundingClientRect().width * (step / maxSeconds);
                setTimeout(function () {
                    $(sliderBTNw).simulate("drag-n-drop", {dx: (desired === "DX") ? dx : -dx});
                }, 20);
            }, 20)
        } catch (e) {
            console.warn("1", e);
        }
    }

    function updateSpeed(speed = "FASTER") {
        try {
            try { $("#screen").simulate("drag-n-drop", {dx: 1}); } catch (e) { if (debug) { console.warn(e); }};

            setTimeout(function () {
                try { document.getElementById("playerSetting").click();	} catch (e) {};

                setTimeout(function () {
                    try { document.getElementById("toSpeedSetting").click(); } catch (e) {};
                    setTimeout(function () {
                        const speeds = document.getElementsByClassName("icon-ng-check speed-item");
                        const disabledSpeeds = document.getElementsByClassName("icon-ng-check speed-item disabled");
                        const b = new Set(disabledSpeeds);
                        const selectedSpeed = [...speeds].filter(x => !b.has(x))[0];
                        let speedIndex = 0;

                        for (let i = 0; i < speeds.length; i++) {
                            if (speeds[i].id === selectedSpeed.id) {
                                speedIndex = i;
                            }
                        }

                        try {
                            if (speedIndex < speeds.length -1 && speed === "FASTER") {
                                speeds[speedIndex+1].click();
                            } else if (speedIndex > 0 && speed === "SLOWER") {
                                speeds[speedIndex-1].click();
                            }
                        } catch (e) {}

                        setTimeout(function () {
                            try { document.getElementById("playerSetting").click();	} catch (e) {};
                        }, 100);
                    } , 60);
                } , 60);
            }, 20)
        } catch (e) {}
    }
}