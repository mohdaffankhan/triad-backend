import dotenv from 'dotenv';

dotenv.config();

const _config = {
    port: process.env.PORT,
    env: process.env.NODE_ENV,
    db_url: process.env.DATABASE_URL,
    cloudinary_name: process.env.CLOUDINARY_NAME,
    cloudinary_api_key: process.env.CLOUDINARY_API_KEY,
    cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET
}

export const config = Object.freeze(_config);