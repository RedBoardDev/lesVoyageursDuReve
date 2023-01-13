function loadPage ()
{
    loadNav()

    getMe(sessionStorage.getItem("lvdrToken"), (user) => {
        if (user) {
            if (user.permission_id >= 2) {
                loadGameType()
                loadGame()
                loadPlace()
                loadUsers()
            } else {
                window.location.href = "/"
            }
        } else {
            window.location.href = "/"
        }

    })
}

var GameType
var Game
var Place
var Users

function loadUsers()
{
    $.ajax({
        type: "GET",
        url: "/user",
        contentType: "application/json; charset=utf-8",
        dataType :"json",
        headers: {
            "Authorization":"Bearer " + sessionStorage.getItem("lvdrToken")
        },
        success: function(result) {
            Users = result
            let selector = document.getElementById("UserSelect")

            for (let i = 0; i < result.length; ++i) {
                let option = document.createElement("option")
                option.setAttribute("value" , result[i].id)
                option.textContent = result[i].username
                selector.append(option)
            }
        },
        error: function(e){
            console.log(e)
        }
    });
}

function loadGameType()
{
    $.ajax({
        type: "GET",
        url: "/game/type",
        contentType: "application/json; charset=utf-8",
        dataType :"json",
        success: function(result) {
           GameType = result
           AddSelect("delGameType", result)
           AddSelect("GameTypeSelect", result)
        },
        error: function(e){
            console.log(e)
        }
    });
}

function loadGame()
{
    $.ajax({
        type: "GET",
        url: "/game",
        contentType: "application/json; charset=utf-8",
        dataType :"json",
        success: function(result) {
            Game = result
            AddSelect("delGame", result)
        },
        error: function(e){
            console.log(e)
        }
    });
}

function loadPlace()
{
    $.ajax({
        type: "GET",
        url: "/place",
        contentType: "application/json; charset=utf-8",
        dataType :"json",
        success: function(result) {
            Place = result
            AddSelect("delPlace", result)
        },
        error: function(e){
            console.log(e)
        }
    });
}

function AddSelect(selectorId, data)
{
    let selector = document.getElementById(selectorId)

    for (let i = 0; i < data.length; ++i) {
        let option = document.createElement("option")
        option.setAttribute("value" , data[i].id)
        option.textContent = data[i].name
        selector.append(option)
    }
}

function remove(selectorId, type)
{
    let valueToRM = document.getElementById(selectorId).value

    if(valueToRM == -1)
        return

    $.ajax({
        type: "DELETE",
        url: "/" + type + "/" + valueToRM,
        contentType: "application/json; charset=utf-8",
        dataType :"json",
        headers: {
            "Authorization":"Bearer " + sessionStorage.getItem("lvdrToken")
        },
        success: function(result) {
            window.location.reload()
        },
        error: function(e){
            err("error")
            console.log(e)
        }
    });
}

function createGameType()
{
    let name = document.getElementById("AddGameTypeInput").value
    let color = document.getElementById("color").value

    if (name == "")
        return

    let data = JSON.stringify({
        "name" : name,
        "color" : color
    })

    $.ajax({
        type: "POST",
        url: "/game/type",
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

function createGame()
{
    let name = document.getElementById("AddGameInput").value
    let gameType = document.getElementById("GameTypeSelect").value

    if (name == "" && gameType != -1)
        return

    let data = JSON.stringify({
        "name" : name,
        "game_type_id" : gameType
    })

    $.ajax({
        type: "POST",
        url: "/game",
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

function createPlace ()
{
    let name = document.getElementById("AddPlaceInputName").value
    let city = document.getElementById("AddPlaceInputCity").value
    let adresse = document.getElementById("AddPlaceInputAdresse").value

    if (name == "" || city == "" || adresse == "")
        return

    let data = JSON.stringify({
        "name" : name,
        "city" : city,
        "adresse" : adresse
    })

    $.ajax({
        type: "POST",
        url: "/place",
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

function changeUser()
{
    let selector = document.getElementById("UserSelect").value

    if (selector == -1) {
        document.getElementById("UserUsername").value = ""
        document.getElementById("UserEmail").value = ""
        document.getElementById("UserPerm").value = ""
    } else {
        let User = Users.find(element => element.id == selector)
        document.getElementById("UserUsername").value = User.username
        document.getElementById("UserEmail").value = User.email
        document.getElementById("UserPerm").value = User.permission_id
    }
}

function deleteUser()
{
    let value = document.getElementById("UserSelect").value

    if (value == -1)
        return
    $.ajax({
        type: "DELETE",
        url: "/user/id/" + value,
        contentType: "application/json; charset=utf-8",
        dataType :"json",
        headers: {
            "Authorization":"Bearer " + sessionStorage.getItem("lvdrToken")
        },
        success: function(result) {
            window.location.reload()
        },
        error: function(e){
            err("error")
            console.log(e)
        }
    });
}

function updateUser()
{
    let value = document.getElementById("UserSelect").value
    let username = document.getElementById("UserUsername").value
    let email = document.getElementById("UserEmail").value
    let perm = document.getElementById("UserPerm").value
    let password = document.getElementById("UserPassword").value

    if (perm < 0 || perm > 2)
        return

    let data = {
        "email" : email,
        "username" : username,
        "permission_id" : perm,
    }
    if (password != "")
        data.password = password

    $.ajax({
        type: "PUT",
        url: "/user/id/" + value,
        data: JSON.stringify(data),
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