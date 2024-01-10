import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1695671807035 implements MigrationInterface {
    name = 'Migrations1695671807035'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "base_entity" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "isActive" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_03e6c58047b7a4b3f6de0bfa8d7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "invest_entity" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "isActive" boolean NOT NULL DEFAULT true, "hash" character varying NOT NULL, "value" integer NOT NULL, "validation" boolean NOT NULL DEFAULT false, "chainId" integer NOT NULL, "projectId" integer, "ownerId" integer, CONSTRAINT "UQ_1ff6c3f7097b700fdcd959ff05a" UNIQUE ("hash"), CONSTRAINT "PK_e002e701bf182b9ee36bae2fa47" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_entity" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "isActive" boolean NOT NULL DEFAULT true, "walletAddress" character varying NOT NULL, "name" character varying, "image" character varying, "password" character varying, "email" character varying, "lastName" character varying, CONSTRAINT "UQ_8a3578d5e943d1caeb6cf2b1d90" UNIQUE ("walletAddress"), CONSTRAINT "UQ_3fe76ecf0f0ef036ff981e9f67d" UNIQUE ("name"), CONSTRAINT "UQ_415c35b9b3b6fe45a3b065030f5" UNIQUE ("email"), CONSTRAINT "PK_b54f8ea623b17094db7667d8206" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "comment_entity" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "isActive" boolean NOT NULL DEFAULT true, "title" character varying NOT NULL, "content" character varying NOT NULL, "parentId" integer, "projectId" integer, "ownerId" integer, CONSTRAINT "PK_5a439a16c76d63e046765cdb84f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "vote_entity" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "isActive" boolean NOT NULL DEFAULT true, "hash" character varying NOT NULL, "value" integer NOT NULL, "validation" boolean NOT NULL DEFAULT false, "chainId" integer NOT NULL, "projectId" integer, "ownerId" integer, CONSTRAINT "UQ_5ef97839f82ce6f0710d32c5602" UNIQUE ("hash"), CONSTRAINT "PK_797f176dedf393489c73b19f9a6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "project_entity" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "isActive" boolean NOT NULL DEFAULT true, "walletAddressToken" character varying NOT NULL, "walletAddressProxy" character varying NOT NULL, "hashToken" character varying NOT NULL, "hashProxy" character varying NOT NULL, "chainId" integer NOT NULL, "title" character varying NOT NULL, "description" character varying NOT NULL, "mainCategory" character varying NOT NULL, "subCategory" character varying NOT NULL, "image" character varying, "deployed" boolean NOT NULL DEFAULT false, "pausable" boolean NOT NULL, "rulesModifiable" boolean NOT NULL, "voteToWithdraw" boolean NOT NULL, "dayToWithdraw" integer NOT NULL, "startFundraising" TIMESTAMP NOT NULL, "endFundraising" TIMESTAMP NOT NULL, "maxSupply" integer NOT NULL, "ownerId" integer, CONSTRAINT "UQ_eab08ba7acf82bc19f00e4f9e25" UNIQUE ("walletAddressToken"), CONSTRAINT "UQ_5a5585828a4c04b9057aace84da" UNIQUE ("walletAddressProxy"), CONSTRAINT "UQ_8f543e3295cbaf53484d10f7ab8" UNIQUE ("hashToken"), CONSTRAINT "UQ_0ca5d40ed8f05bb75156c5b1300" UNIQUE ("hashProxy"), CONSTRAINT "PK_7a75a94e01d0b50bff123db1b87" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "news_entity" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "isActive" boolean NOT NULL DEFAULT true, "title" character varying NOT NULL, "content" character varying NOT NULL, "image" character varying, "public" boolean NOT NULL DEFAULT true, "projectId" integer, CONSTRAINT "PK_53158994f55b6639eac4bf8db7e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "invest_entity" ADD CONSTRAINT "FK_4c3091679634019567627cbaba2" FOREIGN KEY ("projectId") REFERENCES "project_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "invest_entity" ADD CONSTRAINT "FK_01a6bc14608a32a2bd892ef5741" FOREIGN KEY ("ownerId") REFERENCES "user_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comment_entity" ADD CONSTRAINT "FK_94d540d1210eb47d8c42048365e" FOREIGN KEY ("parentId") REFERENCES "comment_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comment_entity" ADD CONSTRAINT "FK_32856bf8dd8ce27b22817ccf2ae" FOREIGN KEY ("projectId") REFERENCES "project_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comment_entity" ADD CONSTRAINT "FK_0987f23de36c79d17e09880aa8f" FOREIGN KEY ("ownerId") REFERENCES "user_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "vote_entity" ADD CONSTRAINT "FK_94c3f6c3db1603e9f3c35a82b0c" FOREIGN KEY ("projectId") REFERENCES "project_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "vote_entity" ADD CONSTRAINT "FK_a2e66ef1fc1b23746724b5d7113" FOREIGN KEY ("ownerId") REFERENCES "user_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project_entity" ADD CONSTRAINT "FK_777c9041f749f6788765f6bb106" FOREIGN KEY ("ownerId") REFERENCES "user_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "news_entity" ADD CONSTRAINT "FK_fb4c36c4f48e6528db2304d09b3" FOREIGN KEY ("projectId") REFERENCES "project_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "news_entity" DROP CONSTRAINT "FK_fb4c36c4f48e6528db2304d09b3"`);
        await queryRunner.query(`ALTER TABLE "project_entity" DROP CONSTRAINT "FK_777c9041f749f6788765f6bb106"`);
        await queryRunner.query(`ALTER TABLE "vote_entity" DROP CONSTRAINT "FK_a2e66ef1fc1b23746724b5d7113"`);
        await queryRunner.query(`ALTER TABLE "vote_entity" DROP CONSTRAINT "FK_94c3f6c3db1603e9f3c35a82b0c"`);
        await queryRunner.query(`ALTER TABLE "comment_entity" DROP CONSTRAINT "FK_0987f23de36c79d17e09880aa8f"`);
        await queryRunner.query(`ALTER TABLE "comment_entity" DROP CONSTRAINT "FK_32856bf8dd8ce27b22817ccf2ae"`);
        await queryRunner.query(`ALTER TABLE "comment_entity" DROP CONSTRAINT "FK_94d540d1210eb47d8c42048365e"`);
        await queryRunner.query(`ALTER TABLE "invest_entity" DROP CONSTRAINT "FK_01a6bc14608a32a2bd892ef5741"`);
        await queryRunner.query(`ALTER TABLE "invest_entity" DROP CONSTRAINT "FK_4c3091679634019567627cbaba2"`);
        await queryRunner.query(`DROP TABLE "news_entity"`);
        await queryRunner.query(`DROP TABLE "project_entity"`);
        await queryRunner.query(`DROP TABLE "vote_entity"`);
        await queryRunner.query(`DROP TABLE "comment_entity"`);
        await queryRunner.query(`DROP TABLE "user_entity"`);
        await queryRunner.query(`DROP TABLE "invest_entity"`);
        await queryRunner.query(`DROP TABLE "base_entity"`);
    }

}
