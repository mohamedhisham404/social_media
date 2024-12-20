import request from 'supertest';
import {httpStatus} from "../../../server/utils/httpStatus.js"
import mongoose from "mongoose";
import User from '../../../server/models/userModel.js'
import app from '../../../server/index.js'
import bcrypt from 'bcryptjs';
import dotenv from "dotenv";

dotenv.config(); 
jest.setTimeout(70 * 1000)

beforeEach(async () => {
    await mongoose.connect(process.env.MONGO_URI);
});

afterEach(async () => {
    await mongoose.connection.close();
});

it('has a module',()=>{
    expect(User).toBeDefined();
})


describe('get user', () => {
    it('should get user profile by id', async () => {
        const userId = '6743a8b1a239caa082846abd';
        const res = await request(app)
            .get(`/api/users/profile/${userId}`)
            .expect(200);
        const data = res.body;
        expect(data.data.email).toBe('mohamed@mail.com');
    });

    it('should get user profile by id', async () => {
        const userId = '6743a8b1a239caa082846abd';  
        const res = await request(app)
            .get(`/api/users/profile/${userId}`)
            .expect(200);  
        const data = res.body;
        expect(data.data.email).toBe('mohamed@mail.com'); 
    });    
});

jest.mock('../../../server/models/userModel.js')
describe('login', () => {
    
    it('should return 400 if username or password is not provided', async () => {
        const res = await request(app)
            .post('/api/users/login')
            .send({})  
            .expect(400);

        expect(res.body.status).toBe(httpStatus.ERROR);
        expect(res.body.data).toBe('Username and Password are required');
    });

    it('should return 404 if user does not exist', async () => {
        const res = await request(app)
            .post('/api/users/login')
            .send({ username: 'nonexistentUser', password: 'password123' })
            .expect(404);

        expect(res.body.status).toBe(httpStatus.ERROR);
        expect(res.body.data).toBe('Invalid Email or Password');
    });

    it('should return 404 if password is incorrect', async () => {
        const mockUser = {
            _id: new mongoose.Types.ObjectId(),
            username: 'testuser',
            password: await bcrypt.hash('correctpassword', 10),
            isFrozen: false,
            save: jest.fn(),
        };

        User.findOne.mockResolvedValue(mockUser);  

        const res = await request(app)
            .post('/api/users/login')
            .send({ username: 'testuser', password: 'wrongpassword' })
            .expect(404);

        expect(res.body.status).toBe(httpStatus.ERROR);
        expect(res.body.data).toBe('Invalid Email or Password');
    });

    it('should return 200 and user data if login is successful', async () => {
        const mockUser = {
            _id: new mongoose.Types.ObjectId(),
            username: 'testuser',
            password: await bcrypt.hash('correctpassword', 10),
            isFrozen: false,
            save: jest.fn(),
        };

        User.findOne.mockResolvedValue(mockUser);  

        const generateJWTsetCookie = jest.fn();

        const res = await request(app)
            .post('/api/users/login')
            .send({ username: 'testuser', password: 'correctpassword' })
            .expect(200);

        expect(res.body.status).toBe(httpStatus.SUCCESS);
        expect(res.body.data.username).toBe('testuser');
    });

    it('should return 500 if there is a server error', async () => {
        User.findOne.mockRejectedValue(new Error('Database error'));

        const res = await request(app)
            .post('/api/users/login')
            .send({ username: 'testuser', password: 'correctpassword' })
            .expect(500);

        expect(res.body.status).toBe(httpStatus.FAIL);
        expect(res.body.data).toBe('Database error');
    });
});
