"use client";
import { useAuth } from '@/app/AuthContext'
import { Loader2, User, Edit2, Save, X } from 'lucide-react'
import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify';


/**

email
password
firstName
lastName
phone
university
year
specialty
 */


interface User {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    university: string;
    year: number;
    specialty: string;
}

const Page = () => {
    const { loading, setLoading, getUser, user, token } = useAuth()
    const [isEditing, setIsEditing] = useState(false)
    const [formData, setFormData] = useState<User>({
        firstName: ""
        , lastName: ""
        , email: ""
        , phone: ""
        , university: "",
        year: 1,
        specialty: ""

    })

    // Initialize form data when user loads
    useEffect(() => {
        if (user) {
            console.log(user);
            
            setFormData({
                firstName: user.firstName,
                lastName: user.lastName, email: user.email || ""
                ,
                phone: user.phone,
                university: user.university,
                year: user.year,
                specialty: user.specialty

            })
        }
    }, [user])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmitEdit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            setLoading(true)

            const response = await fetch("/api/users", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            })

            const result = await response.json()

            if (!result.success) throw new Error(result.error);

            toast.success(result.message || "Profile updated successfully")

            const verif = await getUser()
            if (!verif) {
                throw new Error("Error fetching user");
            }

            setIsEditing(false)
        } catch (error) {
            console.error((error as any).message || "Failed to update profile")
        } finally {
            setLoading(false)
        }
    }

    const handleCancel = () => {
        // Reset form data to original user data
        if (user) {
            setFormData({
                firstName: user.firstName || "",

                lastName: user.lastName || "",

                email: user.email || ""
                , phone: user.phone || "",

                university: user.university || "",

                year: user.year || 1,

                specialty: user.specialty || ""
            })
        }
        setIsEditing(false)
    }

    return (
        <div className=''>

            <div className='rounded-xl bg-white shadow'>
                {loading && !user ? (
                    <div className="flex items-center justify-center h-64">
                        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
                    </div>
                ) : (
                    <div className='p-8'>
                        {/* Profile Header */}
                        <div className='flex flex-col items-center space-y-4 pb-8 border-b'>
                            <div className='p-6 bg-gray-100 rounded-full flex items-center justify-center'>
                                <User size={80} className="text-gray-600" />
                            </div>
                            <div className='text-center'>
                                <h2 className='text-2xl font-semibold'>
                                    {user?.firstName} {user?.lastName}
                                </h2>
                                <p className='text-gray-600 mt-1'>{user?.email}</p>
                            </div>
                        </div>

                        {/* Profile Form */}
                        <div className='mt-8 max-w-2xl mx-auto'>
                            <div className='flex flex-col lg:flex-row items-center gap-2 justify-between mb-6'>
                                <h3 className='text-xl w-full font-semibold'>Profile Information</h3>
                                {!isEditing ? (
                                    <button
                                        type="button"
                                        onClick={() => setIsEditing(true)}
                                        className='flex w-full text-center justify-end items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors'
                                    >
                                        <Edit2 size={16} />
                                        Edit Profile
                                    </button>
                                ) : (
                                    <div className='flex w-full flex-row-reverse items-center gap-2'>
                                        <button
                                            type="button"
                                            onClick={handleCancel}
                                            className='flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors'
                                        >
                                            <X size={16} />
                                            Cancel
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleSubmitEdit}
                                            disabled={loading}
                                            className='flex items-center gap-2 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                                        >
                                            {loading ? (
                                                <Loader2 size={16} className="animate-spin" />
                                            ) : (
                                                <Save size={16} />
                                            )}
                                            Save
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className='space-y-4'>
                                {/* Name */}
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                                        First Name
                                    </label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleInputChange}
                                        disabled={!isEditing}
                                        className='w-full disabled:px-0  px-4 py-2 border border-gray-300 rounded-lg disabled:border-0 disabled:rounded-none  disabled:border-b disabled:text-gray-500'
                                        required
                                    />
                                </div>

                                {/* Surname */}
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                                        Last Name
                                    </label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleInputChange}
                                        disabled={!isEditing}
                                        className='w-full disabled:px-0  px-4 py-2 border border-gray-300 rounded-lg disabled:border-0 disabled:rounded-none  disabled:border-b disabled:text-gray-500'
                                        required
                                    />
                                </div>

                                {/* Email */}
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        disabled={!isEditing}
                                        className='w-full disabled:px-0  px-4 py-2 border border-gray-300 rounded-lg disabled:border-0 disabled:rounded-none  disabled:border-b disabled:text-gray-500'
                                        required
                                    />
                                </div>

                                {/* Phone */}
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                                        Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        disabled={!isEditing}
                                        className='w-full disabled:px-0  px-4 py-2 border border-gray-300 rounded-lg disabled:border-0 disabled:rounded-none   disabled:text-gray-500'
                                        placeholder="Optional"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Account Info */}
                        <div className='mt-8 pt-8 border-t max-w-2xl mx-auto'>
                            <h3 className='text-lg font-semibold mb-4'>Account Information</h3>
                            <div className='space-y-3 text-sm'>
                                <div className='flex justify-between'>
                                    <span className='text-gray-600'>Role:</span>
                                    <span className='font-medium capitalize'>{user?.role || 'Admin'}</span>
                                </div>
                                <div className='flex justify-between'>
                                    <span className='text-gray-600'>Account Created:</span>
                                    <span className='font-medium'>
                                        {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                                    </span>
                                </div>
                                <div className='flex justify-between'>
                                    <span className='text-gray-600'>Last Updated:</span>
                                    <span className='font-medium'>
                                        {user?.updatedAt ? new Date(user.updatedAt).toLocaleDateString() : 'N/A'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Page
