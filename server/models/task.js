import { DataTypes, Model } from 'sequelize';
import db from "./database.js";
import User from './user.js';

class Task extends Model {
  static associate(models) {
    Task.belongsTo(models.User, {
      foreignKey: 'assignedTo',
      as: 'assignedUser'
    });

    Task.belongsTo(models.User, {
      foreignKey: 'createdBy',
      as: 'creator'
    });

    Task.belongsTo(models.User, {
      foreignKey: 'updatedBy',
      as: 'updater'
    });
  }
}

Task.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  due_date: {
    type: DataTypes.DATE,
    allowNull: true
  },
  priority: {
    type: DataTypes.ENUM('low', 'medium', 'high'),
    defaultValue: 'medium',
    allowNull: false
  },
  stage: {
    type: DataTypes.ENUM('todo', 'in-progress', 'completed'),
    defaultValue: 'todo',
    allowNull: false
  },
  assignedTo: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  trashedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  createdBy: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  updatedBy: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  sequelize:db.sequelize,
  modelName: 'Task',
  tableName: 'tasks',
  timestamps: true
});

  export default Task;
