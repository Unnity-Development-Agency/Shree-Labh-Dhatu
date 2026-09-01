import CopperProductsPage from "@/components/CopperProductsPage";
import brassProducts from "@/data/brassProducts";
import Header from "@/components/ui/Header";

export const metadata = {
  title: "Brass Products | Shree Labh Dhatu",
  description: "Explore brass sheet, coil, strip, scrap, and wire products.",
};

export default function BrassPage() {
  return (
    <>
      <Header />
      <div className="pt-20">
        <CopperProductsPage products={brassProducts} materialName="Brass" />
      </div>
    </>
  );
}
