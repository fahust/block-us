import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1695114815091 implements MigrationInterface {
    name = 'Migrations1695114815091'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project_entity" ADD "mainCategory" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "project_entity" ADD "subCategory" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project_entity" DROP COLUMN "subCategory"`);
        await queryRunner.query(`ALTER TABLE "project_entity" DROP COLUMN "mainCategory"`);
    }

}
