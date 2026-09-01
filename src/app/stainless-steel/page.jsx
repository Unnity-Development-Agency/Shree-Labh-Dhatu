import CopperProductsPage from "@/components/CopperProductsPage";
import stainlessSteelProducts from "@/data/stainlessSteelProducts";
import Header from "@/components/ui/Header";

export const metadata = {
  title: "Stainless Steel Products | Shree Labh Dhatu",
  description: "Explore stainless steel sheet and coil products for durable fabrication.",
};

export default function StainlessSteelPage() {
  return (
    <>
      <Header />
      <div className="pt-20">
        <CopperProductsPage
          products={stainlessSteelProducts}
          materialName="Stainless Steel"
        />
      </div>
    </>
  );
}
