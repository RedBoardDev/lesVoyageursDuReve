function loadPage(type) {
    addEventListener('keypress', (event) => {
        if (event.code == "Enter") {
            if (type == "login")
                login()
            if (type == "register")
                register()
        }
    });
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
            window.location.href = "/"
        },
        error: function(e){
            console.log(e)
        }
      });
}

function err(e)
{
    let obj = document.getElementById("errorBar")

    if (e == "password not match")
        obj.textContent = "Les mot de passe ne correspondent pas"
    else if (e == "bad auth")
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
            window.location.href = "/"
        },
        error: function(e){
            console.log(e)
        }
      });
}