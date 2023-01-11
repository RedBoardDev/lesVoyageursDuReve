function loadPage ()
{
    loadNav()
    loadEvents()
}

function loadEvents ()
{
    fillContent({"data" : [
        {
            "name" : "Soirée jeu de plateau",
            "start" : "2023-01-10T15:46:11.000Z",
            "end" : "2023-01-10T19:46:11.000Z",
            "gametype" : 0,
            "id" : 1
        },
        {
            "name" : "Soirée jeu de plateau",
            "start" : "2023-01-10T19:46:11.000Z",
            "end" : "2023-01-10T21:46:11.000Z",
            "gametype" : 0,
            "id" : 2
        },
        {
            "name" : "Soirée jeu de plateau",
            "start" : "2023-01-11T19:46:11.000Z",
            "end" : "2023-01-12T02:46:11.000Z",
            "gametype" : 0,
            "id" : 3
        }
    ]})
    $.ajax({
        type: "GET",
        url: "/event",
        contentType: "application/json; charset=utf-8",
        dataType :"json",
        headers: {
            "Authorization":"Bearer " + sessionStorage.getItem("lvdeToken")
        },
        success: function(result) {
            fillContent(result)
        },
        error: function(e){
            console.log(e)
        }
    });
}

function CreateEvent(start, startMin, end, endMin, color, name, day)
{
    let CalDay = document.getElementById(day)
    

    console.log(CalDay)
}

function loadEvent(obj)
{
    let start = new Date(obj.start)
    let end = new Date(obj.end)
    let week = ["lundi","mardi", "mercredi","jeudi", "vendredi","samedi","dimanche"]

    if (start.getDate() != end.getDate()) {
        CreateEvent(start.getHours(), start.getMinutes(), 24, 00, "#ff0000", "Soirée jeu de plateau", week[start.getDay() - 1])
        CreateEvent(0, 0, end.getHours(), end.getMinutes(),  "#ff0000", "Soirée jeu de plateau", week[end.getDay() - 1])
    } else {
        CreateEvent(start.getHours(), start.getMinutes(), end.getHours(), start.getMinutes(), "#ff0000", "Soirée jeu de plateau", week[start.getDay() - 1])
    }
}

function fillContent(obj)
{
    for (let i = 0; i < obj.data.length; ++i) {
        loadEvent(obj.data[i])
    }
}