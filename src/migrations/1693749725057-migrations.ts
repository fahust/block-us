import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1693749725057 implements MigrationInterface {
    name = 'Migrations1693749725057'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "market_entity" ("id" SERIAL NOT NULL, "price" integer NOT NULL DEFAULT '0', "itemId" integer, "ownerId" integer, CONSTRAINT "REL_9c5d860141054e599721af2576" UNIQUE ("itemId"), CONSTRAINT "PK_ca14bf9cf2b2ef658a5149580db" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "enemy_entity" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "key" character varying NOT NULL, "nature" character varying NOT NULL, "type" character varying NOT NULL, "movement" integer NOT NULL DEFAULT '0', "strong" integer NOT NULL DEFAULT '0', "magic" integer NOT NULL DEFAULT '0', "vitality" integer NOT NULL DEFAULT '0', "spirit" integer NOT NULL DEFAULT '0', "dexterity" integer NOT NULL DEFAULT '0', "lucky" integer NOT NULL DEFAULT '0', "armor" integer NOT NULL DEFAULT '0', "movementMax" integer NOT NULL DEFAULT '0', "strongMax" integer NOT NULL DEFAULT '0', "magicMax" integer NOT NULL DEFAULT '0', "vitalityMax" integer NOT NULL DEFAULT '0', "spiritMax" integer NOT NULL DEFAULT '0', "dexterityMax" integer NOT NULL DEFAULT '0', "luckyMax" integer NOT NULL DEFAULT '0', "armorMax" integer NOT NULL DEFAULT '0', "total" integer NOT NULL DEFAULT '0', "summon" integer NOT NULL DEFAULT '0', "questId" integer, CONSTRAINT "PK_e498a5c632c83b69af779ba27a7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "quest_entity" ("id" SERIAL NOT NULL, "index" integer NOT NULL, "name" character varying NOT NULL, "title" character varying NOT NULL, "password" character varying NOT NULL, "startTime" bigint NOT NULL DEFAULT '0', "treasures" integer NOT NULL DEFAULT '0', "isActive" boolean NOT NULL DEFAULT true, "ownerId" integer, CONSTRAINT "REL_c7d94d3190e55527c6bd207c65" UNIQUE ("ownerId"), CONSTRAINT "PK_49b8544ca25ed56833e9921adf7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "treasure_entity" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "count" integer NOT NULL DEFAULT '1', "userId" integer, CONSTRAINT "PK_7e167ab9bf75f8a56fb7830ebf5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_entity" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "password" character varying NOT NULL, "lastName" character varying NOT NULL, "gold" integer NOT NULL DEFAULT '0', "isActive" boolean NOT NULL DEFAULT true, "inventoryId" integer, "questId" integer, CONSTRAINT "REL_0ea7ddfa6893125f197ad9f6cc" UNIQUE ("inventoryId"), CONSTRAINT "REL_787e51e31948e821ebecc107c4" UNIQUE ("questId"), CONSTRAINT "PK_b54f8ea623b17094db7667d8206" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "inventory_entity" ("id" SERIAL NOT NULL, "userId" integer, CONSTRAINT "REL_b192e31f834085739064f0bba3" UNIQUE ("userId"), CONSTRAINT "PK_7c4147480da3e3ccea8c3168d5f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "item_entity" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "movement" integer NOT NULL DEFAULT '0', "strong" integer NOT NULL DEFAULT '0', "magic" integer NOT NULL DEFAULT '0', "vitality" integer NOT NULL DEFAULT '0', "spirit" integer NOT NULL DEFAULT '0', "dexterity" integer NOT NULL DEFAULT '0', "lucky" integer NOT NULL DEFAULT '0', "success" integer NOT NULL DEFAULT '0', "distance" integer NOT NULL DEFAULT '0', "damage" integer NOT NULL DEFAULT '0', "effect" character varying NOT NULL DEFAULT '', "armor" integer NOT NULL DEFAULT '0', "adequation" character varying NOT NULL DEFAULT '', "neutral" character varying NOT NULL DEFAULT '', "inadequation" character varying NOT NULL DEFAULT '', "emplacement" integer NOT NULL DEFAULT '0', "type" character varying NOT NULL DEFAULT 'summon', "key" character varying NOT NULL DEFAULT '', "isActive" boolean NOT NULL DEFAULT true, "summonerId" integer, "inventoryId" integer, "attachedId" integer, "ownerId" integer, "linkedId" integer, CONSTRAINT "PK_f8a329b22f66835df041692589d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "summoner_entity" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "experience" integer NOT NULL DEFAULT '1', "level" integer NOT NULL DEFAULT '1', "sexe" character varying NOT NULL DEFAULT 'female', "school" character varying NOT NULL DEFAULT 'Chronomancien', "movement" integer NOT NULL, "strong" integer NOT NULL, "magic" integer NOT NULL, "vitality" integer NOT NULL, "spirit" integer NOT NULL, "dexterity" integer NOT NULL, "lucky" integer NOT NULL, "armor" integer NOT NULL, "movementMax" integer NOT NULL, "strongMax" integer NOT NULL, "magicMax" integer NOT NULL, "vitalityMax" integer NOT NULL, "spiritMax" integer NOT NULL, "dexterityMax" integer NOT NULL, "luckyMax" integer NOT NULL, "armorMax" integer NOT NULL, "isActive" boolean NOT NULL DEFAULT true, "questLastTime" bigint NOT NULL DEFAULT '0', "questId" integer, "ownerId" integer, CONSTRAINT "PK_30964b16df28b3de9b3ff30d2ed" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."effect_entity_name_enum" AS ENUM('Gelé', 'Brûle', 'Hors phases', 'Trempé', 'Endormie', 'Confusion', 'Folie', 'Rapidité', 'Zombifié', 'Éclairé', 'Étourdis', 'Froid')`);
        await queryRunner.query(`CREATE TABLE "effect_entity" ("id" SERIAL NOT NULL, "name" "public"."effect_entity_name_enum", "summonerId" integer, "enemyId" integer, CONSTRAINT "PK_c5c4a8828cb7eb745d9b87bcfcc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "market_entity" ADD CONSTRAINT "FK_9c5d860141054e599721af25765" FOREIGN KEY ("itemId") REFERENCES "item_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "market_entity" ADD CONSTRAINT "FK_04aa0c245011a30ec1fa4a5f576" FOREIGN KEY ("ownerId") REFERENCES "user_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "enemy_entity" ADD CONSTRAINT "FK_6ae56a639ea0da1210045a72aec" FOREIGN KEY ("questId") REFERENCES "quest_entity"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "quest_entity" ADD CONSTRAINT "FK_c7d94d3190e55527c6bd207c651" FOREIGN KEY ("ownerId") REFERENCES "user_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "treasure_entity" ADD CONSTRAINT "FK_6b908e020ba26c152eb31157836" FOREIGN KEY ("userId") REFERENCES "user_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_entity" ADD CONSTRAINT "FK_0ea7ddfa6893125f197ad9f6cca" FOREIGN KEY ("inventoryId") REFERENCES "inventory_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_entity" ADD CONSTRAINT "FK_787e51e31948e821ebecc107c4d" FOREIGN KEY ("questId") REFERENCES "quest_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "inventory_entity" ADD CONSTRAINT "FK_b192e31f834085739064f0bba35" FOREIGN KEY ("userId") REFERENCES "user_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "item_entity" ADD CONSTRAINT "FK_2a0e986e95e141bd8df17ebb6f4" FOREIGN KEY ("summonerId") REFERENCES "summoner_entity"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "item_entity" ADD CONSTRAINT "FK_58a280a63a28f91e977713677f3" FOREIGN KEY ("inventoryId") REFERENCES "inventory_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "item_entity" ADD CONSTRAINT "FK_afd811160f4516eb46ef9af5d61" FOREIGN KEY ("attachedId") REFERENCES "item_entity"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "item_entity" ADD CONSTRAINT "FK_e43cb9ab3083576020f3e6bb956" FOREIGN KEY ("ownerId") REFERENCES "user_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "item_entity" ADD CONSTRAINT "FK_740448d47475d5068076c5a779e" FOREIGN KEY ("linkedId") REFERENCES "summoner_entity"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "summoner_entity" ADD CONSTRAINT "FK_1a778ce7bd285434a50138be1f0" FOREIGN KEY ("questId") REFERENCES "quest_entity"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "summoner_entity" ADD CONSTRAINT "FK_33233d6147c43e75ca6217edaa0" FOREIGN KEY ("ownerId") REFERENCES "user_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "effect_entity" ADD CONSTRAINT "FK_4387af7d657c82d11ecf0b601ff" FOREIGN KEY ("summonerId") REFERENCES "summoner_entity"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "effect_entity" ADD CONSTRAINT "FK_f1882bd4fd55f6499f8325ac141" FOREIGN KEY ("enemyId") REFERENCES "enemy_entity"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "effect_entity" DROP CONSTRAINT "FK_f1882bd4fd55f6499f8325ac141"`);
        await queryRunner.query(`ALTER TABLE "effect_entity" DROP CONSTRAINT "FK_4387af7d657c82d11ecf0b601ff"`);
        await queryRunner.query(`ALTER TABLE "summoner_entity" DROP CONSTRAINT "FK_33233d6147c43e75ca6217edaa0"`);
        await queryRunner.query(`ALTER TABLE "summoner_entity" DROP CONSTRAINT "FK_1a778ce7bd285434a50138be1f0"`);
        await queryRunner.query(`ALTER TABLE "item_entity" DROP CONSTRAINT "FK_740448d47475d5068076c5a779e"`);
        await queryRunner.query(`ALTER TABLE "item_entity" DROP CONSTRAINT "FK_e43cb9ab3083576020f3e6bb956"`);
        await queryRunner.query(`ALTER TABLE "item_entity" DROP CONSTRAINT "FK_afd811160f4516eb46ef9af5d61"`);
        await queryRunner.query(`ALTER TABLE "item_entity" DROP CONSTRAINT "FK_58a280a63a28f91e977713677f3"`);
        await queryRunner.query(`ALTER TABLE "item_entity" DROP CONSTRAINT "FK_2a0e986e95e141bd8df17ebb6f4"`);
        await queryRunner.query(`ALTER TABLE "inventory_entity" DROP CONSTRAINT "FK_b192e31f834085739064f0bba35"`);
        await queryRunner.query(`ALTER TABLE "user_entity" DROP CONSTRAINT "FK_787e51e31948e821ebecc107c4d"`);
        await queryRunner.query(`ALTER TABLE "user_entity" DROP CONSTRAINT "FK_0ea7ddfa6893125f197ad9f6cca"`);
        await queryRunner.query(`ALTER TABLE "treasure_entity" DROP CONSTRAINT "FK_6b908e020ba26c152eb31157836"`);
        await queryRunner.query(`ALTER TABLE "quest_entity" DROP CONSTRAINT "FK_c7d94d3190e55527c6bd207c651"`);
        await queryRunner.query(`ALTER TABLE "enemy_entity" DROP CONSTRAINT "FK_6ae56a639ea0da1210045a72aec"`);
        await queryRunner.query(`ALTER TABLE "market_entity" DROP CONSTRAINT "FK_04aa0c245011a30ec1fa4a5f576"`);
        await queryRunner.query(`ALTER TABLE "market_entity" DROP CONSTRAINT "FK_9c5d860141054e599721af25765"`);
        await queryRunner.query(`DROP TABLE "effect_entity"`);
        await queryRunner.query(`DROP TYPE "public"."effect_entity_name_enum"`);
        await queryRunner.query(`DROP TABLE "summoner_entity"`);
        await queryRunner.query(`DROP TABLE "item_entity"`);
        await queryRunner.query(`DROP TABLE "inventory_entity"`);
        await queryRunner.query(`DROP TABLE "user_entity"`);
        await queryRunner.query(`DROP TABLE "treasure_entity"`);
        await queryRunner.query(`DROP TABLE "quest_entity"`);
        await queryRunner.query(`DROP TABLE "enemy_entity"`);
        await queryRunner.query(`DROP TABLE "market_entity"`);
    }

}
