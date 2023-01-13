var discordID = null
var callbackUrl = null

function loadPage(type) {
    const urlParams = new URLSearchParams(window.location.search)
    discordID = urlParams.get('discordId')
    callbackUrl = urlParams.get('callbackUrl')

    let token = sessionStorage.getItem("lvdrToken")
    if (token != null && token != "") {
        if (callbackUrl)
            window.location.href = "/" + callbackUrl + ".html"
    }


    addEventListener('keypress', (event) => {
        if (event.code == "Enter") {
            if (type == "login")
                login()
            if (type == "register")
                register()
        }
    });

}

function putDiscordId(userId)
{
    if (discordID != null) {

        let data = JSON.stringify({"discord_id" : discordID})
        $.ajax({
            type: "PUT",
            url: "/user/id/" + userId,
            data: data,
            contentType: "application/json; charset=utf-8",
            dataType :"json",
            headers: {
                "Authorization":"Bearer " + sessionStorage.getItem("lvdrToken")
            },
            success: function(result) {
            },
            error: function(e){
                console.log(e)
            }
        });
    }
}

function login() {
    let username = document.getElementById("identifiant").value
    let password = document.getElementById("motDePasse").value
    let data = JSON.stringify({"email" : username, "password" : password})

    $.ajax({
        type: "POST",
        url: "/user/login",
        data: data,
        contentType: "application/json; charset=utf-8",
        dataType :"json",
        success: function(result) {
            sessionStorage.setItem("lvdrToken", result.token)
            putDiscordId(result.id)
            if (callbackUrl == null)
                window.location.href = "/"
            else
                window.location.href = "/" + callbackUrl + ".html"
        },
        error: function(e){
            if (e.responseJSON.msg == "Invalid Credentials") {
                err("bad Auth")
            }
            console.log(e)
        }
      });
}

function err(e)
{
    let obj = document.getElementsByClassName("error")[0].children[0]

    if (e == "password not match")
        obj.textContent = "Les mot de passe ne correspondent pas"
    else if (e == "bad Auth")
        obj.textContent = "L'identifiant ou le mot de passe est incorrect"
    else if (e == "missing input")
        obj.textContent = "Merci de remplir le formulaire"
}

function register() {
    let username = document.getElementById("identifiant").value
    let password = document.getElementById("motDePasse").value
    let email = document.getElementById("email").value
    let confPassword = document.getElementById("confMotDePasse").value

    if (username == "" || password == "" || email == "" || confPassword == "")
        err("missing input")
    if (confPassword != password)
        err("password not match")

    let data = JSON.stringify({"username" : username, "password" : password, "email": email})
    $.ajax({
        type: "POST",
        url: "/user/register",
        data: data,
        contentType: "application/json; charset=utf-8",
        dataType :"json",
        success: function(result) {
            sessionStorage.setItem("lvdrToken", result.token)
            putDiscordId(result.id)
            if (callbackUrl == null)
                window.location.href = "/"
            else
                window.location.href = "/" + callbackUrl + ".html"
        },
        error: function(e){
            console.log(e)
        }
      });
}

function goTo (def)
{
    let url = "/" + def + ".html"

    if (callbackUrl || discordID)
        url += "?"

    console.log(callbackUrl)
    if (callbackUrl && discordID)
        url += "callbackUrl=" + callbackUrl + "&discordId=" + discordID
    else if (callbackUrl)
        url += "callbackUrl=" + callbackUrl
    else if (discordID)
        url += "discordId=" + discordID
    window.location.href = url
}