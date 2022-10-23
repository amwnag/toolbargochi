let started = false;
let startTime;
let timePassed = 0;
let tabTime;
let blockedTab;
let health = 50;

let blockedWebsites = ["https://www.youtube.com/", "https://www.reddit.com/", "https://twitter.com/", "https://www.instagram.com/"];

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request == 'PRESS_STOPWATCH') {
        if (started) {
            started = false;
            timePassed = 0;
        } else {
            started = true;
            startTime = new Date();
            tabTime = startTime;
            updateHealthContinuously();
            blockedTab = false;
        }
    } else if (request.message == 'GET_START_STOP') {
        sendResponse({started: started});
    } else if (request.message == 'GET_TIME_PASSED') {
        if (started) {
            let currentTime = new Date();
            timePassed = (currentTime.getTime() - startTime.getTime()) / 1000;
        }
        sendResponse({value: Math.round(timePassed)});
        
    } else if (request.message == 'GET_HEALTH') {
        sendResponse({value: health});
    } else if (request.message == 'GET_BUDDY_STATE') {
        let state = health / 33.4; // gets a number between 0-3
        sendResponse({state: state})
    }
})

// async function getCurrentTab() {
//         let queryOptions = { active: true, lastFocusedWindow: true };
//         // `tab` will either be a `tabs.Tab` instance or `undefined`.
//         let [tab] = await chrome.tabs.query(queryOptions);
//         return tab;
// }

chrome.tabs.onActivated.addListener(function(activeInfo) {
    tabTime = new Date();
    chrome.tabs.get(activeInfo.tabId, function(tab) {
        blockedTab = checkForBlockedWebsite(tab.url);
    })
});

function checkForBlockedWebsite(tabURL) {
    for (let i = 0; i < blockedWebsites.length; i++) {
        if (tabURL.includes(blockedWebsites[i])) {
            return true;
        }
    }
    return false;
}

function updateHealthContinuously() {
    const healthUpdater = setInterval(() => {
        updateHealth()
        if (!started) {
            clearInterval(healthUpdater)
        }
    }, 1000)
}

function updateHealth() {
    let currentTime = new Date();
    if (timeDifference(currentTime, tabTime) >= 1) {
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
    } 
    // else if (health >= 100) {
    //     health = 50;
    // }
}

function decreaseHealth() {
    if (health >= 5) {
        health -= 5;
    }
}

function timeDifference(time1, time2) {
    return (time1.getTime() - time2.getTime()) / 1000;
}
