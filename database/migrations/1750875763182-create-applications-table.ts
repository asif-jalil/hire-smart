import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateApplicationsTable1750875763182 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'applications',
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
            name: 'jobId',
            type: 'int',
            unsigned: true,
          },
          {
            name: 'candidateId',
            type: 'int',
            unsigned: true,
          },
          {
            name: 'coverLetter',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'resumeUrl',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'status',
            type: 'varchar',
            length: '20',
            isNullable: false,
          },
          {
            name: 'lastReviewedBy',
            type: 'int',
            isNullable: true,
            unsigned: true,
          },
          {
            name: 'lastReviewedAt',
            type: 'timestamp',
            isNullable: true,
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
            columnNames: ['jobId'],
            referencedTableName: 'jobs',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          {
            columnNames: ['candidateId'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          {
            columnNames: ['lastReviewedBy'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE',
          },
        ],
        indices: [
          {
            name: 'IDX_JOB_CANDIDATE',
            columnNames: ['jobId', 'candidateId'],
            isUnique: true,
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('applications', 'IDX_JOB_CANDIDATE');
    await queryRunner.dropTable('applications');
  }
}
