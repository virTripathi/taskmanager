import User from './user.js';
import Task from './task.js';

User.associate({ Task });
Task.associate({ User });

export { User, Task };
