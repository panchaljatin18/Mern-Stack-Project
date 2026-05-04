"use client";

import { useState } from "react";
import HomeForm from "../../components/HomeForm";
import PageHero from "../../components/PageHero";
import Toast from "../../components/Toast";
import { api } from "../../lib/api";

const emptyForm = { houseName: "", price: "", location: "", rating: "", photoUrl: "" };

export default function AddHomeFormSection() {
  const [form, setForm] = useState(emptyForm);
  const [toast, setToast] = useState("");
  const [error, setError] = useState("");

  const handleChange = (event) => setForm({ ...form, [event.target.name]: event.target.value });

  const submit = async () => {
    if (Object.values(form).some((value) => !value.trim())) {
      setError("Please fill all fields!");
      setTimeout(() => setError(""), 3000);
      return;
    }

    try {
      const data = await api.addHome(form);
      if (data.success) {
        setForm(emptyForm);
        setToast("Added Your Home!");
        setTimeout(() => setToast(""), 3000);
      }
    } catch (err) {
      setError(err.message || "Failed to add home.");
      setTimeout(() => setError(""), 3000);
    }
  };

  return (
    <>
      <Toast message={error} tone="danger" />
      <Toast message={toast} />
      <PageHero title="List Your Home" subtitle="Register your property on airbnb" />
      <main className="mx-auto max-w-lg px-6 py-10">
        <div className="rounded-2xl bg-white p-8 shadow-xl">
          <HomeForm form={form} onChange={handleChange} onSubmit={submit} submitLabel="Add Home" />
        </div>
      </main>
    </>
  );
}
