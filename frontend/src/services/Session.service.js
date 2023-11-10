export{
    SetToken,
    GetToken,
    RemoveToken
}

function SetToken(token){
    localStorage.setItem("token",token)
}

function GetToken(){
    return localStorage.getItem("token")
}

function RemoveToken(){
    localStorage.removeItem("token")
}


