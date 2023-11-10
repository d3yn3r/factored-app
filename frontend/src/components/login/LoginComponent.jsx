import React, { useState } from "react";
import {Login}   from "../../services/Login.service"
import { Link,useNavigate} from "react-router-dom";
import {SetToken} from "../../services/Session.service"
import "../login/StyleLogin.css";

const initialState = {
    email: "",
    password: "",
    isLoading: false
}


export default function LoginComponent(){
    const [state, setState] = new useState(initialState);
    const navigate = useNavigate();
    function onChangeEmail(event){
        setState((prevState) => ({...prevState, email: event.target.value}))
    }
    function onChangePassword(event){
        setState((prevState) => ({...prevState, password: event.target.value}))
    }
    async function handleLoginSubmit(){      
        const result = await Login(state.email,state.password)
        if(result != null){
            console.log("login subsess", result)
            SetToken(result)
            navigate("/profile")
        }
        else{
            console.log("error de login",result)
        }
    }
    return (
        <div className="column is-half is-offset-one-quarter">
            <h1 className="title has-text-centered">{"Factored"}</h1>
            <div className = "container">
                <div className="field">
                    <label className="label">Email</label>
                    <div className="form-group">
                        <input 
                        type="email" 
                        placeholder="Enter email" 
                        value={state.email}
                        onChange={onChangeEmail} 
                        className="input" 
                        required/>
                    </div>
                </div>
                <div className="field">
                    <label className="label">Password</label>
                    <div className="form-group">
                        <input 
                        type="password" 
                        placeholder="Enter password" 
                        value={state.password} 
                        onChange={onChangePassword} 
                        className="input" 
                        required/>
                        </div>
                    </div>
                <div className="field is-grouped is-grouped-centered">
                    <div className="form-group">
                        <button type="button" className="button is-primary" onClick = {handleLoginSubmit}>{"Login"}</button>
                    </div>
                </div>
                <div className="field is-grouped is-grouped-centered">
                    <div className="control">
                        <Link type="button" className="button is-light" to={"/register"}>Don't you have an account? Register here</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

