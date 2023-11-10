import React, {useEffect, useState} from "react";
import ErrorMessage from "../ErrorMessage";
import SkillModal from "../SkillModal";
// for creating the radar chart
import {
    Chart as ChartJS,
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend,
  } from 'chart.js';
  import { Radar } from 'react-chartjs-2';
import { GetUser, GetUserSkills } from "../../services/User.service";
import NavBarComponent from "../shared/NavBarComponent";

  ChartJS.register(
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend
  );

const initialState = {
    user: null,
    skills:[],
    errorMessage:"",
    loaded: false,
    activeModal:false,
    id: null,
    sprite:"bottts",
    seed:1000

}

const Profile = () => {
    const [state, setState] = new useState(initialState);
    const avatarTypes = ["avataaars", "human", "bottts", "jdenticon", "identicon", "gridy", "micah"];
    // Function to set the current sprite type
    const handleSprite = async () => {
        const pos = Math.floor(Math.random() * avatarTypes.length);
        setState((prevState) => ({...prevState, sprite: avatarTypes[pos]}));
    };

    // Function to generate random seeds for the API
    const handleGenerate = async () => {
        let x = Math.floor(Math.random() * 1000);
        setState((prevState) => ({...prevState, seed:x}));
    };

    // function to trigger the update to happen
    const handleUpdateSkill = async (id) => {
        setState((prevState) => ({...prevState, activeModal: true,id}));
    };

    // function to get the skills
    const getSkills = async () => {
        const result = await GetUserSkills()
        if(result != null){
            setState((prevState) => ({...prevState, skills: result}))
        }
        else{
            console.log("error getskills",result)
        }
    };

    const getUser = async() =>{
        const result = await GetUser()
        if(result != null){
            setState((prevState) => ({...prevState, user: result}))
        }
        else{
            console.log("error getuser",result)
        }
    };
    // use the function
    useEffect(() => {
        getUser();
        getSkills();
        handleSprite();
        handleGenerate();
    }, []);

    // everytime the modal is used it refreshes the skills that are there
    const handleModal = () => {
        setState((prevState) => ({...prevState, activeModal: !prevState.activeModal,id:null}))
        getSkills();
    }

    // skills data to make the radar chart
    const dataRadar = {
        labels: JSON.parse(JSON.stringify(state.skills)).map((skill) => skill.name),
        datasets: [
            {
                label: 'Skills',
                data: JSON.parse(JSON.stringify(state.skills)).map((skill) => skill.level), 
                backgroundColor: 'rgba(63, 209, 187, 0.2)',
                borderColor: 'rgb(4, 181, 160)',
                borderWidth: 1,
            },
        ],
    };
    
    // if the skills are loaded and if they exist then display the table with the skills
    return (
        <>
            <SkillModal active={state.activeModal}
                        handleModal={handleModal}
                        id={state.id}
                        setErrorMessage={(value) => {setState((prevState) => ({...prevState, errorMessage: value}))}}/>
            <div className='card equal-height'>
                <NavBarComponent title={"User Profile"}/>
                {state.user &&
                    <div className="card-content is-flex">
                        <div className="media">
                            <div className="media-left">
                                <figure className="image is-128x128 is-inline-block">
                                    <img className="is-rounded m-5"
                                         src={`https://avatars.dicebear.com/api/${state.sprite}/${state.seed}.svg`}
                                         alt="Sprite"/>
                                </figure>
                            </div>
                            <div className="media-content m-5">
                                <section className="section">
                                    <p className="title">Name: {state.user.name}</p>
                                    <p className="subtitle mt-2">Email: {state.user.email}</p>
                                    <p className="subtitle">Company position: {state.user.company_position}</p>
                                </section>
                                <section className="section">
                                    <p className="title">{state.user.name}'s skills:</p>
                                    {state.skills ? (
                                        <table className="table is-fullwidth">
                                            <thead>
                                            <tr>
                                                <th>Id</th>
                                                <th>Name</th>
                                                <th>Level</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {state.skills.map((skill) => (
                                                <tr key={skill.id}>
                                                    <td>{skill.id}</td>
                                                    <td>{skill.name}</td>
                                                    <td>{skill.level}</td>
                                                </tr>
                                            ))}
                                            </tbody>
                                        </table>
                                    ) : <p>Loading</p>}
                                    
                                    <ErrorMessage message={state.errorMessage}/>

                                    <Radar data={dataRadar}/>
                                </section>
                                
                            </div>
                        </div>
                    </div>
                }
            </div>
        </>
    );
};

export default Profile;
