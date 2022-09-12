import Task from "./Task"
import React from "react";
import { useEffect } from "react";

import "../style/todoStyle.css"

export default function TaskContainer()
{
    useEffect(() =>
    {
        sendGetRequest();
    }, [])

    function unpackTasksFromJson(data)
    {
        console.log(data);
        const tasksArray = data.tasks.map(task =>
        {
            const rdt = Date.now();
            return <Task key={ task.id } id={ task.id } content={ task.content } remover={ removeTask } changeHandler={ updateTaskContent } reloadDateTime={ rdt } sync={ sendPostRequest } />
        })
        const tasksObjectsArray = data.tasks.map(task =>
        {
            return { id: task.id, content: task.content }
        })

        console.log(tasksArray);
        setTasksToRender(tasksArray);
        setTasksObjects(tasksObjectsArray);

    }

    // function packTasksToJson()
    // {
    //     return {
    //         tasks: tasksToRender.map(task =>
    //         {
    //             return (
    //                 { 'id': task.key }
    //             )
    //         })
    //     }
    // }

    function sendPostRequest()
    {
        // const reqBody = packTasksToJson();
        // console.log(reqBody);
        console.log(tasksToRender);
        if (tasksObjects.length > 0)
        {
            const options = {
                method: "POST"
                , headers: {
                    'Content-Type': 'application/json',
                    'CustomHeader': 'SanityCheck'
                }
                , body: JSON.stringify({ tasks: tasksObjects })
            }
            fetch("http://192.168.0.51:3001", options)
                .then(response => response.text())
                .then(response => console.log(response));
        }
        else
        {
            console.log("No tasks to sync");
        }
    }

    function sendGetRequest()
    {
        const options = {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'CustomHeader': 'SanityCheck'
            }
        }

        fetch("http://192.168.0.51:3001", options)
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
                unpackTasksFromJson(data)
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
        setTasksToRender(current => [...current, <Task key={ taskId } id={ taskId } content={ "" } remover={ removeTask } changeHandler={ updateTaskContent } reloadDateTime={ taskId } sync={ sendPostRequest } />])
        setTasksObjects(current => [...current, { id: taskId, content: "" }]);
    }

    function removeTask(id)
    {
        console.log(tasksToRender, tasksObjects)
        setTasksToRender(current => current.filter(task => task.props.id !== id));
        setTasksObjects(current => current.filter(task => task.id !== id));
    }

    const [tasksToRender, setTasksToRender] = React.useState([]);
    const [tasksObjects, setTasksObjects] = React.useState([]);
    return (
        <>
            <div className="todoContainer">
                { tasksToRender }
            </div>
            <div className="todoButtons">
                <button className="newTaskBtn" onClick={ addTask }>Add</button>
                <button className="syncBtn" onClick={ sendPostRequest }>Sync</button>
                <button className="loadBtn" onClick={ sendGetRequest }>Load</button>
            </div>
        </>
    )
}