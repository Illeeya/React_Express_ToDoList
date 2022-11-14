import { useIdleTimer } from 'react-idle-timer'

export default function IdleTester()
{

    const onIdle = () => { alert("Works idle?") };


    const reset = useIdleTimer.onIdle;
    const resume = useIdleTimer.timeout;

    // const {
    //     reset,
    //     resume
    // } = useIdleTimer({

    //     onIdle,
    //     timeout: 3000
    // })

    return (
        <>
            <input type="text" />
        </>
    )
}