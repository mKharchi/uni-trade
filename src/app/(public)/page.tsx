import Image from "next/image";
import Navbar from "../components/Navbar";
import Hero from "../components/home-components/Hero";
import LastArrivals from "../components/home-components/LastArrivals";
import Categories from "../components/home-components/Categories";
import BestSeller from "../components/home-components/BestSeller";
import Products from "../components/home-components/Products";
import Features from "../components/home-components/Features";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div className="w-full box-border flex flex-col items-center justify-start gap-3 px-4 md:px-6 lg:px-8 xl:px-10 2xl:px-0 ">
      <Hero />
      <LastArrivals />
      <Categories />
      <BestSeller />
      <Products />
      <Features />

    </div>


  );
}
