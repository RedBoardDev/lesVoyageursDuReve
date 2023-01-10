function getMe(token, callback)
{
    $.ajax({
        type: "GET",
        url: "/user/me",
        contentType: "application/json; charset=utf-8",
        dataType :"json",
        headers: {
            "Authorization":"Bearer " + token
        },
        success: function(result) {
            if (callback)
                callback(result)
        },
        error: function(e){
            if (callback)
                callback(null)
            console.log(e)
        }
    });
}