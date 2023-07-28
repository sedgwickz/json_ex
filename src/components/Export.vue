<template>
  <div>
    <div>
      <a-select style="min-width: 240px;" :options="options" placeholder="选择表格" @change="selectChange"></a-select>
    </div>
    <a-checkbox-group :options="fields" v-model:value="checkedFields">
    </a-checkbox-group>
    <div style="margin-top: 12px;">
      <a-button type="primary" @click="handleExport">导出</a-button>
    </div>
    <pre class="result">{{ result }}</pre>
    <a-spin v-if="isLoading" />
  </div>
</template>

<script setup lang="ts">
import { type IWidgetTable, bitable, type IWidgetView, type IViewMeta } from '@base-open/web-api';
import { onMounted, reactive, ref } from 'vue';
import type { SelectProps } from 'ant-design-vue';
import type { FieldOption } from '@/models/model';
import * as _ from 'lodash-es';

const options = ref<SelectProps['options']>([])
const fields = ref<FieldOption[]>()
const checkedFields = ref<string[]>([])
let table: IWidgetTable = null;
let view: IViewMeta = null
let result = ref('')
const isLoading = ref(false)

onMounted(async () => {
  const selection = await bitable.base.getSelection();
  table = await bitable.base.getTableById(selection.tableId!);
  const views = await table.getViewMetaList();
  options.value = views.map(item => ({ label: item.name, value: item.id }))
})

async function selectChange(value: string) {
  view = await table.getViewMetaById(value)
  const fieldList = await table.getFieldMetaList()
  fields.value = fieldList.map(item => ({ label: item.name, value: item.id }))
  checkedFields.value = fieldList.filter(item => ['中文', 'Modules', 'Key', 'Page'].includes(item.name) ).map(item => item.id)
  console.log('change ', fieldList)
}

async function handleExport() {
  if (checkedFields.value.length === 0) {
    alert('请选择需要导出的视图')
    return
  }
  isLoading.value = true
  let data = {}
  result.value = ''
  const records = await table.getRecordIdList();
  console.log('records: ', records)
  for (const i in records) {
    const record = await table.getRecordById(records[i] as string);
    // if (record.fields['fldi408CTK']?.text !== view.name) {
    //   continue
    // }
    console.log('-----------------')
    let module = 'null'
    let page = 'null'
    let langKey = 'null'
    let lang = 'null'

    Object.entries(record.fields).forEach(([key, value]) => {
      // console.log('$$$$ ', key, value, checkedFields)
      if (checkedFields.value.includes(key)) {
        const field = fields.value.find(item => item.value === key)
        console.log('field: ', field)
        if (field?.label === 'Modules') {
          module = value?.[0]?.text
        } else if (field?.label === 'Page') {
          page = value?.[0]?.text
        } else if (field?.label === 'Key') {
          langKey = value?.[0]?.text
        } else if (field?.label === '中文') {
          lang = value?.[0]?.text
        } else if (field?.label === '英文') {
          lang = value?.[0]?.text
        }
      }
    })
    const piece = {
      [module]: {
        [page]: {
          [langKey]: lang
        }
      }
    }
    console.log(piece)
    data = _.merge(data, piece)
  }

  result.value = JSON.stringify(data, null, 2)
  console.log('data: ', data)
  isLoading.value = false
}


</script>

<style scoped>
.result {
  /* overflow-x: scroll; */
  /* max-width: 350px; */
  margin-top: 20px;
  background-color: #181818;
}
</style>