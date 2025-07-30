import React from "react";
import HomeBanner from "../Pagesbanner/homebanner";
import AllProducts from "../Allproduct/Allproduct";
import Offers from "../offers/offers";
import Footer from "../Footer/footer";


const Home = () => {
  return (
    <div>
      <HomeBanner />
           <AllProducts/>
           <Offers/>
           
    </div>
  );
};

export default Home;
