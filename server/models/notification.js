import { DataTypes, Model } from 'sequelize';
import db from './database.js';

class Notice extends Model {}

Notice.init(
  {
    team: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      references: {
        model: 'users',
        key: 'id'
      }
    },
    text: {
      type: DataTypes.STRING,
      allowNull: true
    },
    task: {
      type: DataTypes.INTEGER,
      references: {
        model: 'tasks',
        key: 'id'
      },
      allowNull: true
    },
    notiType: {
      type: DataTypes.ENUM('alert', 'message'),
      defaultValue: 'alert'
    },
    isRead: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      references: {
        model: 'user',
        key: 'id'
      }
    }
  },
  {
    sequelize:db.sequelize,
    modelName: 'Notice',
    tableName: 'notices',
    timestamps: true
  }
);

export default Notice;
