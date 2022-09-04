import Task from "./Task"
import React from "react";

import "../style/todoStyle.css"

export default function TaskContainer()
{

    function unpackTasksFromJson(data)
    {
        console.log(data);
        const b = data.tasks.map(task =>
        {
            return <Task key={ task.id } id={ task.id } />
        })

        console.log(b);
        setTasksToRender(b)
    }

    function packTasksToJson()
    {
        return {
            tasks: tasksToRender.map(task =>
            {
                return (
                    { 'id': task.key }
                )
            })
        }
    }

    function sendPostRequest()
    {
        const reqBody = packTasksToJson();
        console.log(reqBody);
        console.log(tasksToRender);

        const options = {
            method: "POST"
            , headers: {
                'Content-Type': 'application/json',
                'CustomHeader': 'SanityCheck'
            }
            , body: JSON.stringify(reqBody)
        }
        fetch("http://localhost:3001", options)
            .then(response => response.text())
            .then(response => console.log(response));
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

        fetch("http://localhost:3001", options)
            .then(response => response.json())
            .then(data => unpackTasksFromJson(data))
    }


    function addTask()
    {
        const taskId = Date.now();
        setTasksToRender(current => [...current, <Task key={ taskId } id={ taskId } />])
    }

    const [tasksToRender, setTasksToRender] = React.useState([]);
    return (
        <div className="todoContainer">
            { tasksToRender }
            <button className="newTaskBtn" onClick={ addTask }>Add</button>
            <button className="syncBtn" onClick={ sendPostRequest }>Sync</button>
            <button className="loadBtn" onClick={ sendGetRequest }>Load</button>
        </div>
    )
}