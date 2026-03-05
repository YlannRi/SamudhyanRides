import AxeBuilder from '@axe-core/playwright';
import type { Page } from '@playwright/test';

export async function runAxe(page: Page) {
  // WCAG A + AA (including 2.1 tags)
  return new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();
}
