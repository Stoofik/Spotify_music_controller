import React, { useState, useEffect } from 'react';
import {Grid, Button, ButtonGroup, Typography} from "@material-ui/core";
import { BrowserRouter as Router, 
    Switch, 
    Route, 
    Link, 
    Redirect,
 } from 'react-router-dom';

import RoomJoinPage from './RoomJoinPage';
import CreateRoomPage from './CreateRoomPage';
import Room from "./Room";

const HomePage = () => {
    const [ roomCode, setRoomCode ] = useState(null);

    useEffect(() => {
        fetch("/api/user-in-room")
            .then((response) => response.json())
            .then((data) => {
                setRoomCode(data.code);
        });
    }, []) 

    const renderHomePage = () => {
        return (
            <Grid container spacing={3} align="center">
                <Grid item xs={12}>
                    <Typography variant="h3" compact="h3">
                        House Party
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <ButtonGroup disableElevation variant="contained" color="primary">
                        <Button color="primary" to="/join" component={ Link }>
                            Join a Room
                        </Button>
                        <Button color="secondary">
                            Create a Room
                        </Button>
                    </ButtonGroup>
                </Grid>
            </Grid>
        )
    }

    const clearRoomCode = () => {
        setRoomCode(null);
    }

    return (
        <Router>
            <Switch>
                <Route exact path="/" render={() => {
                    return roomCode ? (<Redirect to={`/room/${roomCode}`} />) : renderHomePage()
                }} />
                <Route path="/join" component={RoomJoinPage} />
                <Route path="/create" component={CreateRoomPage} />
                <Route path="/room/:roomCode" render={(props) => {
                    return <Room {...props} leaveRoomCallback={clearRoomCode}/>
                }}
                />
            </Switch>
        </Router>
    )
}


export default HomePage
