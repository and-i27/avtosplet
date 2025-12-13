"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { writeClient } from "@/sanity/lib/write-client";

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
  existingImages?: { asset: { url: string } }[];
};

export default function EditVehiclePage({ currentUserId }: { currentUserId: string }) {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

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
    existingImages: [],
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

  const [loading, setLoading] = useState(true);

  // Fetch options
  useEffect(() => {
    async function fetchOptions() {
      const [brands, colors, fuels, gearboxes] = await Promise.all([
        writeClient.fetch('*[_type == "brand"]{_id, name}'),
        writeClient.fetch('*[_type == "color"]{_id, name}'),
        writeClient.fetch('*[_type == "fuel"]{_id, name}'),
        writeClient.fetch('*[_type == "gearbox"]{_id, name}'),
      ]);
      setOptions(prev => ({ ...prev, brands, colors, fuels, gearboxes }));
    }
    fetchOptions();
  }, []);

  // Fetch existing vehicle data
  useEffect(() => {
    async function fetchVehicle() {
      if (!id) return;
      const vehicle = await writeClient.fetch(
        `*[_type=="vehicle" && _id==$id && user._ref==$userId][0]{
          brand->_id,
          model->_id,
          fuel->_id,
          gearbox->_id,
          color->_id,
          price,
          year,
          kilometers,
          engineSize,
          powerKW,
          doors,
          seats,
          description,
          images[]{asset->{url}}
        }`,
        { id, userId: currentUserId }
      );
      if (!vehicle) return router.push("/vehicle/my-vehicles");

      setForm({
        brand: vehicle.brand,
        model: vehicle.model,
        fuel: vehicle.fuel,
        gearbox: vehicle.gearbox,
        color: vehicle.color || "",
        price: vehicle.price?.toString() || "",
        year: vehicle.year?.toString() || "",
        kilometers: vehicle.kilometers?.toString() || "",
        engineSize: vehicle.engineSize?.toString() || "",
        powerKW: vehicle.powerKW?.toString() || "",
        doors: vehicle.doors?.toString() || "",
        seats: vehicle.seats?.toString() || "",
        description: vehicle.description || "",
        images: [],
        existingImages: vehicle.images || [],
      });
      setLoading(false);
    }
    fetchVehicle();
  }, [id, currentUserId, router]);

  // Fetch models when brand changes
  useEffect(() => {
    async function fetchModels() {
      if (!form.brand) return setOptions(prev => ({ ...prev, models: [] }));
      const models = await writeClient.fetch('*[_type=="model" && brand._ref == $brand]{_id, name}', {
        brand: form.brand,
      });
      setOptions(prev => ({ ...prev, models }));
    }
    fetchModels();
  }, [form.brand]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      setForm(prev => ({ ...prev, images: Array.from(e.target.files) }));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    // Upload new images
    const uploadedImages = [];
    for (const file of form.images) {
      const asset = await writeClient.assets.upload("image", file, { filename: file.name });
      uploadedImages.push({ _type: "image", asset: { _type: "reference", _ref: asset._id } });
    }

    const allImages = [...(form.existingImages || []), ...uploadedImages];

    // Update vehicle
    await writeClient.patch(id!).set({
      brand: { _type: "reference", _ref: form.brand },
      model: { _type: "reference", _ref: form.model },
      fuel: { _type: "reference", _ref: form.fuel },
      gearbox: { _type: "reference", _ref: form.gearbox },
      color: form.color ? { _type: "reference", _ref: form.color } : undefined,
      price: Number(form.price),
      year: Number(form.year),
      kilometers: Number(form.kilometers),
      engineSize: Number(form.engineSize),
      powerKW: Number(form.powerKW),
      doors: Number(form.doors),
      seats: Number(form.seats),
      description: form.description,
      images: allImages,
    }).commit();

    setLoading(false);
    router.push("/vehicle/my-vehicles");
  }

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Edit Vehicle</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <select name="brand" value={form.brand} onChange={handleChange} className="input">
          <option value="">Select Brand</option>
          {options.brands.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
        </select>

        <select name="model" value={form.model} onChange={handleChange} disabled={!form.brand} className="input">
          <option value="">Select Model</option>
          {options.models.map(m => <option key={m._id} value={m._id}>{m.name}</option>)}
        </select>

        <select name="fuel" value={form.fuel} onChange={handleChange} className="input">
          <option value="">Select Fuel</option>
          {options.fuels.map(f => <option key={f._id} value={f._id}>{f.name}</option>)}
        </select>

        <select name="gearbox" value={form.gearbox} onChange={handleChange} className="input">
          <option value="">Select Gearbox</option>
          {options.gearboxes.map(g => <option key={g._id} value={g._id}>{g.name}</option>)}
        </select>

        <select name="color" value={form.color} onChange={handleChange} className="input">
          <option value="">Select Color</option>
          {options.colors.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
        </select>

        <input type="number" name="price" placeholder="Price (€)" value={form.price} onChange={handleChange} className="input" />
        <input type="number" name="year" placeholder="Year" value={form.year} onChange={handleChange} className="input" />
        <input type="number" name="kilometers" placeholder="Kilometers" value={form.kilometers} onChange={handleChange} className="input" />
        <input type="number" name="engineSize" placeholder="Engine size (ccm)" value={form.engineSize} onChange={handleChange} className="input" />
        <input type="number" name="powerKW" placeholder="Power (kW)" value={form.powerKW} onChange={handleChange} className="input" />
        <input type="number" name="doors" placeholder="Doors" value={form.doors} onChange={handleChange} className="input" />
        <input type="number" name="seats" placeholder="Seats" value={form.seats} onChange={handleChange} className="input" />

        <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} className="input" />

        <div>
          <p className="mb-2">Existing Images:</p>
          <div className="flex gap-2 flex-wrap mb-2">
            {form.existingImages?.map((img, idx) => (
              <img key={idx} src={img.asset.url} alt={`Existing ${idx}`} className="w-24 h-24 object-cover rounded" />
            ))}
          </div>
          <input type="file" multiple onChange={handleFileChange} className="input" />
        </div>

        <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700">
          Save Changes
        </button>
      </form>
    </div>
  );
}
