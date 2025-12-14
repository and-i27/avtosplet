"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";


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

const inputClass =
  "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500";

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

  useEffect(() => {
    async function fetchOptions() {
      const res = await fetch("/api/vehicles/options");
      const data = await res.json();
      setOptions({
        brands: data.brands,
        colors: data.colors,
        fuels: data.fuels,
        gearboxes: data.gearboxes,
        models: [],
      });
    }
    fetchOptions();
  }, []);

  useEffect(() => {
    async function fetchModels() {
      if (!form.brand) return;
      const res = await fetch(`/api/vehicles/models?brand=${form.brand}`);
      const data = await res.json();
      setOptions(prev => ({ ...prev, models: data.models }));
    }
    fetchModels();
  }, [form.brand]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
  const files = e.target.files;
  if (!files) return;
  setForm(prev => ({ ...prev, images: Array.from(files) }));
}


  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!session?.user?.id) return alert("You must be logged in");

    const fd = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (key === "images") return;
      fd.append(key, value as string);
    });
    fd.append("userId", session.user.id);
    form.images.forEach(img => fd.append("images", img));

    const res = await fetch("/api/vehicles", { method: "POST", body: fd });
    if (!res.ok) return alert("Error adding vehicle");

    router.push("/");
  }

  function removeImage(index: number) {
  setForm(prev => ({
    ...prev,
    images: prev.images.filter((_, i) => i !== index),
  }));
}


  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="mx-auto max-w-3xl rounded-2xl bg-white p-8 shadow">
        <h1 className="mb-6 text-2xl font-bold">Add Vehicle</h1>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* SELECTS */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <select name="brand" value={form.brand} onChange={handleChange} className={inputClass}>
              <option value="">Brand</option>
              {options.brands.map(b => (
                <option key={b._id} value={b._id}>{b.name}</option>
              ))}
            </select>

            <select
              name="model"
              value={form.model}
              onChange={handleChange}
              disabled={!form.brand}
              className={inputClass}
            >
              <option value="">Model</option>
              {options.models.map(m => (
                <option key={m._id} value={m._id}>{m.name}</option>
              ))}
            </select>

            <select name="fuel" value={form.fuel} onChange={handleChange} className={inputClass}>
              <option value="">Fuel</option>
              {options.fuels.map(f => (
                <option key={f._id} value={f._id}>{f.name}</option>
              ))}
            </select>

            <select name="gearbox" value={form.gearbox} onChange={handleChange} className={inputClass}>
              <option value="">Gearbox</option>
              {options.gearboxes.map(g => (
                <option key={g._id} value={g._id}>{g.name}</option>
              ))}
            </select>

            <select name="color" value={form.color} onChange={handleChange} className={inputClass}>
              <option value="">Color</option>
              {options.colors.map(c => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* NUMBERS */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <input type="number" name="price" placeholder="Price (€)" onChange={handleChange} className={inputClass} />
            <input type="number" name="year" placeholder="Year" onChange={handleChange} className={inputClass} />
            <input type="number" name="kilometers" placeholder="Kilometers" onChange={handleChange} className={inputClass} />
            <input type="number" name="engineSize" placeholder="Engine size (ccm)" onChange={handleChange} className={inputClass} />
            <input type="number" name="powerKW" placeholder="Power (kW)" onChange={handleChange} className={inputClass} />

            <select name="doors" value={form.doors} onChange={handleChange} className={inputClass}>
              <option value="">Doors</option>
              <option value="2">2 / 3</option>
              <option value="4">4 / 5</option>
              <option value="6">6 / 7</option>
            </select>

            <select name="seats" value={form.seats} onChange={handleChange} className={inputClass}>
              <option value="">Seats</option>
              <option value="2">2</option>
              <option value="5">5</option>
              <option value="7">7</option>
            </select>
          </div>

          {/* DESCRIPTION */}
          <textarea
            name="description"
            placeholder="Vehicle description"
            rows={4}
            onChange={handleChange}
            className={inputClass}
          />

          {/* IMAGES */}
          <div className="space-y-2">
  <label className="block text-sm font-medium">Images</label>

  {/* skriti input */}
  <input
    id="images"
    type="file"
    multiple
    accept="image/*"
    onChange={handleFileChange}
    className="hidden"
  />

  {/* fake button */}
  <label
    htmlFor="images"
    className="
      inline-flex items-center justify-center
      cursor-pointer
      border border-dashed border-gray-400
      rounded-lg
      px-4 py-3
      text-sm font-medium
      text-gray-700
      hover:border-blue-500
      hover:text-blue-600
      transition
    "
  >
    📁 Izberi slike
  </label>


  {form.images.length > 0 && (
    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-3">
      {form.images.map((file, index) => (
        <div
          key={index}
          className="relative group rounded-lg overflow-hidden border"
        >

<Image src={URL.createObjectURL(file)} alt={`Preview ${index}`} width={96} height={96} className="h-24 w-full object-cover" />
          <button
            type="button"
            onClick={() => removeImage(index)}
            className="absolute top-1 right-1 bg-black/70 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  )}
</div>


          {/* SUBMIT */}
          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 py-3 text-white font-semibold hover:bg-blue-700 transition"
          >
            Add Vehicle
          </button>
        </form>
      </div>
    </div>
  );
}
