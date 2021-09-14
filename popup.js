//implement ability to switch content with tab switches

function setProbInfo() {
        chrome.storage.local.get(["title"], (response) => {
            document.getElementById("title-info").innerHTML = response.title;
            console.log(response.title)

        })
        chrome.storage.local.get(["difficulty"], (response) => {
            const difficultyEle = document.getElementById("difficulty");
            document.getElementById("difficulty").innerHTML = response.difficulty;

            if (response.difficulty === "Easy") {
                difficultyEle.style.setProperty('color', 'rgb(67, 160, 71)');
            } else if (response.difficulty === "Medium") {
                difficultyEle.style.setProperty('color', 'rgb(239, 108, 0)');
            } else if (response.difficulty === "Hard") {
                difficultyEle.style.setProperty('color', 'rgb(233, 30, 99)');
            }
            console.log(response.difficulty)

        })


}

function getProbInfo(){
    chrome.storage.local.get(["isLoading"], (res) => {
        if (res && !res.isLoading) {
            setProbInfo();
        }else if(res && res.isLoading){
            setTimeout(() => {
                getProbInfo();
            }, 2000);
    
        }
    
    })
}

getProbInfo();
