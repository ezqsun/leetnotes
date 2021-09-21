const addPageURL = "https://api.notion.com/v1/pages";
const notionVersion = "2021-08-16";

chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
    ({method, token, database, postBody} = req);
    if (req.method === "postToNotion") {
        console.log(`Bearer ${token}, postBody: ${postBody}`)
        fetch(`${addPageURL}`, {
            method: 'POST',
            headers: {
                "Authorization": `Bearer ${token}`,
                "Notion-Version": notionVersion,
                "Content-Type": "application/json"
            },
            body: postBody
        })
            .then(res => {
                return res.json();
            })
            .then(data => {
                console.log("Request succeeded with JSON response", data);
                sendResponse(data);


            })
            .catch(error => {
                console.log("Request failed", error);
            })

    }
    return true;


}

);