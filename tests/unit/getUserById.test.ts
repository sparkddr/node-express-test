import request from 'supertest';
import {app} from '../../src/app'; // Ton application Express
import UserModel from '../../src/models/user.model'; // Le modèle à mocker

// Mock du modèle UserModel
jest.mock('../../src/models/user.model'); 

describe('GET /users/:id - getUserById', () => {
  it('should return 400 if the ID is invalid', async () => {
    const res = await request(app).get('/users/invalid-id');
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('ID utilisateur invalide');
  });

  it('should return 404 if the user is not found', async () => {
    (UserModel.findById as jest.Mock).mockResolvedValue(null);

    const res = await request(app).get('/users/64b2fc7f89b7c12d3a123456');
    expect(res.status).toBe(404);
    expect(res.body.message).toBe('Utilisateur non trouvé');
  });

  it('should return 200 and the user if the user is found', async () => {
    (UserModel.findById as jest.Mock).mockResolvedValue({
      _id: '64b2fc7f89b7c12d3a123456',
      name: 'John Doe',
    });

    const res = await request(app).get('/users/64b2fc7f89b7c12d3a123456');
    expect(res.status).toBe(200);
    expect(res.body.name).toBe('John Doe');
  });
});


describe('GET /users/search - getUsersByName', () => {
    it('should return 200 and the users if the users are found', async () => {
        const res = await request(app).get('/users/search?name=John');
        expect(res.status).toBe(200);
        expect(res.body.length).toBeGreaterThan(0);
    });
});

