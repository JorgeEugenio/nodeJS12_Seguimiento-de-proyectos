const express = require('express')
const morgan = require('morgan');
const bodyParser = require('body-parser')
const cors = require('cors')

//const servicioRoute = require('./routes/servicioRoute')
const principalRoute = require('./routes/principalRoute')

const app = express()

app.use(cors())
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

// middlewares
app.use(morgan('dev'));
app.use(express.json());

//app.use('/v1',productsRoutes)
app.use('/',principalRoute)
//app.use('/v1',principalRoute)

app.use('/public', express.static(`${__dirname}/storage/imgs/`))
module.exports = app