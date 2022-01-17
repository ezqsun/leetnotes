let probNumber;
let probTitle;
let probDifficulty;

// display Leetcode problem info

function setProbInfo(info) {
    ({ isLoading, title, difficulty } = info);
    probNumber = parseInt(title.split(".")[0].trim());
    probTitle = title.split(".")[1].trim();
    probDifficulty = difficulty;

    document.getElementsByClassName('loading-container')[0].style.display = 'none';
    document.getElementsByClassName('loaded-container')[0].style.display = 'block';

    document.getElementById("title-info").innerHTML = title;
    const difficultyEle = document.getElementById("difficulty");
    document.getElementById("difficulty").innerHTML = difficulty;

    if (difficulty === "Easy") {
        difficultyEle.style.setProperty('color', 'rgb(67, 160, 71)');
    } else if (difficulty === "Medium") {
        difficultyEle.style.setProperty('color', 'rgb(239, 108, 0)');
    } else if (difficulty === "Hard") {
        difficultyEle.style.setProperty('color', 'rgb(233, 30, 99)');
    }
}


// get Leetcode problem info
chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    document.getElementsByClassName('loaded-container')[0].style.display = 'none';
    let url = tabs[0].url;

    //not on leetcode problem page 
    if (!url.includes("leetcode.com/problems/") || url.includes("/discuss/") || url.includes("/submissions/") || url.includes("/solution/")) {
        chrome.storage.local.get("isSaved", (res) => {
            const isSaved = res.isSaved;
            if (isSaved) {
                document.body.style.height = "200px";
                document.getElementById("leetcode-mode").style.display = "none";
                document.getElementById("nonleetcode-container").hidden = false;
            } else {
                document.getElementById("nonleetcode-container").hidden = true;
            }

        })
        // document.body.style.height = "200px";
        // document.getElementById("leetcode-mode").style.display = "none";
        // document.getElementById("nonleetcode-container").hidden = false;

    } else {
        chrome.tabs.sendMessage(tabs[0].id, "getCurrTabInfo", function (response) {
            if (response === undefined || response.isLoading) {
                let count = 0;
                let interval = setInterval(() => {
                    if (count > 10) {
                        clearInterval(interval);
                    }
                    chrome.tabs.sendMessage(tabs[0].id, "getCurrTabInfo", function (response) {
                        setProbInfo(response);
                        clearInterval(interval);
                    });
                    count++;
                }, 700)
            } else {
                setProbInfo(response);
            }

        });
    }

});


// Save user input of notion integration and database info
function saveNotionUserInfo(event) {
    const integration = document.getElementById("notion-integration").value.trim();
    const databaseId = document.getElementById("notion-database").value.trim();

    const info = {
        savedNotionInfo: {
            token: integration,
            databaseId: databaseId
        }
    };
    event.preventDefault();

    chrome.storage.local.set(info);
    chrome.storage.local.set({ isSaved: true });
    document.getElementById("notion-mode").style.display = "none";
    document.getElementById("leetcode-mode").style.display = "flex";
    console.log(info)

}
const notionInfoForm = document.getElementById("notion-info");
notionInfoForm.addEventListener("submit", saveNotionUserInfo);

function getSavedNotionInfo() {
    return new Promise((resolve) => {
        chrome.storage.local.get("savedNotionInfo", (res) => {
            resolve(res.savedNotionInfo);
        })
    })
}

function getNotes() {
    return new Promise((resolve) => {
        chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
            chrome.tabs.sendMessage(tabs[0].id, "getNotes", response => {
                resolve(response);
            })
        })
    })
}

// submit to Notion
async function getRequestBody(databaseId) {
    const confidence = document.getElementById("confidence-dropdown").value;
    const date = document.getElementById("date-input").value;
    const isStarred = document.getElementsByClassName("notes-star")[0].classList.contains("selected")
    const multiSelectContent = isStarred ? [{ "id": "f77c7460-3a27-4d3a-be24-3a2bf5485f29" }] : [];
    let reqBody = await getNotes().then(res => {

        const obj = {
            "parent": {
                "database_id": databaseId
            },
            "properties": {
                "Confidence": {
                    "id": "YQKG",
                    "type": "select",
                    "select": {
                        "name": confidence
                    }
                },
                "Last exercised": {
                    "id": "%5DPZ%7C",
                    "type": "date",
                    "date": {
                        "start": date
                    }
                },
                "#": {
                    "id": "hxen",
                    "type": "number",
                    "number": probNumber
                },
                "Difficulty": {
                    "id": "nxqX",
                    "type": "select",
                    "select": {
                        "name": probDifficulty
                    }
                },
                "Tags": {
                    "id": "zvmb",
                    "type": "multi_select",
                    "multi_select": multiSelectContent
                },
                "Notes": {
                    "id": "~tkb",
                    "type": "rich_text",
                    "rich_text": [
                        {
                            "type": "text",
                            "text": {
                                "content": res,
                                "link": null
                            },
                            "annotations": {
                                "bold": false,
                                "italic": false,
                                "strikethrough": false,
                                "underline": false,
                                "code": false,
                                "color": "default"
                            },
                            "href": null
                        }
                    ]
                },
                "Name": {
                    "id": "title",
                    "type": "title",
                    "title": [
                        {
                            "type": "text",
                            "text": {
                                "content": probTitle,
                                "link": null
                            }
                        }
                    ]
                }

            }
        }
        return JSON.stringify(obj);
    });
    return reqBody;
}


async function submitNotes(event) {
    if (document.getElementById("date-input").value === "") {
        document.getElementById("modal-container").style.display = "block";
        document.getElementsByClassName("modal-button")[0].addEventListener("click", closeModal);
    } else {
        const obj = await getSavedNotionInfo().then(res => {
            return res;
        });
        ({ token, databaseId } = obj);
        const reqBody = await getRequestBody(databaseId);

        chrome.runtime.sendMessage({
            method: "postToNotion",
            token: token,
            postBody: reqBody
        }, (res) => {
            const responseDiv = document.getElementById("submit-response-container");
            const node = document.createElement("span");
            node.setAttribute("id", "submit-response-text");
            node.innerText = (res.status === "successful") ? "successfully added to Notion database!" : "error with adding to Notion, please try again!";
            responseDiv.appendChild(node);
            responseDiv.hidden = false;
            document.getElementById("notes-submit-container").hidden = true;
            console.log("succesfully sent postReq to bg", res.data, res.data.status);
            document.getElementById("confetti").hidden = false;
        }
        );
        event.preventDefault();
    }

}

function closeModal(event) {
    event.preventDefault();
    document.getElementById("modal-container").style.display = "none";
}

const submitBtn = document.getElementById("submit-btn");
submitBtn.addEventListener("click", submitNotes);

chrome.storage.local.get("isSaved", (res) => {
    const isSaved = res.isSaved;
    if (isSaved) {
        document.getElementById("notion-mode").style.display = "none";
        document.getElementById("leetcode-mode").style.display = "flex";
    } else {
        document.getElementById("notion-mode").style.display = "flex";
        document.getElementById("leetcode-mode").style.display  = "none";
    }



})

function toggleStar(event) {
    let isSelected = event.currentTarget.classList.toggle("selected");
    if (isSelected) {
        event.target.setAttribute("fill", "rgb(255,161,22)");
    } else {
        event.target.setAttribute("fill", "rgb(110, 110, 110)");
    }
    document.getElementsByClassName("tooltiptext")[0].hidden = isSelected;
    document.getElementsByClassName("tooltiptext")[1].hidden = !isSelected;
}

document.getElementsByClassName("notes-star")[0].addEventListener("click", toggleStar);