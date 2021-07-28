import { createRouter, createWebHashHistory } from 'vue-router'
import Home from "@/components/Home";
import ApiEditor from "@/components/ApiEditor";
import ApiDetail from "@/components/ApiDetail";

const constantRoutes = [
    {
        path: "/",
        redirect: "/home"
    },
    {
        path: "/home",
        component: Home
    },
    {
        path: '/addApi',
        component: ApiEditor
    },
    {
        path: '/apiDetail',
        component: ApiDetail
    }
]

// https://www.npmjs.com/package/vue-router
const router = createRouter({
    history: createWebHashHistory(),
    routes: constantRoutes
})

export default router
