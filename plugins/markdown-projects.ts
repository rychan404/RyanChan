import { basename, dirname } from 'node:path';
import type { Plugin } from 'vite';
import { emitModule, parseProject } from './parse-project';

const PROJECT_MD = /[\\/]content[\\/]projects[\\/][^\\/]+[\\/]index\.md$/;

/** Compiles src/content/projects/NN-slug/index.md into a typed ES module at
 *  build time, so no Markdown parser reaches the browser bundle. */
export function markdownProjects(): Plugin {
  return {
    name: 'markdown-projects',
    // 'pre' so this runs before Vite's own transforms and they only ever
    // see JavaScript.
    enforce: 'pre',
    transform(code, id) {
      const file = id.split('?')[0];
      if (!PROJECT_MD.test(file)) return null;
      return { code: emitModule(parseProject(code, basename(dirname(file)), file)), map: null };
    },
  };
}
