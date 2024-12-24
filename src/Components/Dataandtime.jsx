import React from 'react';

const Dataandtime = ({ seconds, nanoseconds }) => {
    const time = seconds * 1000 + nanoseconds / 1e6;
    const date = new Date(time);
    const options = {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric"
    };

    const formattedDate = new Intl.DateTimeFormat("en-IN", options).format(date);

    return (
        <>
            <h5>{formattedDate}</h5>
        </>
    );
}

export default Dataandtime;
