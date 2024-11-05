import { DataTypes, Model } from 'sequelize';
import db from "./database.js";
import bcrypt from 'bcryptjs';

class User extends Model {
  static associate(models) {
    User.hasMany(models.Task, {
      foreignKey: 'assignedTo',
      as: 'assignedTasks'
    });

    User.hasMany(models.Task, {
      foreignKey: 'createdBy',
      as: 'createdTasks'
    });
    User.hasMany(models.Task, {
      foreignKey: 'updatedBy',
      as: 'updatedTasks'
    });
  }
  async matchPassword(enteredPassword) {
    return bcrypt.compare(enteredPassword, this.password);
  }
}

User.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('user', 'admin'),
    defaultValue: 'user',
    allowNull: false
  },
  trashedAt: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  sequelize:db.sequelize,
  modelName: 'User',
  tableName: 'users',
  timestamps: true
});

  export default User;
