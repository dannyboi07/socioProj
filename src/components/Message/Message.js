import React, { useEffect, memo } from 'react';
// import { useSelector } from 'react-redux';
import "./message.css";

function Message({ uIdFrom, msgText, uId, time }) {
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

    return (
        <div 
        className={`msg-ctn ${ uIdFrom === uId ? 
        "sent-msg" : "rcvd-msg" }`}>
            <p>
                {
                    msgText
                }
            </p>
            <p>
                {
                    time
                }
            </p>
        </div>
    )
}

export default memo(Message);


    //const msgTimeDetails = new Date(message.date).toLocaleString("default", { dateStyle: "full" }); // msgTimeDetails format is Saturday, 12 April, 2022
    //console.log("msgTimeDetails", msgTimeDetails);
    //console.log(msgTimeDetails.split(" ").slice(1)); //extracting time as 12 April, 2022
    
    // let date;
    // let msgTime = new Date(message.date).toUTCString().split(" ")[4]

    // date = msgTime.split(":")
    // // if (parseInt(date[0]) > 12) {
    // //     date[0] = (parseInt(date[0]) - 12).toString();
    // //     date = (date[0] + ":" + date[1])
    // // };
    // //const msgDate = new Date(message.date).toUTCString().split(" ").slice(1, 4)
    // //console.log(msgDate.join(" "));

    // const msgDate = msgTimeDetails.split(" ").slice(1);
    
    // useEffect(() => {
    //     if (chatSectionDateRef.current !== msgDate.join("  ")) {
    //         setChatSectionDate({ date: msgDate.join(" "), display: 
    //         true });
    //         chatSectionDateRef.current = msgDate.join(" ");
    //         //chatSectionDate.current = { date: msgDate.join(" "), display: true }
    //         //console.log("true", chatSectionDate, msgDate.join(" "));
    //     }
    //     else {
    //         setChatSectionDate({ ...chatSectionDate.date, display: false });
    //         //chatSectionDate.current = { ...chatSectionDate.current, display: false }
    //         console.log("false");
    //     }
    //     // console.log(new Date(message.date).toLocaleDateString("default", { dateStyle: "full"}).split(" "));
    // }, []);
