"use strict";
var md5 = require('md5');
module.exports = function(sequelize, DataTypes) {
  var users = sequelize.define("users", {
    id: {
      type: DataTypes.INTEGER.UNSIGNED ,
        primaryKey: true ,
        autoIncrement: true
    },
    first_name : {
      type:DataTypes.STRING,
      allowNull: false,
    },
    email : {
        type:DataTypes.STRING,
        allowNull: false,
        unique:true
    } ,
    password : {
        type:DataTypes.STRING,
        allowNull: false,
        set(val) {
            this.setDataValue('password', md5(val));
        }
    },
    remember_token :{
        type:DataTypes.STRING,
        allowNull: false,
    },
    created_at :{
      type: 'TIMESTAMP' ,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    updated_at :{
      type: 'TIMESTAMP' ,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    avatarPath : DataTypes.TEXT ,
    isActive: DataTypes.BOOLEAN,
    socketID: {
        type:DataTypes.STRING(255),
        defaultValue:null,
        allowNull:true
    }

      }
  ,
  {
    timestamps: false,
    freezeTableName:true,
    tableName: 'users'
  }
  , {
    classMethods: {
      associate: function(models) {
      }
    }
  });
    users.associate = function(models) {
        users.hasMany(models.messages, {
            onDelete: "CASCADE",
            foreignKey:'sender_id',
            targetKey: 'id',
            as: 'userMessages'
        });
    };
  return users;
};
