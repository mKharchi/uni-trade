"use client";
import Image from 'next/image';
import React from 'react'
import Input from '../components/Input';
import { useAuth } from '../AuthContext';

const page = () => {

    const [formData, setFormData] = React.useState({
        email: '',
        password: '',
    });
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    }
    const { login, loading } = useAuth();
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        login(formData.email, formData.password);
    }
    return (
        <div
            className='w-full min-h-[80vh] flex justify-center items-start gap-4'
        >
            <div
                className='w-full gap-4 md:gap-8 flex lg:flex-row flex-col items-stretch justify-center'
            >
                <div className='w-full lg:w-1/2 flex flex-col items-start justify-center gap-4 '>
                    <Image width={1024} height={1024} className=' object-center object-cover max-h-130 lg:max-h-200  w-full h-auto ' src={"/auth-img.png"} alt='auth-image' />
                </div>
                <div className='w-full  lg:w-1/2 flex flex-col items-center justify-center gap-5  2xl:px-16'>
                    <h1 className='text-xl md:text-5xl w-full  '>Login to Unitrade</h1>
                    <p className=' w-full text-lg text-gray-600'>Enter your details below</p>
                    <form onSubmit={handleSubmit} className='w-full my-6 flex flex-col items-center justify-center gap-8'>
                        <div className='w-full flex items-center justify-center '>
                            <Input name='email' label='Email' value={formData.email} onChange={handleChange} />
                        </div>
                        <div className='w-full  flex items-center justify-center gap-2'>
                            <Input name='password' label='Password' value={formData.password} onChange={handleChange} />
                        </div>
                        <div className="flex w-full  justify-between items-center">

                            <div className="flex items-center justify-start w-1/2">
                                <button disabled={loading} type='submit' className=' px-10  py-3 bg-primary text-white rounded hover:bg-primary/80 transition-colors duration-200'>{loading ? 'Logging in...' : 'Login'}</button>

                            </div>
                            <div className="flex items-center justify-end w-1/2">
                                <a href="#" className="text-sm  text-right text-gray-500 hover:underline">Forgot Password?</a>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default page;