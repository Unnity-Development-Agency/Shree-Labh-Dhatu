import CopperProductsPage from "@/components/CopperProductsPage";
import Header from "@/components/ui/Header";

export const metadata = {
  title: "Copper Products | Shree Labh Dhatu",
  description:
    "Explore Shree Labh Dhatu's copper sheet, coil, strip, nano strip, scrap, and wire products.",
};

export default function CopperPage() {
  return (
    <>
      <Header />
      <div className="pt-20">
        <CopperProductsPage />
      </div>
    </>
  );
}
