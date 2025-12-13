"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

type Option = { _id: string; name: string };

type VehicleFormState = {
  brand: string;
  model: string;
  fuel: string;
  gearbox: string;
  color: string;

  price: string;
  year: string;
  kilometers: string;
  engineSize: string;
  powerKW: string;

  doors: string;
  seats: string;

  description: string;
  images: File[];
};

export default function AddVehiclePage() {
  const router = useRouter();
  const { data: session } = useSession();

  const [form, setForm] = useState<VehicleFormState>({
    brand: "",
    model: "",
    fuel: "",
    gearbox: "",
    color: "",

    price: "",
    year: "",
    kilometers: "",
    engineSize: "",
    powerKW: "",

    doors: "",
    seats: "",

    description: "",
    images: [],
  });

  const [options, setOptions] = useState<{
    brands: Option[];
    models: Option[];
    colors: Option[];
    fuels: Option[];
    gearboxes: Option[];
  }>({
    brands: [],
    models: [],
    colors: [],
    fuels: [],
    gearboxes: [],
  });

  /* ---------------- FETCH OPTIONS ---------------- */

  useEffect(() => {
    async function fetchOptions() {
      const res = await fetch("/api/vehicles/options");
      const data = await res.json();

      setOptions(prev => ({
        ...prev,
        brands: data.brands,
        colors: data.colors,
        fuels: data.fuels,
        gearboxes: data.gearboxes,
      }));
    }
    fetchOptions();
  }, []);

  useEffect(() => {
    async function fetchModels() {
      if (!form.brand) {
        setOptions(prev => ({ ...prev, models: [] }));
        return;
      }

      const res = await fetch(`/api/vehicles/models?brand=${form.brand}`);
      const data = await res.json();
      setOptions(prev => ({ ...prev, models: data.models }));
    }
    fetchModels();
  }, [form.brand]);

  /* ---------------- HANDLERS ---------------- */

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return;
    setForm(prev => ({ ...prev, images: Array.from(e.target.files!) }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!session?.user?.id) {
      alert("You must be logged in");
      return;
    }

    // ✅ FormData (NUJNO zaradi slik)
    const fd = new FormData();

    fd.append("brand", form.brand);
    fd.append("model", form.model);
    fd.append("fuel", form.fuel);
    fd.append("gearbox", form.gearbox);
    if (form.color) fd.append("color", form.color);

    fd.append("price", form.price);
    fd.append("year", form.year);
    fd.append("kilometers", form.kilometers);
    fd.append("engineSize", form.engineSize);
    fd.append("powerKW", form.powerKW);

    fd.append("doors", form.doors);
    fd.append("seats", form.seats);

    fd.append("description", form.description);
    fd.append("userId", session.user.id);

    form.images.forEach(img => fd.append("images", img));

    try {
      const res = await fetch("/api/vehicles", {
        method: "POST",
        body: fd, // ⚠️ brez Content-Type
      });

      if (!res.ok) throw new Error("Failed");

      alert("Vehicle added!");
      router.push("/");
    } catch (err) {
      console.error(err);
      alert("Error adding vehicle");
    }
  }

  /* ---------------- UI ---------------- */

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Add Vehicle</h1>

      <form onSubmit={handleSubmit} className="space-y-4">

        <select name="brand" value={form.brand} onChange={handleChange}>
          <option value="">Brand</option>
          {options.brands.map(b => (
            <option key={b._id} value={b._id}>{b.name}</option>
          ))}
        </select>

        <select name="model" value={form.model} onChange={handleChange} disabled={!form.brand}>
          <option value="">Model</option>
          {options.models.map(m => (
            <option key={m._id} value={m._id}>{m.name}</option>
          ))}
        </select>

        <select name="fuel" value={form.fuel} onChange={handleChange}>
          <option value="">Fuel</option>
          {options.fuels.map(f => (
            <option key={f._id} value={f._id}>{f.name}</option>
          ))}
        </select>

        <select name="gearbox" value={form.gearbox} onChange={handleChange}>
          <option value="">Gearbox</option>
          {options.gearboxes.map(g => (
            <option key={g._id} value={g._id}>{g.name}</option>
          ))}
        </select>

        <select name="color" value={form.color} onChange={handleChange}>
          <option value="">Color</option>
          {options.colors.map(c => (
            <option key={c._id} value={c._id}>{c.name}</option>
          ))}
        </select>

        <input type="number" name="price" placeholder="Price" onChange={handleChange} />
        <input type="number" name="year" placeholder="Year" onChange={handleChange} />
        <input type="number" name="kilometers" placeholder="Kilometers" onChange={handleChange} />
        <input type="number" name="engineSize" placeholder="Engine size" onChange={handleChange} />
        <input type="number" name="powerKW" placeholder="Power (kW)" onChange={handleChange} />

        {/* custom dropdowns */}
        <select name="doors" value={form.doors} onChange={handleChange}>
          <option value="">Doors</option>
          <option value="2">2 / 3</option>
          <option value="4">4 / 5</option>
          <option value="6">6 / 7</option>
        </select>

        <select name="seats" value={form.seats} onChange={handleChange}>
          <option value="">Seats</option>
          <option value="2">2</option>
          <option value="5">5</option>
          <option value="7">7</option>
        </select>

        <textarea name="description" placeholder="Description" onChange={handleChange} />

        <input type="file" multiple accept="image/*" onChange={handleFileChange} />

        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Add Vehicle
        </button>
      </form>
    </div>
  );
}
