import React from "react";
import { RemoveToken } from "../../services/Session.service";
import { useNavigate } from "react-router-dom";

// to show the title and logout button as well as the profile with it
const NavBarComponent = ({title}) => {
    const navigate = useNavigate();
    const handleLogout = () => {
        RemoveToken();
        navigate("/login")
    };

    return (
            <div className="columns">
                <div className="column is-two-quarters">
                    <h1 className="title">{title}</h1>
                    <div className="is-grouped">
                        <button className="button is-pulled-right mr-2" onClick={handleLogout}>Logout</button>
                    </div>
                </div>
            </div>
    );
};

export default NavBarComponent;