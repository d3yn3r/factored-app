import React from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RegisterComponent from "./components/login/RegisterComponent";
import LoginComponent from "./components/login/LoginComponent";
import Profile from "./components/profile/Profile";


export default function App(){
    return <Router>
        <Routes>
            <Route path="/login" Component={LoginComponent}/>
            <Route path="/register" Component={RegisterComponent}/>
            <Route path="/profile" Component={Profile}/>
        </Routes>   
    </Router>
}

