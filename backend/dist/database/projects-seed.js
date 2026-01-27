"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const data_source_1 = require("./data-source");
const project_entity_1 = require("../projects/entities/project.entity");
async function seedProjects() {
    try {
        await data_source_1.AppDataSource.initialize();
        console.log('Database connected for seeding projects');
        const projectRepository = data_source_1.AppDataSource.getRepository(project_entity_1.Project);
        console.log('Cleaning projects...');
        await projectRepository.delete({});
        console.log('Projects cleaned');
        const erasmusProject = projectRepository.create({
            name: 'Erasmus+ Mobility',
        });
        await projectRepository.save(erasmusProject);
        console.log('Project created: Erasmus+ Mobility');
        const stemProject = projectRepository.create({
            name: 'STEM Innovation',
        });
        await projectRepository.save(stemProject);
        console.log('Project created: STEM Innovation');
        const culturalProject = projectRepository.create({
            name: 'Cultural Exchange',
        });
        await projectRepository.save(culturalProject);
        console.log('Project created: Cultural Exchange');
        console.log('=================================');
        console.log('Projects seeding completed successfully');
        console.log('Projects created: 3');
        console.log('=================================');
        await data_source_1.AppDataSource.destroy();
    }
    catch (error) {
        console.error('Error during projects seeding:', error);
        process.exit(1);
    }
}
seedProjects();
//# sourceMappingURL=projects-seed.js.map