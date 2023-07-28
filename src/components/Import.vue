<template>
  <a-space direction="vertical" block style="width: 100%;">
    <a-textarea v-model:value="value" placeholder="JSON格式数据" :auto-size="{ minRows: 8, maxRows: 8 }" />
    <div style="margin: 20px 0;">
      <a-button type="primary" @click="handleImport()">导入</a-button>
    </div>
  </a-space>
</template>

<script setup lang="ts">
import { FieldType, bitable } from '@base-open/web-api';
import { ref } from 'vue';

const value = ref('')

async function handleImport() {
  try {
    const data = JSON.parse(value.value)
    Object.entries(data).forEach(module => {
      const moduleName = module[0]
      Object.entries(module[1]).forEach(page => {
        const pageName = page[0]
        Object.entries(page[1]).forEach(lang => {
          const langName = lang[0]
          const langValue = lang[1]
          insertRecord(moduleName, pageName, langName, langValue)
          console.log(moduleName, pageName, langName, langValue)
        })
      })
    })
  } catch (error) {
    alert('JSON格式错误')
  }

}

async function insertRecord(moduleName: string, pageName: string, langName: string, langValue: string) {
  const selection = await bitable.base.getSelection();
  const table = await bitable.base.getTableById(selection.tableId);
  let moduleFieldId;
  let pageFieldId;
  let keyFieldId;
  let zhFieldId;

  try {
    const moduleField = await table.getFieldByName('Modules');
    moduleFieldId = moduleField.id
  } catch (error) {
    moduleFieldId = await table.addField({
      type: FieldType.Text,
      name: 'Modules',
    })
  }
  try {
    const pageField = await table.getFieldByName('Page');
    pageFieldId = pageField.id
  } catch (error) {
    pageFieldId = await table.addField({
      type: FieldType.Text,
      name: 'Page',
    })
  }

  try {
    const keyField = await table.getFieldByName('Key');
    keyFieldId = keyField.id
  } catch (error) {
    keyFieldId = await table.addField({
      type: FieldType.Text,
      name: 'Key',
    })
  }

  try {
    const zhField = await table.getFieldByName('中文');
    zhFieldId = zhField.id
  } catch (error) {
    zhFieldId = await table.addField({
      type: FieldType.Text,
      name: '中文',
    })
  }
  const res = await table.addRecord({
    fields: {
      [moduleFieldId]: [
        {
          type: 'text',
          text: moduleName
        }
      ],
      [pageFieldId]: [
        {
          type: 'text',
          text: pageName
        }
      ],
      [keyFieldId]: [
        {
          type: 'text',
          text: langName
        }
      ],
      [zhFieldId]: [
        {
          type: 'text',
          text: langValue
        }
      ]
    }
  });
}
</script>

<style scoped></style>