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

export function deleteRule(id) {
    return axios.delete('/rule?id=' + id)
}

export function defaultRule() {
    return `package rules

import com.fly.rule.entity.RuleResult
import org.slf4j.Logger
import org.springframework.context.ApplicationContext
import java.util.Map
import org.springframework.jdbc.core.JdbcTemplate

rule "discount_rule_4"
    when
        param: Map()
        result: RuleResult()
        log: Logger()
        context: ApplicationContext()
        jdbc: JdbcTemplate()
    then
        log.info("param map={}", param);
        result.setData("hello world!");
        log.info("result = {}", result);
end




`
}
