import React from "react";
import "../style/taskStyle.css"

export default function Task(props)
{
    console.log("My name is: ",props.id, " and my content is ", props.content)
    const [content, setContent] = React.useState(props.content ? props.content : "");
    const [size, setSize] = React.useState(props.content.length > 5? `${props.content.length}0px` : '50px');

    React.useEffect( () => {
        setContent(props.content);
    }, [props.content]); 

    function handleSize(event)
    {
        console.log(event.target.value.length)
        console.log(event.target.style)
        event.target.style.width = event.target.value.length
    }

    return (
        <div className="taskOuterContainer">
            <div className="taskInnerContainer">
                <input maxLength={25} style={{width: size}} type="text" onChange={(event) => 
                {
                    props.changeHandler(props.id, event.target.value)
                    setContent(event.target.value)
                    if(event.target.value.length >= 5) {
                    setSize(`${event.target.value.length}0px`)
                    }
                    else if (size !== "50px"){
                    setSize("50px")
                    }
                }} value={content}/>
                <button onClick={() => props.remover(props.id)}>X</button>

            </div>

            
        </div>
    )
}