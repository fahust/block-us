import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1695238207713 implements MigrationInterface {
    name = 'Migrations1695238207713'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project_entity" DROP COLUMN "password"`);
        await queryRunner.query(`ALTER TABLE "project_entity" DROP CONSTRAINT "UQ_54c050a5b215a3c7a148f31c816"`);
        await queryRunner.query(`ALTER TABLE "project_entity" DROP COLUMN "walletAddress"`);
        await queryRunner.query(`ALTER TABLE "project_entity" DROP CONSTRAINT "UQ_73875f345bb9b9cf191ae99f70b"`);
        await queryRunner.query(`ALTER TABLE "project_entity" DROP COLUMN "txHash"`);
        await queryRunner.query(`ALTER TABLE "project_entity" ADD "walletAddressToken" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "project_entity" ADD CONSTRAINT "UQ_eab08ba7acf82bc19f00e4f9e25" UNIQUE ("walletAddressToken")`);
        await queryRunner.query(`ALTER TABLE "project_entity" ADD "walletAddressProxy" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "project_entity" ADD CONSTRAINT "UQ_5a5585828a4c04b9057aace84da" UNIQUE ("walletAddressProxy")`);
        await queryRunner.query(`ALTER TABLE "project_entity" ADD "hashToken" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "project_entity" ADD CONSTRAINT "UQ_8f543e3295cbaf53484d10f7ab8" UNIQUE ("hashToken")`);
        await queryRunner.query(`ALTER TABLE "project_entity" ADD "hashProxy" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "project_entity" ADD CONSTRAINT "UQ_0ca5d40ed8f05bb75156c5b1300" UNIQUE ("hashProxy")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project_entity" DROP CONSTRAINT "UQ_0ca5d40ed8f05bb75156c5b1300"`);
        await queryRunner.query(`ALTER TABLE "project_entity" DROP COLUMN "hashProxy"`);
        await queryRunner.query(`ALTER TABLE "project_entity" DROP CONSTRAINT "UQ_8f543e3295cbaf53484d10f7ab8"`);
        await queryRunner.query(`ALTER TABLE "project_entity" DROP COLUMN "hashToken"`);
        await queryRunner.query(`ALTER TABLE "project_entity" DROP CONSTRAINT "UQ_5a5585828a4c04b9057aace84da"`);
        await queryRunner.query(`ALTER TABLE "project_entity" DROP COLUMN "walletAddressProxy"`);
        await queryRunner.query(`ALTER TABLE "project_entity" DROP CONSTRAINT "UQ_eab08ba7acf82bc19f00e4f9e25"`);
        await queryRunner.query(`ALTER TABLE "project_entity" DROP COLUMN "walletAddressToken"`);
        await queryRunner.query(`ALTER TABLE "project_entity" ADD "txHash" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "project_entity" ADD CONSTRAINT "UQ_73875f345bb9b9cf191ae99f70b" UNIQUE ("txHash")`);
        await queryRunner.query(`ALTER TABLE "project_entity" ADD "walletAddress" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "project_entity" ADD CONSTRAINT "UQ_54c050a5b215a3c7a148f31c816" UNIQUE ("walletAddress")`);
        await queryRunner.query(`ALTER TABLE "project_entity" ADD "password" character varying NOT NULL`);
    }

}
