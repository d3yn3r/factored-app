import React, {createContext, useEffect, useState} from "react";


const fetchUser = async token => {
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
};

export const UserContext = createContext(null)

export const UserProvider = (props) => {
    const [token, setToken] = useState(localStorage.getItem("factoredLoginToken"));
    const [user, setUser] = useState(null);

    // use the token, send a request to the /users/me and if it's ok the token is valid
    useEffect(() => {
        localStorage.setItem("factoredLoginToken", token ?? "");
        if (token) {
            fetchUser(token).then(setUser);
        }
    }, [token]);

    return (
        // to make the token and setToken accessible they are passed as a prop
        <UserContext.Provider value={{token, setToken, user, setUser}}>
            {props.children}
        </UserContext.Provider>
    )
}
