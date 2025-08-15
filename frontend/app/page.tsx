import BestProducts from "./components/ProductHiglights";
import Hero from "./components/Hero";
import WhyWe from "./components/WhyWe";
import VideoBanner from "./components/VideoBanner";

export default function Home() {
  return (
    <div>
      <Hero />
      <BestProducts
        title="Best Products"
        limit={4}
        url="/products/get/featured"
      />
      <VideoBanner />
      {/* <WhyWe /> */}
      <BestProducts title="Shop Us" limit={12} url="/products" />
    </div>
  );
}
