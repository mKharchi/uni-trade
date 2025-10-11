import React from 'react';
import { LiaShippingFastSolid } from "react-icons/lia"
import { BsHeadset } from "react-icons/bs"
import { AiOutlineSafety } from "react-icons/ai";
const features = [
    {
        icon: <LiaShippingFastSolid className="text-4xl " />,
        title: "FREE AND FAST DELIVERY",
        description: "Free delivery for all orders over $140",
    },
    {
        icon: <BsHeadset className="text-4xl  " />,
        title: "24/7 CUSTOMER SERVICE",
        description: "Friendly 24/7 customer support",
    },
    {
        icon: <AiOutlineSafety className="text-4xl  " />,
        title: "MONEY BACK GUARANTEE",
        description: "We return money within 30 days",
    },
];

const Features = () => {
    return (
        <section className="w-full py-8 flex flex-col items-center">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl">
                {features.map((feature, idx) => (
                    <div key={idx} className="flex flex-col items-center justify-between text-center  bg-white ">

                        <div className='rounded-full mb-3 bg-primary text-white p-4'>{feature.icon}
                        </div>
                        <h3 className="font-bold text-lg mb-1">{feature.title}</h3>
                        <p className="text-gray-600">{feature.description}</p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Features;