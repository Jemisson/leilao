import React, { useCallback, useEffect, useState } from "react";
import { CatalogSettingsContext } from "./CatalogSettingsContext";
import { fetchCatalogSetting, getCatalogSettingValue, updateCatalogSetting } from "../services/api";

export const CatalogSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [showProductValues, setShowProductValues] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshCatalogSetting = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchCatalogSetting();
      setShowProductValues(getCatalogSettingValue(data));
    } catch (err) {
      console.error("Erro ao carregar configuracao do catalogo:", err);
      setError("Erro ao carregar a configuracao do catalogo.");
      setShowProductValues(false);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateShowProductValues = async (nextShowProductValues: boolean) => {
    setError(null);

    try {
      const data = await updateCatalogSetting(nextShowProductValues);
      setShowProductValues(getCatalogSettingValue(data));
    } catch (err) {
      console.error("Erro ao salvar configuracao do catalogo:", err);
      setError("Erro ao salvar a configuracao do catalogo.");
      throw err;
    }
  };

  useEffect(() => {
    refreshCatalogSetting().catch(() => undefined);
  }, [refreshCatalogSetting]);

  return (
    <CatalogSettingsContext.Provider
      value={{
        showProductValues,
        loading,
        error,
        refreshCatalogSetting,
        updateShowProductValues,
      }}
    >
      {children}
    </CatalogSettingsContext.Provider>
  );
};
