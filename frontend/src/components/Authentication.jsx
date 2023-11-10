import React, { useContext, useState } from "react";
import { UserContext } from "../context/UserContext";
import ErrorMessage from "./ErrorMessage";

const apiUrl = process.env.REACT_APP_API_URL;
// name of the component
const Authentication = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [companyPosition, setCompanyPosition] = useState("");
    const [password, setPassword] = useState("");
    const [confirmationPassword, setConfirmationPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    // set the token so when registered it automatically logs in, as the token is not needed, just ignore it
    const { setToken } = useContext(UserContext);

    // to change to the register screen
    const [isRegister, setIsRegister] = useState(false);

    const handleIsRegister = () => {
        setIsRegister(!isRegister);
    };

    // submit the registration information
    const submitRegistration = async () => {
        const requestOptions = {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ name: name, email: email, company_position: companyPosition, hashed_password: password }),
        };
        
        const response = await fetch("http://localhost:8000/api/users", requestOptions);
        const data = await response.json();

        if (!response.ok) {
            setErrorMessage(data.detail);
        } else {
            setToken(data.access_token);
        }
    };

    const handleRegisterSubmit = (e) => {
        e.preventDefault(); // it stops the form from doing default things
        if (password === confirmationPassword && password.length >= 8) {
            submitRegistration();
        } else {
            setErrorMessage("Make sure the passwords match and are at least 8 characters long");
        }
    };

    // submit the login information
    const submitLogin = async () => {
        const requestOptions = {
            method: "POST",
            headers: {"Content-Type": "application/x-www-form-urlencoded"},
            body: JSON.stringify(`grant_type=&username=${email}&password=${password}&scope=&client_id=&client_secret=`)
        };

        const response = await fetch("http://localhost:8000/api/token", requestOptions);
        const data = await response.json();

        if (!response.ok) {
            setErrorMessage(data.detail);
            console.log(data.detail)
        } else {
            setToken(data.access_token);
        }
    };

    const handleLoginSubmit = (e) => {
        e.preventDefault();
        submitLogin();
    };

    // create the registration form
    return (
        <div className="column">
            <div>{isRegister}</div>
            <form className="box" onSubmit={ isRegister ? handleRegisterSubmit : handleLoginSubmit }>
                <h1 className="title has-text-centered">{isRegister ? "Register" : "Login"}</h1>
                {isRegister && (
                    <div className="field">
                        <label className="label">Name</label>
                        <div className="control">
                            <input type="text" placeholder="Enter name" value={name} onChange={ (e) => setName(e.target.value)} className="input" required/>
                        </div>
                    </div>
                )}
                <div className="field">
                    <label className="label">Email</label>
                    <div className="control">
                        <input type="email" placeholder="Enter email" value={email} onChange={ (e) => setEmail(e.target.value)} className="input" required/>
                    </div>
                </div>
                {isRegister && (
                    <div className="field">
                        <label className="label">Company Position</label>
                        <div className="control">
                            <input type="text" placeholder="Enter company position" value={companyPosition} onChange={ (e) => setCompanyPosition(e.target.value)} className="input" required/>
                        </div>
                    </div>
                )}
                <div className="field">
                    <label className="label">Password</label>
                    <div className="control">
                        <input type="password" placeholder="Enter password" value={password} onChange={ (e) => setPassword(e.target.value)} className="input" required/>
                    </div>
                </div>
                {isRegister && (
                    <div className="field">
                        <label className="label">Confirm Password</label>
                        <div className="control">
                            <input type="password" placeholder="Enter password" value={confirmationPassword} onChange={ (e) => setConfirmationPassword(e.target.value)} className="input" required/>
                        </div>
                    </div>
                )}
                <ErrorMessage message={errorMessage}/>
                <br/>
                <div className="field is-grouped is-grouped-centered">
                    <div className="control">
                        <button type="submit" className="button is-primary">{!isRegister ? "Login" : "Register"}</button>
                    </div>
                </div>
                <div className="field is-grouped is-grouped-centered">
                    <div className="control">
                        <button type="button" className="button is-light" onClick={handleIsRegister}>Change to {isRegister ? "Login" : "Register"}</button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default Authentication;
