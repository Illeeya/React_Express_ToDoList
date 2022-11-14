import React from "react";
import { useState, useEffect } from "react";
import "../style/authenticationStyle.css"

export default function Authentication(props)
{

    const [wrongPass, setWrongPass] = useState(false);
    const [isLogging, setIsLogging] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false);
    const [registerStatus, setRegisterStatus] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");


    function sendPostRequestForUserData(username, password)
    {
        setWrongPass(false);
        console.log('Trying to log in')
        if (!isLogging)
        {
            setIsLogging(true);
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
                            setWrongPass(true);
                            setIsLogging(false);
                        }
                        else
                        {
                            console.log(data, 2);
                            setIsLogging(false);
                            props.loginHandler(data);
                        }
                    }
                    else 
                    {
                        console.log("No data");
                        setIsLogging(false);
                    }
                }
                )

        }

    }

    function registerUser(user, pass)
    {
        console.log('test1')
        if (!isRegistering)
        {
            setIsRegistering(true)
            console.log('test2')
            if (user.length <= 0 || pass.length <= 0)
            {
                console.log("Need user or pass");
                setRegisterStatus("User and Password cannot be empty!")
                setIsRegistering(false)
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
                            setRegisterStatus('User already exists')
                        if (data.includes('Could not register'))
                            setRegisterStatus('Internal Error, cannot create user.')
                        if (data.includes('User created!'))
                            setRegisterStatus('User created!')
                        setIsRegistering(false)
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
        <div className="authInnerContainer">
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
                placeholder="Password"
                type="password"
                name="password" />
            {
                !isLogging
                    ? <button onClick={ () => sendPostRequestForUserData(username, password) }>Log in</button>
                    : <div className="loadingBall"></div>
            }
            <div style={ wrongPass ? {} : { visibility: 'hidden' } } className="wrongPass">Wrong username or password</div>
            {
                !isRegistering
                    ? <button onClick={ () => registerUser(username, password) }>Register</button>
                    : <div className="loadingBall"></div>
            }
            <div style={ registerStatus === '' ? { visibility: 'hidden' } : {} } className="wrongPass">{ registerStatus }</div>

        </div>
    )


}