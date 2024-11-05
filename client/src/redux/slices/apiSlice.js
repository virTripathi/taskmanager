import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_URI = "http://localhost:8800/api";

const baseQuery = fetchBaseQuery({ baseUrl: API_URI,credentials: "include", });

export const apiSlice = createApi({
  baseQuery,
  tagTypes: ["User"],
  endpoints: (builder) => ({
    getUserList: builder.query({
      query: () => "/user",
      providesTags: ["User"],
    }),
    registerUser: builder.mutation({
      query: (userData) => ({
        url: "/user/register",
        method: "POST",
        body: userData,
      }),
      invalidatesTags: ["User"],
    }),
    registerAdminUser: builder.mutation({
      query: (userData) => ({
        url: "/user/admin-register",
        method: "POST",
        body: userData,
      }),
      invalidatesTags: ["User"],
    }),
    loginUser: builder.mutation({
      query: (credentials) => ({
        url: "/user/login",
        method: "POST",
        body: credentials,
      }),
    }),
    logoutUser: builder.mutation({
      query: () => ({
        url: "/user/logout",
        method: "POST",
      }),
      invalidatesTags: ["User"],
    }),
    getTasks: builder.query({
      query: () => "/task",
      providesTags: ["Task"],
      transformResponse: (response) => response.tasks,
    }),
    createTask: builder.mutation({
      query: (taskData) => ({
        url: "/task/create",
        method: "POST",
        body: taskData,
      }),
      invalidatesTags: ["Task"],
    }),
    updateTask: builder.mutation({
      query: ({ id, ...taskData }) => ({
        url: `/task/update/${id}`,
        method: "PUT",
        body: taskData,
      }),
      invalidatesTags: ["Task"],
    }),
    updateTaskStatus: builder.mutation({
      query: ({ id, slug }) => ({
        url: `/task/${id}/status/${slug}`,
        method: "PUT",
      }),
      invalidatesTags: ["Task"],
    }),
    deleteTask: builder.mutation({
      query: ({ id }) => ({
        url: `/task/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Task"],
    }),
  }),
});

export const {
  useGetUserListQuery,
  useRegisterUserMutation,
  useRegisterAdminUserMutation,
  useLoginUserMutation,
  useLogoutUserMutation,
  useGetTasksQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useUpdateTaskStatusMutation,
  useDeleteTaskMutation
} = apiSlice;
