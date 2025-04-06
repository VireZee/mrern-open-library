import express from 'express'
import APICon from '../controller/API.ts'

const Router: express.Router = express.Router({
    caseSensitive: true,
    strict: true
})
Router.get('/API/:hash', APICon)
export default Router