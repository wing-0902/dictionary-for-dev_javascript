import type { Alpine } from 'alpinejs';
import persist from '@alpinejs/persist';
import mask from '@alpinejs/mask';

export default (Alpine: Alpine) => {
  Alpine.plugin(persist);
  Alpine.plugin(mask);
};
