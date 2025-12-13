import VehicleFilter from "@/app/components/VehicleFilter";

export default function Home() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-semibold mb-6">Najdi svoje vozilo</h1>
      <VehicleFilter />
    </div>
  );
}
