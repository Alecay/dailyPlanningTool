import * as fileReader from '/dailyPlanningTool/javascript/helpers/fileReader.js';
import * as csvHelpers from '/dailyPlanningTool/javascript/helpers/csvHelpers.js';
import * as timeHelpers from '/dailyPlanningTool/javascript/helpers/timeHelpers.js';

//let pagePath = "/dailyPlanningTool/pages/dailyGrid.html";
let pagePath = "/dailyPlanningTool/index.html";

var selectedDateIndex = 0;

var userData = JSON.parse(localStorage.userData);

if(userData["TM NUMBER"] == undefined)
{
    //Return to login page
    window.location.href = pagePath;
}

setUserData(userData["FIRST NAME"].concat(" ", userData["LAST NAME"]), userData["JOB"]);

selectTodaysDate();

setupButtons();
loadPage();

function selectTodaysDate()
{
    const text = fileReader.loadFile("/dailyPlanningTool/csvData/scheduleData.csv");
    const array = csvHelpers.csvToArr(text);
    const dates = csvHelpers.getUniqueElements(array, "SCHEDULED DATE");

    const today = timeHelpers.getTodayDate();
    selectedDateIndex = dates.indexOf(today);    
}

function setupButtons()
{
    const nextButton = document.getElementById("nextDayButton");
    const previousDayButton = document.getElementById("previousDayButton");

    nextButton.addEventListener("click", function ()
    {
        selectedDateIndex++;
        clearRollupDepartmentHolders();
        loadPage();
    });

    previousDayButton.addEventListener("click", function ()
    {
        selectedDateIndex--;
        clearRollupDepartmentHolders();
        loadPage();
    });
}

function getSelectedDate()
{
    const text = fileReader.loadFile("/dailyPlanningTool/csvData/scheduleData.csv");
    const array = csvHelpers.csvToArr(text);
    const dates = csvHelpers.getUniqueElements(array, "SCHEDULED DATE");    

    if(selectedDateIndex < 0)
        selectedDateIndex = 0;

    if(selectedDateIndex >= dates.length)
        selectedDateIndex = dates.length - 1;

    const selectedDate = dates[selectedDateIndex];        

    return selectedDate;
}

function clearRollupDepartmentHolders()
{
    const rdHolders = document.querySelectorAll("#rollupDepartmentHolder");
    for(var i = 0; i < rdHolders.length; i++)
    {
        rdHolders[i].parentElement.removeChild(rdHolders[i]);
    }
}


function loadPage()
{    
    const text = fileReader.loadFile("/dailyPlanningTool/csvData/scheduleData.csv");
    var array = csvHelpers.csvToArr(text);
    array = csvHelpers.filterCSV(array, "STORE", [userData["STORE"]]);

    const trainingText = fileReader.loadFile("/dailyPlanningTool/csvData/trainingData.csv");
    const trainingArray = csvHelpers.csvToArr(trainingText);    
    
    const dates = csvHelpers.getUniqueElements(array, "SCHEDULED DATE");
    const selectedDate = getSelectedDate();

    document.getElementById("date").innerText = timeHelpers.getFormattedDate(selectedDate);

    document.getElementById("store").innerText = userData["STORE"];
    const dailyTMCount = csvHelpers.filterCSV(array, "STORE", [userData["STORE"]], "SCHEDULED DATE", [selectedDate]).length;
    document.getElementById("dailyCount").innerText = dailyTMCount;
    
    const dailyGridHolder = document.getElementById("dailyGrid");
    const rdTemplate = document.getElementById("rollupDepartmentTemplate");
    
    const rollupDepartments = csvHelpers.getUniqueElements(array, "ROLLUP DEPARTMENT");
    
    for(var i = 0; i < array.length; i++)
    {
        if(array[i]["ROLLUP DEPARTMENT"] == "Service and Engagement")
        {
            array[i]["DEPARTMENT"] = array[i]["JOB AREA"];
        }
    }

    const rowTemplate = rdTemplate.querySelector("#tmRow");
    
    //For each rollup department create tables
    for(var i = 0; i < rollupDepartments.length; i++)
    {
        const rdClone = rdTemplate.cloneNode(true);    
        rdClone.setAttribute("id", "rollupDepartmentHolder");
        rdClone.querySelector("#rollupDepartmentName").innerText = rollupDepartments[i];
        rdClone.setAttribute("style", "");
        const rdTmCount = csvHelpers.filterCSV(array, "ROLLUP DEPARTMENT", [rollupDepartments[i]], "SCHEDULED DATE", [selectedDate]).length;
        rdClone.querySelector("#tmCount").innerText = rdTmCount;

        //get departments that fall under rollup department
        const rdFilteredArray = csvHelpers.filterCSV(array, "ROLLUP DEPARTMENT", [rollupDepartments[i]]);
        const departments = csvHelpers.getUniqueElements(rdFilteredArray, "DEPARTMENT");
    
        //rdClone.innerHTML = "";
        const departmentTemplate = rdClone.querySelector("#departmentHolder");
    
        //If there are more than one departments then add additonal department tables
        for(var j = 0; j < departments.length; j++)
        {
            const departmentClone = rdClone.querySelector("#departmentHolder").cloneNode(true);
            departmentClone.querySelector("#departmentName").innerText = departments[j];

            const department = departmentClone.querySelector("#departmentName").innerText;    
    
            const tmTable = departmentClone.querySelector("#tmTable");
            tmTable.innerHTML = "";
        
            const filteredArray = csvHelpers.filterCSV(array, "DEPARTMENT", [department], "SCHEDULED DATE", [selectedDate]);
            filteredArray.sort(csvHelpers.dynamicSortMultiple("ROLLUP DEPARTMENT", "DEPARTMENT", "START TIME"));     
        
            departmentClone.querySelector("#tmCount").innerText = filteredArray.length;

            for(var k = 0; k < filteredArray.length; k++)
            {
                const clonedRow = rowTemplate.cloneNode(true);
        
                clonedRow.querySelector("#name").innerText = filteredArray[k]["TM NAME (NUM)"].replace(/"/g, "");
                clonedRow.querySelector("#shift").innerText = filteredArray[k]["SCHEDULE"];
                clonedRow.querySelector("#hours").innerText = timeHelpers.getDurationFromTimeRange(filteredArray[k]["SCHEDULE"]).toFixed(1);
        
                const trainingData = csvHelpers.csvLookup(trainingArray, "TM NUMBER", filteredArray[k]["TM NUMBER"]);
                const trainingCount =  trainingData["PERSONAL COUNT"];
                const overdueCount =  trainingData["OVERDUE COUNT"];
                
                if(!isNaN(trainingCount))
                {
                    clonedRow.querySelector("#name").innerText = clonedRow.querySelector("#name").innerText.concat(" T:", trainingCount);
                    if(overdueCount > 0)
                    {
                        clonedRow.querySelector("#name").innerText = clonedRow.querySelector("#name").innerText.concat("*");
                    }
                }
        
                tmTable.appendChild(clonedRow);
            }
    
            rdClone.appendChild(departmentClone);
        }
    
        rdClone.appendChild(document.createElement("br"));

        departmentTemplate.setAttribute("style", "display:none");
    
        dailyGridHolder.appendChild(rdClone);
    }    
    
    rdTemplate.setAttribute("style", "display: none;");
}

function setUserData(name, title)
{
    const userName = document.getElementById("userName");
    const userTitle = document.getElementById("userTitle");

    userName.innerText = name;
    userTitle.innerText = title;
}
