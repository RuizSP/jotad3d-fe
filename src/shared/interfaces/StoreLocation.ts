export interface StoreLocation {
  id: string;
  name: string;
  addressLine: string;
  number: string;
  complement?: string | null;
  neighborhood: string;
  city: string;
  state: string;
  postalCode: string;
  instructions?: string | null;
  whatsapp: string | null;
}
