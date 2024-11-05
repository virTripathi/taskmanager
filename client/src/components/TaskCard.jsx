import clsx from "clsx";
import React, { useState } from "react";
import {
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowUp,
} from "react-icons/md";
import { useSelector } from "react-redux";
import { PRIOTITYSTYELS, TASK_TYPE, formatDate } from "../utils";
import TaskDialog from "./task/TaskDialog";

const ICONS = {
  high: <MdKeyboardDoubleArrowUp />,
  medium: <MdKeyboardArrowUp />,
  low: <MdKeyboardArrowDown />,
};

const TaskCard = ({ task }) => {

  return (
    <>
      <div className='w-full h-fit bg-white shadow-md p-4 rounded'>
        <div className='w-full flex justify-between'>
          <div
            className={clsx(
              "flex flex-1 gap-1 items-center text-sm font-medium",
              PRIOTITYSTYELS[task?.priority]
            )}
          >
            <span className='text-lg'>{ICONS[task?.priority]}</span>
            <span className='uppercase'>{task?.priority} Priority</span>
          </div>

          { <TaskDialog task={task} />}
        </div>

        <>
          <div className='flex items-center gap-2 items-center justify-between'>
          <div className="flex items-center gap-2 ">
            <div
              className={clsx("w-4 h-4 rounded-full", TASK_TYPE[task.stage])}
            />
            
            <h4 className='line-clamp-1 text-black'>{task?.title}</h4>
            </div>
            <p className='text-sm text-gray-600 mb-2 rounded-full bg-teal-300 w-fit px-4 py-1'>
            
            <span className='capitalize'>{task?.stage}</span>
            </p>
          </div>
          <span className='text-sm text-gray-600'>
            Due By: {formatDate(new Date(task?.due_date))}
          </span>
        </>

        <div className='py-4 border-t border-gray-200'>
          <h5 className='text-base line-clamp-1 text-black'>
            {task?.description}
          </h5>
         
          <div className=''>
          <p className='text-sm text-gray-600 mb-2'>
              Assigned To: {task.assignedUser.name}
            </p>
            <p className='text-sm text-gray-600'>
              Created On: {formatDate(new Date(task?.createdAt))}
            </p>
            
          </div>
        </div>

      </div>
    </>
  );
};

export default TaskCard;
