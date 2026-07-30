import React, { FormEvent, useState } from "react";
import { FaLock } from "react-icons/fa";
import { toast } from "react-toastify";
import PageHeader from "../components/PageHeader";
import { updatePassword } from "../services/api";

const getErrorMessages = (err: unknown) => {
  const responseErrors = (err as { response?: { data?: { errors?: unknown } } }).response?.data?.errors;

  if (Array.isArray(responseErrors)) {
    return responseErrors.map(String);
  }

  if (typeof responseErrors === "string") {
    return [responseErrors];
  }

  return ["Erro ao alterar senha."];
};

const PasswordChange: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const validate = () => {
    const validationErrors: string[] = [];

    if (!currentPassword.trim()) {
      validationErrors.push("Informe a senha atual.");
    }

    if (password.length < 6) {
      validationErrors.push("A nova senha deve ter no mínimo 6 caracteres.");
    }

    if (password !== passwordConfirmation) {
      validationErrors.push("A nova senha e a confirmação devem ser iguais.");
    }

    return validationErrors;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationErrors = validate();

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      validationErrors.forEach((message) => toast.warning(message));
      return;
    }

    setIsSubmitting(true);
    setErrors([]);

    try {
      await updatePassword(currentPassword, password, passwordConfirmation);
      toast.success("Senha alterada com sucesso!");
      setCurrentPassword("");
      setPassword("");
      setPasswordConfirmation("");
    } catch (err) {
      const messages = getErrorMessages(err);
      setErrors(messages);
      messages.forEach((message) => toast.error(message));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <PageHeader title="Alterar Senha" icon={<FaLock className="h-5 w-5" />} />

      <form
        onSubmit={handleSubmit}
        className="max-w-xl rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
      >
        {errors.length > 0 && (
          <div className="mb-5 rounded-md border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
            {errors.map((message) => (
              <p key={message}>{message}</p>
            ))}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label htmlFor="current-password" className="block text-sm font-semibold text-gray-700">
              Senha atual
            </label>
            <input
              id="current-password"
              type="password"
              autoComplete="current-password"
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:border-blueBright focus:outline-none focus:ring-2 focus:ring-blueBright/20"
              required
            />
          </div>

          <div>
            <label htmlFor="new-password" className="block text-sm font-semibold text-gray-700">
              Nova senha
            </label>
            <input
              id="new-password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:border-blueBright focus:outline-none focus:ring-2 focus:ring-blueBright/20"
              minLength={6}
              required
            />
          </div>

          <div>
            <label htmlFor="password-confirmation" className="block text-sm font-semibold text-gray-700">
              Confirmação da nova senha
            </label>
            <input
              id="password-confirmation"
              type="password"
              autoComplete="new-password"
              value={passwordConfirmation}
              onChange={(event) => setPasswordConfirmation(event.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:border-blueBright focus:outline-none focus:ring-2 focus:ring-blueBright/20"
              minLength={6}
              required
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-md !bg-pinkDark px-4 py-2 font-bold !text-white transition hover:!bg-redBright disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Alterando..." : "Alterar senha"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PasswordChange;
