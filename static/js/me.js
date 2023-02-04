var popUp = false
var userId 
var popUpId

function loadPage ()
{

    $(document).on('keydown', function(event) {
        if (popUp) {
            if (event.key == "Enter") {
                validPassword(popUpId)
            }
            if (event.key == "Escape") {
                closePopUp()
            }
        }
    });

    loadNav()
    token = sessionStorage.getItem("lvdrToken")
    if (token != null || token != "") {
        getMe(token, (user) => {
            if (user != null) {
                fillData(user)
            } else {
                window.location.href = "/"
            }
        })
    } else {
        window.location.href = "/"
    }
}

function fillData(user)
{
    document.getElementById("PageTitle").textContent = user.username
    document.getElementById("email").value = user.email
    document.getElementById("identifiant").value = user.username
    document.getElementById("password").value = "aaaaaaaaaaaaa"
    document.getElementById("perm").value = "Joueur"
    console.log(user.discord_username)
    if (user.discord_username != null && user.discord_username && user.discord_username != "") {
        document.getElementById("discord").value = user.discord_username
    } 
    if (user.discord_avatar != null && user.discord_avatar && user.discord_avatar != "0"){
        document.getElementById("profilePicture").setAttribute("src", user.discord_avatar)
    } else {
        document.getElementById("profilePicture").setAttribute("src", "assets/user.png")
    }


    userId = user.id
}

function openPopUp(id)
{
    popUpId = id
    popUp = true
    document.getElementById("popUp").setAttribute("style", "display : block;")
    document.getElementById("validPassword").setAttribute("onclick", "validPassword('" + id + "')")
}


function closePopUp()
{
    popUp = false
    document.getElementById("popUp").setAttribute("style", "display : none;")
    document.getElementById("errorP").textContent = ""
}


function validPassword(id)
{
    let password = document.getElementById("passwordIN").value
    let email = document.getElementById("email").value

    let data = JSON.stringify({"email" : email, "password" : password})


    $.ajax({
        type: "POST",
        url: API() + "/user/login",
        data: data,
        contentType: "application/json; charset=utf-8",
        dataType :"json",
        success: function(result) {
            document.getElementById(id).removeAttribute("readonly")
            document.getElementById(id).value = ""
            let theButton = document.getElementById(id + "Edit")
            theButton.textContent = "Valider"
            let editButtons = document.getElementsByClassName("edit")
            for (let i = 0; i < editButtons.length; ++i) {
                if (editButtons[i].children[0].id != theButton.id)
                    editButtons[i].children[0].setAttribute("style", "display: none;")
            }
            document.getElementById(id + "Edit").setAttribute("onclick", "validChange('" + id +"')")
            closePopUp()
        },
        error: function(e){
            if (e.responseJSON.msg == "Invalid Credentials")
                err("Invalid auth")
            console.log(e)
        }
      });
}


function validChange(id)
{
    let thing = document.getElementById(id).value
    let data = null

    if (id == "email")
        data = JSON.stringify({"email" : thing})
    if (id == "identifiant")
        data = JSON.stringify({"username" : thing})
    if (id == "password")
        data = JSON.stringify({"password" : thing})

    $.ajax({
        type: "PUT",
        url: API() + "/user/id/" + userId,
        data: data,
        contentType: "application/json; charset=utf-8",
        dataType :"json",
        headers: {
            "Authorization":"Bearer " + sessionStorage.getItem("lvdrToken")
        },
        success: function(result) {
            window.location.reload()
        },
        error: function(e){
            console.log(e)
        }
      });
}

function err(id)
{
    let error = document.getElementById("errorP")

    if (id == "Invalid auth") {
        error.textContent = "Mot de passe incorrect"
    }
}