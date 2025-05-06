import { Need } from 'src/needs/entities/need.entity';
import { User } from '../users/entities/user.entity';
import { Offer } from 'src/offers/entities/offer.entity';
import { Match } from 'src/matches/entities/match.entity';

export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  jwt: {
    secret: process.env.JWT_SECRET || 'refuge-connect-bridge-secret',
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  },
  database: {
    type: 'postgres',
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT, 10) || 5433,
    username: process.env.DATABASE_USER || 'postgres',
    password: process.env.DATABASE_PASSWORD || '090690',
    database: process.env.DATABASE_NAME || 'refuge_connect_bridge',
    ssl: process.env.DATABASE_SSL === 'true' ? {
      rejectUnauthorized: false,
    } : false,
    entities: [User, Need, Offer, Match],
    synchronize: true,
    autoLoadEntities: true,
    logging: true,
  }
});