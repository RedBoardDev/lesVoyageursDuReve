function loadPage ()
{
    loadNav()
    getMe(sessionStorage.getItem("lvdrToken"), (user) => {
        if (user) {
            if (user.permission_id >= 1) {
                loadTags()
                loadPlace()
                addEventListener('keypress', (event) => {
                    if (event.code == "Enter") {
                        if (tagInputFocused) {
                            addTag()
                        }
                    }
                });

            } else {
                window.location.href = "/"
            }
        } else {
            window.location.href = "/"
        }
    })
}

var Tags
var outTagList = []
var Place
var tagInputFocused = false

function loadTags()
{
    $.ajax({
        type: "GET",
        url: API() + "/tags",
        contentType: "application/json; charset=utf-8",
        dataType :"json",
        success: function(result) {
            Tags = result
            let select = document.getElementById("intags")
            for (let i = 0; i < Tags.length; ++i) {
                let option = document.createElement("option")
                option.value = Tags[i].name
                option.textContent = Tags[i].name
                select.append(option)
            }
            let option = document.createElement("option")
            option.value = "-1"
            option.textContent = "Autre"
            select.append(option)
            changeSelect("intags", "tagInput")
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
            let select = document.getElementById("inPlace")
            for (let i = 0; i < Place.length; ++i) {
                let option = document.createElement("option")
                option.value = Place[i].id
                option.textContent = Place[i].place_name
                select.append(option)
            }
            let option = document.createElement("option")
            option.value = "-1"
            option.textContent = "Autre"
            select.append(option)
            changeSelect("inPlace", "inputPlace")
        },
        error: function(e){
            console.log(e)
        }
    });
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



function creatTag(name)
{
    let tagBal = document.createElement('div')
    tagBal.setAttribute("class" , "tagBal")
    tagBal.setAttribute("name" , "TAG" + name)
    let delTag = document.createElement("div")
    delTag.setAttribute("class", "delTag")
    let img = document.createElement("img")
    img.setAttribute("src" , "./assets/close.png")
    img.setAttribute("onclick" , "delTag(`" + name + "`)" )
    delTag.append(img)
    tagBal.append(delTag)
    let textTag = document.createElement("div")
    textTag.setAttribute("class", "textTag")
    textTag.textContent = name
    tagBal.append(textTag)
    return tagBal
}

function delTag(name)
{
    document.getElementsByName("TAG" + name)[0].remove()
    let indexCurrent = outTagList.findIndex((elem) => elem == name)
    delete outTagList[indexCurrent]
}

function addTag()
{
    let select = document.getElementById("intags")
    let tagName = ""
    
    if(select.value == "-1")
        tagName = document.getElementById("tagInput").value
    else
        tagName = select.value

    tagName =  tagName.replaceAll("`", "'")
    let indexCurrent = outTagList.findIndex((elem) => elem == tagName)
    if (indexCurrent == -1) {
        document.getElementById("tagsList").append(creatTag(tagName))

        outTagList.push(tagName)
        document.getElementById("tagInput").value = ""
    }
}

function selectTag()
{
    let select = document.getElementById("intags")
    
    if(select.value != "-1") {
        let tagName = select.value
        let indexCurrent = outTagList.findIndex((elem) => elem == tagName)
        if (indexCurrent == -1) {
            document.getElementById("tagsList").append(creatTag(tagName))
            outTagList.push(tagName)
        }
    }
}

function PostTag(tag)
{
    let data = JSON.stringify({"tags" : tag})
    $.ajax({
        type: "POST",
        url: API() + "/tags",
        data: data,
        contentType: "application/json; charset=utf-8",
        dataType :"json",
        headers: {
            "Authorization":"Bearer " + sessionStorage.getItem("lvdrToken")
        }
    });
}

function submit()
{
    let title = document.getElementById("titleInput").value
    let start = document.getElementById("startInput").value
    let end = document.getElementById("endInput").value
    let descr = document.getElementById("descrInput").value
    let placeV = document.getElementById("inPlace").value
    let place = document.getElementById("inputPlace").value
    let nb = document.getElementById("inputNb").value

    let startStamp = new Date(start).getTime().toString()
    let endStamp = new Date(end).getTime().toString()


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

    

    let data = JSON.stringify({
        "title" : title,
        "description" : descr,
        "place_id" : placeV,
        "place_custom" : place,
        "register_max" : nb,
        "date_start" : startStamp,
        "date_end" : endStamp,
        "tags" : JSON.stringify(outTagList)
    })
    
    $.ajax({
        type: "POST",
        url: API() + "/event",
        data: data,
        contentType: "application/json; charset=utf-8",
        dataType :"json",
        headers: {
            "Authorization":"Bearer " + sessionStorage.getItem("lvdrToken")
        },
        success: function(result) {
            for (let i = 0; i < outTagList.length; ++i) {
                if (Tags.findIndex((elem) => elem == outTagList[i]) == -1) {
                    PostTag(outTagList[i])
                }
            }
            window.location.href = "/"
        },
        error: function(e){
            err("error")
            console.log(e)
        }
    });
}