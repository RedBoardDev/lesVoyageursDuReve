var Event 
var Players
const urlParams = new URLSearchParams(window.location.search);
var Users
var Comment
var sortOrder = 1

var chatBarFocus = false

function loadPage ()
{
    loadNav()
    loadEvent(()=>{
        loadUsers(() => {
            loadPlayers(()=>{})
            loadChat(() => {
                loadComment()
            })

        })
    })
    document.getElementById("chatBar").addEventListener('focusin', (event) => {
        chatBarFocus = true
    });

    document.getElementById("chatBar").addEventListener('focusout', (event) => {
        chatBarFocus = false
    });

    addEventListener('keypress', (event) => {
        if (event.code == "Enter" && chatBarFocus) {
            sendComment()
        }
    });

}

function getplace (data, callback)
{
    if (data.place_id != -1) {
        $.ajax({
            type: "GET",
            url: API() + "/place/" + data.place_id,
            contentType: "application/json; charset=utf-8",
            dataType :"json",
            success: function(result) {
                callback(result)
            },
            error: function(e){
                console.log(e)
            }
        });
    } else {
        callback({"place_name" : data.place_custom})
    }
}

function getAdmin(data, callback)
{
    $.ajax({
        type: "GET",
        url: API() + "/user/id/" + data.admin_user_id,
        contentType: "application/json; charset=utf-8",
        dataType :"json",
        success: function(result) {
            let discord = result.discord_avatar
            if (discord == null || discord == "0")
                discord = "assets/user.png"
            callback({"username" : result.username, "discord_avatar" : discord})
        },
        error: function(e){
            console.log(e)
        }
    });
}

function creatTag(name)
{
    let tagBal = document.createElement('div')
    tagBal.setAttribute("class" , "tagBal")
    tagBal.setAttribute("name" , "TAG" + name)
    // let delTag = document.createElement("div")
    // delTag.setAttribute("class", "delTag")
    // let img = document.createElement("img")
    // img.setAttribute("src" , "./assets/close.png")
    // img.setAttribute("onclick" , "delTag(`" + name + "`)" )
    // delTag.append(img)
    // tagBal.append(delTag)
    let textTag = document.createElement("div")
    textTag.setAttribute("class", "textTag")
    textTag.textContent = name
    tagBal.append(textTag)
    return tagBal
}


function fillEvent(data)
{
    // document.getElementById("PageTitle").textContent = data.title;
    let start = new Date(parseInt(data.date_start))
    let end = new Date(parseInt(data.date_end))
    document.getElementById("titleInput").value = data.title
    document.getElementById("descrInput").textContent = data.description

    let starthour = start.getHours()
    let startMinute = start.getMinutes()
    let dayStart = start.getDate() 
    let monthStart = (start.getMonth() + 1)

    if (dayStart < 10)
        dayStart = "0" + dayStart
    if (monthStart < 10)
        monthStart = "0" + monthStart
    if (starthour < 10)
        starthour = "0" + starthour
    if (startMinute < 10)
        startMinute = "0" + startMinute

    start = dayStart + "/"+ monthStart + "/" + start.getFullYear() + " " +  starthour + "H" + startMinute
    let endhour = end.getHours()
    let endMinute = end.getMinutes()
    let dayEnd = end.getDate()
    let monthEnd = (end.getMonth() + 1)

    if (dayEnd < 10)
        dayEnd = "0" + dayEnd
    if (monthEnd < 10)
        monthEnd = "0" + monthEnd
    if (endhour < 10)
        endhour = "0" + endhour
    if (endMinute < 10)
        endMinute = "0" + endMinute

    end = dayEnd + "/"+ monthEnd + "/" + end.getFullYear() + " " + endhour + "H" + endMinute

    document.getElementById("startInput").value = start
    document.getElementById("endInput").value = end
    getplace(data, (out) => {
        try {
            document.getElementById("placeInput").value = out.place_name
            if (out.city && out.adresse) {
                document.getElementById("adresse").textContent = out.city + "," + out.adresse
                document.getElementById("adresse").setAttribute("onclick" , "window.open( `https://www.google.fr/maps/place/" + out.adresse + "," + out.city + "`)")
            }
        } catch {}
    })


    let tagTmp = JSON.parse(data.tags)
    let tagListDiv = document.getElementById("tagsList")
    for (let i = 0; i < tagTmp.length; ++i) {
        tagListDiv.append(creatTag(tagTmp[i]))
    }


    getAdmin(data, (out) => {
        document.getElementById("adminHead").setAttribute("src", out.discord_avatar)
        document.getElementById("adminName").textContent = out.username
    })

    getMe(sessionStorage.getItem("lvdrToken"), (out) => {
        let players = []
        if (Event.user_registered_array != "") {
            players = JSON.parse(Event.user_registered_array)
        }
        let register = document.getElementById("registerButton")
        if (players.length < parseInt(Event.register_max) && players.indexOf(out.id) == -1 && Event.admin_user_id != out.id) {
            register.setAttribute("style", "display: block;")
            register.setAttribute("onclick", "register('" + out.id + "')")
        }
        let unregister = document.getElementById("unregisterButton")
        if (players.indexOf(out.id) != -1) {
            unregister.setAttribute("style", "display: block;")
            unregister.setAttribute("onclick", "unregister('" + out.id + "')")
        }
    })
    }

