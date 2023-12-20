import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1695111840273 implements MigrationInterface {
    name = 'Migrations1695111840273'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "invest_entity" RENAME COLUMN "validate" TO "validation"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "invest_entity" RENAME COLUMN "validation" TO "validate"`);
    }

}
