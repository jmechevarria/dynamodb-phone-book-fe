<script setup lang="ts">
import { computed, type ComputedRef } from "vue";

import type { Contact } from "@/types";

const props = defineProps<{
  contact: Contact;
}>();

const fullAddress: ComputedRef<string> = computed(() => {
  const { address_lines } = props.contact;

  return address_lines?.join(", ");
});
</script>

<template>
  <tr class="contact">
    <td>
      {{ props.contact.name }}
    </td>
    <td>
      {{ props.contact.phone }}
    </td>
    <td>
      {{ fullAddress }}
    </td>
  </tr>
</template>
