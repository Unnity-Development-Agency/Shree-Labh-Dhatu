import CopperProductsPage from "@/components/CopperProductsPage";
import aluminiumProducts from "@/data/aluminiumProducts";
import Header from "@/components/ui/Header";

export const metadata = {
  title: "Aluminium Products | Shree Labh Dhatu",
  description: "Explore aluminium sheet and coil products for fabrication and industry.",
};

export default function AluminiumPage() {
  return (
    <>
      <Header />
      <div className="pt-20">
        <CopperProductsPage
          products={aluminiumProducts}
          materialName="Aluminium"
        />
      </div>
    </>
  );
}
