import React, { useState, useEffect } from 'react'
import { useParams } from "react-router-dom";
import PropTypes from 'prop-types'

// display a room
const Room = () => {
    // get code parameter
    let params = useParams();

    // set info about a room
    const [votesToSkip, setVotesToSkip] = useState(2);
    const [guestCanPause, setGuestCanPause] = useState(true);
    const [isHost, setIsHost] = useState(false);

    // update default room data by actual data fetched from API
    useEffect(() => {
        fetch("/api/get-room" + "?code=" + params.roomCode)
            .then((response) =>  response.json()
            ).then((data) => {
                setVotesToSkip(data.votes_to_skip);
                setGuestCanPause(data.guest_can_pause);
                setIsHost(data.is_host);
        });
    }, []);

    return (
        <div>
            <p>Room Code: { params.roomCode }</p>
            <p>Votes: {votesToSkip}</p>
            <p>Guest Can Pause: {guestCanPause.toString()}</p>
            <p>Host: {isHost.toString()}</p>
        </div>
    )
}


export default Room
