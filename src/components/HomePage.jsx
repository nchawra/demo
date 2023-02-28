import axios from "axios";
import React, { useEffect, useState } from "react";
import Model from "./Model";

// Authentication redirect URL
const URL = `https://api.instagram.com/oauth/authorize?client_id=726988412238261&redirect_uri=https://subtle-pie-b18ea2.netlify.app/&scope=user_profile,user_media&response_type=code`;

const HomePage = () => {
    const [userPhotos, setUserPhotos] = useState([]);

    const authenticateTestUser = () => {
        window.open(URL);
    };

    // Fetch insta user photos details
    const getData = () => {
        axios
            .post("http://127.0.0.1:3001/api/users/me")
            .then((res) => {
                setUserPhotos(res.data.data.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    // Save Photos details to DB
    const saveToDb = () => {
        const params = {
            data: userPhotos,
        };

        axios
            .post("http://127.0.0.1:3001/api/users/save-profile-data", params)
            .then((res) => {
                console.log(res);
            })
            .catch((err) => {
                console.log("err", err);
            });
    };

    // Save acess token to DB
    const saveAccessTokenToDb = (code) => {
        const params = {
            code,
        };

        axios
            .post("http://127.0.0.1:3001/api/save-access-token", params)
            .then((res) => {
                console.log(res);
            })
            .catch((err) => {
                console.log("err", err);
            });
    };

    useEffect(() => {
        const queryParameters = new URLSearchParams(window.location.search);
        const code = queryParameters.get("code");
        if (code !== null) {
            saveAccessTokenToDb(code);
        }
    }, []);

    return (
        <>
            <nav className="navbar navbar-light bg-light justify-content-between">
                <a className="navbar-brand" href="#">
                    Get Instagram user images
                </a>
            </nav>

            <div class="alert alert-primary" role="alert">
                Insta IDs that are connected : <strong>726988412238261</strong>
            </div>

            <div className="container">
                <button
                    className="btn btn-outline-success my-2 my-sm-0"
                    onClick={getData}
                >
                    GET USER PHOTOS
                </button>

                <button
                    className="btn btn-outline-danger my-2 my-sm-0 ml-2"
                    onClick={saveToDb}
                >
                    Save Image details to DB
                </button>

                <button
                    className="btn btn-dark ml-2"
                    onClick={authenticateTestUser}
                >
                    Authenticate test user
                </button>
            </div>
            <div className="container-fluid mt-5">
                <div className="row">
                    {userPhotos.length > 0 &&
                        userPhotos.map((photos) => {
                            return (
                                <div
                                    className="col-md-6"
                                    data-toggle="modal"
                                    data-target="#exampleModal"
                                >
                                    <img
                                        src={photos.media_url}
                                        className="img-fluid"
                                        alt=""
                                    />
                                </div>
                            );
                        })}
                </div>
            </div>

            <Model />
        </>
    );
};

export default HomePage;
