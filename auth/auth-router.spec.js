const server = require('../api/server.js');
const request = require('supertest');
const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../database/dbConfig');


describe('auth router', () => {
    describe('POST /register', () => {
        const user = {
            username: 'User Of the Centaur Gym',
            password: 'gym-nasty'
        };

        let res = {};

        beforeEach(async () => {
            await db('users').truncate();
            res = await request(server).post('/api/auth/register').send(user);
        });

        it('should return 201 OK', async () => {
            expect(res.status).toBe(201);
        });

        it('should add a new user', async () => {
            const newUser = await db('users')
                .where({ username: user.username })
                .first();

            expect(res.body.data).toEqual(newUser);
        });

        it('should create hash', async () => {

            const newUser = await db('users')
                .where({ username: user.username })
                .first();
            const creds = bcrypt.compareSync(
                user.password,
                newUser.password
            );
            expect(creds).toEqual(true);
        });
    });

    describe('POST /login', () => {
        const user = {
            username: 'User Of the Centaur Gym',
            password: 'gym-nasty'
        };

        let res = {};

        beforeEach(async () => {
            await db('users').truncate();
            await request(server).post('/api/auth/register').send(user);
            res = await request(server).post('/api/auth/login').send(user);
        });

        it('should return 200 for successfully login', async () => {
            expect(res.status).toBe(200);
        });

        it('should return token to user', async () => {
            expect(res.jwt_token).not.toBe('');
        });
    });
});