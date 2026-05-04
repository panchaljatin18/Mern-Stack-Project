import EditHomeFormSection from "../../../../sections/HostEditHomePage/EditHomeFormSection";

export default function EditHomePage({ params }) {
  return <EditHomeFormSection homeId={params.id} />;
}
