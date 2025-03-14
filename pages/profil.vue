<script setup>
definePageMeta({
  middleware: ["auth"],
});

const authStore = useAuthStore();
const user = computed(() => authStore.user);
</script>

<template>
  <div class="max-w-xl mx-auto my-8 p-6 border border-primary-80 rounded-md">
    <h1 class="text-2xl font-semibold text-center border-b pb-4 mb-6">
      Moji podaci
    </h1>

    <table class="w-full table-auto">
      <tbody class="divide-y">
        <tr>
          <td class="py-3 text-gray-500">Ime</td>
          <td class="py-3">{{ user?.first_name || "-" }}</td>
        </tr>
        <tr>
          <td class="py-3 text-gray-500">Prezime</td>
          <td class="py-3">{{ user?.last_name || "-" }}</td>
        </tr>
        <tr>
          <td class="py-3 text-gray-500">Email</td>
          <td class="py-3">{{ user?.email || "-" }}</td>
        </tr>
        <tr>
          <td class="py-3 text-gray-500">Telefon</td>
          <td class="py-3">{{ user?.telefon || "-" }}</td>
        </tr>
      </tbody>
    </table>

    <div class="mt-6">
      <button
        @click="authStore.logout()"
        class="w-full py-3 bg-red-500 text-white font-medium rounded hover:bg-red-600 transition"
      >
        Odjavi se
      </button>
    </div>
  </div>
</template>
