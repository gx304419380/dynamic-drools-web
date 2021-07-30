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
        return Promise.reject(error);
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

export function deleteRule(id) {
    return axios.delete('/rule?id=' + id)
}

export function defaultRule() {
    return `package rules

import com.fly.dynamic.entity.RuleResult
import org.slf4j.Logger
import java.util.Map
import org.springframework.context.ApplicationContext
import org.springframework.jdbc.core.JdbcTemplate

rule "dynamic_rule"
    when
        param: Map()
        res: RuleResult()
        log: Logger()
        context: ApplicationContext()
        jdbc: JdbcTemplate()
    then
        log.info("param map={}", param);
        res.setData("hello world!");
        log.info("result = {}", res);
end




`
}
