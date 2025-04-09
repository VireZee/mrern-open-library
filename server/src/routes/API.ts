import express from 'express'
import APICon from '../controller/booksParent.ts'

const Router = express.Router({
    caseSensitive: true,
    strict: true
})
Router.get('/API/:hash', APICon)
export default Router