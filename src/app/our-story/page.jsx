import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";
import StoryHero from "@/components/story/StoryHero";

export const metadata = {
  title: "Our Story",
  description: "Since 1994: the people, principles and metal expertise behind Shree Labh Dhatu Traders.",
};

export default function OurStoryPage() {
  return <><Header /><main><StoryHero /></main><Footer /></>;
}
