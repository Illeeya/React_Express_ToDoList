import Task from "./Task"
import React from "react";
import { useEffect, useState } from "react";
import { useIdleTimer } from 'react-idle-timer'

import "../style/todoStyle.css"

export default function TaskContainer(props)
{
    const [tasksToRender, setTasksToRender] = useState([]);
    const [tasksObjects, setTasksObjects] = useState([]);
    const [isSynched, setIsSynched] = useState(true);
    const [isSyncing, setIsSyncing] = useState(false);

    useEffect(() =>
    {
        sendPostRequestForTasksData();
    }, [])

    useEffect(() =>
    {
        setIsSynched(false);
    }, [tasksObjects])

    const onIdle = () =>
    {
        console.log("Is idle!")
        if (!isSynched)
        {
            sendPostRequestToSaveData(props.userId)
            console.log("Data synched");
            setIsSynched(true);
        }
    };

    useIdleTimer({
        onIdle,
        timeout: 5000,
        events: [
            'keydown',
            'mousedown',
            'touchstart',
            'touchmove',
            'MSPointerDown',
            'MSPointerMove',
            'visibilitychange'
        ],
    })

    function sendPostRequestForTasksData()
    {
        const options = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'CustomHeader': 'SanityCheck'
            },
            body: JSON.stringify({ userId: props.userId })
        }

        fetch("https://ilee-tasks.glitch.me/tasksLoad", options)
            .then(response =>
            {
                if (response.ok)
                    return response.json()
                else if (response.status === 500)
                    throw new Error("No data on server or server is not responding")
                else
                    throw new Error(`Something went wrong. Status nr: ${ response.status }`)

            })
            .then(data =>
            {
                unpackTasksFromJson(data);
            })
            .catch(error =>
            {
                console.log(error.message)
            })

    }

    function unpackTasksFromJson(data)
    {
        console.log(data);
        const tasksArray = data.tasks.map(task =>
        {
            const rdt = Date.now();
            return <Task key={ `${ task.id }usr${ props.userId }` } id={ task.id } content={ task.content } remover={ removeTask } changeHandler={ updateTaskContent } reloadDateTime={ rdt } />
        })
        const tasksObjectsArray = data.tasks.map(task =>
        {
            return { key: `${ task.id }usr${ props.userId }`, id: task.id, content: task.content }
        })

        console.log(tasksArray);
        setTasksToRender(tasksArray);
        setTasksObjects(tasksObjectsArray);

    }

    function sendPostRequestToSaveData(user)
    {
        console.log("sprtsd fired with user:", user);
        if (user === 0)
        {
            console.log("User not logged in!")
        }
        else
        {
            console.log("Sending request to save data for user: ", user);
            setIsSyncing(true);

            console.log(tasksToRender);
            if (tasksObjects.length === 0)
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
                , body: JSON.stringify({
                    tasks: tasksObjects.filter(task =>
                    {
                        if (task.content.length > 0) return task;
                    }), userId: user
                })
            }
            fetch("https://ilee-tasks.glitch.me/tasksSave", options)
                .then(response => response.text())
                .then(response => console.log(response))
                .then(setIsSyncing(false));
        }
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
        setTasksToRender(current => [...current, <Task key={ `${ taskId }usr${ props.userId }` } id={ taskId } content={ "" } remover={ removeTask } changeHandler={ updateTaskContent } reloadDateTime={ taskId } />])
        setTasksObjects(current => [...current, { key: `${ taskId }usr${ props.userId }`, id: taskId, content: "" }]);
    }

    function removeTask(id)
    {
        console.log(tasksToRender, tasksObjects)
        setTasksToRender(current => current.filter(task => task.props.id !== id));
        setTasksObjects(current => current.filter(task => task.id !== id));
    }

    return (
        <div>
            <div className="todoContainer">
                { tasksToRender }
            </div>
            <div className="todoButtons">
                <button className="newTaskBtn" onClick={ addTask }>Add</button>
                <div style={ !isSynched ? {} : { visibility: 'hidden' } }>{ isSyncing ? "Data is syncing..." : "Data waiting to sync" }</div>
            </div>
        </div>

    )
}