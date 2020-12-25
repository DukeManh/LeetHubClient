import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Jumbotron from 'react-bootstrap/Jumbotron';
import ProgressBar from 'react-bootstrap/ProgressBar';


function Intro() {
    return (
        <Jumbotron>
            <h1 className="display-3">Hello, world!</h1>
            <p className="lead">This is a simple hero unit, a simple jumbotron-style component for calling extra attention to featured content or information.</p>
            <hr className="my-4" />
            <h3>Your Progress</h3>
            <ProgressBar variant="info" className="bg-dark h-3 progressDiv">
                <ProgressBar animated variant="success" now={35} key={1} />
                <ProgressBar animated variant="warning" now={20} key={2} />
                <ProgressBar animated variant="danger" now={10} key={3} />
            </ProgressBar>
            <p className="lead">
                <a className="btn btn-primary btn-lg mt-3" href="#" role="button" style={{ "padding": "0.5rem 0.5rem" }}><span >My AC</span></a>
            </p>
        </Jumbotron>
    );
}
export default function Home({ questions }) {
    useEffect(() => {
    })
    return (
        <div className="container my-4">
            <Intro></Intro>
        </div>
    )
}

Home.propTypes = {
    questions: PropTypes.object,
}