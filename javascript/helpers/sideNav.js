/* Set the width of the side navigation to 250px */
function openNav() 
{
    document.getElementById("sidenav").style.width = "300px";
    const shadow = document.getElementById("sidenavShadow");//
    shadow.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
    shadow.style.zIndex = "1";
}
  
/* Set the width of the side navigation to 0 */
function closeNav() 
{
    document.getElementById("sidenav").style.width = "0";
    const shadow = document.getElementById("sidenavShadow");//
    shadow.style.backgroundColor = "rgba(0, 0, 0, 0)";
    shadow.style.zIndex = "-1";
}

function setUserData(name, title)
{
    const userName = document.getElementById("userName");
    const userTitle = document.getElementById("userName");

    userName.innerText = name;
    userTitle.innerText = title;
}