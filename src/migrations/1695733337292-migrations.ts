import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1695733337292 implements MigrationInterface {
    name = 'Migrations1695733337292'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "news_entity" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "isActive" boolean NOT NULL DEFAULT true, "title" character varying NOT NULL, "content" character varying NOT NULL, "image" character varying, "public" boolean NOT NULL DEFAULT true, "projectId" integer, CONSTRAINT "PK_53158994f55b6639eac4bf8db7e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_entity" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "isActive" boolean NOT NULL DEFAULT true, "walletAddress" character varying NOT NULL, "name" character varying, "image" character varying, "password" character varying, "email" character varying, "lastName" character varying, CONSTRAINT "UQ_8a3578d5e943d1caeb6cf2b1d90" UNIQUE ("walletAddress"), CONSTRAINT "UQ_3fe76ecf0f0ef036ff981e9f67d" UNIQUE ("name"), CONSTRAINT "UQ_415c35b9b3b6fe45a3b065030f5" UNIQUE ("email"), CONSTRAINT "PK_b54f8ea623b17094db7667d8206" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "invest_entity" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "isActive" boolean NOT NULL DEFAULT true, "hash" character varying NOT NULL, "value" integer NOT NULL, "validation" boolean NOT NULL DEFAULT false, "chainId" integer NOT NULL, "projectId" integer, "ownerId" integer, CONSTRAINT "invest_hash" UNIQUE ("hash", "chainId"), CONSTRAINT "PK_e002e701bf182b9ee36bae2fa47" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "vote_entity" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "isActive" boolean NOT NULL DEFAULT true, "hash" character varying NOT NULL, "value" integer NOT NULL, "validation" boolean NOT NULL DEFAULT false, "chainId" integer NOT NULL, "projectId" integer, "ownerId" integer, CONSTRAINT "vote_hash_index" UNIQUE ("hash", "chainId"), CONSTRAINT "PK_797f176dedf393489c73b19f9a6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "project_entity" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "isActive" boolean NOT NULL DEFAULT true, "walletAddressToken" character varying NOT NULL, "walletAddressProxy" character varying NOT NULL, "hashToken" character varying NOT NULL, "hashProxy" character varying NOT NULL, "chainId" integer NOT NULL, "title" character varying NOT NULL, "description" character varying NOT NULL, "mainCategory" character varying NOT NULL, "subCategory" character varying NOT NULL, "image" character varying, "deployed" boolean NOT NULL DEFAULT false, "pausable" boolean NOT NULL, "rulesModifiable" boolean NOT NULL, "voteToWithdraw" boolean NOT NULL, "dayToWithdraw" integer NOT NULL, "startFundraising" TIMESTAMP NOT NULL, "endFundraising" TIMESTAMP NOT NULL, "maxSupply" integer NOT NULL, "ownerId" integer, CONSTRAINT "project_address_hash_index" UNIQUE ("walletAddressToken", "walletAddressProxy", "hashToken", "hashProxy", "chainId"), CONSTRAINT "PK_7a75a94e01d0b50bff123db1b87" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "comment_entity" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "isActive" boolean NOT NULL DEFAULT true, "title" character varying NOT NULL, "content" character varying NOT NULL, "parentId" integer, "projectId" integer, "ownerId" integer, CONSTRAINT "PK_5a439a16c76d63e046765cdb84f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "news_entity_likes_user_entity" ("newsEntityId" integer NOT NULL, "userEntityId" integer NOT NULL, CONSTRAINT "PK_ffde0ed774974095a444b571394" PRIMARY KEY ("newsEntityId", "userEntityId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_75311c9729278f90293104f2ff" ON "news_entity_likes_user_entity" ("newsEntityId") `);
        await queryRunner.query(`CREATE INDEX "IDX_e085a8dcadab722c6f9e813362" ON "news_entity_likes_user_entity" ("userEntityId") `);
        await queryRunner.query(`CREATE TABLE "project_entity_likes_user_entity" ("projectEntityId" integer NOT NULL, "userEntityId" integer NOT NULL, CONSTRAINT "PK_b089ceb307d3091f89e79e4b0de" PRIMARY KEY ("projectEntityId", "userEntityId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_3939c2df228234c6465824de0d" ON "project_entity_likes_user_entity" ("projectEntityId") `);
        await queryRunner.query(`CREATE INDEX "IDX_3d17a79422e26d0a522a371dd4" ON "project_entity_likes_user_entity" ("userEntityId") `);
        await queryRunner.query(`CREATE TABLE "comment_entity_likes_user_entity" ("commentEntityId" integer NOT NULL, "userEntityId" integer NOT NULL, CONSTRAINT "PK_907f7b4183448a8a69f9a12bcb7" PRIMARY KEY ("commentEntityId", "userEntityId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_5c572bf405d92ef0ee0c365552" ON "comment_entity_likes_user_entity" ("commentEntityId") `);
        await queryRunner.query(`CREATE INDEX "IDX_fb33dfcc24d50a22ec9a4a4711" ON "comment_entity_likes_user_entity" ("userEntityId") `);
        await queryRunner.query(`ALTER TABLE "news_entity" ADD CONSTRAINT "FK_fb4c36c4f48e6528db2304d09b3" FOREIGN KEY ("projectId") REFERENCES "project_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "invest_entity" ADD CONSTRAINT "FK_4c3091679634019567627cbaba2" FOREIGN KEY ("projectId") REFERENCES "project_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "invest_entity" ADD CONSTRAINT "FK_01a6bc14608a32a2bd892ef5741" FOREIGN KEY ("ownerId") REFERENCES "user_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "vote_entity" ADD CONSTRAINT "FK_94c3f6c3db1603e9f3c35a82b0c" FOREIGN KEY ("projectId") REFERENCES "project_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "vote_entity" ADD CONSTRAINT "FK_a2e66ef1fc1b23746724b5d7113" FOREIGN KEY ("ownerId") REFERENCES "user_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project_entity" ADD CONSTRAINT "FK_777c9041f749f6788765f6bb106" FOREIGN KEY ("ownerId") REFERENCES "user_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comment_entity" ADD CONSTRAINT "FK_94d540d1210eb47d8c42048365e" FOREIGN KEY ("parentId") REFERENCES "comment_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comment_entity" ADD CONSTRAINT "FK_32856bf8dd8ce27b22817ccf2ae" FOREIGN KEY ("projectId") REFERENCES "project_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comment_entity" ADD CONSTRAINT "FK_0987f23de36c79d17e09880aa8f" FOREIGN KEY ("ownerId") REFERENCES "user_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "news_entity_likes_user_entity" ADD CONSTRAINT "FK_75311c9729278f90293104f2ff5" FOREIGN KEY ("newsEntityId") REFERENCES "news_entity"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "news_entity_likes_user_entity" ADD CONSTRAINT "FK_e085a8dcadab722c6f9e8133620" FOREIGN KEY ("userEntityId") REFERENCES "user_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project_entity_likes_user_entity" ADD CONSTRAINT "FK_3939c2df228234c6465824de0d4" FOREIGN KEY ("projectEntityId") REFERENCES "project_entity"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "project_entity_likes_user_entity" ADD CONSTRAINT "FK_3d17a79422e26d0a522a371dd4a" FOREIGN KEY ("userEntityId") REFERENCES "user_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comment_entity_likes_user_entity" ADD CONSTRAINT "FK_5c572bf405d92ef0ee0c3655523" FOREIGN KEY ("commentEntityId") REFERENCES "comment_entity"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "comment_entity_likes_user_entity" ADD CONSTRAINT "FK_fb33dfcc24d50a22ec9a4a47116" FOREIGN KEY ("userEntityId") REFERENCES "user_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comment_entity_likes_user_entity" DROP CONSTRAINT "FK_fb33dfcc24d50a22ec9a4a47116"`);
        await queryRunner.query(`ALTER TABLE "comment_entity_likes_user_entity" DROP CONSTRAINT "FK_5c572bf405d92ef0ee0c3655523"`);
        await queryRunner.query(`ALTER TABLE "project_entity_likes_user_entity" DROP CONSTRAINT "FK_3d17a79422e26d0a522a371dd4a"`);
        await queryRunner.query(`ALTER TABLE "project_entity_likes_user_entity" DROP CONSTRAINT "FK_3939c2df228234c6465824de0d4"`);
        await queryRunner.query(`ALTER TABLE "news_entity_likes_user_entity" DROP CONSTRAINT "FK_e085a8dcadab722c6f9e8133620"`);
        await queryRunner.query(`ALTER TABLE "news_entity_likes_user_entity" DROP CONSTRAINT "FK_75311c9729278f90293104f2ff5"`);
        await queryRunner.query(`ALTER TABLE "comment_entity" DROP CONSTRAINT "FK_0987f23de36c79d17e09880aa8f"`);
        await queryRunner.query(`ALTER TABLE "comment_entity" DROP CONSTRAINT "FK_32856bf8dd8ce27b22817ccf2ae"`);
        await queryRunner.query(`ALTER TABLE "comment_entity" DROP CONSTRAINT "FK_94d540d1210eb47d8c42048365e"`);
        await queryRunner.query(`ALTER TABLE "project_entity" DROP CONSTRAINT "FK_777c9041f749f6788765f6bb106"`);
        await queryRunner.query(`ALTER TABLE "vote_entity" DROP CONSTRAINT "FK_a2e66ef1fc1b23746724b5d7113"`);
        await queryRunner.query(`ALTER TABLE "vote_entity" DROP CONSTRAINT "FK_94c3f6c3db1603e9f3c35a82b0c"`);
        await queryRunner.query(`ALTER TABLE "invest_entity" DROP CONSTRAINT "FK_01a6bc14608a32a2bd892ef5741"`);
        await queryRunner.query(`ALTER TABLE "invest_entity" DROP CONSTRAINT "FK_4c3091679634019567627cbaba2"`);
        await queryRunner.query(`ALTER TABLE "news_entity" DROP CONSTRAINT "FK_fb4c36c4f48e6528db2304d09b3"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_fb33dfcc24d50a22ec9a4a4711"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_5c572bf405d92ef0ee0c365552"`);
        await queryRunner.query(`DROP TABLE "comment_entity_likes_user_entity"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_3d17a79422e26d0a522a371dd4"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_3939c2df228234c6465824de0d"`);
        await queryRunner.query(`DROP TABLE "project_entity_likes_user_entity"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e085a8dcadab722c6f9e813362"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_75311c9729278f90293104f2ff"`);
        await queryRunner.query(`DROP TABLE "news_entity_likes_user_entity"`);
        await queryRunner.query(`DROP TABLE "comment_entity"`);
        await queryRunner.query(`DROP TABLE "project_entity"`);
        await queryRunner.query(`DROP TABLE "vote_entity"`);
        await queryRunner.query(`DROP TABLE "invest_entity"`);
        await queryRunner.query(`DROP TABLE "user_entity"`);
        await queryRunner.query(`DROP TABLE "news_entity"`);
    }

}
