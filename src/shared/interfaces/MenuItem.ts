export interface MenuItem {
  id: string;
  label: string;
  icon: React.ElementType;
  path?: string;
  items?: MenuItem[];
}
