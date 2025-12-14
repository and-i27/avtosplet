"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

type Option = { _id: string; name: string };
type ExistingImage = { _key: string; _ref: string; url: string };

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
  existingImages: ExistingImage[];
};

const inputClass =
  "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500";

export default function EditVehiclePage() {
  const router = useRouter();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<VehicleFormState>({
    brand: "", model: "", fuel: "", gearbox: "", color: "",
    price: "", year: "", kilometers: "", engineSize: "", powerKW: "",
    doors: "", seats: "", description: "", images: [], existingImages: []
  });

  const [options, setOptions] = useState<{
    brands: Option[]; models: Option[]; colors: Option[]; fuels: Option[]; gearboxes: Option[];
  }>({ brands: [], models: [], colors: [], fuels: [], gearboxes: [] });

  // ---------- LOAD OPTIONS ----------
  useEffect(() => {
    async function loadOptions() {
      const res = await fetch("/api/vehicles/options");
      const data = await res.json();
      setOptions({
        brands: data.brands ?? [], models: [], colors: data.colors ?? [], fuels: data.fuels ?? [], gearboxes: data.gearboxes ?? []
      });
    }
    loadOptions();
  }, []);

  // ---------- LOAD VEHICLE ----------
  useEffect(() => {
    async function loadVehicle() {
      if (!id) return;
      const res = await fetch(`/api/vehicles/${id}`);
      if (!res.ok) return;
      const v = await res.json();

      setForm({
        brand: v.brand?._id ?? "",
        model: v.model?._id ?? "",
        fuel: v.fuel?._id ?? "",
        gearbox: v.gearbox?._id ?? "",
        color: v.color?._id ?? "",

        price: String(v.price ?? ""),
        year: String(v.year ?? ""),
        kilometers: String(v.kilometers ?? ""),
        engineSize: String(v.engineSize ?? ""),
        powerKW: String(v.powerKW ?? ""),

        doors: String(v.doors ?? ""),
        seats: String(v.seats ?? ""),

        description: v.description ?? "",
        images: [],
        existingImages: v.images ?? []
      });

      setLoading(false);
    }
    loadVehicle();
  }, [id]);

  // ---------- LOAD MODELS ----------
  useEffect(() => {
    async function loadModels() {
      if (!form.brand) {
        setOptions(prev => ({ ...prev, models: [] }));
        return;
      }
      const res = await fetch(`/api/vehicles/models?brand=${form.brand}`);
      const data = await res.json();
      setOptions(prev => ({ ...prev, models: data.models ?? [] }));
    }
    loadModels();
  }, [form.brand]);

  // ---------- HANDLERS ----------
  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return;
    setForm(prev => ({ ...prev, images: Array.from(e.target.files) }));
  }

  function removeImage(index: number) {
    setForm(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  }

  function removeExistingImage(key: string) {
    setForm(prev => ({
      ...prev,
      existingImages: prev.existingImages.filter(img => img._key !== key),
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const fd = new FormData();

    ["brand","model","fuel","gearbox","color","price","year","kilometers","engineSize","powerKW","doors","seats","description"]
      .forEach(f => fd.append(f, (form as any)[f]));

    fd.append("existingImages", JSON.stringify(form.existingImages.map(img => ({ _key: img._key, _ref: img._ref }))));
    form.images.forEach(img => fd.append("images", img));

    const res = await fetch(`/api/vehicles/${id}`, { method: "PUT", body: fd });
    if (res.ok) router.push("/vehicle/my-vehicles");
    else alert("Error updating vehicle");
  }

  if (loading) return <p className="text-center mt-10">Loading…</p>;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="mx-auto max-w-3xl rounded-2xl bg-white p-8 shadow">
        <h1 className="mb-6 text-2xl font-bold">Edit Vehicle</h1>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* SELECTS */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <select name="brand" value={form.brand} onChange={handleChange} className={inputClass}>
              <option value="">Brand</option>
              {options.brands.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
            </select>

            <select name="model" value={form.model} onChange={handleChange} disabled={!form.brand} className={inputClass}>
              <option value="">Model</option>
              {options.models.map(m => <option key={m._id} value={m._id}>{m.name}</option>)}
            </select>

            <select name="fuel" value={form.fuel} onChange={handleChange} className={inputClass}>
              <option value="">Fuel</option>
              {options.fuels.map(f => <option key={f._id} value={f._id}>{f.name}</option>)}
            </select>

            <select name="gearbox" value={form.gearbox} onChange={handleChange} className={inputClass}>
              <option value="">Gearbox</option>
              {options.gearboxes.map(g => <option key={g._id} value={g._id}>{g.name}</option>)}
            </select>

            <select name="color" value={form.color} onChange={handleChange} className={inputClass}>
              <option value="">Color</option>
              {options.colors.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
          </div>

          {/* NUMBERS */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <input type="number" name="price" value={form.price} placeholder="Price (€)" onChange={handleChange} className={inputClass} />
            <input type="number" name="year" value={form.year} placeholder="Year" onChange={handleChange} className={inputClass} />
            <input type="number" name="kilometers" value={form.kilometers} placeholder="Kilometers" onChange={handleChange} className={inputClass} />
            <input type="number" name="engineSize" value={form.engineSize} placeholder="Engine size (ccm)" onChange={handleChange} className={inputClass} />
            <input type="number" name="powerKW" value={form.powerKW} placeholder="Power (kW)" onChange={handleChange} className={inputClass} />

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
          <textarea name="description" value={form.description} onChange={handleChange} placeholder="Vehicle description" rows={4} className={inputClass} />

          {/* EXISTING IMAGES */}
          {form.existingImages.length > 0 && (
            <div className="space-y-2">
              <p className="block text-sm font-medium">Existing Images</p>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-2">
                {form.existingImages.map(img => (
                  <div key={img._key} className="relative group rounded-lg overflow-hidden border">
                    <img src={img.url} alt="Existing" className="h-24 w-full object-cover" />
                    <button type="button" onClick={() => removeExistingImage(img._key)} className="absolute top-1 right-1 bg-black/70 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">✕</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* NEW IMAGES */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">Add new images</label>
            <input id="images" type="file" multiple accept="image/*" onChange={handleFileChange} className="hidden" />
            <label htmlFor="images" className="inline-flex items-center justify-center cursor-pointer border border-dashed border-gray-400 rounded-lg px-4 py-3 text-sm font-medium text-gray-700 hover:border-blue-500 hover:text-blue-600 transition">📁 Izberi slike</label>

            {form.images.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-3">
                {form.images.map((file, index) => (
                  <div key={index} className="relative group rounded-lg overflow-hidden border">
                    <img src={URL.createObjectURL(file)} alt={`Preview ${index}`} className="h-24 w-full object-cover" />
                    <button type="button" onClick={() => removeImage(index)} className="absolute top-1 right-1 bg-black/70 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">✕</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SUBMIT */}
          <button type="submit" className="w-full rounded-lg bg-blue-600 py-3 text-white font-semibold hover:bg-blue-700 transition">
            Save changes
          </button>

        </form>
      </div>
    </div>
  );
}
