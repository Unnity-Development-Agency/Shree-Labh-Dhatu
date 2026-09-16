import AboutUs from "@/components/home/AboutUs";
import FeaturedProduct from "@/components/home/FeaturedProduct";
import Hero from "@/components/home/Hero";
import ProductShow from "@/components/home/ProductShow";
import Reviews from "@/components/home/Reviews";
import ServedIndustry from "@/components/home/ServedIndustry";
import WhyChooseUS from "@/components/home/WhyChooseUS";
import Footer from "@/components/ui/Footer";
import Header from "@/components/ui/Header";
import React from "react";

const Home = () => {
  return (
    <div className="home-page">
      <Header />
      <Hero />
      <WhyChooseUS />
      {/* <AboutUs /> */}
      <ProductShow />
      <FeaturedProduct />
      <ServedIndustry />
      <Reviews />
      <Footer />
    </div>
  );
};

export default Home;
