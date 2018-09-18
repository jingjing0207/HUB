import * as ActionsTypes from '../constants'
let initailState = {
    authToken: {
        token: ''
    }
}

const Token = (state = initailState , action = {}) => {
    switch(action.type){
        case ActionsTypes.SET_TOKEN:
            setToken(state,action)
        case ActionsTypes.LOGOUT:
            loginOut(state,action)
        default:
            return state;
    }
};

export default Token


function setToken (state, action){
    let token = action.token
    return Object.assign({},state,{authToken:{token}})
}

function loginOut (state, action){
    return Object.assign({},state,{authToken:{token: undefined}})
}
