function loadPage ()
{
    loadNav()

    getMe(sessionStorage.getItem("lvdrToken"), (user) => {
        if (user) {
            if (user.permission_id >= 2) {
                // loadGameType()
                loadTag()
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

// var GameType
var Tag
var Place
var Users

function loadUsers()
{
    $.ajax({
        type: "GET",
        url: API() + "/user",
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

function loadTag()
{
    $.ajax({
        type: "GET",
        url: API() + "/tags",
        contentType: "application/json; charset=utf-8",
        dataType :"json",
        success: function(result) {
            Tag = result
            AddSelect("delTag", result)
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
        url: API() + "/place",
        contentType: "application/json; charset=utf-8",
        dataType :"json",
        success: function(result) {
            Place = result
            AddSelectPlace("delPlace", result)
        },
        error: function(e){
            console.log(e)
        }
    });
}

function AddSelectPlace(selectorId, data)
{
    let selector = document.getElementById(selectorId)

    for (let i = 0; i < data.length; ++i) {
        let option = document.createElement("option")
        option.setAttribute("value" , data[i].id)
        option.textContent = data[i].place_name
        selector.append(option)
    }
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
        url: API() + "/" + type + "/" + valueToRM,
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



function createPlace()
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
        url: API() + "/place",
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
        url: API() + "/user/id/" + value,
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
        url: API() + "/user/id/" + value,
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