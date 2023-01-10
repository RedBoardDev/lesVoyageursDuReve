function loadNav (){
    let token = sessionStorage.getItem("lvdrToken")
    if (token != null || token != "") {
        getMe(token, (user) => {
            if (user != null) {
                document.getElementById("NavConnexion").setAttribute("style", "display: none")
                document.getElementById("NavHello").children[0].textContent = "Bonjour " + user.username
                document.getElementById("NavUser").setAttribute("onclick", "window.location.href='/me.html'")
                document.getElementById("NavDisconnect").setAttribute("class", "NavDisconnect")
            }
        })
    }
}

function logout (){
    sessionStorage.setItem("lvdrToken" , "")
    window.location.reload();
}

