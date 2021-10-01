let problemInfo = {isLoading: true};

function checkElement(e) {
  return e && e.length > 0;
}

function getProblemName() {
  let numName = "";
  numName = document.getElementsByClassName("css-v3d350")[0].innerText;
  return numName;
}

function getProblemDifficulty() {
  let isHard = document.getElementsByClassName('css-t42afm');
  let isMedium = document.getElementsByClassName('css-dcmtd5');
  let isEasy = document.getElementsByClassName('css-14oi08n');
  while (!isHard && !isMedium && !isEasy) {
    setTimeout(() => {
      isHard = document.getElementsByClassName('css-t42afm');
      isMedium = document.getElementsByClassName('css-dcmtd5');
      isEasy = document.getElementsByClassName('css-14oi08n');
    }, 500)
  }
  if (checkElement(isEasy)) {
    return "Easy";
  } else if (checkElement(isMedium)) {

    return "Medium";
  } else if (checkElement(isHard)) {

    return "Hard";
  }
  return "";
}

function getProblemInfo() {
  setTimeout(() => {
    const title = getProblemName();
    const diff = getProblemDifficulty();
    problemInfo = {
      isLoading: false,
      title: title,
      difficulty: diff
    }
  }, 2000);

}

function getNotesIfAny() {
  let notes = "";
  notesdiv = document
    .getElementsByClassName("notewrap__eHkN")[0]
    .getElementsByClassName("CodeMirror-code")[0];
  if (notesdiv) {
    for (i = 0; i < notesdiv.childNodes.length; i++) {
      if (notesdiv.childNodes[i].childNodes.length === 0) continue;
      let text = notesdiv.childNodes[i].childNodes[0].innerText;
      if (text) {
        notes = `${notes}\n${text.trim()}`;
      }
    }
  }
  return notes.trim();
}

getProblemInfo();
chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {

    if (request === "getCurrTabInfo") {
        sendResponse(problemInfo);
    }else if(request === "getNotes"){
      const notes = getNotesIfAny();
      sendResponse(notes);
    }
  }
);








