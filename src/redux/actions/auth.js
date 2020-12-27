import axios from 'axios';
import * as types from '../actionTypes';
import { API_URL } from '../config';

const base_url = API_URL;

export const loginRequest = creds => ({
    type: types.LOGIN_REQUEST,
    payload: creds
});

export const loginFailure = err => ({
    type: types.LOGIN_FAILURE,
    err: err
});


export const loginSuccess = res => ({
    type: types.LOGIN_SUCCESS,
    ...res
});

export const loginUser = creds => (dispatch) => {
    dispatch(loginRequest(creds));
    axios.post(base_url + 'accounts/login', creds, { withCredentials: true })
        .then(res => {
            if (res.status === 200) {
                res = res.data;
                dispatch(loginSuccess(res));
            }
            else {
                dispatch(loginFailure('User name or password invalid'));
            }
        })
        .catch(err => {
            dispatch(loginFailure(err.message));
        });

}

export const retriveUser = () => (dispatch) => {
    axios.get(base_url + 'accounts', { withCredentials: true })
        .then(res => {
            if (res.status === 200 || res.data) {
                res = res.data;
                dispatch(loginSuccess(res));
            }
            else {
                throw new Error('Cookies Expired');
            }
        })
        .catch(err => {
            dispatch(loginFailure(err.message));
        });
}

export const logoutFailure = err => ({
    type: types.LOGOUT_FAILURE,
    err: err
});

export const logoutRequest = () => ({
    type: types.LOGOUT_REQUEST,
});

export const logoutSuccess = () => ({
    type: types.LOGOUT_SUCCESS,
});

export const logoutUser = () => (dispatch) => {
    dispatch(logoutRequest());
    axios.get(base_url + 'accounts/logout').then(() => {
        dispatch(logoutSuccess());
    })
        .catch(err => {
            dispatch(logoutFailure(err.message));
        })
}
