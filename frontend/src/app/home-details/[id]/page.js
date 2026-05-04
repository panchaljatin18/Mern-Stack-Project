"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import BookingPopup from "../../../components/BookingPopup";
import SuccessBar from "../../../components/SuccessBar";

export default function HomeDetailPage() {
  const { id } = useParams();
  const [home, setHome] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    fetch(`/api/homes/${id}`).then((response) => response.json()).then(setHome);
  }, [id]);

  if (!home) return <p className="mt-10 text-center">Loading...</p>;

  return (
    <>
      <SuccessBar message={successMsg} />
      <div className="mt-6 flex h-20 justify-center shadow-2xl">
        <h1 className="mx-auto w-fit text-4xl font-bold text-indigo-900">
          You are in Home Detail Page
        </h1>
      </div>
      <main className="container mx-auto my-12 max-w-md rounded-lg bg-green-500 p-8 shadow-lg">
        <img
          src={home.photoUrl}
          alt={home.houseName}
          className="mb-7 w-full rounded-lg object-cover"
          onError={(event) => {
            event.currentTarget.src = "https://placehold.co/400x200?text=No+Image";
          }}
        />
        <h2 className="mb-2 text-2xl font-bold text-gray-800">{home.houseName}</h2>
        <p className="mb-1 text-gray-500">{home.location}</p>
        <p className="mb-1 text-xl font-bold text-red-500">Rs {home.price} / night</p>
        <p className="mb-6 font-semibold text-yellow-500">{home.rating}</p>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={() => window.history.back()}
            className="inline-block cursor-pointer rounded-md bg-gray-500 px-4 py-2 text-white transition duration-300 hover:bg-gray-600"
          >
            Back
          </button>
          <button
            onClick={() => setShowPopup(true)}
            style={{
              flex: 1,
              background: "#22c55e",
              color: "white",
              padding: "8px",
              border: "none",
              borderRadius: 6,
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Book
          </button>
        </div>
      </main>
      {showPopup && (
        <BookingPopup
          home={home}
          onClose={() => setShowPopup(false)}
          onSuccess={() => {
            setSuccessMsg("Booking Confirmed Successfully!");
            setTimeout(() => setSuccessMsg(""), 3000);
          }}
        />
      )}
    </>
  );
}
