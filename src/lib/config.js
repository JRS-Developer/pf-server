require('dotenv').config()

if (!process.env.SECRET)
  console.error('The SECRET env variable is not declared')

const config = {
  dbUser: process.env.DB_USER || 'postgres',
  dbPassword: process.env.DB_PASSWORD || '1234',
  dbHost: process.env.DB_HOST || 'localhost',
  dbName: process.env.DB_NAME || 'gaia',
  dbPort: process.env.DB_PORT || '5432',
  isProduction: process.env.NODE_ENV,
  port: process.env.PORT || '3001',
  host: process.env.API_HOST || 'localhost',
  cors: process.env.CORS || 'http://localhost:3000',
  secret: process.env.SECRET,
  dbURL: process.env.DATABASE_URL,
  private_vapid_key: process.env.PRIVATE_KEY,
  public_vapid_key: process.env.PUBLIC_KEY,
  // Heroku db url
}

module.exports = config