function loadEvent(callback)
{
    $.ajax({
        type: "GET",
        url: API() + "event/" + urlParams.get('id'),
        contentType: "application/json; charset=utf-8",
        dataType :"json",
        success: function(result) {
            Event = result
            fillEvent(result)
            callback()
        },
        error: function(e){
            console.log(e)
        }
    });
}

function CreatePLayer (player)
{
    let playerDIV = document.createElement("div")
    let playerPicture = document.createElement("div")
    let playerName = document.createElement("div")
    let img = document.createElement("img")
    if (player.discord_avatar != null && player.discord_avatar != "0")
        img.setAttribute("src", player.discord_avatar)
    else
        img.setAttribute("src", "assets/user.png")
    playerName.setAttribute("class" , "playerName")
    playerPicture.setAttribute("class" , "playerPicture")
    playerName.textContent = player.username
    playerPicture.append(img)
    playerDIV.append(playerPicture)
    playerDIV.append(playerName)
    playerDIV.setAttribute("class","player")
    document.getElementById("players").append(playerDIV)
}

function loadPlayers()
{
    if (Event.register_max > 16) {
        document.getElementById("players").setAttribute("style" , "overflow-y: scroll;padding-right: 1em;")
    }
    if (Event.user_registered_array != "") {
        let players = JSON.parse(Event.user_registered_array)
        let pass = 0
        for (let i = 0; i < Users.length; ++i) {
            for (let j = 0; j < players.length; ++j) {
                if (Users[i].id == players[j]) {
                    ++pass;
                    CreatePLayer(Users[i])
                }
            }
            if (pass == players.length) {
                break
            }
        }
        for (let i = 0; i < Event.register_max - players.length ; ++i) {
            CreatePLayer({"username" : "______", "discord_avatar" : null})
        }
    } else {
        for (let i = 0; i < Event.register_max ; ++i) {
            CreatePLayer({"username" : "______", "discord_avatar" : null})
        }
    }
}

