import mongoose from 'mongoose';
import { connectDB } from '../../database/db';
import { logger } from '../../helpers/logger.helper'

jest.mock('../../helpers/logger.helper', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
  },
}));

describe('connectDB', () => {
  const fakeMongoURI = 'mongodb://localhost:27017/testdb';

  it('should connect to the database and log success', async () => {

    const connectMock = jest.fn().mockResolvedValue(mongoose);

    mongoose.connect = connectMock;

    await connectDB(fakeMongoURI);

    expect(connectMock).toHaveBeenCalledWith(fakeMongoURI);
    expect(logger.info).toHaveBeenCalledWith('Database connection established');
  });

  it('should log an error and throw an exception on connection failure', async () => {

    const connectMock = jest.fn().mockRejectedValue(new Error('Connection failed'));

    mongoose.connect = connectMock;

    try {
      await connectDB(fakeMongoURI);
    } catch (error) {
      expect(connectMock).toHaveBeenCalledWith(fakeMongoURI);
      expect(logger.error).toHaveBeenCalledWith('Database connection failed', error);
      expect(error).toBeInstanceOf(Error);
    }
  });
});
