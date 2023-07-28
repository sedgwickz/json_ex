import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import Antd, { Button, Checkbox, Divider, Select, Space } from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';

// createApp(App).use(Button).use(Select).use(Space).use(Checkbox).use(Antd).use(Divider).mount('#app')
createApp(App).use(Antd).mount('#app')

