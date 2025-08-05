export default () => {
  const corsOrigin = process.env.CORS_ORIGIN || 'https://instagram-agend.vercel.app/';

  const origins = corsOrigin.includes(',') 
    ? corsOrigin.split(',').map(origin => origin.trim())
    : corsOrigin;

  return {
    port: parseInt(process.env.PORT!, 10) || 3000,
    cors: {
      origin: origins,
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
