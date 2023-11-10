import { GetToken } from "./Session.service";
export {
    GetUser,
    GetUserSkills
}

const apiUrl = process.env.REACT_APP_API_URL;

async function GetUser(){
    const token = GetToken();
    console.log(token)
    if (token!=null){
        const requestOptions = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
        };
        // make the request
        const response = await fetch("http://localhost:8000/api/users/profile", requestOptions);
        return response.json();
    }
    else{
        return null
    }
}

async function GetUserSkills(){
    const token = GetToken();
    console.log(token)
    if (token!=null){
        const requestOptions = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
        };
        const response = await fetch("http://localhost:8000/api/skills", requestOptions);
        if (response.ok) {
            return await response.json();
        } else {
            return null
        }
    }
    else{
        return null
    }
}