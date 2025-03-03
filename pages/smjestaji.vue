<template>
  <div class="">
    <SearchFilterComponent
      :tipovi="tipovi"
      :tipovi-loading="tipoviLoading"
      :tipovi-error="tipoviError || undefined"
      :regije="regije"
      :regije-loading="regijeLoading"
      :regije-error="regijeError || undefined"
    />
  </div>
</template>

<script lang="ts">
import { useTipoviSmjestaja } from "~/composables/useTipoviSmjestaja";
import { useRegije } from "~/composables/useRegije";
import { useNovosti } from "~/composables/useNovosti";

export default defineComponent({
  setup() {
    const {
      tipovi,
      isLoading: tipoviLoading,
      error: tipoviError,
      fetchTipovi,
    } = useTipoviSmjestaja();

    const {
      regije,
      isLoading: regijeLoading,
      error: regijeError,
      fetchRegije,
    } = useRegije();

    const {
      novosti,
      isLoading: novostiLoading,
      error: novostiError,
      fetchNovosti,
      getHeroImageUrl,
      formatDate,
    } = useNovosti();

    onMounted(() => {
      fetchTipovi();
      fetchRegije();
      fetchNovosti(3);
    });

    return {
      tipovi,
      tipoviLoading,
      tipoviError,

      regije,
      regijeLoading,
      regijeError,

      novosti,
      novostiLoading,
      novostiError,
      getHeroImageUrl,
      formatDate,
    };
  },
});
</script>
