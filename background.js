let started = false;
let startTime;
let timePassed = 0;
let tabTime;
let blockedTab;
let health = 50;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request == 'PRESS_STOPWATCH') {
        if (started) {
            started = false;
            timePassed = 0;
            console.log("here")

        } else {
            started = true;
            startTime = new Date();
            tabTime = startTime;
            blockedTab = true;
            updateHealthContinuously();
        }
    } else if (request.message == 'GET_TIME_PASSED') {
        if (started) {
            let currentTime = new Date();
            timePassed = (currentTime.getTime() - startTime.getTime()) / 1000;
        }
        sendResponse({value: Math.round(timePassed)});
        
    } else if (request.message == 'GET_HEALTH') {
        sendResponse({value: health});
    }
})

chrome.tabs.onActivated.addListener(function(activeInfo) {
    tabTime = new Date();
    chrome.tabs.get(activeInfo.tabId, function(tab) {
        console.log(tab.url);
    })
});

function updateHealthContinuously() {
    console.log("started? ", started)
    const healthUpdater = setInterval(() => {
        updateHealth()
        if (!started) {
            clearInterval(healthUpdater)
        }
    }, 1000)
}

function updateHealth() {
    let currentTime = new Date();
    if (timeDifference(currentTime, tabTime) >= 5) {
        if (blockedTab) {
            decreaseHealth();
        } else {
            increaseHealth();
        }
        tabTime = currentTime;
    }
}

function increaseHealth() {
    if (health <= 95) {
        health += 5;
    } else if (health >= 100) {
        health = 50;
    }
}

function decreaseHealth() {
    if (health >= 5) {
        health -= 5;
    }
}

function timeDifference(time1, time2) {
    return (time1.getTime() - time2.getTime()) / 1000;
}
