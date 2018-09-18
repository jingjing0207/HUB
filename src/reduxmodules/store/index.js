import {createStore, applyMiddleware, compose} from 'redux';
import tokenReducer from './usermessge/reducer'
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger'

let middleware = [thunk]

if(process.env.NODE_ENV !== 'development'){
    middleware.push(createLogger())
}

let store = createStore(
    tokenReducer,
    applyMiddleware(...middleware)
);
export default store

