export default () => ({
  port: parseInt(process.env.PORT ?? '3000', 10),
  auth: { secret: process.env.JWT_SECRET },
  saltRounds: parseInt(process.env.SALT_ROUNDS ?? '10'),
  database: {
    url: process.env.DATABASE_URL,
  },
})
