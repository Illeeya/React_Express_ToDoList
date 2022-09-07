import React from "react";
import "../style/taskStyle.css"

export default function Task(props)
{
    const [content, setContent] = React.useState(props.content ? props.content : "");
    const [size, setSize] = React.useState(props.content.length > 5 ? `${ props.content.length }0px` : '50px');
    const [reloadDateTime, setReloadDateTime] = React.useState(props.reloadDateTime);
    if (reloadDateTime !== props.reloadDateTime)
        setReloadDateTime(props.reloadDateTime);
    React.useEffect(() =>
    {
        setContent(props.content);
    }, [props.content]);
    React.useEffect(() =>
    {
        setSize(props.content.length > 5 ? `${ props.content.length }0px` : '50px');
    }, [props.content]);
    React.useEffect(() =>
    {
        setSize(content.length > 5 ? `${ content.length }0px` : '50px');
    }, [content]);
    React.useEffect(() =>
    {
        setContent(props.content);
    }, [reloadDateTime]);


    return (
        <div className="taskOuterContainer">
            <div className="taskInnerContainer">
                <input maxLength={ 25 } style={ { width: size } } type="text" onChange={ (event) => 
                {
                    console.log("ON CHANGE STARTED");
                    props.changeHandler(props.id, event.target.value)
                    setContent(event.target.value)
                } } value={ content } />
                <button onClick={ () =>
                    props.remover(props.id)
                }><img src="img/delete.png" /></button>

            </div>


        </div >
    )
}