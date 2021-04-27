const sequelize = require('../config/connection');
const { Model, DataTypes } = require('sequelize');

class Post extends Model {

}

Post.init({
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },

    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    
    body: {
        type: DataTypes.STRING,
        allowNull: false
    },

    post_url: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isUrl: true
        }
    },

    user_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'user',
            key: 'id'
        }
    }
},
    {
        sequelize,
        underscored: true,
        freezeTableName: true,
        modelName: 'post'
    });

module.exports = Post;