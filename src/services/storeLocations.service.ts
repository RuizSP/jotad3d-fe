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

export interface SaveStoreLocationInput {
  id?: string;
  name: string;
  addressLine: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  postalCode: string;
  instructions: string;
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

  async save(input: SaveStoreLocationInput): Promise<StoreLocation> {
    if (!supabase) {
      throw new Error("Supabase não está configurado para salvar a loja.");
    }

    const payload = {
      name: input.name.trim(),
      address_line: input.addressLine.trim(),
      address_number: input.number.trim(),
      address_complement: input.complement.trim() || null,
      neighborhood: input.neighborhood.trim(),
      city: input.city.trim(),
      state: input.state.trim().toUpperCase(),
      postal_code: input.postalCode.trim(),
      instructions: input.instructions.trim() || null,
      is_active: true,
    };

    const query = input.id
      ? supabase
          .from("store_locations")
          .update(payload)
          .eq("id", input.id)
          .select("*")
          .single()
      : supabase
          .from("store_locations")
          .insert(payload)
          .select("*")
          .single();

    const { data, error } = await query;
    if (error) throw error;
    return mapStoreLocation(data as StoreLocationRow);
  },
};
