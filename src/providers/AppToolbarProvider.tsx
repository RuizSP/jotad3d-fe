import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  type ReactNode,
  type ComponentType,
  Suspense,
  lazy,
} from "react";

const TOOLBARSTORAGEKEY = "persist@toolbar";

/**
 * Cada dialog salva apenas o caminho do módulo
 * relativo à pasta /dialogs
 *
 * Exemplo:
 * module: "user/EditUserDialog"
 */
export type DialogItem = {
  id: string;
  module: string;
  payload: object;
  title: string;
};

type DialogAction =
  | { type: "add"; payload: DialogItem }
  | { type: "remove"; id: string }
  | { type: "hydrate"; payload: DialogItem[] };

type AppToolbarContextType = {
  dialog: DialogItem[];
  addDialog: (item: DialogItem) => void;
  removeDialog: (id: string) => void;
};

const AppToolbarContext = createContext<AppToolbarContextType | undefined>(
  undefined,
);

/**
 * 🔥 Vite glob automático
 * Carrega TODOS os dialogs automaticamente
 */
const dialogModules = import.meta.glob("../../../application/**/*.tsx");

function dialogReducer(
  state: DialogItem[],
  action: DialogAction,
): DialogItem[] {
  switch (action.type) {
    case "hydrate":
      return action.payload;

    case "add": {
      const exists = state.some((item) => item.id === action.payload.id);

      if (exists) {
        return state.map((item) =>
          item.id === action.payload.id ? action.payload : item,
        );
      }

      return [...state, action.payload];
    }

    case "remove":
      return state.filter((item) => item.id !== action.id);

    default:
      return state;
  }
}

export function AppToolbarProvider({ children }: { children: ReactNode }) {
  const [dialog, dispatch] = useReducer(dialogReducer, [], () => {
    const storage = localStorage.getItem(TOOLBARSTORAGEKEY);

    if (!storage) return [];

    try {
      return JSON.parse(storage) as DialogItem[];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(TOOLBARSTORAGEKEY, JSON.stringify(dialog));
  }, [dialog]);

  function addDialog(item: DialogItem) {
    dispatch({ type: "add", payload: item });
  }

  function removeDialog(id: string) {
    dispatch({ type: "remove", id });
  }

  return (
    <AppToolbarContext.Provider value={{ dialog, addDialog, removeDialog }}>
      {children}

      {/* Renderização dinâmica */}
      {dialog.map((item) => {
        const modulePath = `../dialogs/${item.module}.tsx`;

        const importer = dialogModules[modulePath];

        if (!importer) {
          console.warn(`Dialog module "${item.module}" não encontrado.`);
          return null;
        }

        const LazyComponent = lazy(
          importer as () => Promise<{
            default: ComponentType<object>;
          }>,
        );

        return (
          <Suspense fallback={null} key={item.id}>
            <LazyComponent {...item.payload} />
          </Suspense>
        );
      })}
    </AppToolbarContext.Provider>
  );
}

export function useAppToolbar() {
  const context = useContext(AppToolbarContext);

  if (!context) {
    throw new Error("useAppToolbar must be used within AppToolbarProvider");
  }

  return context;
}
