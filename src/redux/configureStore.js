import { applyMiddleware, compose, createStore, combineReducers } from 'redux';
import thunkMiddleware from 'redux-thunk';

import monitorReducersEnhancer from './enhancers/monitorReducer';
import logger from 'redux-logger';
import { authReducer } from './reducer/auth';
import { questionsReducer } from './reducer/submissions';

export const configureStore = () => {
    const middlewares = [logger, thunkMiddleware]
    const middlewareEnhancer = applyMiddleware(...middlewares)

    const enhancers = [middlewareEnhancer, monitorReducersEnhancer]
    const composedEnhancers = compose(...enhancers)

    const store = createStore(combineReducers({
        auth: authReducer,
        questions: questionsReducer,

    }), composedEnhancers);

    return store
}