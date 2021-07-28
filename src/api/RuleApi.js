import axios from "axios";
import {ElMessage} from 'element-plus'

axios.interceptors.response.use(
    res => {
        if (res.data.code !== 0) {
            ElMessage.error(res.data.message)
            return Promise.reject(new Error(res.data.message))
        }
        return res
    },
    error => {
        ElMessage.error(error)
        return Promise.error(error);
    }
)

export function saveRule(rule) {
    console.log(rule)
    return axios.post('/rule', rule)
}


export function getRulePage(param) {
    return axios.get('/rule', {
        params: param
    })
}

export function getRule(id) {
    return axios.get('/rule/' + id)
}
