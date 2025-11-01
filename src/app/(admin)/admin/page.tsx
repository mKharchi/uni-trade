"use client";
import React from "react";
import { useAdmin } from "./AdminContext";
import { Edit, MoreVertical, User } from "lucide-react";
import { useAuth } from "@/app/AuthContext";

const page = () => {
  const { users, loading } = useAdmin();
  const { user } = useAuth()
  console.log(user);

  return (
    <div className="w-full ">


      {loading ? (
        <p className="text-gray-600">Loading...</p>
      ) : users.students.length === 0 ? (
        <p className="text-gray-600">No users found.</p>
      ) : (<>
        <h3 className="mb-6 text-2xl  ">Welcome <b>{" " + user?.email}</b></h3>
        <h2 className="py-2 border-b w-fit mb-4">Active Users:</h2>
        <div className="w-full  flex flex-wrap items-start gap-4">
          {users.students.filter(el=>(el.email!== user?.email)).map((u: any) => {
            const key = u.id ?? u._id ?? `${u.email}-${Math.random()}`;
            const title = u.firstName
              ? `${u.firstName} ${u.lastName ?? ""}`.trim()
              : u.name ?? u.email ?? "Unknown user";
            return (
              <div key={key} className="p-3 bg-white rounded  relative text-center shadow-sm min-h-60 min-w-[200px]">
                <div className="absolute top-2 right-2">
                  <button className="text-sm text-gray-500 hover:text-gray-700">
                    <MoreVertical size={15} />
                  </button>
                </div>
                <div className="w-full min-h-40 flex items-center justify-center ">


                  <User className="rounded-full bg-gray-50 p-2" size={60} />

                </div>
                <div className="font-medium">{title}</div>
                {u.role && <div className="text-xs text-gray-400 mt-1">Role: {u.role}</div>}
              </div>
            );
          })}
        </div>

      </>

      )}
    </div>
  );
};

export default page;