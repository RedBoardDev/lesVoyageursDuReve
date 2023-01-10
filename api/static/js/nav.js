function loadNav (){
    let token = sessionStorage.getItem("lvdrToken")
    if (token != null || token != "") {
        getMe(token, (user) => {
            if (user != null) {
                document.getElementById("NavConnexion").setAttribute("style", "display: none")
                document.getElementById("NavHello").children[0].textContent = "Bonjour " + user.username
                document.getElementById("NavUser").setAttribute("onclick", "window.location.href='/me.html'")
                document.getElementById("NavDisconnect").setAttribute("class", "NavDisconnect")
                if (user.discord_avater != null) {
                    document.getElementById("NavProfilePicture").setAttribute("src", user.discord_avater)
                }
            }
        })
    }
}

function logout (){
    sessionStorage.setItem("lvdrToken" , "")
    window.location.reload();
}

