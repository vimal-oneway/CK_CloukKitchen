import dotenv from 'dotenv'
import express, { Request, Response } from 'express'

import path from 'path'

import { connect } from './database/db'
import passport from 'passport'
import session, { SessionOptions, CookieOptions } from 'express-session'
import MongoStore from 'connect-mongo'
import { env } from 'process'
import cors, { CorsOptions } from 'cors'
import bodyParser from 'body-parser'

import { ErrorHandler } from './utils/ErrorHandler'
import { AppRouter } from './AppRouter'

import './middleware/passport.middleware'

import './controllers/LoginController'
import './controllers/FoodController'
import './controllers/RootController'
import './controllers/RestaurantController'
import './controllers/OrderController'
import './controllers/CartController'
import './controllers/ReviewController'

// const currentDir = process.cwd()
// if (currentDir.endsWith('server')) {
//   dotenv.config({ path: path.resolve(currentDir, '/src/.env') })
// } else {
//   dotenv.config({ path: path.resolve(currentDir, './server/dist/.env') })
// }

// dotenv.config()
const currentDir = process.cwd()
console.log(currentDir)

if (currentDir.endsWith('server')) {
  console.log(currentDir)

  dotenv.config({ path: path.resolve(currentDir, './src/.env') })
} else {
  dotenv.config({ path: path.resolve(currentDir, './server/dist/.env') })
}

// console.log(
//   process.env.CLIENT_ID,
//   process.env.CLIENT_SECRET,
//   process.env.SER_URL
// )

const app = express()
const corsOption: CorsOptions = {
  origin: env.CLI_URL,
  credentials: true,
}
const SECRET: string = process.env.COOKIE_SECRET
const DB_URL: string = process.env.DB_URL

var cookieOpt: CookieOptions = {
  maxAge: 3 * 24 * 60 * 60,
  sameSite: 'strict',
  secure: false,
}
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1)
  cookieOpt.sameSite = 'none'
  cookieOpt.secure = true
}
var sess: SessionOptions = {
  resave: false,
  saveUninitialized: false,
  secret: SECRET,
  store: new MongoStore({
    mongoUrl: DB_URL,
    ttl: 3 * 24 * 60 * 60, // 3 days
  }),
  cookie: cookieOpt,
}

app.use(bodyParser.json())
app.use(session(sess))
app.use(passport.initialize())
app.use(passport.session())
app.use(cors(corsOption))

app.get(
  '/api/auth/google',
  (req, res, next) => {
    console.log('Api get re')

    res.header(
      'Access-Control-Allow-Methods',
      'GET, POST, PUT, DELETE, OPTIONS'
    )
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    res.header('Access-Control-Allow-Credentials', 'true')
    next()
  },
  passport.authenticate('google', { scope: ['email', 'profile'] })
)

app.get(
  '/api/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: `${env.SER_URL}/login`,
  }),
  function (req, res) {
    res.redirect(`${env.SER_URL}/`)
  }
)
app.use('/api/', AppRouter.getInstance())
app.use(ErrorHandler)

app.use(express.static(path.join(__dirname, '../../client/dist')))
app.get('*', (req: Request, res: Response) =>
  res.sendFile(path.join(__dirname, '../../client/dist/index.html'))
)

process.on('uncaughtException', (err: Error) => {
  console.error('Uncaught Exception:', err.stack)
  process.exit(1)
})

process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
  console.error('Unhandled Rejection:', reason)
  process.exit(1)
})

connect(DB_URL).then(() => {
  app.listen(env.PORT, () => {
    console.log(`Server running at http://localhost:${env.PORT}`)
  })
})
