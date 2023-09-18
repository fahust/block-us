import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1695054092898 implements MigrationInterface {
    name = 'Migrations1695054092898'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "base_entity" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "isActive" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_03e6c58047b7a4b3f6de0bfa8d7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_entity" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "isActive" boolean NOT NULL DEFAULT true, "address" character varying NOT NULL, "name" character varying NOT NULL, "image" character varying NOT NULL, "password" character varying NOT NULL, "email" character varying NOT NULL, "lastName" character varying NOT NULL, CONSTRAINT "PK_b54f8ea623b17094db7667d8206" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "invest_entity" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "isActive" boolean NOT NULL DEFAULT true, "address" character varying NOT NULL, "value" integer NOT NULL, "projectId" integer, "ownerId" integer, CONSTRAINT "PK_e002e701bf182b9ee36bae2fa47" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "project_entity" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "isActive" boolean NOT NULL DEFAULT true, "title" character varying NOT NULL, "description" character varying NOT NULL, "image" character varying NOT NULL, "password" character varying NOT NULL, "ownerId" integer, CONSTRAINT "PK_7a75a94e01d0b50bff123db1b87" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "comment_entity" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "isActive" boolean NOT NULL DEFAULT true, "title" character varying NOT NULL, "content" character varying NOT NULL, "parentId" integer, "projectId" integer, CONSTRAINT "PK_5a439a16c76d63e046765cdb84f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "news_entity" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "isActive" boolean NOT NULL DEFAULT true, "title" character varying NOT NULL, "content" character varying NOT NULL, "image" character varying NOT NULL, "projectId" integer, CONSTRAINT "PK_53158994f55b6639eac4bf8db7e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "invest_entity" ADD CONSTRAINT "FK_4c3091679634019567627cbaba2" FOREIGN KEY ("projectId") REFERENCES "project_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "invest_entity" ADD CONSTRAINT "FK_01a6bc14608a32a2bd892ef5741" FOREIGN KEY ("ownerId") REFERENCES "user_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project_entity" ADD CONSTRAINT "FK_777c9041f749f6788765f6bb106" FOREIGN KEY ("ownerId") REFERENCES "user_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comment_entity" ADD CONSTRAINT "FK_94d540d1210eb47d8c42048365e" FOREIGN KEY ("parentId") REFERENCES "comment_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comment_entity" ADD CONSTRAINT "FK_32856bf8dd8ce27b22817ccf2ae" FOREIGN KEY ("projectId") REFERENCES "project_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "news_entity" ADD CONSTRAINT "FK_fb4c36c4f48e6528db2304d09b3" FOREIGN KEY ("projectId") REFERENCES "project_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "news_entity" DROP CONSTRAINT "FK_fb4c36c4f48e6528db2304d09b3"`);
        await queryRunner.query(`ALTER TABLE "comment_entity" DROP CONSTRAINT "FK_32856bf8dd8ce27b22817ccf2ae"`);
        await queryRunner.query(`ALTER TABLE "comment_entity" DROP CONSTRAINT "FK_94d540d1210eb47d8c42048365e"`);
        await queryRunner.query(`ALTER TABLE "project_entity" DROP CONSTRAINT "FK_777c9041f749f6788765f6bb106"`);
        await queryRunner.query(`ALTER TABLE "invest_entity" DROP CONSTRAINT "FK_01a6bc14608a32a2bd892ef5741"`);
        await queryRunner.query(`ALTER TABLE "invest_entity" DROP CONSTRAINT "FK_4c3091679634019567627cbaba2"`);
        await queryRunner.query(`DROP TABLE "news_entity"`);
        await queryRunner.query(`DROP TABLE "comment_entity"`);
        await queryRunner.query(`DROP TABLE "project_entity"`);
        await queryRunner.query(`DROP TABLE "invest_entity"`);
        await queryRunner.query(`DROP TABLE "user_entity"`);
        await queryRunner.query(`DROP TABLE "base_entity"`);
    }

}
