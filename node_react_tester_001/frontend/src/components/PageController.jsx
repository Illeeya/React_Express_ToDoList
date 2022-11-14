import Authentication from "./Authentication"
import { useEffect, useState } from "react";
import TaskContainer from "./TaskContainer";

export default function PageController()
{
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userId, setUserId] = useState(-1);

    function logIn(userId)
    {
        if (userId === -1)
        {
            console.log('Some error occured. LogIn called without new user id.')
        }
        else
        {
            console.log('User logged in with id: ', userId)
            setUserId(userId);
            setIsLoggedIn(true);
        }
    }

    return (
        <>
            {
                !isLoggedIn
                    ? <Authentication loginHandler={ logIn } />
                    : <TaskContainer userId={ userId } />
            }
        </>
    )
}