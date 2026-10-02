import { Typography } from "@mui/material";
import OrdersTable from "../../../components/application/Orders/OrdersTable";
import { Filter } from "../../../components/ui/Filter";
import { Page } from "../../../components/ui/Page";

export default function Orders() {
  return (
    <Page.Root>
      <Page.Content>
        <Filter.Provider initialFormValues={{}}>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Acompanhe o status das suas compras recentes e acesse os detalhes de
            cada pedido.
          </Typography>
          <OrdersTable />
        </Filter.Provider>
      </Page.Content>
    </Page.Root>
  );
}
