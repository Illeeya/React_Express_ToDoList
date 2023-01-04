import React from "react";
import { useState } from "react";
import "../style/soloAuthenticationStyle.css"

export default function SoloAuthentication(props)
{
    const [isProcessing, setIsProcessing] = useState(false);
    const [status, setStatus] = useState("");
    const username = "IleeSolo";
    const [password, setPassword] = useState("");

    if (localStorage.getItem("pinPassword") !== null && !isProcessing)
    {
        sendPostRequestForUserData(username, localStorage.getItem("pinPassword"));
    }


    function sendPostRequestForUserData(username, password)
    {
        if (localStorage.getItem("pinPassword") === null)
        {
            localStorage.setItem("pinPassword", `${ password }`);
        }

        setStatus('Logging in...');
        console.log('Trying to log in')
        if (username.length === 0 || password.length === 0)
        {
            setStatus('Username and Password cannot be empty!');
            return;
        }
        if (!isProcessing)
        {
            setIsProcessing(true);
            const options = {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: username,
                    password: password
                })
            }

            fetch("https://ilee-tasks.glitch.me/users/login", options)
                .then(response => response.text())
                .then(data => 
                {

                    if (data)
                    {
                        if (isNaN(data))
                        {
                            console.log(data);
                            setStatus(data);
                            setIsProcessing(false);
                        }
                        else
                        {
                            console.log(data, 2);
                            setIsProcessing(false);
                            props.loginHandler(data);
                        }
                    }
                    else 
                    {
                        console.log("No data");
                        setStatus("Login failed!");
                        setIsProcessing(false);
                    }
                }
                )

        }

    }

    function handleEnterPress(event)
    {
        if (event.key === 'Enter')
        {
            sendPostRequestForUserData(username, password);
        }
    }


    return (
        <div className="authOuterContainer">
            <div className="authInnerBackground"></div>


            <div className="authInnerContainer">
                <input
                    autoFocus
                    onChange={ (event) => { setPassword(event.target.value) } }
                    onKeyDown={ handleEnterPress }
                    value={ password }
                    placeholder="Password..."
                    type="password"
                    inputMode="numeric"
                    name="password" />
                {
                    !isProcessing
                        ? <button onClick={ () => sendPostRequestForUserData(username, password) }>Log in</button>
                        : <div className="loadingBall"></div>
                }
                <div style={ status === '' ? { visibility: 'hidden' } : {} } className="wrongPass">{ status }</div>

            </div>
        </div>
    )


}