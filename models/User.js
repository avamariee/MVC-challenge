const sequelize = require('../config/connection')
const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');

class User extends Model {

    // set up method to run on instance data (per user) to check password

    checkPassword(loginPw) {
        return bcrypt.compareSync(loginPw, this.password);
    }

}

User.init({
    // ID column
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    // username column
    username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    // user's email address for email column
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        // prevent duplicate email addresses from being used
        unique: true,
        // make sure the user input is actually an email address
        validate: {
            isEmail: true
        }
    },
    // password column
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            // make sure the password is a certain amount of characters long
            len: [4]
        }
    }
},
    { // hash the password for the user
        hooks: {

            // set up beforeCreate lifecycle "hook" functionality
            async beforeCreate(newUserData) {
                newUserData.password = await bcrypt.hash(newUserData.password, 10);
                return newUserData;

            },

            // set up beforeUpdate lifecycle "hook" functionality
            async beforeUpdate(updatedUserData) {
                updatedUserData.password = await bcrypt.hash(updatedUserData.password, 10);
                return updatedUserData;
            }
        },

        sequelize,
        // don't automatically create createdAt/updatedAt timestamp fields
        timestamps: false,
        // don't pluralize the name of the database table
        freezeTableName: true,
        // user underscores instead of camel-casing
        underscored: true,
        // make it so our model name stays lowercase in the database
        modelName: 'user'
    })

    module.exports = User;