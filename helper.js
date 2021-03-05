function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function injectHelper() {
    await sleep(2000);
    myVideoHelper = null;
    i = 0;
    while (myVideoHelper == null && i < 50) {
        console.log("Try to get the video attemp ", i)
        sleep(2000)
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
                myVideoHelper.currentTime = myVideoHelper.currentTime - 30;
                break;
            case "ArrowRight":
                // Right pressed
                myVideoHelper.currentTime = myVideoHelper.currentTime + 30;
                break;
            case "ArrowUp":
                // Up pressed
                myVideoHelper.playbackRate = myVideoHelper.playbackRate + 0.1;
                console.log(myVideoHelper.playbackRate)
                document.getElementsByClassName("speedValue")[0].innerHTML = round(myVideoHelper.playbackRate, 1) + "x";
                break;
            case "ArrowDown":
                // Down pressed
                myVideoHelper.playbackRate = myVideoHelper.playbackRate - 0.1;
                console.log(myVideoHelper.playbackRate);
                document.getElementsByClassName("speedValue")[0].innerHTML = round(myVideoHelper.playbackRate, 1) + "x";

                break;

            case " ":
                playOrPauseElem = document.getElementById("playOrPause")
                if (myVideoHelper.paused) {
                    playOrPauseElem.setAttribute('title', 'Pause');
                    playOrPauseElem.setAttribute('aria-label', 'Pause');
                    playOrPauseElem.className = 'icon-player-pause';
                    myVideoHelper.play()

                } else {
                    playOrPauseElem.setAttribute('title', 'Play');
                    playOrPauseElem.setAttribute('aria-label', 'Play');
                    playOrPauseElem.className = 'icon-player-play';
                    myVideoHelper.pause()
                }
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