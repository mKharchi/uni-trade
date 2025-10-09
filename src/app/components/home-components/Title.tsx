import React from 'react'

type Props = {
    title: string
}

const Title = (props: Props) => {
    return (
        <div className='w-full flex items-center justify-start my-4'>
            <div className='flex border border-primary rounded-l overflow-hidden items-stretch'>
                <div className='bg-primary w-6 flex-shrink-0' />
                <h1 className='text-lg text-primary px-2 py-1.5 bg-secondary '>
                    {props.title}
                </h1>
            </div>
        </div>
    )
}

export default Title