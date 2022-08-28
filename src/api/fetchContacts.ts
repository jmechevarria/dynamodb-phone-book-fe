import { UnauthorizedException } from "@/errors";
import type { ApiResponse, Contact } from "@/types";
import { cache, retrieve } from "@/util/cache-service";
import { getToken } from "@/util/storage-service";
import axios from "axios";

interface ContactsPayload {
  name?: string;
  phone?: string;
  limit?: number;
  offset?: string;
}

export interface ContactsResponse {
  contacts: Contact[];
  offset: string;
}

export const fetchContacts = async (
  payload: ContactsPayload
): Promise<ApiResponse<ContactsResponse>> => {
  const token = getToken();

  if (token) {
    const limit = payload.limit || 1;
    const url = `${import.meta.env.VITE_API_URL}/contacts/?name=${
      payload.name || ""
    }&phone=${payload.phone || ""}&limit=${limit}&offset=${payload.offset}`;

    const singleContactRequest = payload.name && payload.phone;
    if (singleContactRequest) {
      const localData = retrieve(url);

      if (localData) return localData;
    }

    console.warn("Hitting server");

    const { data } = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (singleContactRequest) {
      cache(url, data);
    }

    return data;
  } else throw new UnauthorizedException("No token provided");
};
