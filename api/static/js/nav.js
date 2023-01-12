function loadNav (){
    let token = sessionStorage.getItem("lvdrToken")
    if (token != null || token != "") {
        getMe(token, (user) => {
            if (user != null) {
                document.getElementById("NavConnexion").setAttribute("style", "display: none")
                document.getElementById("NavHello").children[0].textContent = "Bonjour " + user.username
                document.getElementById("NavUser").setAttribute("onclick", "window.location.href='/me.html'")
                document.getElementById("NavDisconnect").setAttribute("class", "NavDisconnect")
                if (user.discord_avatar != null && user.discord_avatar != "") {
                    document.getElementById("NavProfilePicture").setAttribute("src", user.discord_avatar)
                }
                if (user.permission_id >= 2)
                    document.getElementById("adminLink").setAttribute("style" , "display : flex")
            }
        })
    }
}

function logout (){
    sessionStorage.setItem("lvdrToken" , "")
    window.location.reload();
}

