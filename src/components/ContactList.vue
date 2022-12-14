<script setup lang="ts">
import { UnauthorizedException } from "@/errors";
import { onMounted, ref } from "vue";

import { deleteContacts, fetchContacts } from "@/api";
import router from "@/router";
import { useAuthStore } from "@/stores/auth";
import type { Contact } from "@/types";
import { logAxiosError } from "../util/logging-service";
import ContactRow from "./ContactRow.vue";

const isLoading = ref(false);
const contacts = ref<Contact[]>([]);
const columns: string[] = ["Name", "Phone", "Address", "Actions"];

interface PaginationData {
  name: string;
  phone: string;
  limit: number;
  page: number;
  lastPage: boolean;
  offsets: Record<string, string>;
  offset?: string;
}

const paginationData: PaginationData = {
  name: "",
  phone: "",
  limit: 2,
  page: 0,
  lastPage: false,
  offsets: {},
  offset: undefined,
};

const authStore = useAuthStore();

onMounted(async () => {
  try {
    loadMore();
  } catch (error: any) {
    logAxiosError(error);

    if (
      error instanceof UnauthorizedException ||
      error.response?.status == 403 ||
      error.response?.status == 401
    ) {
      authStore.logout();
    }
  }
});

const loadMore = async (forward = true) => {
  if (
    (paginationData.page === 1 && !forward) ||
    (paginationData.lastPage && forward)
  )
    return;

  try {
    isLoading.value = true;

    if (!forward) {
      paginationData.offset = paginationData.offsets[paginationData.page - 1];
    }

    const data = await fetchContacts(paginationData);

    const newContacts = data.result.contacts;

    if (newContacts?.length) {
      contacts.value = newContacts;
      paginationData.offset = data.result.offset;

      if (forward) {
        paginationData.page++;
        paginationData.offsets[paginationData.page + 1] = data.result.offset;
        if (newContacts.length < paginationData.limit) {
          paginationData.lastPage = true;
        }
      } else {
        paginationData.lastPage = false;
        paginationData.offsets[paginationData.page] = data.result.offset;
        paginationData.page--;
      }
    } else paginationData.lastPage = true;
  } catch (error: any) {
    logAxiosError(error);

    if (
      error instanceof UnauthorizedException ||
      error.response?.status == 403 ||
      error.response?.status == 401
    ) {
      authStore.logout();
    }
  }

  isLoading.value = false;
};

const onItemClick = (contact: Contact) => {
  router.push({
    name: "contact-details",
    params: { name: contact.name, phone: contact.phone },
  });
};

const createContact = async () => {
  router.push("/contacts/new");
};

const onItemDelete = (contact: Contact) => {
  const index: number = contacts.value.findIndex(
    (c) => c.name === contact.name && c.phone === contact.phone
  );
  contacts.value.splice(index, 1);

  try {
    deleteContacts({
      name: contact.name,
      phone: contact.phone,
    });
    // offset--;
  } catch (error: any) {
    logAxiosError(error);

    if (
      error instanceof UnauthorizedException ||
      error.response?.status == 403 ||
      error.response?.status == 401
    ) {
      authStore.logout();
    }
  }
};
</script>

<template>
  <div id="actions" class="row justify-content-end">
    <div class="col-auto">
      <button
        :disabled="isLoading"
        class="btn btn-primary"
        @click="loadMore(false)"
      >
        Previous
      </button>
    </div>
    <div class="col-auto">
      <button :disabled="isLoading" class="btn btn-primary" @click="loadMore()">
        Next
      </button>
    </div>
    <div class="col-auto ms-auto">
      <button
        :disabled="isLoading"
        class="btn btn-success"
        @click="createContact()"
      >
        New Contact
      </button>
    </div>
  </div>

  <table class="table p-5 text-center align-middle">
    <thead>
      <tr>
        <th v-for="key in columns" :key="key">
          {{ key }}
        </th>
      </tr>
    </thead>
    <tbody>
      <ContactRow
        v-for="(contact, index) in contacts"
        :key="index"
        :contact="contact"
        @click:item="onItemClick"
        @delete:item="onItemDelete"
      />
    </tbody>
  </table>
</template>

<style scoped>
.selected {
  color: white;
  background-color: black;
  font-weight: bold;
}
</style>
