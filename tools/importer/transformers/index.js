import removeHeaderAndFooter from './removeHeaderAndFooter.js';
import links from './links.js';

export const transformers = [removeHeaderAndFooter];
export const asyncTransformers = [];
export const preTransformers = [];
export const postTransformers = [links];
