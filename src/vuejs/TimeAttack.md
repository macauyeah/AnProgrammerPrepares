install vue3
```bash
npm create vue@latest
cd <your-project-name>
npm install
npm run dev
```

update vite.config.ts
```js
import { fileURLToPath, URL } from 'node:url'
import type { UserConfig, ConfigEnv } from 'vite' // add
import { defineConfig, loadEnv } from 'vite' // modify
import vue from '@vitejs/plugin-vue'
import VueDevTools from 'vite-plugin-vue-devtools'

export default defineConfig(({ mode }: ConfigEnv): UserConfig => { // modify
  const env = loadEnv(mode, process.cwd()) // add
  return { // add return statement, properties build, server, base
    plugins: [
      vue(),
      VueDevTools()
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    build: {
      outDir: 'somewhere',
      emptyOutDir: true
    },
    server: {
      host: '0.0.0.0',
      proxy: {
        '^/api': {
          target: 'http://localhost:8080/', // assume backend-api is running on localhost:8080
          ws: true,
          changeOrigin: true,
          autoRewrite: true,
          cookieDomainRewrite: {
            '*': '127.0.0.1'
          }
        }
      }
    },
    base: env.VITE_WEB_ROOT
  }
})
```

udpate vitest.config.ts
```js
export default defineConfig(env => mergeConfig( // update
  viteConfig(env), // add
  defineConfig({
    test: {
      environment: 'jsdom',
      exclude: [...configDefaults.exclude, 'e2e/**'],
      root: fileURLToPath(new URL('./', import.meta.url)),
    },
  }),
)) // update
```

add .env for dev variable, context path, disable auth
```
VITE_WEB_ROOT=""
HTTP_AUTH_ENABLED=false
```

add .env.production for production variable
```
VITE_WEB_ROOT="/production-context-path"
HTTP_AUTH_ENABLED=true
```

// config frontend backend route
update src/router/index.ts
```diff
-path: '/about',
+path: '/ui/about',
```
if you go back to Hash Mode, confirm that you are not using backend routing

test producion build
```bash
npm run lint
npm run format
npm run build
```

config openapi generator
```bash
npm install --save-dev @openapitools/openapi-generator-cli
npx openapi-generator-cli version-manager set 7.11.0
```

revise package.json add openapi command
```json
{
  "scripts": {
    "openapi": "openapi-generator-cli generate -i http://localhost:8080/v3/api-docs -g typescript-axios --additional-properties=withSeparateModelsAndApi=true,modelPackage=model,apiPackage=api -o src/openapi/"
  }
}
```

npm install axios
npm install vue-i18n

```diff
# src/main.ts
import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

+import i18n from "./i18n/"
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
+app.use(i18n)

app.mount('#app')


# src/i18n/index.ts
+import { createI18n } from 'vue-i18n'
+import zhTwJson from "./locales/zh-tw.json"
+
+const i18n = createI18n({
+  locale: 'zh-tw',
+  globalInjection: true,
+  messages: {
+    'zh-tw': zhTwJson
+  }
+})
+
+export default i18n

# src/i18n/locales/zh-tw.json
+{
+  "app": {
+    "name": "YOUR APP NAME"
+  }
+}
```

npm install element-plus --save

```diff
# src/main.ts
import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import i18n from "./i18n/"

+import ElementPlus from 'element-plus'
+import 'element-plus/dist/index.css'
+import { zhTw } from 'element-plus/es/locales.mjs'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(i18n)
+app.use(ElementPlus, { locale: zhTw })

app.mount('#app')
```

# draft
config vue router (route guard)
config vue axios interceptor
config vue i18n
config vue pinia
config vue element-plus
config openapi generator
config vue validator (vuelidate)