import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1695817667429 implements MigrationInterface {
    name = 'Migrations1695817667429'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project_entity" ADD "shortDescription" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project_entity" DROP COLUMN "shortDescription"`);
    }

}
