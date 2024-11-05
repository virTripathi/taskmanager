import React from "react";
import Title from "../components/Title";
import { useGetUserListQuery } from "../redux/slices/apiSlice";
import { getInitials } from "../utils";
import clsx from "clsx";

const Users = () => {
  const { data: users = [], isLoading, error } = useGetUserListQuery();

  function capitalizeFirstLetter(word) {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  }
  const TableHeader = () => (
    <thead className="border-b border-gray-300">
      <tr className="text-black text-left">
        <th className="py-2">Full Name</th>
        <th className="py-2">Email</th>
        <th className="py-2">Role</th>
        <th className="py-2">Active</th>
      </tr>
    </thead>
  );

  const TableRow = ({ user }) => (
    <tr className="border-b border-gray-200 text-gray-600 hover:bg-gray-400/10">
      <td className="p-2">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full text-white flex items-center justify-center text-sm bg-blue-700">
            <span className="text-xs md:text-sm text-center">
              {getInitials(user.name)}
            </span>
          </div>
          {user.name}
        </div>
      </td>

      <td className="p-2">{user.email || "user@example.com"}</td>
      <td className="p-2">{capitalizeFirstLetter(user.role) || "N/A"}</td>

      <td className="p-2">
        <button
          className={clsx(
            "w-fit px-4 py-1 rounded-full",
            user?.isActive ? "bg-blue-200" : "bg-yellow-100"
          )}
        >
          Active
        </button>
      </td>
    </tr>
  );

  return (
    <>
      <div className="w-full md:px-1 px-0 mb-6">
        <div className="flex items-center justify-between mb-8">
          <Title title="Users" />
         
        </div>

        {isLoading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error loading users.</p>
        ) : (
          <div className="bg-white px-2 md:px-4 py-4 shadow-md rounded">
            <div className="overflow-x-auto">
              <table className="w-full mb-5">
                <TableHeader />
                <tbody>
                  {users.map((user, index) => (
                    <TableRow key={user._id || index} user={user} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Users;
