import { useContext } from "react";
import { CatalogSettingsContext } from "../contexts/CatalogSettingsContext";

export const useCatalogSettings = () => {
  const context = useContext(CatalogSettingsContext);

  if (!context) {
    throw new Error("useCatalogSettings deve ser usado dentro de um CatalogSettingsProvider");
  }

  return context;
};
