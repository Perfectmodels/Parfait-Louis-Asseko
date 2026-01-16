import { createSlug } from '../utils/slugUtils';
import { courseData } from '../constants/courseData';

// Script to normalize all slugs in courseData
const normalizedCourseData = courseData.map(module => ({
    ...module,
    slug: createSlug(module.slug),
    chapters: module.chapters.map(chapter => ({
        ...chapter,
        slug: createSlug(chapter.slug)
    }))
}));

console.log('Normalized Course Data:');
console.log(JSON.stringify(normalizedCourseData, null, 2));

// Export for use
export default normalizedCourseData;
