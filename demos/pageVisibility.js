// variable to record if video has been paused
// video is set to autoplay so initially is not paused
sessionStorage.isPaused = "false";

// set name of hidden property and visibility change event
var hidden, visibilityChange;
if (typeof document.hidden !== "undefined") {
    hidden = "hidden";
    visibilityChange = "visibilitychange";
} else if (typeof document.mozHidden !== "undefined") {
    hidden = "mozHidden";
    visibilityChange = "mozvisibilitychange";
} else if (typeof document.msHidden !== "undefined") {
    hidden = "msHidden";
    visibilityChange = "msvisibilitychange";
} else if (typeof document.webkitHidden !== "undefined") {
    hidden = "webkitHidden";
    visibilityChange = "webkitvisibilitychange";
}

var videoElement = document.getElementById("videoElement");

// if the page is hidden, pause the video
// if the page is shown, play the video
function handleVisibilityChange() {
    if (document[hidden]) {
        videoElement.pause();
    } else if (sessionStorage.isPaused !== "true") {
        videoElement.play();
    }
}

// warn if the browser doesn't support addEventListener or the Page Visibility API
if (typeof document.addEventListener === "undefined" ||
    typeof hidden === "undefined") {
    alert("This demo requires a browser such as Google Chrome that supports the Page Visibility API.");
} else {

    // handle page visibility change
    // see https://developer.mozilla.org/en/API/PageVisibility/Page_Visibility_API
    document.addEventListener(visibilityChange, handleVisibilityChange, false);

    // revert to existing favicon for site when the page is closed
    // otherwise the favicon will remain as paused.png
    window.addEventListener("unload", function(){
        favicon.change("/favicon.ico");
    }, false);

    // when the video pauses, set the favicon
    videoElement.addEventListener("pause", function(){
        favicon.change("images/paused.png");
        if (!document[hidden]) {
            // if not pausing because document is now hidden, then set isPaused to true
            sessionStorage.isPaused = "true";
        }
    }, false);

    // when the video plays, set the isPaused state and the favicon
    videoElement.addEventListener("play", function(){
        sessionStorage.isPaused = "false";
        favicon.change("images/playing.png");
    }, false);

    // set the document (tab) title from the current video time
    videoElement.addEventListener("timeupdate", function(){
        document.title = Math.floor(videoElement.currentTime) + " second(s)";
    }, false);
}