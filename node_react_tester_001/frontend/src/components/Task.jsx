import React from "react";
import "../style/taskStyle.css"

export default function Task(props)
{
    const [content, setContent] = React.useState(props.content ? props.content : "");
    const [size, setSize] = React.useState('');
    const [reloadDateTime, setReloadDateTime] = React.useState(props.reloadDateTime);
    const [isVertical, setIsVertical] = React.useState(window.innerWidth > window.innerHeight ? false : true);
    const [winWidth, setWinWidth] = React.useState(window.innerWidth);
    if (reloadDateTime !== props.reloadDateTime)
        setReloadDateTime(props.reloadDateTime);

    // React.useEffect(() =>
    // {
    //     setContent(props.content)
    // }, [props.content]);

    React.useEffect(() =>
    {
        // setContent(props.content)
        setSize(content.length > 4 ? `${ content.length * 10 + 50 }px` : '90px');
        function handleResize()
        {
            setIsVertical(window.innerWidth > window.innerHeight ? false : true);
            setWinWidth(window.innerWidth);
        }

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    React.useEffect(() =>
    {
        setSize(content.length > 4 ? `${ content.length * 10 + 50 }px` : '90px');
        // setSize(content.length > 4 ? `${ content.length * 3 + 50 }px` : '62px'); PERFECT FOR l
        // setSize(content.length > 4 ? `${ content.length * 16 + 50 }px` : '114px'); PERFECT FOR W
    }, [content]);
    React.useEffect(() =>
    {
        setContent(props.content);
    }, [reloadDateTime]);


    return (
        <div className="taskOuterContainer">
            <div className="taskInnerContainer">
                <input maxLength={ 25 } style={ isVertical ? { width: '100%', fontSize: `${ winWidth * 0.003 }rem` } : { width: size } } type="text" onChange={ (event) => 
                {
                    props.changeHandler(props.id, event.target.value)
                    setContent(event.target.value)
                } } value={ content } />
                <button onClick={ () =>
                    props.remover(props.id)
                }><img alt="" src="img/delete.png" /></button>

            </div>


        </div >
    )
}