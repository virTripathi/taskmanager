import React, { useEffect, useState } from "react";
import ModalWrapper from "../ModalWrapper";
import { Dialog } from "@headlessui/react";
import Textbox from "../Textbox";
import { useForm } from "react-hook-form";
import UserList from "./UserList";
import SelectList from "../SelectList";
import Button from "../Button";
import { useCreateTaskMutation, useUpdateTaskMutation } from "../../redux/slices/apiSlice";

const PRIORITY = ["HIGH", "MEDIUM", "LOW"];

const AddTask = ({ open, setOpen, task = null }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  const [assignedTo, setAssignedTo] = useState(task?.assignedTo || null);
  const [priority, setPriority] = useState(task?.priority?.toUpperCase() || PRIORITY[1]);
  const [createTask, { isLoading: isCreating }] = useCreateTaskMutation();
  const [updateTask, { isLoading: isUpdating }] = useUpdateTaskMutation();
  const [apiErrors, setApiErrors] = useState({});

  useEffect(() => {
    if (task) {
      setValue("title", task.title);
      setValue("description", task.description);
      setValue("assignedTo", task.assignedTo);
      setValue("due_date", task.due_date);
      setValue("priority", task.priority);
    }
  }, [task, setValue]);

  const submitHandler = async (data) => {
    const formData = {
      ...data,
      priority: priority.toLowerCase(),
      assignedTo: assignedTo[0],
    };
  
    try {
      let response;
      if (task) {
        response = await updateTask({ id: task.id, ...formData }).unwrap();
      } else {
        response = await createTask(formData).unwrap();
      }
      setApiErrors({});
      setOpen(false);
    } catch (error) {
      const errors = {};
      error.data.stack.forEach((err) => {
        errors[err.path] = err.msg;
      });
      setApiErrors(errors);
    }
  };

  return (
    <ModalWrapper open={open} setOpen={setOpen}>
      <form onSubmit={handleSubmit(submitHandler)}>
        <Dialog.Title as="h2" className="text-base font-bold leading-6 text-gray-900 mb-4">
          {task ? "EDIT TASK" : "ADD TASK"}
        </Dialog.Title>

        <div className="mt-2 flex flex-col gap-6">
          <Textbox
            placeholder="Task Title"
            type="text"
            name="title"
            label="Task Title"
            className="w-full rounded"
            register={register("title", {
              required: "Title is required",
            })}
            error={errors.title ? errors.title.message : ""}
          />

          <UserList setAssignedTo={setAssignedTo} assignedTo={assignedTo} />
          {apiErrors.assignedTo && (
            <p className="text-red-500 text-sm mt-1">{apiErrors.assignedTo}</p>
          )}

          <Textbox
            placeholder="Due Date"
            type="date"
            name="due_date"
            label="Due Date"
            className="w-full rounded"
            register={register("due_date", {
              required: "Due date is required",
              validate: {
                isISO8601: (value) =>
                  !isNaN(Date.parse(value)) || "Invalid date format",
              },
            })}
            error={errors.due_date ? errors.due_date.message : ""}
          />
<Textbox
            placeholder="Task Description"
            type="text"
            name="description"
            label="Task Description"
            className="w-full rounded"
            register={register("description", {
              required: "Description is required",
            })}
            error={errors.title ? errors.title.message : ""}
          />
          <SelectList
            label="Priority Level"
            lists={PRIORITY}
            selected={priority}
            setSelected={setPriority}
          />

          <Button
            type="submit"
            label={isCreating || isUpdating ? "Saving..." : task ? "Update Task" : "Create Task"}
            className="mt-4 bg-blue-600 text-white rounded-md py-2 px-4"
            disabled={isCreating || isUpdating}
          />
        </div>

        {apiErrors.message && (
          <p className="text-red-500 text-sm mt-4">{apiErrors.message}</p>
        )}
      </form>
    </ModalWrapper>
  );
};

export default AddTask;
