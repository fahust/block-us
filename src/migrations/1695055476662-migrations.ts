import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1695055476662 implements MigrationInterface {
    name = 'Migrations1695055476662'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_entity" ADD CONSTRAINT "UQ_b2a7d4be0ea4c941d595d6752dc" UNIQUE ("address")`);
        await queryRunner.query(`ALTER TABLE "user_entity" ADD CONSTRAINT "UQ_3fe76ecf0f0ef036ff981e9f67d" UNIQUE ("name")`);
        await queryRunner.query(`ALTER TABLE "user_entity" ADD CONSTRAINT "UQ_415c35b9b3b6fe45a3b065030f5" UNIQUE ("email")`);
        await queryRunner.query(`ALTER TABLE "invest_entity" ADD CONSTRAINT "UQ_4a7e56b353d8463c444518c0b8a" UNIQUE ("address")`);
        await queryRunner.query(`ALTER TABLE "project_entity" ADD CONSTRAINT "UQ_d0bb39c7fc0bd40f20a55620474" UNIQUE ("title")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project_entity" DROP CONSTRAINT "UQ_d0bb39c7fc0bd40f20a55620474"`);
        await queryRunner.query(`ALTER TABLE "invest_entity" DROP CONSTRAINT "UQ_4a7e56b353d8463c444518c0b8a"`);
        await queryRunner.query(`ALTER TABLE "user_entity" DROP CONSTRAINT "UQ_415c35b9b3b6fe45a3b065030f5"`);
        await queryRunner.query(`ALTER TABLE "user_entity" DROP CONSTRAINT "UQ_3fe76ecf0f0ef036ff981e9f67d"`);
        await queryRunner.query(`ALTER TABLE "user_entity" DROP CONSTRAINT "UQ_b2a7d4be0ea4c941d595d6752dc"`);
    }

}