function register(id)
{
    let data = JSON.stringify({"user" : id.toString()})

    $.ajax({
        type: "PUT",
        url: API() + "/event/register/" + Event.id,
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

function unregister(id)
{
    let data = JSON.stringify({"user" : id.toString()})

    $.ajax({
        type: "PUT",
        url: API() + "/event/unregister/" + Event.id,
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


function loadUsers(callback)
{
    $.ajax({
        type: "GET",
        url: API() + "/user",
        contentType: "application/json; charset=utf-8",
        dataType :"json",
        success: function(result) {
            Users = result
            callback()
        },
        error: function(e){
            console.log(e)
        }
    });
}

function loadChat(callback)
{
    $.ajax({
        type: "GET",
        url: API() + "/comment/" + Event.id,
        contentType: "application/json; charset=utf-8",
        dataType :"json",
        success: function(result) {
            result = result.sort((o1, o2) => {
                if (o1.created_at > o2.created_at) {
                    return 1;
                }
                if (o1.created_at < o2.created_at) {
                    return -1;
                }
                return 0;
            });
            Comment = result
            callback()
        },
        error: function(e){
            console.log(e)
        }
    });
}


function genComment(comment)
{
    let commentUser = Users.find(element => element.id == comment.user_id)


    let MainDiv = document.createElement("div")
    MainDiv.setAttribute("class" , "MainChatDiv")
    let Chat = document.createElement("div")
    Chat.setAttribute("class" , "Chat")
    let ChatProfil = document.createElement("div")
    ChatProfil.setAttribute("class" , "ChatProfil")
    let ChatPicture = document.createElement("div")
    ChatPicture.setAttribute("class" , "ChatPicture")
    let img = document.createElement("img")

    if (commentUser.discord_avatar == "0")
        img.setAttribute("src" , "assets/user.png")
    else
        img.setAttribute("src" , commentUser.discord_avatar)
    ChatPicture.append(img)
    ChatProfil.append(ChatPicture)
    let ChatProfilName = document.createElement("div")
    ChatProfilName.setAttribute("class" , "ChatProfilName")
    let p1 = document.createElement("p")
    p1.textContent = commentUser.username
    ChatProfilName.append(p1)
    ChatProfil.append(ChatProfilName)
    Chat.append(ChatProfil)
    let ChatText = document.createElement("div")
    ChatText.setAttribute("class" , "ChatText")
    let ChatDate = document.createElement("div")
    ChatDate.setAttribute("class" , "ChatDate")
    let p2 = document.createElement("p")
    let date = new Date(parseInt(comment.created_at))

    let starthour = date.getHours()
    let startMinute = date.getMinutes()
    let dayStart = date.getDate() 
    let monthStart = (date.getMonth() + 1)

    if (dayStart < 10)
        dayStart = "0" + dayStart
    if (monthStart < 10)
        monthStart = "0" + monthStart
    if (starthour < 10)
        starthour = "0" + starthour
    if (startMinute < 10)
        startMinute = "0" + startMinute

    date = dayStart + "/"+ monthStart + "/" + date.getFullYear() + " " +  starthour + "H" + startMinute

    p2.textContent = date
    ChatDate.append(p2)
    ChatText.append(ChatDate)
    let ChatTextIn = document.createElement("div")
    ChatTextIn.setAttribute("class" , "ChatTextIn")
    let p3 = document.createElement("p")
    p3.textContent = comment.message
    ChatTextIn.append(p3)
    ChatText.append(ChatTextIn)
    Chat.append(ChatText)
    MainDiv.append(Chat)
    document.getElementById("MainChatDiv").append(MainDiv)
}

function loadComment()
{
    document.getElementById("MainChatDiv").textContent = ""
    if (sortOrder == 1) {
        for (let i = 0; i < Comment.length; ++i) {
            genComment(Comment[i])
        }
    } else {
        for (let i = Comment.length - 1; i >= 0; --i) {
            genComment(Comment[i])
        }
    }
    
}

function sendComment()
{
    let bar = document.getElementById("chatBar").value
    if(bar == "")
        return
    let data = JSON.stringify({
        "event_id" : Event.id,
        "message" : bar
    })

    $.ajax({
        type: "POST",
        url: API() + "/comment",
        data: data,
        contentType: "application/json; charset=utf-8",
        dataType :"json",
        headers: {
            "Authorization":"Bearer " + sessionStorage.getItem("lvdrToken")
        },
        success: function(result) {
            document.getElementById("chatBar").value = ""
            loadChat(() => {
                loadComment()
            })
        },
        error: function(e){
            console.log(e)
        }
    });
}

function changeSens()
{
    if (sortOrder == 1) {
        sortOrder = 0
        loadChat(() => {
            loadComment()
        })
        document.getElementById("arrowChange").removeAttribute("style")
    } else {
        sortOrder = 1
        loadChat(() => {
            loadComment()
        })
        document.getElementById("arrowChange").setAttribute("style", "transform: rotate(180deg);")
    }
}