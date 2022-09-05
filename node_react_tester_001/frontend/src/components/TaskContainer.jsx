import Task from "./Task"
import React from "react";

import "../style/todoStyle.css"

export default function TaskContainer()
{

    function unpackTasksFromJson(data)
    {
        console.log(data);
        const tasksArray = data.tasks.map(task =>
        {
            return <Task key={ task.id } id={ task.id } content={task.content} remover={removeTask} changeHandler = {updateTaskContent}  />
        })
        const tasksObjectsArray = data.tasks.map(task =>
        {
            return {id:task.id, content:task.content}
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

        const options = {
            method: "POST"
            , headers: {
                'Content-Type': 'application/json',
                'CustomHeader': 'SanityCheck'
            }
            , body: JSON.stringify({tasks: tasksObjects})
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
            .then(data => unpackTasksFromJson(data));
            
    }

    function updateTaskContent(id, content)
    {
        setTasksObjects(current => current.map(task => 
        {
            return task.id === id ? {...task, content: content} : task;
        }))
    }

    function addTask()
    {
        const taskId = Date.now();
        setTasksToRender(current => [...current, <Task key={ taskId } id={ taskId } content={""} remover={removeTask} changeHandler = {updateTaskContent} />])
        setTasksObjects(current => [...current, {id: taskId, content:""}]);
    }

    function removeTask(id){
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