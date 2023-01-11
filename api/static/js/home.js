var colorsId = []
var colorData = []
var gameTypes = null

function loadPage ()
{
    loadNav()

    $.ajax({
        type: "GET",
        url: "/event/all",
        contentType: "application/json; charset=utf-8",
        dataType :"json",
        success: function(result) {
            fillContent(result)
        },
        error: function(e){
            console.log(e)
        }
    });

}

function openEvent(eventId)
{

}

function getColor(callback)
{
    let index = colorsId.indexOf(id)

    console.log(colorsId)
    if (index == -1) {
        $.ajax({
            type: "GET",
            url: "/game/type/",
            contentType: "application/json; charset=utf-8",
            dataType :"json",
            success: function(result) {
                // gameTypes
                callback()
            },
            error: function(e){
                console.log(e)
            }
        });
    } else {
        callback(colorData[index])
    }
}

function addNow(obj)
{
    let end = new Date(obj.date_end)
    let out = document.createElement("div")
    out.setAttribute("class", "event")
    out.setAttribute("onclick", "openEvent(" + obj.id + ")")
    let color = document.createElement("div")
    color.setAttribute("class", "Color red")
    let time = document.createElement("div")
    time.setAttribute("class", "Time")

    let endhour = end.getHours()
    let endMinute = end.getMinutes()

    if (endhour < 10)
        endhour = "0" + endhour
    if (endMinute < 10)
        endMinute = "0" + endMinute

    time.textContent = "Fin : " + endhour + "H" + endMinute
    let name = document.createElement("div")
    name.setAttribute("class", "Name")
    name.textContent = obj.title

    out.append(color)
    out.append(time)
    out.append(name)
    document.getElementById("nowBar").append(out)
}

function addToday(obj)
{
    let end = new Date(obj.date_end)
    let start = new Date(obj.date_start)
    let out = document.createElement("div")
    out.setAttribute("onclick", "openEvent(" + obj.id + ")")
    out.setAttribute("class", "event")
    let color = document.createElement("div")
    color.setAttribute("class", "Color red")
    let time = document.createElement("div")
    time.setAttribute("class", "Time")

    let starthour = start.getHours()
    let startMinute = start.getMinutes()
    let endhour = end.getHours()
    let endMinute = end.getMinutes()

    if (starthour < 10)
        starthour = "0" + starthour
    if (startMinute < 10)
        startMinute = "0" + startMinute
    if (endhour < 10)
        endhour = "0" + endhour
    if (endMinute < 10)
        endMinute = "0" + endMinute

    time.textContent = starthour + "H" + startMinute + "-" + endhour + "H" + endMinute

    let name = document.createElement("div")
    name.setAttribute("class", "Name")
    name.textContent = obj.title
    out.append(color)
    out.append(time)
    out.append(name)
    document.getElementById("todayBar").append(out)
}

function addNext(obj)
{
    let end = new Date(obj.date_end)
    let start = new Date(obj.date_start)
    let out = document.createElement("div")
    out.setAttribute("onclick", "openEvent(" + obj.id + ")")
    out.setAttribute("class", "event")
    let color = document.createElement("div")
    color.setAttribute("class", "Color red")
    let time = document.createElement("div")
    time.setAttribute("class", "Time")
    let timeDiv = document.createElement("div")
    time.setAttribute("style", "text-align : center;")
    let str = document.createElement("p")
    let day = start.getDate() 
    if (day < 10)
        day = "0" + day
    let month = (start.getMonth() + 1)
    if (month < 10)
    month = "0" + month

    str.textContent = day + "/"+ month + "/" + start.getFullYear()
    str.setAttribute("style", "margin : 0px;")
    let string = document.createElement("p")

    let starthour = start.getHours()
    let startMinute = start.getMinutes()
    let endhour = end.getHours()
    let endMinute = end.getMinutes()

    if (starthour < 10)
        starthour = "0" + starthour
    if (startMinute < 10)
        startMinute = "0" + startMinute
    if (endhour < 10)
        endhour = "0" + endhour
    if (endMinute < 10)
        endMinute = "0" + endMinute

    string.textContent = starthour + "H" + startMinute + "-" + endhour + "H" + endMinute
    string.setAttribute("style", "margin : 0px;")
    timeDiv.append(str)
    timeDiv.append(string)
    time.append(timeDiv)
    let name = document.createElement("div")
    name.setAttribute("class", "Name")
    name.textContent = obj.title

    out.append(color)
    out.append(time)
    out.append(name)
    document.getElementById("nextBar").append(out)
}

function createEvent(obj) {
    let now = new Date()
    let start = new Date(obj.date_start)
    let end = new Date(obj.date_end)

    let nowStr = now.getFullYear() + "."+  now.getMonth() + "."+ now.getDate()
    let startStr = start.getFullYear() + "."+  start.getMonth() + "."+ start.getDate()

    getColor(obj.game_type_id, (color) => {
        console.log(color)
    })
    if (start.getTime() < now.getTime() && end.getTime() > now.getTime()) {
        addNow(obj)
    } else if (start.getTime() > now.getTime() && nowStr == startStr) {
        addToday(obj)
    } else if (start.getTime() > now.getTime()) {
        addNext(obj)
    }
}

function fillContent(data)
{
    // console.log(data)
    for (let i = 0; i < data.length; ++i) {
        createEvent(data[i])
    }
}
