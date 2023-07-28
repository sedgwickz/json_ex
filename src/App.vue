
<template>
  <main>
    <div>
      <div style="padding-bottom: 20px;">
        <a-segmented v-model:value="segmentValue" block :options="segmentItems" />
      </div>
      <Export v-if="segmentValue === '导出'"></Export>
      <Import v-if="segmentValue === '导入'"></Import>
    </div>
  </main>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import Export from '@/components/Export.vue';
import Import from '@/components/Import.vue';

const segmentItems = reactive(['导出', '导入']);
const segmentValue = ref(segmentItems[0]);


function handleImport() {

}

</script>


<style scoped>
main {
  height: 100%;
  width: 100%;
  /* display: flex;
  align-items: center;
  justify-content: center; */
}


</style>
