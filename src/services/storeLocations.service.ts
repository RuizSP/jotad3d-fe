import { supabase } from "./supabase";
import type { StoreLocation } from "../shared/interfaces/StoreLocation";

export interface StoreLocationRow {
  id: string;
  name: string;
  address_line: string;
  address_number: string;
  address_complement: string | null;
  neighborhood: string;
  city: string;
  state: string;
  postal_code: string;
  instructions: string | null;
}

export function mapStoreLocation(row: StoreLocationRow): StoreLocation {
  return {
    id: row.id,
    name: row.name,
    addressLine: row.address_line,
    number: row.address_number,
    complement: row.address_complement,
    neighborhood: row.neighborhood,
    city: row.city,
    state: row.state,
    postalCode: row.postal_code,
    instructions: row.instructions,
  };
}

export const storeLocationsService = {
  async getActive(): Promise<StoreLocation | null> {
    if (!supabase) {
      throw new Error("Supabase não está configurado para carregar a loja.");
    }

    const { data, error } = await supabase
      .from("store_locations")
      .select("*")
      .eq("is_active", true)
      .maybeSingle();

    if (error) throw error;
    return data ? mapStoreLocation(data as StoreLocationRow) : null;
  },
};
