export default () => {
  return {
    port: parseInt(process.env.PORT!, 10) || 3000,
    cors: {
      origin: process.env.CORS_ORIGIN || 'http://localhost:8081',
      credentials: true,
    },
    database: {
      url: process.env.DATABASE_URL,
    },
    jwt: {
      secret: process.env.JWT_SECRET,
    },
    ai: {
      openai: {
        apiKey: process.env.OPENAI_KEY,
      },
      google: {
        apiKey: process.env.GOOGLE_AI_API_KEY,
      },
    },
  };
};
