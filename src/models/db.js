const Sequelize = require('sequelize');

if(!process.env.DB_CONNECTION) throw "Env File not likely loaded.";

const sequelize = new Sequelize(process.env.DB_CONNECTION, {
  pool: {
    max: 5,
    min: 0,
    idle: 10000,
  },
  logging: false,
});

const user = sequelize.define('user', {
  name: {
    type: Sequelize.STRING,
  },
  age: {
    type: Sequelize.INTEGER,
  },
  hobby: {
    type: Sequelize.STRING,
  }
});

sequelize.sync();

exports.sequelize = sequelize;
exports.user = user;
