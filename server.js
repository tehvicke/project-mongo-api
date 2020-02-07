import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'

const MAXPERPAGE = 10 /* max results per page */

// import goldenGlobesData from './data/golden-globes.json'
import avocadoSalesData from './data/avocado-sales.json'
// import booksData from './data/books.json'
// import netflixData from './data/netflix-titles.json'
// import topMusicData from './data/top-music.json'

const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost/project-mongo'
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const AvocadoSales = mongoose.model('AvocadoSales', {
  id: Number,
  date: Date /* Date is in string in json but is automatically converted. Time is set to 00:00:00 however */,
  averagePrice: Number,
  totalVolume: Number,
  totalBagsSold: Number,
  smallBagsSold: Number,
  largeBagsSold: Number,
  xLargeBagsSold: Number,
  region: String
})

if (process.env.RESET_DB) {
  const seedDatabase = async () => {
    await AvocadoSales.deleteMany({})

    avocadoSalesData.forEach(item => {
      new AvocadoSales(item).save()
    })
  }

  seedDatabase()
  console.log('Database seeded')
}

// Defines the port the app will run on. Defaults to 8080, but can be
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 8080
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())

const queryBuilder = (req, res) => {
  const {
    /* destructure the query params */
    start,
    end,
    'average-price-min': averagePriceMin,
    'average-price-max': averagePriceMax,
    'total-volume-min': totalVolumeMin,
    'total-volume-max': totalVolumeMax,
    region
  } = req.query
  /* Error handling */
  if (start === undefined || end === undefined) {
    /* Ensure we get dates, send 400 error otherwise */
    return res.status(400).json({
      status: 'failure',
      message: 'Please ensure you pick two dates'
    })
  }
  /* Add mandatory fields to the query */
  const dbQuery = {
    date: {
      /* check for date range greater or equal && lesser than */
      $gte: new Date(start),
      $lt: new Date(end)
    }
  }
  /* Adds optional fields */
  if (averagePriceMin || averagePriceMax) {
    dbQuery['averagePrice'] = {}
    if (averagePriceMin) {
      dbQuery['averagePrice']['$gte'] = +averagePriceMin
    }
    if (averagePriceMax) {
      dbQuery['averagePrice']['$lte'] = +averagePriceMax
    }
  }
  if (totalVolumeMin || totalVolumeMax) {
    dbQuery['totalVolume'] = {}
    if (totalVolumeMin) {
      dbQuery['totalVolume']['$gte'] = +totalVolumeMin
    }
    if (totalVolumeMax) {
      dbQuery['totalVolume']['$lte'] = +totalVolumeMax
    }
  }
  if (region) {
    dbQuery['region'] = { $eq: region }
  }

  console.log(dbQuery)
  return dbQuery
}

// Start defining your routes here
app.get('/avocado-sales', async (req, res) => {
  let page = req.query.page || 1

  const dbQuery = queryBuilder(req, res)

  const numberOfPages = Math.ceil(
    (await AvocadoSales.countDocuments(dbQuery)) / MAXPERPAGE
  ) /* Not really needed to send for each new page request - could store in frontend and pass bool to not run this function */

  if (numberOfPages != 0 && numberOfPages < page) {
    /* If page provided is too high return last page */
    page = numberOfPages
  }
  const response = await AvocadoSales.find(dbQuery)
    .skip(MAXPERPAGE * (page - 1))
    .limit(MAXPERPAGE)

  res.json({
    'number-of-pages': numberOfPages,
    'current-page': +page /* not really necessary as the client should know this but could be good for confirmation... or something.. */,
    data: response
  })
})

app.get('/avocado-sales/:id', async (req, res) => {
  
  try {
    const result = await AvocadoSales.findOne({ _id: req.params.id })
    if (result === null) {
      throw 'error'
    }
    return res.json(result)
  } catch {
    return res.status(400).json({
      status: 'failure',
      message: 'Please provide a valid ID'
    })
  }
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
