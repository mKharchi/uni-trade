"use client";
import React from 'react';
import { useAdmin } from '../AdminContext';
import { MoreVertical, Ban, Loader2, UserX, Mail, Phone, GraduationCap, BookOpen, AlertTriangle, MessageSquareWarningIcon } from 'lucide-react';
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
      <td className='p-4'>{user.reports ? user.reports.length : 'N/A'}</td>
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

// Mobile Card Component
const UserCard: React.FC<UserTableRowProps> = ({ user, onBanUser }) => {
  const [showActions, setShowActions] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const cardRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
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
    <div ref={cardRef} className='bg-white border border-gray-200 rounded-lg w-full h-full p-4 space-y-3 relative'>
      {/* Header with name and actions */}
      <div className='flex items-start justify-between'>
        <div>
          <h3 className='font-semibold text-lg'>{user.name}</h3>
          {user.reports && user.reports.length > 0 && (
            <div className='flex items-center gap-1 text-orange-600 text-sm mt-1'>
              <AlertTriangle className='h-4 w-4' />
              <span>{user.reports.length} report{user.reports.length !== 1 ? 's' : ''}</span>
            </div>
          )}
        </div>
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
          <div className="absolute right-4 top-12 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
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
      </div>

      {/* User details */}
      <div className='space-y-2 text-sm'>
        <div className='flex items-center gap-2 text-gray-600'>
          <Mail className='h-4 w-4 flex-shrink-0' />
          <span className='break-all'>{user.email}</span>
        </div>
        
        {user.phone && (
          <div className='flex items-center gap-2 text-gray-600'>
            <Phone className='h-4 w-4 flex-shrink-0' />
            <span>{user.phone}</span>
          </div>
        )}
        
        {user.university && (
          <div className='flex items-center gap-2 text-gray-600'>
            <GraduationCap className='h-4 w-4 flex-shrink-0' />
            <span>{user.university}</span>
          </div>
        )}
        
        {user.specialty && (
          <div className='flex items-center gap-2 text-gray-600'>
            <BookOpen className='h-4 w-4 flex-shrink-0' />
            <span>{user.specialty}</span>
          </div>
        )}
        {user.reports  && (
          <div className='flex items-center gap-2 text-gray-600'>
            <MessageSquareWarningIcon className='h-4 w-4 flex-shrink-0' />
            <span>{user.reports?.length}</span>
          </div>
        )}
      </div>
    </div>
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
      const result = await res.json();
      if (!result.success) {
        throw new Error(result.details);
      } else {
        toast.success("Success");
      }
    } catch (error: any) {
      throw error;
    }
  };

  const usersList = users?.students || [];

  return (
    <div className='space-y-6 py-6 px-4 '>
      <header className='flex items-center justify-between'>
        <h1 className='text-2xl font-semibold'>User Management</h1>
        <div className='flex items-center gap-4'>
          {loading && <Loader2 className="h-5 w-5 animate-spin text-gray-500" />}
          {!loading && usersList.length > 0 && (
            <span className='text-sm text-gray-500'>{usersList.length} user{usersList.length !== 1 ? 's' : ''}</span>
          )}
        </div>
      </header>

      {loading ? (
        <div className="flex items-center justify-center h-64 bg-white rounded-xl shadow">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        </div>
      ) : !usersList.length ? (
        <div className="flex flex-col items-center justify-center h-64 bg-white rounded-xl shadow text-gray-500">
          <UserX className="h-12 w-12 mb-2" />
          <p>No users found</p>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
         
          {/* Mobile Card View */}
          <div className='space-y-4 grid grid-cols-1 md:grid-cols-2 gap-x-2 xl:gap-x-1 gap-y-2'>
            {usersList.map((user: User) => (
              <UserCard
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
          </div>
        </>
      )}
    </div>
  );
};

export default UsersPage;