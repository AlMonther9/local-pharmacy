import Catalog from "@/components/Catalog";
import { getPharmacyConfig, getPharmacyInventory } from "@/lib/inventory-service";

// Enable Next.js Incremental Static Regeneration (ISR) with a 10-minute (600 seconds) revalidation interval
export const revalidate = 600;

export default async function HomePage() {
  const config = await getPharmacyConfig();
  const items = await getPharmacyInventory();

  return (
    <main className="min-h-screen flex flex-col bg-brand-bg">
      <Catalog initialItems={items} config={config} />
    </main>
  );
}
