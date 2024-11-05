import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useGetTasksQuery } from "../redux/slices/apiSlice";
import Loading from "../components/Loader";
import Title from "../components/Title";
import Button from "../components/Button";
import { IoMdAdd } from "react-icons/io";
import Tabs from "../components/Tabs";
import BoardView from "../components/BoardView";
import AddTask from "../components/task/AddTask";
import { useSelector } from "react-redux";

const Tasks = () => {
  const { user } = useSelector((state) => state.auth);
  const params = useParams();
  const [selected, setSelected] = useState(0);
  const [open, setOpen] = useState(false);

  const { data: tasks = [], isLoading, error } = useGetTasksQuery(undefined,{
    refetchOnMountOrArgChange: true,

  });

  if (isLoading) {
    return (
      <div className="py-10">
        <Loading />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">Error loading tasks: {error.message || "Unknown error"}</div>;
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <Title title={params?.status ? `${params.status} Tasks` : "Tasks"} />

        {!params?.status && user?.role === "admin" && (
          <Button
            onClick={() => setOpen(true)}
            label="Create Task"
            icon={<IoMdAdd className="text-lg" />}
            className="flex flex-row-reverse gap-1 items-center bg-blue-600 text-white rounded-md py-2 2xl:py-2.5"
          />
        )}
      </div>

      <Tabs setSelected={setSelected}>
      <BoardView tasks={tasks} />
      </Tabs>

      <AddTask open={open} setOpen={setOpen} />
    </div>
  );
};

export default Tasks;
