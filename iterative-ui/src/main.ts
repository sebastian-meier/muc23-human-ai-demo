import App from './App.svelte';
import {i18nSetup} from './lib/i18n';

i18nSetup();

const app = new App({
  target: document.body,
})

export default app