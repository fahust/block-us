import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1696176800930 implements MigrationInterface {
    name = 'Migrations1696176800930'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "notification_entity" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "content" character varying NOT NULL, "read" boolean NOT NULL DEFAULT false, "projectId" integer, "ownerId" integer, CONSTRAINT "PK_112676de71a3a708b914daed289" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "notification_entity" ADD CONSTRAINT "FK_6aa3f24e9dcbf5752071ca76ff4" FOREIGN KEY ("projectId") REFERENCES "project_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "notification_entity" ADD CONSTRAINT "FK_0b703659de01b5702d2ca028cb6" FOREIGN KEY ("ownerId") REFERENCES "user_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notification_entity" DROP CONSTRAINT "FK_0b703659de01b5702d2ca028cb6"`);
        await queryRunner.query(`ALTER TABLE "notification_entity" DROP CONSTRAINT "FK_6aa3f24e9dcbf5752071ca76ff4"`);
        await queryRunner.query(`DROP TABLE "notification_entity"`);
    }

}
