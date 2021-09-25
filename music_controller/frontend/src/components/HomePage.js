import React from 'react'
import PropTypes from 'prop-types'
import { BrowserRouter as Router, 
    Switch, 
    Route, 
    Link, 
    Redirect,
 } from 'react-router-dom'
import RoomJoinPage from './RoomJoinPage'
import CreateRoomPage from './CreateRoomPage'

const HomePage = props => {
    return (
        <Router>
            <Switch>
                <Route exact path="/"><p>This is the home page</p></Route>
                <Route path="/join" component={RoomJoinPage} />
                <Route path="/create" component={CreateRoomPage} />
            </Switch>
        </Router>
    )
}

HomePage.propTypes = {

}

export default HomePage
