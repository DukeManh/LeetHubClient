import { LOGIN_FAILURE, LOGIN_REQUEST, LOGIN_SUCCESS, LOGOUT_SUCCESS, LOGOUT_REQUEST } from '../actionTypes';

export const authReducer = (state = {
    loading: false,
    authenticated: false,
    userStatus: {},
    userCountryCode: '',
    err: '',
    acSubmissionNum: [],
}, action) => {
    switch (action.type) {
        case LOGIN_REQUEST:
            return {
                ...state,
                loading: true,
                authenticated: false,
            }
        case LOGIN_SUCCESS:
            return {
                ...state,
                loading: false,
                authenticated: true,
                userStatus: action.userStatus,
                userCountryCode: action.userCountryCode,
                acSubmissionNum: action.acSubmissionNum,
            }
        case LOGIN_FAILURE:
            return {
                ...state,
                loading: false,
                authenticated: false,
                err: action.err,
                acSubmissionNum: [],
                userStatus: {},
                userCountryCode: '',
            }
        case LOGOUT_REQUEST:
            return {
                ...state,
                loading: true,
            }
        case LOGOUT_SUCCESS:
            return {
                ...state,
                authenticated: false,
                loading: false,
                userStatus: {},
                userCountryCode: '',
                acSubmissionNum: [],
            }
        default:
            return state;
    }
};
