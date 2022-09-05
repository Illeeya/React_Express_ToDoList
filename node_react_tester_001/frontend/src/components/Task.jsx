import React from "react";
import "../style/taskStyle.css"

export default function Task(props)
{
    const [content, setContent] = React.useState(props.content ? props.content : "");

    React.useEffect( () => {
        setContent(props.content);
    }, [props.content]); 


    return (
        <div className="taskOuterContainer">
            <div className="taskInnerContainer">
                <input type="text" onChange={(event) => 
                {
                    props.changeHandler(props.id, event.target.value)
                    setContent(event.target.value)
                }} value={content}/>
                <button onClick={() => props.remover(props.id)}>X</button>

            </div>

            
        </div>
    )
}