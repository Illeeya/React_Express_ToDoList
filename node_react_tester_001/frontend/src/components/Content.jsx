
import React from "react";

function Content()
{

    function getDataFromApi(event)
    {
        event.preventDefault();
        const requestData = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'CustomHeader': 'SanityCheck',
            },
            body: JSON.stringify(myData)
        };

        fetch("http://localhost:3000", requestData)
            .then(data => data.json())
            .then(data => 
            {
                console.log(`Whats in json: ${ data.id }`);
                console.log(`Type of ${ data.id } is ${ typeof data.id }`);
                setResponseData(data.id)
            })

    }

    const [responseData, setResponseData] = React.useState("Test");

    const [myData, setMyData] = React.useState({
        userName: ""
        , userLastName: ""
        , userAge: ""
        , kills: 0
        , deaths: 0
        , assists: 0
    });

    function handleChange(event)
    {
        setMyData(current =>
        {
            return {
                ...current,
                [event.target.name]: event.target.value
            }
        })
    }

    return (
        <div className="contentContainer">
            <form method="post" action="http://localhost:3009">
                <label htmlFor="userName">Name:</label>
                <input value={ myData.userName } onChange={ handleChange } name="userName" id="userName" type="text" />
                <label htmlFor="userLastName">Surname:</label>
                <input value={ myData.userLastName } onChange={ handleChange } name="userLastName" id="userLastName" type="text" />
                <label htmlFor="userAge">Age:</label>
                <input value={ myData.userAge } onChange={ handleChange } name="userAge" id="userAge" type="text" />
                <p />
                <label htmlFor="kills">Kills:</label>
                <input value={ myData.kills } onChange={ handleChange } name="kills" id="kills" type="number" min={ 0 } />
                <label htmlFor="deaths">Deaths:</label>
                <input value={ myData.deaths } onChange={ handleChange } name="deaths" id="deaths" type="number" min={ 0 } />
                <label htmlFor="assists">Assists:</label>
                <input value={ myData.assists } onChange={ handleChange } name="assists" id="assists" type="number" min={ 0 } />
                <p />
                <button onClick={ getDataFromApi }>Send</button>
                <h2>{ responseData }</h2>
            </form>
        </div>
    )
}


export default Content;