/*
{
    sites:[
        "origin url": {
            "chars": 11349,
            "wpm": 60
        },
        "origin url": {
            "chars": 11349,
            "wpm": 60
        }
    ],
    keys:[
        "a": 0,
        "b": 1,
        ...
    ]
}
*/

const weblist = document.getElementById("web-list");
const entries = document.getElementsByClassName("entry-btn");



const viewer = document.getElementById("viewer");

const back = document.getElementById("back");
const title = document.getElementById("title");

const leftmain = document.getElementById("left-main");
const centermain = document.getElementById("center-main");
const rightmain = document.getElementById("right-main");



const key = document.getElementById("key");
const count = document.getElementById("count");


function getSiteList() {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(["sitelist"], (result) => {
            console.log("SiteList queried");

            const sitelist = JSON.parse(result.sitelist || '{"sites": []}');

            console.log("Before");
            console.log(sitelist);

            resolve(sitelist);
        });
    });
}

function getTypeData(site) {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(site, (result) => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
            } else {
                console.log(`TabData for "${site}" queried`);

                tabdata = JSON.parse(result[site] || "{}");
                tabdata.site = site;

                console.log("Before");
                console.log(tabdata);

                resolve();
            }
        });
    });
}

var tabdata = {};

async function goTo(site) {
    console.log("Go To " + site);

    title.innerHTML = site;

    await getTypeData(site)
        .catch((error) => {
            console.error(error);
        });

    leftmain.innerHTML = tabdata.chars || 0;
    rightmain.innerHTML = (Math.round(((60000 / tabdata.avgtime) + Number.EPSILON) * 100) / 100) || 0;
    centermain.innerHTML = assignGrade(rightmain.innerHTML);

    viewer.style.transform = "translateX(0px)";
}

function assignGrade(wpm) {
    if (wpm >= 125) {
        return 'SSS+';
    } else if (wpm >= 120) {
        return 'SSS';
    } else if (wpm >= 115) {
        return 'SSS-';
    } else if (wpm >= 110) {
        return 'SS+';
    } else if (wpm >= 105) {
        return 'SS';
    } else if (wpm >= 100) {
        return 'SS-';
    } else if (wpm >= 95) {
        return 'S+';
    } else if (wpm >= 90) {
        return 'S';
    } else if (wpm >= 85) {
        return 'S-';
    } else if (wpm >= 80) {
        return 'A+';
    } else if (wpm >= 75) {
        return 'A';
    } else if (wpm >= 70) {
        return 'A-';
    } else if (wpm >= 65) {
        return 'B+';
    } else if (wpm >= 60) {
        return 'B';
    } else if (wpm >= 55) {
        return 'B-';
    } else if (wpm >= 50) {
        return 'C+';
    } else if (wpm >= 45) {
        return 'C';
    } else if (wpm >= 40) {
        return 'C-';
    } else if (wpm >= 35) {
        return 'D+';
    } else if (wpm >= 30) {
        return 'D';
    } else if (wpm >= 25) {
        return 'D-';
    } else {
        return 'F';
    }
}

function getFreq(key) {
    return tabdata[key];
}

document.querySelectorAll(".key").forEach(function (keyb) {
    keyb.addEventListener('mouseover', function () {
        key.style.transform = "translateY(-5px)";
        setTimeout(function () {
            key.innerHTML = keyb.innerHTML;
            key.style.transform = "translateY(0px)";
        }, 100);

        count.style.transform = "translateY(-5px)";
        setTimeout(function () {
            count.innerHTML = getFreq(keyb.innerHTML.toLowerCase()) || 0;
            count.style.transform = "translateY(0px)";
        }, 100);
    });
});

back.addEventListener("click", function () {
    viewer.style.transform = "translateX(300px)";
});

const sitelist = await getSiteList();

for (let i in sitelist.sites) {
    console.log(sitelist.sites[i].url);

    weblist.innerHTML += `
    <div class="entry">
        <h4>${sitelist.sites[i].url}</h4>
        <button class="entry-btn" data-url="${sitelist.sites[i].url}">&rarr;</button>
    </div>
    `;
}

for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];

    entry.addEventListener("click", function () {
        goTo(entry.dataset.url);
    });
}
