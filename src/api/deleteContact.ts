import { UnauthorizedException } from "@/errors";
import { getToken } from "@/util/storage-service";
import axios from "axios";

interface DeleteContactsPayload {
  name?: string;
  phone?: string;
}

export const deleteContacts = async (
  payload: DeleteContactsPayload
): Promise<void> => {
  const token = getToken();

  if (token)
    await axios.delete(
      `${import.meta.env.VITE_API_URL}/contacts/${payload.name || ""}/${
        payload.phone || ""
      }`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  else throw new UnauthorizedException("No token provided");
};
