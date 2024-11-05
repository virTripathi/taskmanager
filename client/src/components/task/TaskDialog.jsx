import React, { Fragment, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AiTwotoneFolderOpen } from "react-icons/ai";
import { BsThreeDots } from "react-icons/bs";
import { useSelector } from "react-redux";
import { MdOutlineEdit } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { Menu, Transition } from "@headlessui/react";
import AddTask from "./AddTask";
import ConfirmatioDialog from "../Dialogs";
import { useUpdateTaskStatusMutation, useDeleteTaskMutation } from "../../redux/slices/apiSlice";

const TaskDialog = ({ task, onDelete }) => {
  const [updateTaskStatus] = useUpdateTaskStatusMutation();
  const [deleteTask] = useDeleteTaskMutation();
  const { user } = useSelector((state) => state.auth);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  
  const navigate = useNavigate();

  const deleteHandler = async () => {
    try {
      await deleteTask({id:task.id}).unwrap();
      setOpenDialog(false);
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    try {
      await updateTaskStatus({ id: task.id, slug: newStatus }).unwrap();
    } catch (error) {
      console.error("Failed to update task status:", error);
    }
  };

  const availableStatuses = ["todo", "in-progress", "completed"];

  const statusItems = availableStatuses
    .filter(status => status !== task.stage)
    .map(status => ({
      label: status.charAt(0).toUpperCase() + status.slice(1),
      icon: <MdOutlineEdit className="mr-2 h-5 w-5" aria-hidden="true" />,
      onClick: () => handleStatusUpdate(status),
    }));

  const items = [
    {
      label: "Open Task",
      icon: <AiTwotoneFolderOpen className="mr-2 h-5 w-5" aria-hidden="true" />,
      onClick: () => navigate(`/task/${task.id}`),
    },
    {
      label: "Edit",
      icon: <MdOutlineEdit className="mr-2 h-5 w-5" aria-hidden="true" />,
      isAdminButton: true,
      onClick: () => setOpenEdit(true),
    },
    ...statusItems,
  ];

  return (
    <>
      <div>
        <Menu as="div" className="relative inline-block text-left">
          <Menu.Button className="inline-flex w-full justify-center rounded-md px-4 py-2 text-sm font-medium text-gray-600 ">
            <BsThreeDots />
          </Menu.Button>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute p-4 right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
              <div className="px-1 py-1 space-y-2">
                {items.map(
                  (el) =>
                    (!el.isAdminButton || user.role === 'admin') && (
                      <Menu.Item key={el.label}>
                        {({ active }) => (
                          <button
                            onClick={el.onClick}
                            className={`${
                              active
                                ? "bg-blue-500 text-white"
                                : "text-gray-900"
                            } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                          >
                            {el.icon}
                            {el.label}
                          </button>
                        )}
                      </Menu.Item>
                    )
                )}
              </div>
              {user.role === 'admin' && (
                <div className="px-1 py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={() => setOpenDialog(true)}
                        className={`${
                          active ? "bg-blue-500 text-white" : "text-red-900"
                        } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                      >
                        <RiDeleteBin6Line
                          className="mr-2 h-5 w-5 text-red-400"
                          aria-hidden="true"
                        />
                        Delete
                      </button>
                    )}
                  </Menu.Item>
                </div>
              )}
            </Menu.Items>
          </Transition>
        </Menu>
      </div>

      <AddTask
        open={openEdit}
        setOpen={setOpenEdit}
        task={task}
        key={new Date().getTime()}
      />

      <ConfirmatioDialog
        open={openDialog}
        setOpen={setOpenDialog}
        onClick={deleteHandler}
      />
    </>
  );
};

export default TaskDialog;
