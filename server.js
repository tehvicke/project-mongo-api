import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'

const MAXPERPAGE = 10

// If you're using one of our datasets, uncomment the appropriate import below
// to get started!
// 
// import goldenGlobesData from './data/golden-globes.json'
import avocadoSalesData from './data/avocado-sales.json'
// import booksData from './data/books.json'
// import netflixData from './data/netflix-titles.json'
// import topMusicData from './data/top-music.json'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise


const AvocadoSales = mongoose.model('AvocadoSales', {
  id: Number,
  date: Date, /* Date is in string in json but is automatically converted */
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

		avocadoSalesData.forEach((item) => {
			new AvocadoSales(item).save()
		})
  }

  seedDatabase()
  console.log("Database seeded")
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

// Start defining your routes here
app.get('/avocado-sales', async (req, res) => {
  const { /* destructure the query params */
    start, 
    end, 
    page = 1,
    "average-price-min": averagePriceMin,
    "average-price-max": averagePriceMax
    } = req.query

    /* Ensure we get dates, send 400 error otherwise */
    if(start === undefined || end === undefined) {
      return res.status(400).json({
          status:'failure',
          message: 'Please ensure you pick two dates'
           })
          }
  


    let sales = await AvocadoSales.find({ 
      date: { /* check for date range greater or equal && lesser than */ 
            $gte: new Date(start),
            $lt: new Date(end)
             }
      }).sort({ date: 'desc'})  /** TODO: Add pagination in database and not in response - preferably without Skip() as it's resource intensive */
    
    /* Handle pages */
    const response = sales.slice((page - 1) * MAXPERPAGE, page * MAXPERPAGE)
    const numberOfPages = Math.ceil(sales.length / MAXPERPAGE)
  res.json(
    {
      'number-of-pages': numberOfPages,
      'current-page': page, /* not really necessary as the client should know this but could be good for confirmation... or something.. */
      'data': response
    }
  )
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
