import Task from "./Task"
import Authentication from "./Authentication"
import React from "react";
import { useEffect, useState } from "react";
import { useIdleTimer } from 'react-idle-timer'

import "../style/todoStyle.css"

export default function TaskContainer()
{

    const [userId, setUserId] = useState(0);
    const [tasksToRender, setTasksToRender] = useState([]);
    const [tasksObjects, setTasksObjects] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isSynched, setIsSynched] = useState(true);
    const [isSyncing, setIsSyncing] = useState(false);

    const [isFirstLoad, setIsFirstLoad] = React.useState(true);

    useEffect(() =>
    {
        if (isLoggedIn)
            if (isFirstLoad)
            {
                setIsFirstLoad(false)
            }
            else
            {
                setIsSynched(false);
            }
    }, [tasksObjects])

    const onIdle = () =>
    {
        if (isLoggedIn && !isSynched)
        {
            sendPostRequestToSaveData(userId)
            console.log("Data synched");
            setIsSynched(true);
        }
    };

    const {
        reset,
        resume
    } = useIdleTimer({
        onIdle,
        timeout: 5000
    })


    function unpackTasksFromJson(data)
    {
        console.log(data);
        const tasksArray = data.tasks.map(task =>
        {
            const rdt = Date.now();
            return <Task key={ `${ task.id }usr${ userId }` } id={ task.id } content={ task.content } remover={ removeTask } changeHandler={ updateTaskContent } reloadDateTime={ rdt } />
        })
        const tasksObjectsArray = data.tasks.map(task =>
        {
            return { key: `${ task.id }usr${ userId }`, id: task.id, content: task.content }
        })

        console.log(tasksArray);
        setTasksToRender(tasksArray);
        setTasksObjects(tasksObjectsArray);

    }

    function sendPostRequestToSaveData(user)
    {
        if (user === 0)
        {
            console.log("User not logged in!")
        }
        else
        {
            setIsSyncing(true);

            console.log(tasksToRender);
            if (tasksObjects.length == 0)
            {
                console.log("Task list saved as empty")
            }

            console.log(user);

            const options = {
                method: "POST"
                , headers: {
                    'Content-Type': 'application/json',
                    'CustomHeader': 'SanityCheck'
                }
                , body: JSON.stringify({ tasks: tasksObjects, userId: user })
            }
            fetch("https://ilee-tasks.glitch.me/tasksSave", options)
                .then(response => response.text())
                .then(response => console.log(response))
                .then(setIsSyncing(false));
        }
    }

    function sendPostRequestForUserData(username, password)
    {


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

        fetch("https://ilee-tasks.glitch.me/users", options)
            .then(response => response.text())
            .then(data => 
            {

                if (data)
                {
                    console.log(data);
                    logIn(data);
                }
                else console.log("No data");
            }
            )


    }

    function sendPostRequestForTasksData(user)
    {
        const options = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'CustomHeader': 'SanityCheck'
            },
            body: JSON.stringify({ userId: user })
        }

        fetch("https://ilee-tasks.glitch.me/tasksLoad", options)
            .then(response =>
            {
                if (response.ok)
                    return response.json()
                else if (response.status == 500)
                    throw new Error("No data on server or server is not responding")
                else
                    throw new Error(`Something went wrong. Status nr: ${ response.status }`)

            })
            .then(data =>
            {
                unpackTasksFromJson(data);
                setIsLoggedIn(true);
            })
            .catch(error =>
            {
                console.log(error.message)
            })
        // .then(response =>
        // {
        //     console.log(response.ok);
        //     if (response.ok)
        //         response.json();
        // })
        // .then(data => unpackTasksFromJson(data))
        // .catch(console.log("Nothing came from the server"))

    }

    function updateTaskContent(id, content)
    {
        setTasksObjects(current => current.map(task => 
        {
            return task.id === id ? { ...task, content: content } : task;
        }))
    }

    function addTask()
    {
        const taskId = Date.now();
        setTasksToRender(current => [...current, <Task key={ `${ taskId }usr${ userId }` } id={ taskId } content={ "" } remover={ removeTask } changeHandler={ updateTaskContent } reloadDateTime={ taskId } />])
        setTasksObjects(current => [...current, { key: `${ taskId }usr${ userId }`, id: taskId, content: "" }]);
    }

    function removeTask(id)
    {
        console.log(tasksToRender, tasksObjects)
        setTasksToRender(current => current.filter(task => task.props.id !== id));
        setTasksObjects(current => current.filter(task => task.id !== id));
    }

    function logIn(userId)
    {
        setUserId(userId);
        sendPostRequestForTasksData(userId)
    }




    return (
        <>
            {
                isLoggedIn ?
                    <div>
                        <div className="todoContainer">
                            { tasksToRender }
                        </div>
                        <div className="todoButtons">
                            <button className="newTaskBtn" onClick={ addTask }>Add</button>
                            {/* <button className="syncBtn" onClick={ () => { sendPostRequestToSaveData(userId) } }>Sync</button>
                            <button className="loadBtn" onClick={ () => { sendPostRequestForTasksData(userId) } }>Load</button> */}
                            <div style={ !isSynched ? {} : { visibility: 'hidden' } }>{ isSyncing ? "Data is syncing..." : "Data waiting to sync" }</div>
                        </div>
                    </div>
                    :
                    <Authentication loginHandler={ logIn } />
            }
        </>
    )
}