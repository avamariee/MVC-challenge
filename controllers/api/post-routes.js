const router = require('express').Router();
const { User, Post } = require('../../models/index');
const sequelize = require('../../config/connection');
const withAuth = require('../../utils/auth');

