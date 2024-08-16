import { getEntitiesList } from '@silly-tavern/script.js';
import Sandbox from '@nyariv/sandboxjs';
import web from './web';

import { importFromScript } from 'utils';
import { getApiUrl } from '../../../../extensions';



export default async function init() {
    console.log('init');
    const script = await importFromScript('script.js');
    console.log(script);
    const { getContext } = await importFromScript('scripts/extensions.js') as { getContext: () => any };
    console.log(getContext());
    console.log('Hello from SillyTavern-Extension-ZerxzLib!');
    console.log('Importing from SillyTavern-Extension-ZerxzLib/src/index.ts');
    console.log(getEntitiesList());
    console.log(new Sandbox());
    console.log(getApiUrl());
    web();
}


