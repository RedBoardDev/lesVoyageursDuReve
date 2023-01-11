var Event 
var Players
const urlParams = new URLSearchParams(window.location.search);

function loadPage ()
{
    loadNav()
    loadEvent(()=>{
        loadPlayers(()=>{

        })
    })
}

function getgameType (data, callback)
{
    if (data.game_type_id != -1) {
        $.ajax({
            type: "GET",
            url: "/game/type/" + data.game_type_id,
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
        callback({"name" : data.game_type_custom, "color" : "#00FF00"})
    }
}

function getgame (data, callback)
{
    if (data.game_id != -1) {
        $.ajax({
            type: "GET",
            url: "/game/" + data.game_id,
            contentType: "application/json; charset=utf-8",
            dataType :"json",
            success: function(result) {
                callback(result[0])
            },
            error: function(e){
                console.log(e)
            }
        });
    } else {
        callback({"name" : data.game_custom})
    }
}

function getplace (data, callback)
{
    if (data.place_id != -1) {
        $.ajax({
            type: "GET",
            url: "/place/" + data.place_id,
            contentType: "application/json; charset=utf-8",
            dataType :"json",
            success: function(result) {
                callback(result[0])
            },
            error: function(e){
                console.log(e)
            }
        });
    } else {
        callback({"name" : data.place_custom})
    }
}

function getAdmin(data, callback)
{
    $.ajax({
        type: "GET",
        url: "/user/id/" + data.admin_user_id,
        contentType: "application/json; charset=utf-8",
        dataType :"json",
        success: function(result) {
            let discord = result.discord_avater
            if (discord == null)
                discord = "assets/user.png"
            callback({"username" : result.username, "discord_avater" : discord})
        },
        error: function(e){
            console.log(e)
        }
    });
    
}


function fillEvent(data)
{
    let start = new Date(data.date_start)
    let end = new Date(data.date_end)
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
    getgameType(data ,(out) => {
        document.getElementById("typeColor").setAttribute("style" , "background-color :" + out.color + ";")
        document.getElementById("typeName").textContent = out.name
    })

    getgame(data, (out) => {
        document.getElementById("gameInput").value = out.name
    })
    
    getplace(data, (out) => {
        document.getElementById("placeInput").value = out.name
    })

    getAdmin(data, (out) => {
        document.getElementById("adminHead").setAttribute("src", out.discord_avater)
        document.getElementById("adminName").textContent = out.username
    })
    }

function loadEvent(callback)
{
    $.ajax({
        type: "GET",
        url: "event/" + urlParams.get('id'),
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
    if (player.discord_avater != null)
        img.setAttribute("src", player.discord_avater)
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
    if (Event.user_registered_array != "") {
        let players = JSON.parse(Event.user_registered_array)
        let pass = 0

        for (let i = 0; i < players.length; ++i) {
            $.ajax({
                type: "GET",
                url: "user/id/" + players[i],
                contentType: "application/json; charset=utf-8",
                dataType :"json",
                success: function(result) {
                    CreatePLayer(result)
                    pass += 1;
                    if (pass == players.length) {
                        for (let i = 0; i < Event.register_max - players.length; ++i) {
                            CreatePLayer({"username" : "______", "discord_avater" : null})
                        }
                    }
                },
                error: function(e){
                    console.log(e)
                }
            });
        }
        if (players.length == 0) {
            for (let i = 0; i < Event.register_max ; ++i) {
                CreatePLayer({"username" : "______", "discord_avater" : null})
            }
        }

        
    } else {
        for (let i = 0; i < Event.register_max ; ++i) {
            CreatePLayer({"username" : "______", "discord_avater" : null})
        }
    }
}