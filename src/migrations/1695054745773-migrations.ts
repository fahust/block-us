import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1695054745773 implements MigrationInterface {
    name = 'Migrations1695054745773'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_entity" ALTER COLUMN "image" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "project_entity" ALTER COLUMN "image" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "news_entity" ALTER COLUMN "image" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "news_entity" ALTER COLUMN "image" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "project_entity" ALTER COLUMN "image" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user_entity" ALTER COLUMN "image" SET NOT NULL`);
    }

}
