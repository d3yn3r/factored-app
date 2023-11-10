export{
    Login,
    Register
}
const apiUrl = process.env.REACT_APP_API_URL;

async function Login(email, password){
    const requestOptions = {
        method: "POST",
        headers: {"Content-Type": "application/x-www-form-urlencoded"},
        body: JSON.stringify(`grant_type=&username=${email}&password=${password}&scope=&client_id=&client_secret=`)
    };

    const response = await fetch("http://localhost:8000/api/token", requestOptions);
    const data = await response.json();

    if (!response.ok) {
        console.log(data.detail)
    } else {
        return data.access_token;
    }
}


async function Register(name,email,companyPosition,password){
    const requestOptions = {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            name,
            email,
            company_position:companyPosition,
            hashed_password:password
        })
    };

    const response = await fetch("http://localhost:8000/api/users", requestOptions);
    const data = await response.json();

    if (!response.ok) {
        console.log(data.detail)
    } else {
        return data.access_token;
    }
}
