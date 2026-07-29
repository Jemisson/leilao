import { useEffect, useState } from "react";
import { FaEye, FaEyeSlash, FaSyncAlt } from "react-icons/fa";
import { MdSettings } from "react-icons/md";
import { toast } from "react-toastify";
import Button from "../components/Button";
import PageHeader from "../components/PageHeader";
import { useCatalogSettings } from "../hooks/useCatalogSettings";

function CatalogSettings() {
  const {
    showProductValues,
    loading,
    error,
    refreshCatalogSetting,
    updateShowProductValues,
  } = useCatalogSettings();
  const [draftShowProductValues, setDraftShowProductValues] = useState(showProductValues);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setDraftShowProductValues(showProductValues);
  }, [showProductValues]);

  const handleSave = async () => {
    setSaving(true);

    try {
      await updateShowProductValues(draftShowProductValues);
      toast.success("Configuração do catálogo salva com sucesso!");
    } catch (err) {
      toast.error(`Erro ao salvar configuração do catálogo: ${err}`);
    } finally {
      setSaving(false);
    }
  };

  const handleRefresh = async () => {
    try {
      await refreshCatalogSetting();
      toast.success("Configuração do catálogo atualizada.");
    } catch (err) {
      toast.error(`Erro ao carregar configuração do catálogo: ${err}`);
    }
  };

  const hasChanges = draftShowProductValues !== showProductValues;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <PageHeader title="Configurações do Catálogo" icon={<MdSettings className="h-5 w-5" />} />

      <div className="max-w-3xl rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-blueBright/10 text-blueBright">
              {draftShowProductValues ? <FaEye className="h-5 w-5" /> : <FaEyeSlash className="h-5 w-5" />}
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Exibir valores dos produtos</h2>
              <p className="mt-1 text-sm text-gray-600">
                Quando desativado, cards, detalhes e modais do catálogo não exibem valor atual ou lance mínimo.
              </p>
            </div>
          </div>

          <label className="inline-flex cursor-pointer items-center gap-3">
            <span className="text-sm font-semibold text-gray-700">
              {draftShowProductValues ? "Visível" : "Oculto"}
            </span>
            <input
              type="checkbox"
              className="sr-only peer"
              checked={draftShowProductValues}
              onChange={(event) => setDraftShowProductValues(event.target.checked)}
              disabled={loading || saving}
            />
            <span className="relative h-7 w-12 rounded-full bg-gray-300 transition peer-checked:bg-redDark peer-disabled:opacity-60 after:absolute after:left-1 after:top-1 after:h-5 after:w-5 after:rounded-full after:bg-white after:transition peer-checked:after:translate-x-5" />
          </label>
        </div>

        {error && (
          <p className="mt-5 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            {error}
          </p>
        )}

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button
            text={saving ? "Salvando..." : "Salvar configuração"}
            onClick={handleSave}
            disabled={loading || saving || !hasChanges}
            className="inline-flex justify-center"
          />
          <button
            type="button"
            onClick={handleRefresh}
            disabled={loading || saving}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2 font-semibold text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FaSyncAlt className="h-4 w-4" />
            {loading ? "Carregando..." : "Recarregar"}
          </button>
        </div>

        {hasChanges && (
          <p className="mt-4 text-sm font-semibold text-pinkDark">
            Existem alterações não salvas.
          </p>
        )}
      </div>
    </div>
  );
}

export default CatalogSettings;
