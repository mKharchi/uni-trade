"use client";
import Image from 'next/image';
import React from 'react'
import Input from '@/app/components/Input';
import { useAuth } from '@/app/AuthContext';

import { redirect } from 'next/navigation';

const page = () => {
    const [is_login, setIsLogin] = React.useState(true);

    const [formData, setFormData] = React.useState({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        phone: '',
        university: '',
        year: 1,
        specialty: '',
    });
    const [confirmPassword, setConfirmPassword] = React.useState('');
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    }
    const { login, loading, register } = useAuth();
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log(formData);
        let success;
        if (is_login) {
            // Perform login
            success = await login(formData.email, formData.password);
        } else {
            // Perform registration
            if (formData.password !== confirmPassword) {
                alert("Passwords do not match");
                return;
            }
            // Call registration API
            success = await register(
                formData.email,
                formData.password,
                formData.firstName,
                formData.lastName,
                formData.phone,
                formData.university,
                formData.year,
                formData.specialty
            );
        }
        if (success) {
            // Redirect or perform further actions upon successful login/registration
            console.log("Success!");
            redirect('/');
        }
    }
    return (
        <div
            className='w-full min-h-[80vh] flex justify-center items-start gap-4'
        >
            <div
                className='w-full mt-6 gap-4 md:gap-8 flex lg:flex-row flex-col items-stretch justify-center'
            >
                <div className='w-full lg:w-1/2 flex flex-col items-start justify-center gap-4 '>
                    <Image width={1024} height={1024} className=' object-center object-cover max-h-130 lg:max-h-200  w-full h-auto ' src={"/auth-img.png"} alt='auth-image' />
                </div>
                <div className='w-full  lg:w-1/2 flex flex-col items-center justify-center gap-5  2xl:px-16'>
                    <h1 className='text-xl md:text-5xl w-full  '>{is_login ? "Login to Unitrade" : "Create an Account"}</h1>
                    {
                        is_login ? (
                            <p className='w-full text-gray-500'>Don't have an account? <button onClick={() => setIsLogin(false)} className='text-primary hover:underline underline-offset-8 cursor-pointer'>Register here</button></p>
                        ) : (
                            <p className='w-full text-gray-500'>Already have an account? <button onClick={() => setIsLogin(true)} className='text-primary hover:underline underline-offset-8 cursor-pointer'>Login here</button></p>
                        )
                    }

                    <form onSubmit={handleSubmit} className='w-full my-6 flex flex-col items-center justify-center gap-8'>

                        {
                            !is_login && (
                                <>
                                    <div className='w-full flex items-center justify-center gap-4'>
                                        <Input name='firstName' label='First Name' value={formData.firstName} onChange={handleChange} />
                                        <Input name='lastName' label='Last Name' value={formData.lastName} onChange={handleChange} />
                                    </div>
                                    <div className='w-full flex items-center justify-center gap-4'>
                                        <Input name='phone' label='Phone' value={formData.phone} onChange={handleChange} />
                                        <Input name='university' label='University' value={formData.university} onChange={handleChange} />
                                    </div>
                                    <div className='w-full flex items-center justify-center gap-4'>
                                        <Input type='number' name='year' label='Year' value={formData.year} onChange={handleChange} />
                                        <Input name='specialty' label='Specialty' value={formData.specialty} onChange={handleChange} />
                                    </div>
                                </>
                            )
                        }

                        <div className='w-full flex items-center justify-center '>
                            <Input name='email' label='Email' value={formData.email} onChange={handleChange} />
                        </div>
                        <div className='w-full  flex items-center justify-center gap-2'>
                            <Input name='password' label='Password' value={formData.password} onChange={handleChange} />
                        </div>
                        {!is_login && (

                            <div className='w-full  flex items-center justify-center gap-2'>
                                <Input name='password_confirm' label='Password Confirm' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                            </div>
                        )}

                        <div className="flex w-full  justify-between items-center">

                            <div className="flex items-center justify-start w-1/2">
                                <button disabled={loading} type='submit' className=' px-10  py-3 bg-primary text-white rounded hover:bg-primary/80 transition-colors duration-200'>{
                                    is_login ?
                                        loading ? 'Logging in...' : 'Login'
                                        :
                                        loading ? 'Registering...' : 'Register'
                                }</button>

                            </div>
                           {is_login && <div className="flex items-center justify-end w-1/2">
                                <a href="#" className="text-sm  text-right text-gray-500 hover:underline">Forgot Password?</a>
                            </div>}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default page;