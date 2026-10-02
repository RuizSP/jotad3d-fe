import ClienteTable from "../../components/application/Cliente/ClienteTable";
import { Filter } from "../../components/ui/Filter";
import { Page } from "../../components/ui/Page";

export default function Clientes() {
  return (
    <Page.Root>
      <Page.Content>
        <Filter.Provider initialFormValues={{}}>
          <ClienteTable />
        </Filter.Provider>
      </Page.Content>
    </Page.Root>
  );
}
