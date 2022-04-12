{   
    {/* const dateTime = new Date(message.date_time)
    //console.log(Intl.DateTimeFormat().resolvedOptions().timeZone)
    console.log(dateTime)
    const date = dateTime.toString().split(" ").slice(1, 4).join(" ")
    const time = dateTime.toString().split(" ")[4]
    const offset = dateTime.toString().split(" ")[5].split("+")[1] */}
    if (i === messagingState.messages.length - 1) {
        return (
            <Fragment key={message.msg_id}>
                <Message                                  
                uId={ user.uId } 
                message={ message }
                time={ time }
                />
                {            
                    <p className="dm-sction-date">
                        { date }
                    </p>
                    
                }
                
            </Fragment>
        )
    }
    else {
        if (messagingState.messages[i + 1].date_time > message.date_time) {
            return (
                <Message 
                key={ message.msg_id } 
                uId={ user.uId } 
                message={ message }
                time={ time }
                />
            )
        }
        else {
            return (
                <Fragment key={message.msg_id}>
                    <Message                                            
                    uId={ user.uId } 
                    message={ message }
                    time={ time }
                    />
                    {            
                        <p className="dm-sction-date">
                            { date }
                        </p>
                    }
                </Fragment>
            )
        }
    }
}

new Date((new Date(messagingState.messages[i + 1].date_time)).toString().split(" ").slice(1, 4).join(" "))
{
    messagingState?.messages.map((message, i) => 
        
        i === (messagingState.messages.length - 1) ? 
            <Fragment key={message.msg_id}>
                <Message                                  
                uId={ user.uId } 
                uIdFrom={ message.u_id_from }
                msgText={ message.msg_text }
                time={ message.time }
                />
                {            
                    <p className="dm-sction-date">
                        { message.date }
                    </p>
                    
                }
                
            </Fragment>

        :   messagingState.messages[i+1].date === message.date ?
            
                <Message 
                key={ message.msg_id } 
                uId={ user.uId } 
                uIdFrom={ message.u_id_from }
                msgText={ message.msg_text }
                time={ message.time }
                />
            
            :   <Fragment key={message.msg_id}>
                    <Message                                            
                    uId={ user.uId } 
                    uIdFrom={ message.u_id_from }
                    msgText={ message.msg_text }
                time={ message.time }
                    />
                    {            
                        <p className="dm-sction-date">
                            { message.date }
                        </p>
                    }
                </Fragment>
    )
}

    //console.log(time);
    // Going to be explicitly converting all time related strings to int instead of relying on implicit conversions and then possibly banging my head later
    // const offsetHours = offset.slice(0, 2); //offset is going to be 0530, as an example for GMT India, taking the hours out of it here - 05
    // const offsetMins = offset.slice(2, 4);  // Taking the minutes out of it here, 30

    // function formatTime(t) {
    //     const timeSplit = t.split(":") // t/time for ex is 20:15:48

    //     const offedMins = parseInt(timeSplit[1], 10) + parseInt(offsetMins, 10); // adding the original minutes with offset mins to get regional minutes
    //     const offedHours = parseInt(timeSplit[0], 10) + parseInt(offsetHours, 10);
    //     const parsedHours = offedHours > 12 ? offedHours / 12 : offedHours // adding the og hours with offset hours, and dividing by 12
        
        
    //     //console.log(parsedHours, offedHours);
        
    //     let meridiem = "AM";

    //     if ( offedHours > 12) meridiem = "PM";

    //     if (offedMins > 60) {
    //         const parsedMins = Math.floor(offedMins / 60).toString();
    //         if (parsedMins.length === 1) {
    //             return `${parsedHours}:${parsedMins.padStart(2, 0)} ${meridiem}`;
    //         }
    //         return `${parsedHours}:${Math.floor(offedMins/60)} ${meridiem}`;
    //     }
    //     return `${parsedHours}:${offedMins} ${meridiem}`;
        
    //     // if (parseInt(timeSplit[0], 10) > 12) { // if the 
            
    //     //     if (mins > 60) {
    //     //         const parsedMins = Math.floor(mins / 60).toString();
    //     //         if (parsedMins.length === 1) {
    //     //             return `${parsedHours}:${parsedMins.padStart(2, 0)} PM`;
    //     //         }
    //     //         return `${parsedHours}:${Math.floor(mins/60)} PM`;
    //     //     }
    //     //     return `${parsedHours}:${mins} PM`;
    //     // }
    //     // else {
    //     //     if (mins > 60) {
    //     //         const parsedMins = Math.floor(mins / 60).toString();

    //     //         if (parsedMins.length === 1) {
    //     //             return `${parsedHours}:${parsedMins.padStart(2, 0)} AM`;
    //     //         }
    //     //     }
    //     //     return `${parsedHours}:${mins} AM`;
    //     // };
    // };

    // Forget everything above I changed the backend itself. I send the users's timezone every time they login and store it, and use that 
    // whenever I need to query something that involves time. A couple more hours of this crap of manipulating dates in javascript and I would've gone bald
    // Why the hell doesn't the contructor new Date(message.date) convert the supplied timestamp to the users's timezone?!?!?!
