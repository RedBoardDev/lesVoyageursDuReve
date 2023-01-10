var popUp = false
var userId 

function loadPage ()
{
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
    document.getElementById("email").value = user.email
    document.getElementById("identifiant").value = user.username
    document.getElementById("password").value = "aaaaaaaaaaaaa"
    userId = user.id
}

function openPopUp(id)
{
    popUp = true
    document.getElementById("popUp").setAttribute("style", "display : block;")
    document.getElementById("validPassword").setAttribute("onclick", "validPassword('" + id + "')")
}


function closePopUp()
{
    popUp = false
    document.getElementById("popUp").setAttribute("style", "display : none;")
}


function validPassword(id)
{
    let password = document.getElementById("passwordIN").value
    let email = document.getElementById("email").value

    let data = JSON.stringify({"email" : email, "password" : password})


    $.ajax({
        type: "POST",
        url: "/user/login",
        data: data,
        contentType: "application/json; charset=utf-8",
        dataType :"json",
        success: function(result) {
            document.getElementById(id).removeAttribute("readonly")
            document.getElementById(id + "Edit").textContent = "Valider"
            document.getElementById(id + "Edit").setAttribute("onclick", "validChange('" + id +"')")
            closePopUp()

        },
        error: function(e){
            console.log(e)
        }
      });
}

function resetToken(email, password)
{
    let data = JSON.stringify({"email" : email, "password" : password})


    $.ajax({
        type: "POST",
        url: "/user/login",
        data: data,
        contentType: "application/json; charset=utf-8",
        dataType :"json",
        success: function(result) {
            sessionStorage.setItem("lvdrToken", result.token)

        },
        error: function(e){
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
        url: "/user/id/" + userId,
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