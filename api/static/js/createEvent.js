function loadPage ()
{
    loadNav()
    loadGameType(() => {
        loadGame()
    })
    loadPlace()
}

var GameType
var Game
var Place

function loadGameType(callback)
{
    $.ajax({
        type: "GET",
        url: "/game/type",
        contentType: "application/json; charset=utf-8",
        dataType :"json",
        success: function(result) {
            GameType = result
            let select = document.getElementById("inGameType")
            for (let i = 0; i < GameType.length; ++i) {
                let option = document.createElement("option")
                option.value = GameType[i].id
                option.textContent = GameType[i].name
                select.append(option)
            }
            let option = document.createElement("option")
            option.value = "-1"
            option.textContent = "Autre"
            select.append(option)
            callback()
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
            let select = document.getElementById("inGame")
            let selected = document.getElementById("inGameType").value
            for (let i = 0; i < Game.length; ++i) {
                if (Game[i].game_type_id == selected) {
                    let option = document.createElement("option")
                    option.value = Game[i].id
                    option.textContent = Game[i].name
                    select.append(option)
                }
            }
            let option = document.createElement("option")
            option.value = "-1"
            option.textContent = "Autre"
            select.append(option)
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
            let select = document.getElementById("inPlace")
            for (let i = 0; i < Place.length; ++i) {
                let option = document.createElement("option")
                option.value = Place[i].id
                option.textContent = Place[i].name
                select.append(option)
            }
            let option = document.createElement("option")
            option.value = "-1"
            option.textContent = "Autre"
            select.append(option)
        },
        error: function(e){
            console.log(e)
        }
    });
}

function changeGameTypeSelect(selectId, fieldId)
{
    let selectValue = document.getElementById(selectId).value
    let game = document.getElementById("inGame")
    game.textContent = ""
    if (selectValue == -1) {
        document.getElementById(fieldId).disabled = false
        let option = document.createElement("option")
        option.value = "-1"
        option.textContent = "Autre"
        game.append(option)
        changeSelect("inGame", "inputGame")
    } else {
        document.getElementById(fieldId).disabled = true
        let select = document.getElementById("inGame")
        let selected = document.getElementById("inGameType").value
        for (let i = 0; i < Game.length; ++i) {
            if (Game[i].game_type_id == selected) {
                let option = document.createElement("option")
                option.value = Game[i].id
                option.textContent = Game[i].name
                select.append(option)
            }
        }
        let option = document.createElement("option")
        option.value = "-1"
        option.textContent = "Autre"
        select.append(option)
        changeSelect("inGame", "inputGame")
    }
}

function changeSelect(selectId, fieldId)
{
    let selectValue = document.getElementById(selectId).value

    if (selectValue == -1) {
        document.getElementById(fieldId).disabled = false
    } else {
        document.getElementById(fieldId).disabled = true
    }
}

function err(id)
{
    let error = document.getElementById("ErrorP")
    if (id == "notFill")
        error.textContent = "Tous les champs ne sont pas complets"
    if (id == "negativeTime")
        error.textContent = "La date de fin est inférieur à la date du début"
    if (id == "negativeNb")
        error.textContent = "Le nombre de participants ne peut pas être négatif"
    if (id == "error")
        error.textContent = "Erreur interne merci de réessayer plus tard"
}

function submit()
{
    let title = document.getElementById("titleInput").value
    let start = document.getElementById("startInput").value
    let end = document.getElementById("endInput").value
    let descr = document.getElementById("descrInput").value
    let gameTypeV = document.getElementById("inGameType").value
    let gameType = document.getElementById("inputGameType").value
    let gameV = document.getElementById("inGame").value
    let game = document.getElementById("inputGame").value
    let placeV = document.getElementById("inPlace").value
    let place = document.getElementById("inputPlace").value
    let nb = document.getElementById("inputNb").value

    let startStamp = new Date(start).getTime()
    let endStamp = new Date(end).getTime()

    if (!startStamp || !endStamp || !title || !descr || !nb) {
        err("notFill")
        return
    }

    if (endStamp <= startStamp) {
        err("negativeTime")
        return
    }

    if (nb < 0) {
        err("negativeNb")
        return
    }

    let startOut = start.replace("T", " ") + ":00"
    let endOut = end.replace("T", " ") + ":00"

    let data = JSON.stringify({
        "title" : title,
        "description" : descr,
        "place_id" : placeV,
        "place_custom" : place,
        "game_custom" : game,
        "game_type_custom" : gameType,
        "register_max" : nb,
        "game_id" : gameV,
        "game_type_id" : gameTypeV,
        "date_start" : startOut,
        "date_end" : endOut
    })
    
    $.ajax({
        type: "POST",
        url: "/event",
        data: data,
        contentType: "application/json; charset=utf-8",
        dataType :"json",
        headers: {
            "Authorization":"Bearer " + sessionStorage.getItem("lvdrToken")
        },
        success: function(result) {
            window.location.href = "/"
        },
        error: function(e){
            err("error")
            console.log(e)
        }
    });
}