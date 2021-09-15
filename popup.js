//implement ability to switch content with tab switches

function setProbInfo(info) {
    ({ isLoading, title, difficulty } = info);

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



chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    document.getElementsByClassName('loaded-container')[0].style.display = 'none';

    chrome.tabs.sendMessage(tabs[0].id, "getCurrTabInfo", function (response) {
        if (response.isLoading) {
            setTimeout(() => {
                chrome.tabs.sendMessage(tabs[0].id, "getCurrTabInfo", function (response) {
                    setProbInfo(response);
                    document.getElementsByClassName('loading-container')[0].style.display = 'none';
                    document.getElementsByClassName('loaded-container')[0].style.display = 'block';

                });

            }, 2000);
        } else {
            setProbInfo(response);
            document.getElementsByClassName('loading-container')[0].style.display = 'none';
            document.getElementsByClassName('loaded-container')[0].style.display = 'block';
        }

    });

});

