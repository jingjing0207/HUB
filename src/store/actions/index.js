import { createAction } from 'redux-actions'
import axios from 'axios'
import * as Api from '../api'
import * as actionsType from '../constants'

export function login (payload) {
    return async (dispatch,getState) => {
        // let store = getState()
        console.log(getState())
        // let token = store.authToken.token || ''
        return HttpPost(Api.LOGIN, payload).then(result => {
            let loginSucess = createAction(actionsType.LOGIN_SUCCESS)
            let setToken = createAction(actionsType.SET_TOKEN)
            dispatch(loginSucess(result))
            dispatch(setToken(result))
            return result
        }).catch(err => {
            throw err
        })
    }
}
export function checkIsAdminLogin () {
    return async (dispatch,getState) => {
        console.log(getState().authToken.token)
        let store = getState()
        let token = store.authToken.token || ''
        return HttpGet(Api.GET_INFORMATION, token).then(result => {
            let checkIsAdminLogin = createAction(actionsType.GET_IS_ADMIN_LOGIN)
            dispatch(checkIsAdminLogin(result))
            return result
        }).catch(err => {
            throw err
        })
    }
}
export function getQueryRunResult () {
    return async (dispatch,getState) => {
        let store = getState()
        let token = store.authToken.token || ''
        return HttpGet(Api.QUERY_RUN_STATUS, token).then(result => {
            let getGroupRunResultSuccess = createAction(actionsType.GET_MONITORY_GROUP_RUN_RESULT)
            dispatch(getGroupRunResultSuccess(result))
            return result
        }).catch(err => {
            throw err
        })
    }
}
export function logOut (payload) {
    return async (dispatch,getState) => {
        let store = getState()
        let token = store.authToken.token || ''
        return HttpPost(Api.LOGIN, payload, token).then(result => {
            let logOutSuccess = createAction(actionsType.LGOUT_SUCCESS)
            dispatch(logOutSuccess(result))
            return result
        }).catch(err => {
            throw err
        })
    }
}



function HttpPost(url, data, token = '') {
    var result = axios({
        method: "POST",
        headers: {
            'Content-type': 'application/json;charset=UTF-8',
            'Authorization': token
        },
        url: url,
        data: data
    })
    return result
}

function HttpGet(url, token = '') {
    var result = axios({
        method: "GET",
        headers: {
            'Content-type': 'application/json;charset=UTF-8',
            'Authorization': token
        },
        url: url,
        withCredentials: true
    })
    return result
}
