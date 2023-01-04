import React from "react";
import { useState, useEffect } from "react";
import "../style/authenticationStyle.css"

export default function Authentication(props)
{
    const [isProcessing, setIsProcessing] = useState(false);
    const [status, setStatus] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");


    function sendPostRequestForUserData(username, password)
    {
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

    function registerUser(user, pass)
    {
        console.log('test1')
        if (!isProcessing)
        {
            setIsProcessing(true)
            console.log('test2')
            if (user.length <= 0 || pass.length <= 0)
            {
                console.log("Need user or pass");
                setStatus("User and Password cannot be empty!")
                setIsProcessing(false)
                return;
            }
            else
            {

                const request = {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        username: user,
                        password: pass
                    })
                }

                fetch("https://ilee-tasks.glitch.me/users/register", request)
                    .then(response => response.text())
                    .then(data => 
                    {
                        if (data.includes('Could not add'))
                            setStatus('User already exists')
                        if (data.includes('Could not register'))
                            setStatus('Internal Error, cannot create user.')
                        if (data.includes('User created!'))
                            setStatus('User created!')
                        setIsProcessing(false)
                    });
            }
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
                <p className="titleClass">I.T.D</p>
                <input
                    onChange={ (event) => { setUsername(event.target.value) } }
                    value={ username }
                    placeholder="Username..."
                    type="text"
                    name="username" />
                <input
                    onChange={ (event) => { setPassword(event.target.value) } }
                    onKeyDown={ handleEnterPress }
                    value={ password }
                    placeholder="Password..."
                    type="password"
                    name="password" />
                {
                    !isProcessing
                        ? <><button onClick={ () => sendPostRequestForUserData(username, password) }>Log in</button><button onClick={ () => registerUser(username, password) }>Register</button></>
                        : <div className="loadingBall"></div>
                }
                <div style={ status === '' ? { visibility: 'hidden' } : {} } className="wrongPass">{ status }</div>

            </div>
        </div>
    )


}