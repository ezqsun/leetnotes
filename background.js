const addPageURL = "https://api.notion.com/v1/pages";
const notionVersion = "2021-08-16";

chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
    ({ method, token, postBody } = req);
    if (req.method === "postToNotion") {
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
                sendResponse(data);


            })
            .catch(error => {
                console.log("Request failed", error);
            })
    }
    return true;
}
);

chrome.storage.local.get("isSaved", (res)=>{
    if(res === undefined){
        chrome.storage.local.set({isSaved: false});
    }
})