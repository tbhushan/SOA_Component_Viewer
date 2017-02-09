Instructions of how to create an independant Copy of SOA_Component_Viewer
=
This document describes how the SOA_Component_Viewer can be cloned so an independant copy can be used.

Make your own copy of the Google Sheets Spreadsheet
-
Navigate to https://drive.google.com/drive/shared-with-me 
You must be logged on as your google user with read access to the document.
This will show the SOA_Component_Viewer google docs spreadsheet. (It may be called "Live Component List")
Right click on the document and select "Create a copy". It prompts you to wait then gives you a "Locate" option. Click this option.
Rename the document to a sensible name and if desired move it to a better locaiton inside your google drive.
Right click the new document, click "Share" then click "Advanced"
Invlte all the people who should be able to view the SOA_Component_Viewer and select "Can View" as the option.
Invlte all the people who should be update data in the SOA_Component_Viewer and select "Can Edit" as the option.
Finally you must find the new document ID.
Click on it and inspect the URL. It should be something like
https://docs.google.com/spreadsheets/d/1K28dX1gAmNmAwJ4JbKfC7al19oTlEl8dBlS2VkG6BFo/edit#gid=1483315145
The document ID is the long string inbetween /d and /edit, in this case 1K28dX1gAmNmAwJ4JbKfC7al19oTlEl8dBlS2VkG6BFo

Fork the git repo
-
You will need a github account for the following steps. Log into your github accounts and navigate to this project (https://github.com/rmetcalf9/SOA_Component_Viewer). In the top right corner click the "Fork" button. This will create a copy of the entire repo (including document pages) which you will be able to edit.

Update the Forked Document references to point to new Google Sheets Spreadsheet
-
The forked github repo must be changed to point to the newly created google sheets documented. To do this find the file:
(docs/ic_soa_data.js) in your repo.
It can be edited in the github ui. Edit it and change the following function:
```javascript
function ic_soa_data_getSheetID() {
	return '1u_DNhV7NO16uHZSP1KeYfAorW9tvwD9gbbYsCRp07G8';
};
```
so that it returns the sheet ID obtained previously.
Remember to commit the change to the repo with an apropiate comment.

Note down the URL for your forked copy
-
Each github repo will have a special documents area with it's own URL. As this repo has been forked a new area has been created and this is what should be used to access the SOA_Component_Viewer. 
The URL will have the following format:
```
https://<<GIT USER>>.github.io/<<PROJECT NAME>>/component_viewer.html
```
Test this link and make sure you can access the pages. (Although you will get an error)

Configure Google API's to allow access to new site
-
Google API's have Cross Site Scripting (XSS) protection. This means that API calls are only accepted when viewing a site from a known URL. It is nessecary to setup an application in Google API Manager and explicitly allot the URL gained in the previous step.

To do this:
Navigate to (https://console.developers.google.com/apis/credentials)
Create a Project called "SOA Component Viewer"
Create OAuth Client ID credentials called "SOA Component Viewer"
At this point it will stop you and make you fill in "product name on consent screen"
Enter "SOA Component Viewer" as the name and Press Save

Create a new OAuth CLient ID credential
Application Type: Web application
Name: SOA Component Viewer
Authorized Javascript Origins: 
* http://localhost:8000
* https://rmetcalf9.github.io

Replace rmetcalf9 with your own github user.

Note down the client ID.

Click Dashboard
Press Enable API
Under Google Apps APIs select Sheets API
Press Enable

In your repo edit (docs/board.js) and enter in the client ID.
Save and commit your changes.

These settings may take some time to take effect.

Update README.md to point to correct site
-
Edit the README.md file in github and change the URL for github live pages to point to your site. (Add your git account ID rather than rjmetcal)

Test the System
-
Log in to the URL and ensure that the components all appear. Test a edit user is able to move items around the Kanban board.
