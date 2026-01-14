import { AppDataSource } from './data-source';
import { User } from '../users/entities/user.entity';
import { Article } from '../articles/entities/article.entity';
import { Project } from '../projects/entities/project.entity'; // CORRECTimport * as bcrypt from 'bcryptjs';
import * as bcrypt from 'bcryptjs';

async function seed() {
  try {
    await AppDataSource.initialize();
    console.log('Database connected for seeding');

    const userRepository = AppDataSource.getRepository(User);
    const articleRepository = AppDataSource.getRepository(Article);
    const projectRepository = AppDataSource.getRepository(Project);

    // Clean start - drop all data
  

    // Create admin user
    const passwordHash = await bcrypt.hash('admin', 10);
    const adminUser = userRepository.create({
      username: 'admin',
      passwordHash,
      role: 'admin',
      isValidated: true,
    });
    await userRepository.save(adminUser);
    console.log('Admin user created: admin / admin');

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

    // Create sample articles
    const sampleArticles = [
      {
        title: 'Erasmus+ Mobility Program Launch',
        slug: 'erasmus-mobility-program-launch',
        excerpt: 'We are excited to announce the launch of our new Erasmus+ mobility program for students and teachers.',
        content: `<h2>A New Chapter in International Education</h2>
          <p>Colegiul Național "Frații Buzești" is proud to announce the launch of our comprehensive Erasmus+ mobility program. This initiative will provide unprecedented opportunities for our students and teachers to engage with European partners.</p>
          <h3>Program Highlights</h3>
          <ul>
            <li>Student exchanges with partner schools across Europe</li>
            <li>Teacher training workshops in innovative pedagogical methods</li>
            <li>Collaborative projects with international institutions</li>
            <li>Cultural immersion experiences</li>
          </ul>
          <p>The program will commence in the fall semester and run for three years, with opportunities for extension. We believe this will significantly enhance the educational experience of our community.</p>`,
        coverImageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800',
        imageUrls: ['https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800'],
        published: true,
        authorId: adminUser.id,
        projectId: erasmusProject.id,
      },
      {
        title: 'Student Exchange to Germany',
        slug: 'student-exchange-germany',
        excerpt: 'Ten of our students will participate in a two-week exchange program with our partner school in Berlin.',
        content: `<h2>Berlin Awaits Our Students</h2>
          <p>We are thrilled to announce that ten students from our school have been selected to participate in an exciting exchange program with Friedrich-Ebert-Gymnasium in Berlin, Germany.</p>
          <h3>Program Details</h3>
          <p>During their two-week stay, students will:</p>
          <ul>
            <li>Attend classes alongside German students</li>
            <li>Stay with host families to experience German culture firsthand</li>
            <li>Participate in guided tours of historical sites</li>
            <li>Work on collaborative STEM projects</li>
          </ul>
          <p>This exchange is funded by our Erasmus+ grant and represents a unique opportunity for cultural and educational growth.</p>`,
        coverImageUrl: 'https://images.unsplash.com/photo-1560969184-10fe8719e047?w=800',
        imageUrls: ['https://images.unsplash.com/photo-1560969184-10fe8719e047?w=800'],
        published: true,
        authorId: adminUser.id,
        projectId: erasmusProject.id,
      },
      {
        title: 'Teacher Training Workshop in Portugal',
        slug: 'teacher-training-portugal',
        excerpt: 'Our faculty members attended an innovative teaching methods workshop in Lisbon as part of the Erasmus+ program.',
        content: `<h2>Professional Development in Lisbon</h2>
          <p>Five teachers from Colegiul Național "Frații Buzești" recently returned from a transformative week-long workshop in Lisbon, Portugal, focused on modern pedagogical approaches.</p>
          <h3>Key Learnings</h3>
          <p>The workshop covered several important topics:</p>
          <ul>
            <li>Project-based learning methodologies</li>
            <li>Digital tools for classroom engagement</li>
            <li>Inclusive education practices</li>
            <li>Assessment for learning strategies</li>
          </ul>
          <p>Our teachers are now implementing these innovative approaches in their classrooms, benefiting all our students. The workshop also strengthened our network of European educational partners.</p>
          <blockquote>"This experience has revolutionized my approach to teaching. I'm excited to share what I've learned with my colleagues and students." - Prof. Maria Ionescu</blockquote>`,
        coverImageUrl: 'https://images.unsplash.com/photo-1588075592446-265fd1e6e76f?w=800',
        imageUrls: ['https://images.unsplash.com/photo-1588075592446-265fd1e6e76f?w=800'],
        published: true,
        authorId: adminUser.id,
        projectId: erasmusProject.id,
      },
      {
        title: 'STEM Robotics Competition Success',
        slug: 'stem-robotics-competition',
        excerpt: 'Our robotics team won first place at the National STEM Innovation Challenge.',
        content: `<h2>Victory at National STEM Challenge</h2>
          <p>We are proud to announce that our school's robotics team has won first place at the prestigious National STEM Innovation Challenge held in Bucharest.</p>
          <h3>The Winning Project</h3>
          <p>The team developed an autonomous robot capable of sorting recyclable materials using AI and computer vision. This innovative solution addresses real-world environmental challenges.</p>
          <p>The competition featured teams from over 50 schools nationwide, making this achievement even more remarkable.</p>`,
        coverImageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800',
        imageUrls: ['https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800'],
        published: true,
        authorId: adminUser.id,
        projectId: stemProject.id,
      },
      {
        title: 'International Folk Dance Festival',
        slug: 'folk-dance-festival',
        excerpt: 'Students showcase traditional Romanian dances at international cultural festival in Spain.',
        content: `<h2>Romanian Culture Shines in Barcelona</h2>
          <p>Our folk dance ensemble brilliantly represented Romania at the International Youth Folk Festival in Barcelona, performing traditional dances from various regions of our country.</p>
          <h3>Cultural Ambassador</h3>
          <p>The students not only performed but also conducted workshops teaching other participants traditional Romanian dances, fostering cultural exchange and understanding.</p>
          <p>This event strengthened our cultural ties with partner schools across Europe and showcased the richness of Romanian heritage.</p>`,
        coverImageUrl: 'https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?w=800',
        imageUrls: ['https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?w=800'],
        published: true,
        authorId: adminUser.id,
        projectId: culturalProject.id,
      },
    ];

    for (const articleData of sampleArticles) {
      const article = articleRepository.create(articleData);
      await articleRepository.save(article);
      console.log(`Article created: ${articleData.title}`);
    }

    console.log('Seeding completed successfully');
    console.log('=================================');
    console.log('Admin credentials: admin / admin');
    console.log('Projects created: 3');
    console.log('Articles created: 5');
    console.log('=================================');
    
    await AppDataSource.destroy();
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  }
}

seed();