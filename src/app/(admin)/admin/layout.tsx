import React from 'react'

const layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div
            className='w-full min-h-screen
            flex items-stretch justify-between p-3'

        >
            <div className='bg-primary rounded text-background w-40 lg:w-80 flex flex-col items-center justify-between'>
                <p>Admin Panel</p>
                <p>User Management</p>
                <p>Settings</p>
            </div>
            <div className='w-full'>

                {children}
            </div>
        </div>
    )
}

export default layout