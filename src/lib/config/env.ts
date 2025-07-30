export default () => ({
  port: parseInt(process.env.PORT ?? '3000', 10),
  auth: { secret: process.env.JWT_SECRET },
  database: {
    url: process.env.DATABASE_URL,
  },
})
