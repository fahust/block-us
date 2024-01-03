import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1695384116931 implements MigrationInterface {
    name = 'Migrations1695384116931'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project_entity" ADD "chainId" integer NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project_entity" DROP COLUMN "chainId"`);
    }

}
