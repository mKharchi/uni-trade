"use client";
import React from 'react';
import { useAdmin } from '../AdminContext';
import { MoreVertical, Ban, Loader2, UserX } from 'lucide-react';
import { toast } from 'react-toastify';

// Types
type User = {
  id?: string | number;
  _id?: string | number;
  email: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  phone?: string;
  university?: string;
  specialty?: string;
  reports?: any[];
};

interface UserTableRowProps {
  user: User;
  onBanUser: (user: User) => Promise<void>;
}

const UserTableRow: React.FC<UserTableRowProps> = ({ user, onBanUser }) => {
  const [showActions, setShowActions] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const rowRef = React.useRef<HTMLTableRowElement>(null);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (rowRef.current && !rowRef.current.contains(event.target as Node)) {
        setShowActions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleBanUser = async () => {
    if (window.confirm(`Are you sure you want to ban ${user.name || user.email}?`)) {
      setLoading(true);
      try {
        await onBanUser(user);
        toast.success(`User ${user.name || user.email} has been banned`);
      } catch (error: any) {
        toast.error(error.message || 'Failed to ban user');
      } finally {
        setLoading(false);
        setShowActions(false);
      }
    }
  };

  return (
    <tr ref={rowRef} className='hover:bg-gray-50 transition-colors'>
      <td className='p-4'>{user.name}</td>
      <td className='p-4'>{user.email}</td>
      <td className='p-4'>{user.phone || 'N/A'}</td>
      <td className='p-4'>{user.university || 'N/A'}</td>
      <td className='p-4'>{user.specialty || 'N/A'}</td>
      <td className='p-4'>{user.reports ?  user.reports.length  : 'N/A'}</td>
      <td className='p-4 relative'>
        <button
          onClick={() => setShowActions(!showActions)}
          className='p-2 hover:bg-gray-100 rounded-full transition-colors'
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin text-gray-500" />
          ) : (
            <MoreVertical className="h-5 w-5 text-gray-500" />
          )}
        </button>

        {showActions && (
          <div className="absolute right-2 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
            <div className="py-1">
              <button
                onClick={handleBanUser}
                className='flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50'
              >
                <Ban className="h-4 w-4 mr-2" />
                Ban User
              </button>
            </div>
          </div>
        )}
      </td>
    </tr>
  );
};

const UsersPage: React.FC = () => {
  const { users, loading } = useAdmin();

  const handleBanUser = async (user: User) => {
    try {
      const res = await fetch(`/api/admin/ban/${user.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const result = await res.json()
      if (!result.success) {
        throw new Error(result.details)
      } else {
        toast.success("Success")
      }
      
    } catch (error: any) {
      throw error;
    }
  };

  return (
    <div className='space-y-6 p-6'>
      <header className='flex items-center justify-between'>
        <h1 className='text-2xl font-semibold'>User Management</h1>
        <div className='flex items-center gap-4'>
          {loading && <Loader2 className="h-5 w-5 animate-spin text-gray-500" />}
        </div>
      </header>

      <div className='rounded-xl bg-white shadow'>
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          </div>
        ) : !users?.students?.length ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <UserX className="h-12 w-12 mb-2" />
            <p>No users found</p>
          </div>
        ) : (
          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead className='bg-gray-50'>
                <tr>
                  <th className="p-4 text-left text-sm font-medium text-gray-500">Name</th>
                  <th className="p-4 text-left text-sm font-medium text-gray-500">Email</th>
                  <th className="p-4 text-left text-sm font-medium text-gray-500">Phone</th>
                  <th className="p-4 text-left text-sm font-medium text-gray-500">University</th>
                  <th className="p-4 text-left text-sm font-medium text-gray-500">Major</th>
                  <th className="p-4 text-left text-sm font-medium text-gray-500">Reports</th>
                  <th className="p-4 text-left text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-200'>
                {users.students.map((user: User) => (
                  <UserTableRow
                    key={user.id || user._id}
                    user={{
                      ...user,
                      name: user.firstName
                        ? `${user.firstName} ${user.lastName || ''}`.trim()
                        : user.name || user.email
                    }}
                    onBanUser={handleBanUser}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersPage;