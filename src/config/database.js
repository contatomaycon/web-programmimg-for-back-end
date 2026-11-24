import mysql from 'mysql2/promise';

export const pool = mysql.createPool({
  host: process.env.DB_HOST ?? '127.0.0.1',
  port: Number(process.env.DB_PORT ?? 3306),
  user: process.env.DB_USER ?? 'unifecaf_reader',
  password: process.env.DB_PASSWORD ?? '',
  database: process.env.DB_NAME ?? 'unifecaf_flix',
  charset: 'utf8mb4',
  dateStrings: true,
  connectionLimit: 5,
  queueLimit: 20,
  connectTimeout: 5000,
});
