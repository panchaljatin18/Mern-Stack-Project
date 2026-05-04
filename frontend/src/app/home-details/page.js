import HomeDetailsSection from "../../sections/HomeDetailsPage/HomeDetailsSection";

export default function HomeDetailsPage({ params }) {
  return <HomeDetailsSection homeId={params.id} />;
}
