import { AppDataSource } from './data-source';
import { Project } from '../projects/entities/project.entity';

async function seedProjects() {
  try {
    await AppDataSource.initialize();
    console.log('Database connected for seeding projects');

    const projectRepository = AppDataSource.getRepository(Project);

    // Clean projects
    console.log('Cleaning projects...');
    await projectRepository.delete({});
    console.log('Projects cleaned');

    // Create sample projects
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
    
    await AppDataSource.destroy();
  } catch (error) {
    console.error('Error during projects seeding:', error);
    process.exit(1);
  }
}

seedProjects();