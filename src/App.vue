
<template>
  <main>
    <div>
      <div>
        <a-select style="min-width: 240px;" :options="options" placeholder="选择表格" @change="selectChange"></a-select>
      </div>
      <a-checkbox-group :options="fields" v-model:value="checkedFields">
      </a-checkbox-group>
      <div style="margin-top: 12px;">
        <a-button type="primary" @click="handleExport">导出</a-button>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { type IWidgetTable, bitable, type IWidgetView, type IViewMeta } from '@base-open/web-api';
import { onMounted, ref } from 'vue';
import type { SelectProps } from 'ant-design-vue';
import type { FieldOption } from '@/models/model';
import * as _ from 'lodash-es';

const options = ref<SelectProps['options']>([])
const fields = ref<FieldOption[]>()
const checkedFields = ref<string[]>([])
let table: IWidgetTable = null;
let view: IViewMeta = null

onMounted(async () => {
  // const tableList = await bitable.base.getTableMetaList()
  const selection = await bitable.base.getSelection();
  table = await bitable.base.getTableById(selection.tableId!);
  const views = await table.getViewMetaList();
  options.value = views.map(item => ({ label: item.name, value: item.id }))
})

async function selectChange(value: string) {
  view = await table.getViewMetaById(value)
  console.log('view: ', view)
  const fieldList = await view.getFieldMetaList()
  fields.value = fieldList.map(item => ({ label: item.name, value: item.id, checked: true }))
  checkedFields.value = fieldList.map(item => item.id)
  console.log('change ', fieldList)
}

async function handleExport() {
  let data = {}
  const records = await table.getRecordIdList();
  console.log('records: ', records)
  for (const record in records) {
    console.log('record: ', record)
  }
  records.forEach(async item => {
    const record = await table.getRecordById(item as string);
    if (record.fields['fldi408CTK']?.text !== view.name) {
      return
    }
    console.log('-----------------')
    let module = 'null'
    let page = 'null'
    let langKey = 'null'
    let lang = 'null'

    for(const [key, value] of Object.entries(record.fields)) {

    }
    Object.entries(record.fields).forEach(([key, value]) => {
      if (key === 'fldFRHXUEh') {
        module = value?.[0]?.text
      } else if (key === 'flddQpVeXw') {
        page = value?.[0]?.text
      } else if (key === 'fld31KGl4E') {
        langKey = value?.[0]?.text
      } else if (key === 'fldRoIIvQB') {
        lang = value?.[0]?.text
      }
    })
    const piece = {
      [module]: {
        [page]: {
          [langKey]: lang
        }
      }
    }
    // console.log('piece: ', piece)
    data = _.merge(data, piece)
    // console.log('data1: ', data)
  })
  console.log('data: ', data)
}

function processData() {
  
}


</script>


<style scoped>
main {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
