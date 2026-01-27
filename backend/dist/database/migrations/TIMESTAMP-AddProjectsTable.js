"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddProjectsTable1234567890123 = void 0;
const typeorm_1 = require("typeorm");
class AddProjectsTable1234567890123 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
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
        }), true);
        await queryRunner.query(`
      ALTER TABLE articles ADD COLUMN "projectId" uuid
    `);
        await queryRunner.createForeignKey('articles', new typeorm_1.TableForeignKey({
            columnNames: ['projectId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'projects',
            onDelete: 'CASCADE',
        }));
        await queryRunner.query(`
      INSERT INTO projects (id, name) 
      VALUES ('00000000-0000-0000-0000-000000000000', 'Default Project')
      ON CONFLICT DO NOTHING
    `);
        await queryRunner.query(`
      UPDATE articles 
      SET "projectId" = '00000000-0000-0000-0000-000000000000' 
      WHERE "projectId" IS NULL
    `);
        await queryRunner.query(`
      ALTER TABLE articles ALTER COLUMN "projectId" SET NOT NULL
    `);
    }
    async down(queryRunner) {
        const table = await queryRunner.getTable('articles');
        const foreignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('projectId') !== -1);
        if (foreignKey) {
            await queryRunner.dropForeignKey('articles', foreignKey);
        }
        await queryRunner.dropColumn('articles', 'projectId');
        await queryRunner.dropTable('projects');
    }
}
exports.AddProjectsTable1234567890123 = AddProjectsTable1234567890123;
//# sourceMappingURL=TIMESTAMP-AddProjectsTable.js.map