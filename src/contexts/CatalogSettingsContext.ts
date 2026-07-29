import { createContext } from "react";

export interface CatalogSettingsContextValue {
  showProductValues: boolean;
  loading: boolean;
  error: string | null;
  refreshCatalogSetting: () => Promise<void>;
  updateShowProductValues: (showProductValues: boolean) => Promise<void>;
}

export const CatalogSettingsContext = createContext<CatalogSettingsContextValue | undefined>(undefined);
