// eslint-disable-next-line import/no-cycle
import { loadScript, sampleRUM } from './lib-franklin.js';

// Core Web Vitals RUM collection
sampleRUM('cwv');

// add more delayed functionality here

// GTM
loadScript('/scripts/gtm-init.js', { defer: true });

// reCapture
loadScript('https://www.google.com/recaptcha/api.js?render=6LfrAQgeAAAAAP0zLUqJQydsBxkJp-XZK8KsKX_d&#038;ver=3.0', { defer: true });
