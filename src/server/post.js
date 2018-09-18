import axios from 'axios'

export function HttpPost(url, data, token = '') {
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
