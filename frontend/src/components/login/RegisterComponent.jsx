import React, { useState } from "react";
import { Link,useNavigate } from "react-router-dom";
import {Register} from "../../services/Login.service"
import {SetToken} from "../../services/Session.service"

const initialState = {
    name: "",
    email:"",
    companyPosition:"",
    password:"",
    confirmPassword:"",
    isLoaded:false
}

export default function RegisterComponent(){
    const [state, setState] = new useState(initialState);
    const navigate = useNavigate();
    function onChangeInput(propName,event){
        setState((prevState) => ({...prevState, [propName]: event.target.value}))
    }

    async function handleRegisterSubmit(){
        const result = await Register(
            state.name,
            state.email,
            state.companyPosition,
            state.password
        )
        if(result != null){
            console.log("login subsess", result)
            SetToken(result)
            navigate("/profile")
        }
        else{
            console.log("error de login",result)
        }
        console.log(result)
    }
    return (
        <div className="column">
            <h1 className="title has-text-centered">{"Register"}</h1>
                <div className="field">
                    <label className="label">Name</label>
                    <div className="control">
                            <input type="text" 
                            placeholder="Enter name" 
                            value={state.name} 
                            onChange={ (event) => onChangeInput("name",event)} 
                            className="input" 
                            required/>
                        </div>
                    </div>
                <div className="field">
                    <label className="label">Email</label>
                    <div className="control">
                        <input type="email" 
                        placeholder="Enter email" 
                        value={state.email} 
                        onChange={ (event) => onChangeInput("email",event)} 
                        className="input" 
                        required/>
                    </div>
                </div>
                <div className="field">
                        <label className="label">Company Position</label>
                        <div className="control">
                            <input type="text" 
                            placeholder="Enter company position" 
                            value={state.companyPosition} 
                            onChange={ (event) => onChangeInput("companyPosition",event)} 
                            className="input" 
                            required/>
                        </div>
                    </div>
                <div className="field">
                    <label className="label">Password</label>
                    <div className="control">
                        <input type="password" 
                        placeholder="Enter password" 
                        value={state.password} 
                        onChange={ (event) => onChangeInput("password",event)} 
                        className="input" 
                        required/>
                    </div>
                </div>
                <div className="field">
                        <label className="label">Confirm Password</label>
                        <div className="control">
                            <input type="password" 
                            placeholder="Enter password" 
                            value={state.confirmPassword} 
                            onChange={ (event) => onChangeInput("confirmPassword",event)} 
                            className="input" 
                            required/>
                        </div>
                    </div>
                <div className="field is-grouped is-grouped-centered">
                    <div className="control">
                        <button type="button" className="button is-primary" onClick = {handleRegisterSubmit}>Register</button>
                    </div>
                </div>
                <div className="field is-grouped is-grouped-centered">
                    <div className="control">
                        <Link type="button" className="button is-light" to = "/login">Do you already have an account? login here</Link>
                    </div>
                </div>
        </div>
    );
}