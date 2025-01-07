import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../src/app'; 
import { MongoMemoryServer } from 'mongodb-memory-server';
import UserModel from '../../src/models/user.model'; 
let mongoServer: MongoMemoryServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
  });

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

describe('GET /users/:id', () => {
    it('should return 404 if the user is not found', async () => {
        const res = await request(app).get('/users/60c72b2f9f1b2c001c2c3d4e');  // ID non existant
        expect(res.status).toBe(404);
        expect(res.body.message).toBe('Utilisateur non trouvé');
    });

    it('should return the user if found', async () => {
        const newUser = new UserModel({ name: 'Test User', email: 'test@example.com',password:'12345678910' });
        await newUser.save();
        const res = await request(app).get(`/users/${newUser._id}`);
        expect(res.status).toBe(200);
        expect(res.body.name).toBe('Test User');
    });
});
