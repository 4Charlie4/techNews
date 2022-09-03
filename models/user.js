const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");
const bcrypt = require("bcrypt");

//User class inherits from model which comes from sequelize package
class User extends Model {
  //runs on each instance of User
  checkPassword(loginPw) {
    return bcrypt.compareSync(loginPw, this.password);
  }
}

//Define table columns and config
User.init(
  {
    //table column definitions
    id: {
      //sequelize DataTypes object convey what type of data it is
      type: DataTypes.INTEGER,
      //equivalent to NOT NULL
      allowNull: false,

      //Sequellize will default to providing primary key(Good practice to add it anyways)
      primaryKey: true,

      autoIncrement: true,
    },

    username: {
      type: DataTypes.STRING,

      allowNull: false,
    },

    email: {
      type: DataTypes.STRING,

      allowNull: false,

      //makes sure that there are not duplicate emails in table
      unique: true,

      //if allowNull is false it is possible run data through validators before creating table data to insure data you require is present
      validate: {
        //specifically validates whether the format of the email is written correctly
        isEmail: true,
      },
    },

    password: {
      type: DataTypes.STRING,

      allowNull: false,
      validate: {
        //Determines what the min pass length can be
        len: [4],
      },
    },
  },

  {
    hooks: {
      //for when a pass is created
      async beforeCreate(newUserData) {
        newUserData.password = await bcrypt.hash(newUserData.password, 10);
        return newUserData;
      },
      //for when a pass is updated
      async beforeUpdate(updateUserData) {
        updateUserData.password = await bcrypt.hash(
          updateUserData.password,
          10
        );
        return updateUserData;
      },
    },

    //Table configuration options

    //passing in imported sequelize connection from connection.js
    sequelize,
    //prevents default timestamp fields
    timestamps: false,
    //Prevents auto pluralize name of database table
    freezeTableName: true,
    // Use underscores instead of camel-casing
    underscored: true,
    //make sure that model name is lowercase
    modelName: "user",
  }
);

module.exports = User;
