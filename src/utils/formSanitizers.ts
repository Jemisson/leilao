import { ProfileUser } from "../types";

const removeMask = (value: string): string => value.replace(/\D/g, "");

export const sanitizeProfileUserData = (data: ProfileUser): ProfileUser => {
  return {
    ...data,
    cpf: removeMask(data.cpf),
    phone: removeMask(data.phone),
    zip_code: removeMask(data.zip_code),
  };
};
