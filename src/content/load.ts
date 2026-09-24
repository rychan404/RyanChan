import { getCollection, type CollectionEntry } from 'astro:content';
import { byNewest, toProject, type Project } from './projects';

export type ProjectEntry = { entry: CollectionEntry<'projects'>; project: Project };

/** Every project, validated by content.config.ts and sorted newest first. */
export async function loadProjects(): Promise<ProjectEntry[]> {
  const entries = await getCollection('projects');
  return entries
    .map((entry) => ({
      entry,
      project: toProject(entry.id, { ...entry.data, image: entry.data.image?.src }),
    }))
    .sort((a, b) => byNewest(a.project, b.project));
}
