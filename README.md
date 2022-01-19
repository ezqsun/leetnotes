<h1 align="center">Sprout</h1>

## About The Project
This is a web browser extension developed for Google Chrome to save problem-solving progress and notes on individual [LeetCode](https://leetcode.com) problems. It allows users to question details such as 
title, difficulty, and add personal markers such as understanding, date last attempted/completed, notes, and the ability to star the question.

## Getting Started
### Using the Extension

1. Download extension
2. Navigate to your personal [Notion integration page](https://www.notion.so/my-integrations). Login and choose "New Integration +" to create an integration named "LeetNotes" 
(remember the workspace you chose). Under Capabilities > Content Capabilities allow Read, Update, and Insert Content. 
3. Duplicate [this Notion template](https://emilysun.notion.site/9630863d50b84ac0afcc43b9d3b887dc?v=65246beafff14e2194b50ed4e3611999 "Notion Template") into the workspace you created an integration for.
NOTE: LeetNotes is designed to work alongside this Notion template. Do not delete any existing columns or column names (only exception is date last exercised). 
Additional columns can be freely added.
4. On the duplicated page, click SHARE on the upper right corner and choose Invite > Select an Integration > LeetNotes > Invite 
5. When using LeetNotes for the first time, enter your integration token (found in your custom [LeetNotes integration page](https://www.notion.so/my-integrations) and
your template database ID. Find this in your duplicated page link 
```
https://www.notion.so/{YOUR_WORKSPACE_NAME}/{DATABASE_IDv}?=/{VIEW_ID}
```

**Now you can navigate to any Leetcode problem pages, take notes with Leetcode's built-in Notes function, and save the problem details to your dedicated Notion Page using LeetNotes!

### Developing and Customizing the Extension

1. clone the repo
```
git clone https://github.com/ezqsun/leetnotes.git
```

2. CHROME: navigate to chrome://extensions/ in Chrome browser. Choose "Load unpacked" and select cloned leetnotes folder.
3. Follow STEPS 2-5 of "Using the Extension" outlined above.

## License
Distributed under the MIT License. See `LICENSE` for details.
