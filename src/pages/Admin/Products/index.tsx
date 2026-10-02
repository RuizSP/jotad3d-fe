import ProductsTable from "../../../components/application/Products/ProductsTable";
import { Filter } from "../../../components/ui/Filter";
import { Page } from "../../../components/ui/Page";

export default function AdminProducts() {
  return (
    <Page.Root>
      <Page.Content>
        <Filter.Provider initialFormValues={{}}>
          <ProductsTable />
        </Filter.Provider>
      </Page.Content>
    </Page.Root>
  );
}
