import * as fileReader from '/dailyPlanningTool/javascript/helpers/fileReader.js';
import * as csvHelpers from '/dailyPlanningTool/javascript/helpers/csvHelpers.js';

let pagePath = "/dailyPlanningTool/pages/dailyGrid.html";
let userData = {};

//Logan
//75082592

setupSubmitButton();

function setupSubmitButton()
{
    const loginForm = document.getElementById("loginForm");
    loginForm.addEventListener('submit', function (event)
    {
        event.preventDefault();
        onSubmit();
    });
}

function onSubmit()
{
    userData = {};
    localStorage.userData = JSON.stringify(userData);

    const loginField = document.getElementById("tmLogin");
    var tmNumber = String(loginField.value);

    const invalidLogin = document.getElementById("invalidLoginMessage");    

    if(isValidLogin(tmNumber))
    {
        //Load home page
        window.location.href = pagePath;
        
        //hide invalid login message
        invalidLogin.style.display = "none";

        //store userData
        localStorage.userData = JSON.stringify(userData);
    }
    else
    {        
        //show invalid login message
        invalidLogin.style.display = "block";
    }

    loginField.value = "";
}

function isValidLogin(tmNumber)
{
    const text = fileReader.loadFile("/dailyPlanningTool/csvData/leaderData.csv");
    const array = csvHelpers.csvToArr(text);

    userData = csvHelpers.csvLookup(array, "TM NUMBER", tmNumber);

    //if there was no match to the input data
    if(userData["TM NUMBER"] != tmNumber)
        return false;


    return true;
    
    
}