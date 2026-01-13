import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class AddProjectsTable1234567890123 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create projects table
    await queryRunner.createTable(
      new Table({
        name: 'projects',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'name',
            type: 'varchar',
            isUnique: true,
          },
        ],
      }),
      true,
    );

    // Add projectId column to articles table
    await queryRunner.query(`
      ALTER TABLE articles ADD COLUMN "projectId" uuid
    `);

    // Add foreign key constraint
    await queryRunner.createForeignKey(
      'articles',
      new TableForeignKey({
        columnNames: ['projectId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'projects',
        onDelete: 'CASCADE',
      }),
    );

    // Make projectId NOT NULL after setting default values
    // First, create a default project if needed
    await queryRunner.query(`
      INSERT INTO projects (id, name) 
      VALUES ('00000000-0000-0000-0000-000000000000', 'Default Project')
      ON CONFLICT DO NOTHING
    `);

    // Update existing articles to have a projectId
    await queryRunner.query(`
      UPDATE articles 
      SET "projectId" = '00000000-0000-0000-0000-000000000000' 
      WHERE "projectId" IS NULL
    `);

    // Now make it NOT NULL
    await queryRunner.query(`
      ALTER TABLE articles ALTER COLUMN "projectId" SET NOT NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove foreign key
    const table = await queryRunner.getTable('articles');
    const foreignKey = table.foreignKeys.find(
      fk => fk.columnNames.indexOf('projectId') !== -1,
    );
    if (foreignKey) {
      await queryRunner.dropForeignKey('articles', foreignKey);
    }

    // Remove projectId column
    await queryRunner.dropColumn('articles', 'projectId');

    // Drop projects table
    await queryRunner.dropTable('projects');
  }
}