const db = require('../database/dbConfig.js');

const Users = require('./users-model.js');

describe('users model', () => {
    beforeEach(async () => {
        await db('users').truncate();
    });

    describe('add function', () => {
        beforeEach(async () => {
            await db('users').truncate();
        });

        it('should insert the provided users into the db.', async () => {
            await Users.add({ username: 'Shot Calla', password: 'impala' });
            await Users.add({ username: 'Cecil', password: 'ia' });

            const users = await db('users');
            expect(users).toHaveLength(2);
        });

        it('should return the hobbit we inserted', async () => {
            let users = await Users.add({ username: 'Shot Calla', password: 'impala' });
            expect(users.username).toBe('Shot Calla');

            users = await Users.add({ username: 'Cecil', password: 'ia' });
            expect(users.username).toBe('Cecil');
        });
    });

    describe('findById function', () => {
        it('should find the user with the given id', async () => {
            await Users.add({ username: 'Forest', password: 'gump' });
            const user = await Users.findById(1);

            expect(user.username).toBe('Forest');
        });
    });
});