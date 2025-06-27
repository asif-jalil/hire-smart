import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreatePreferredSkillsTable1750867474229 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'preferredSkills',
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
            name: 'candidatePreferenceId',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'skillId',
            type: 'int',
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
            columnNames: ['candidatePreferenceId'],
            referencedTableName: 'candidatePreference',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          {
            columnNames: ['skillId'],
            referencedTableName: 'skills',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
        ],
        indices: [
          {
            name: 'IDX_CANDIDATE_PREFERENCE_SKILL',
            columnNames: ['candidatePreferenceId', 'skillId'],
            isUnique: true,
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('preferredSkills', 'IDX_CANDIDATE_PREFERENCE_SKILL');
    await queryRunner.dropTable('preferredSkills');
  }
}
