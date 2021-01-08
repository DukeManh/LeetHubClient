import React, { useEffect } from 'react'
import { connect } from 'react-redux';
import { Switch, Route, Redirect, withRouter } from 'react-router-dom';
import Home from './Home';
import Header from './Header';
import Footer from './Footer';
import Questions from './Questions';
import QuestionDetail from './QuestionDetail';
import { loginUser, logoutUser, retriveUser } from '../redux/actions/auth';
import { fetchQuestions } from '../redux/actions/submissions';
import PropTypes from 'prop-types';

const mapStateToProps = state => {
    return {
        auth: state.auth,
        questions: state.questions
    }
}

const mapDispatchToProps = {
    loginUser, logoutUser, fetchQuestions, retriveUser
};

function Main({ auth, questions, loginUser, logoutUser, fetchQuestions, retriveUser }) {
    useEffect(() => {
        retriveUser();
    }, []);
    return (
        <div id="page-container">
            <Header
                auth={auth}
                loginUser={loginUser}
                logoutUser={logoutUser}
            />
            <Switch>
                <Route exact path="/"
                    component={() => <Home auth={auth} />} ></Route>
                <Route exact path="/questions"
                    component={() =>
                        <Questions
                            fetchQuestions={fetchQuestions}
                            questions={questions}
                            authenticated={auth.authenticated} />} >
                </Route>
                <Route exact path="/questions/:title_slug"
                    component={() => <QuestionDetail />} >
                </Route>
                <Redirect to="/" />
            </Switch>
            <Footer />
        </div >
    )
}

Main.propTypes = {
    auth: PropTypes.object,
    loginUser: PropTypes.func,
    logoutUser: PropTypes.func,
    questions: PropTypes.object,
    retriveUser: PropTypes.func,
    fetchQuestions: PropTypes.func
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Main));
