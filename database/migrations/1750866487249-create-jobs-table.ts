import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateJobsTable1750866487249 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'jobs',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
            unsigned: true,
          },
          {
            name: 'postedBy',
            type: 'int',
            isNullable: false,
            unsigned: true,
          },
          {
            name: 'title',
            type: 'text',
            isNullable: false,
          },
          {
            name: 'description',
            type: 'text',
            isNullable: false,
          },
          {
            name: 'location',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'minSalary',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'maxSalary',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'status',
            type: 'varchar',
            length: '20',
            isNullable: false,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
        foreignKeys: [
          {
            columnNames: ['postedBy'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
        ],
        indices: [
          {
            name: 'IDX_JOBS_STATUS_CREATEDAT',
            columnNames: ['status', 'createdAt'],
          },
          {
            name: 'IDX_JOBS_MIN_MAX_SALARY',
            columnNames: ['minSalary', 'maxSalary'],
          },
        ],
      }),
    );

    await queryRunner.query(`
      ALTER TABLE jobs
      ADD COLUMN fts tsvector GENERATED ALWAYS AS (
        to_tsvector('english', 
          coalesce(title, '') || ' ' || 
          coalesce(description, '') || ' ' || 
          coalesce(location, '')
        )
      ) STORED
    `);

    await queryRunner.query(`
      CREATE INDEX idx_fts_jobs ON jobs USING GIN (fts)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS idx_fts_jobs`);
    await queryRunner.query(`ALTER TABLE jobs DROP COLUMN IF EXISTS fts`);
    await queryRunner.dropTable('jobs');
  }
}
