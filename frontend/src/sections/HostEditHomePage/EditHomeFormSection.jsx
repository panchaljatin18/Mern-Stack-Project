"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import HomeForm from "../../components/HomeForm";
import PageHero from "../../components/PageHero";
import Toast from "../../components/Toast";
import { api } from "../../lib/api";

const emptyForm = { houseName: "", price: "", location: "", rating: "", photoUrl: "" };

export default function EditHomeFormSection({ homeId }) {
  const router = useRouter();
  const [form, setForm] = useState(emptyForm);
  const [toast, setToast] = useState("");

  useEffect(() => {
    api.getHome(homeId)
      .then((home) => {
        if (home) {
          setForm({
            houseName: home.houseName || "",
            price: home.price || "",
            location: home.location || "",
            rating: home.rating || "",
            photoUrl: home.photoUrl || "",
          });
        }
      })
      .catch(() => {});
  }, [homeId]);

  const handleChange = (event) => setForm({ ...form, [event.target.name]: event.target.value });

  const submit = async () => {
    try {
      await api.updateHome(homeId, form);
      setToast("Updated Your Home!");
      setTimeout(() => router.push("/host/homes"), 2000);
    } catch { /* silently fail */ }
  };

  return (
    <>
      <Toast message={toast} />
      <PageHero title="Edit Home" subtitle="Update your property details" />
      <main className="mx-auto max-w-lg px-6 py-10">
        <div className="rounded-2xl bg-white p-8 shadow-xl">
          <HomeForm
            form={form}
            onChange={handleChange}
            onSubmit={submit}
            submitLabel="Update Home"
            showPlaceholders={false}
          />
        </div>
      </main>
    </>
  );
}
