import Notice from "../models/notification.js";
import { Task, User } from '../models/index.js';
import { Op } from "sequelize";

export const createTask = async (req, res) => {
  try {
    const { userId } = req.user;
    let { title, description, stage, due_date, priority, assignedTo } = req.body;

    const assignedUser = await User.findByPk(assignedTo);
    if (!assignedUser) {
      return res.status(404).json({ status: false, message: "Assigned user not found" });
    }
    if(stage) {
      stage = stage.toLowerCase();
    }

    const text = `New task has been assigned to you. The task priority is set to ${priority} priority. The due date is ${new Date(due_date).toDateString()}.`;

    const task = await Task.create({
      title,
      description,
      stage: stage,
      due_date,
      priority: priority.toLowerCase(),
      assignedTo,
      createdBy: userId,
      updatedBy: userId,
    });

    await Notice.create({
      userId: assignedTo,
      text,
      taskId: task.id,
    });

    res.status(200).json({ status: true, task, message: "Task created successfully." });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const getTasks = async (req, res) => {
  try {
    const { stage, isTrashed } = req.query;
    const whereClause = { 
      trashedAt: isTrashed === 'true' ? { [Op.not]: null } : null 
    };

    if (stage) {
      whereClause.stage = stage.toLowerCase();
    }
    if(req.user.role == 'user') {
      whereClause.assignedTo = req.user.userId;
    }

    const tasks = await Task.findAll({
      where: whereClause,
      include: [{ model: User, as: 'assignedUser', attributes: ['name', 'email'] }],
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json({ status: true, tasks });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const getTask = async (req, res) => {
  try {
    const { id } = req.params;
    const whereClause = {};
    if (req.user.role === 'user') {
      whereClause.assignedTo = req.user.userId;
    }

    const task = await Task.findOne({
      where: {
        id,
        ...whereClause
      },
      include: [
        { model: User, as: 'assignedUser', attributes: ['name', 'role', 'email'] },
        { model: User, as: 'creator', attributes: ['name'] },
        { model: User, as: 'updater', attributes: ['name'] },
      ],
    });

    if (!task) {
      return res.status(404).json({ status: false, message: "Task not found" });
    }

    res.status(200).json({ status: true, task });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};


export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    let { title, description, due_date, stage, priority, assignedTo } = req.body;
    if(stage) {
      stage = stage.toLowerCase();
    }
    const task = await Task.findByPk(id);
    if (!task) {
      return res.status(404).json({ status: false, message: "Task not found" });
    }

    if (assignedTo) {
      const assignedUser = await User.findByPk(assignedTo);
      if (!assignedUser) {
        return res.status(404).json({ status: false, message: "Assigned user not found" });
      }
    }

    await task.update({
      title,
      description,
      due_date,
      stage: stage,
      priority: priority.toLowerCase(),
      assignedTo,
      updatedBy: req.user.userId,
    });

    res.status(200).json({ status: true, message: "Task updated successfully." });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const updateTaskStatus = async (req, res) => {
  try {
    const { id, slug } = req.params;
    const task = await Task.findByPk(id);

    if (!task) {
      return res.status(404).json({ status: false, message: "Task not found" });
    }
    if(req.user.userId !== task.assignedTo) {
      return res.status(401).json({ status: false, message: "Unauthorised!" });
    }

    await task.update({ stage: slug.toLowerCase(), updatedBy: req.user.userId });

    res.status(200).json({ status: true, message: "Task status updated successfully", task });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    await Task.update({ trashedAt: new Date() }, { where: { id } });

    res.status(200).json({ status: true, message: "Task Deleted successfully." });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const assignTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { assignedTo } = req.body;

    const task = await Task.findByPk(id);
    if (!task) {
      return res.status(404).json({ status: false, message: "Task not found" });
    }

    const user = await User.findByPk(assignedTo);
    if (!user) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    await task.update({ assignedTo, updatedBy: req.user.userId });

    res.status(200).json({ status: true, message: "Task assigned successfully." });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};
