import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1695395735124 implements MigrationInterface {
    name = 'Migrations1695395735124'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "vote_entity" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "isActive" boolean NOT NULL DEFAULT true, "hash" character varying NOT NULL, "value" integer NOT NULL, "validation" boolean NOT NULL DEFAULT false, "chainId" integer NOT NULL, "projectId" integer, "ownerId" integer, CONSTRAINT "UQ_5ef97839f82ce6f0710d32c5602" UNIQUE ("hash"), CONSTRAINT "PK_797f176dedf393489c73b19f9a6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "project_entity" ADD "pausable" boolean NOT NULL`);
        await queryRunner.query(`ALTER TABLE "project_entity" ADD "rulesModifiable" boolean NOT NULL`);
        await queryRunner.query(`ALTER TABLE "project_entity" ADD "voteToWithdraw" boolean NOT NULL`);
        await queryRunner.query(`ALTER TABLE "project_entity" ADD "dayToWithdraw" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "project_entity" ADD "startFundraising" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "project_entity" ADD "endFundraising" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "project_entity" ADD "maxSupply" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "vote_entity" ADD CONSTRAINT "FK_94c3f6c3db1603e9f3c35a82b0c" FOREIGN KEY ("projectId") REFERENCES "project_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "vote_entity" ADD CONSTRAINT "FK_a2e66ef1fc1b23746724b5d7113" FOREIGN KEY ("ownerId") REFERENCES "user_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "vote_entity" DROP CONSTRAINT "FK_a2e66ef1fc1b23746724b5d7113"`);
        await queryRunner.query(`ALTER TABLE "vote_entity" DROP CONSTRAINT "FK_94c3f6c3db1603e9f3c35a82b0c"`);
        await queryRunner.query(`ALTER TABLE "project_entity" DROP COLUMN "maxSupply"`);
        await queryRunner.query(`ALTER TABLE "project_entity" DROP COLUMN "endFundraising"`);
        await queryRunner.query(`ALTER TABLE "project_entity" DROP COLUMN "startFundraising"`);
        await queryRunner.query(`ALTER TABLE "project_entity" DROP COLUMN "dayToWithdraw"`);
        await queryRunner.query(`ALTER TABLE "project_entity" DROP COLUMN "voteToWithdraw"`);
        await queryRunner.query(`ALTER TABLE "project_entity" DROP COLUMN "rulesModifiable"`);
        await queryRunner.query(`ALTER TABLE "project_entity" DROP COLUMN "pausable"`);
        await queryRunner.query(`DROP TABLE "vote_entity"`);
    }

}
