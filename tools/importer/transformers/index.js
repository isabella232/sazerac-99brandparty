import removeHeaderAndFooter from './removeHeaderAndFooter.js';
import links from './links.js';
import products from './products.js';

export const transformers = [removeHeaderAndFooter, products];
export const asyncTransformers = [];
export const preTransformers = [];
export const postTransformers = [links];
