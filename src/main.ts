import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import Antd, { Button, Checkbox, Select, Space } from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';

createApp(App).use(Button).use(Select).use(Space).use(Checkbox).use(Antd).mount('#app')

