import axios from 'axios';
import * as types from '../actionTypes';
import { API_URL } from '../config';

const base_url = API_URL;

export const questionsRequest = () => ({
    type: types.QUESTIONS_REQUEST,
});

export const questionsFailure = err => ({
    type: types.QUESTIONS_FAILURE,
    err,
});

export const questionsSuccess = questions => ({
    type: types.QUESTIONS_SUCCESS,
    payload: questions
});

export const fetchQuestions = () => (dispatch) => {
    dispatch(questionsRequest());

    axios.get(base_url + 'questions/', { withCredentials: true })
        .then(questions => {
            if (questions.status === 200 || questions.status === 304) {
                questions = questions.data;
                dispatch(questionsSuccess(questions));
            }
            else {
                dispatch(questionsFailure("error loading submissions"));
            }
        })
        .catch(err => {
            dispatch(questionsFailure(err.message));
        });
}