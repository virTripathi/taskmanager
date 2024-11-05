import { DataTypes } from 'sequelize';

export default {
  up: async (queryInterface) => {
    await queryInterface.createTable('notices', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      team: {
        type: DataTypes.ARRAY(DataTypes.INTEGER),
        allowNull: true,
        references: {
          model: 'Users',
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
          model: 'Tasks',
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
        allowNull: true,
        references: {
          model: 'Users',
          key: 'id'
        }
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      }
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('notices');
  }
};
