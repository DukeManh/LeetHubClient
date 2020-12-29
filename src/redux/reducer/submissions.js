import { QUESTIONS_REQUEST, QUESTIONS_FAILURE, QUESTIONS_SUCCESS } from '../actionTypes';


export const questionsReducer = (state = {
    questions: [],
    ac_total: 0,
    ac_easy: 0,
    ac_medium: 0,
    ac_hard: 0,
    total: 0,
    loading: false,
    err: ''
}, action) => {
    switch (action.type) {
        case QUESTIONS_REQUEST:
            return {
                ...state,
                loading: true
            }

        case QUESTIONS_FAILURE:
            return {
                ...state,
                questions: [],
                ac_total: 0,
                ac_easy: 0,
                ac_medium: 0,
                ac_hard: 0,
                total: 0,
                err: action.err,
                loading: false,
            }
        case QUESTIONS_SUCCESS:
            return {
                ...state,
                err: '',
                loading: false,
                questions: action.payload.stat_status_pairs,
                ac_total: action.payload.num_solved,
                ac_easy: action.payload.ac_easy,
                ac_medium: action.payload.ac_medium,
                ac_hard: action.payload.ac_hard,
                total: action.payload.num_total,
            }
        default:
            return state;
    }
}