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

    chrome.tabs.sendMessage(tabs[0].id, "getCurrTabInfo", function (response) {
        if (response.isLoading) {
            setTimeout(() => {
                chrome.tabs.sendMessage(tabs[0].id, "getCurrTabInfo", function (response) {
                    setProbInfo(response);
                });

            }, 2000);
        } else {
            setProbInfo(response);
        }

    });

});


// Save user input of notion integration and database info
function saveNotionUserInfo(event) {
    const integration = document.getElementById("notion-integration").value.trim();
    const databaseId = document.getElementById("notion-database").value.trim();

    const info = {
        savedInfo: {
            token: integration,
            databaseId: databaseId
        }
    };
    event.preventDefault();

    chrome.storage.local.set(info, () => {
        console.log(`set notion info`);
        chrome.storage.local.get(function (result) { console.log(result) })

    });
    document.getElementById("notion-mode").hidden = true;
}
const notionInfoForm = document.getElementById("notion-info");
notionInfoForm.addEventListener("submit", saveNotionUserInfo);

function getSavedNotionInfo() {
    return new Promise((resolve) => {
        chrome.storage.local.get("savedInfo", (res) => {
            token = res.savedInfo.token;
            database = res.savedInfo.databaseId;
            resolve({token, database});
        })
    })
}

function getNotes() {
    return new Promise((resolve) => {
        chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
            chrome.tabs.sendMessage(tabs[0].id, "getNotes", response => {
                console.log(response);
                resolve(response);
            })
        })
    })
}

// submit to Notion
async function getRequestBody(databaseId) {
    const confidence = document.getElementById("confidence-dropdown").value;
    const date = document.getElementById("date-input").value;
    let reqBody = await getNotes().then(res => {
        console.log(res);
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
                    "multi_select": []
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
    console.log('notes submitted')

    const obj = await getSavedNotionInfo().then(res=>{
        return res;
    });
    ({token, database} = obj);
    const reqBody = await getRequestBody(database);

    chrome.runtime.sendMessage({
        method: "postToNotion",
        token: token,
        database: database,
        postBody: reqBody
    }, (res) => {
        console.log("succesfully sent postReq to bg", res);
    }

    );
    event.preventDefault();

}
const submitBtn = document.getElementById("submit-btn");
submitBtn.addEventListener("click", submitNotes);

