"use strict";

module.exports = (sequelize, Datatypes) => {
  const User = sequelize.define(
    "user",
    {
      id: {
        autoIncrement: true,
        type: Datatypes.SMALLINT,
        allowNull: false,
        primaryKey: true,
      },
      email: {
        type: Datatypes.STRING(100),
        allowNull: false,
        unique: "email_UNIQUE",
      },
      password: {
        type: Datatypes.STRING(100),
        allowNull: false,
      },
      lastActive: {
        type: Datatypes.STRING(100),
        allowNull: true,
      },
      active: {
        type: Datatypes.BOOLEAN,
        default: false,
      },
      otp: {
        type: Datatypes.STRING(100),
        allowNull: true,
      },
      userAgent: {
        type: Datatypes.STRING(200),
        allowNull: true,
      },
      ip: {
        type: Datatypes.STRING(15),
        allowNull: true,
      },
    
    },
    {
      sequelize,
      tableName: "user",
      timestamps: true,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "id" }],
        },
        {
          name: "email_UNIQUE",
          unique: true,
          using: "BTREE",
          fields: [{ name: "email" }],
        },
      ],
    }
  );
  return User;
};