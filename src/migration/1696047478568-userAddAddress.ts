import { MigrationInterface, QueryRunner } from "typeorm";

export class UserAddAddress1696047478568 implements MigrationInterface {
    name = 'UserAddAddress1696047478568'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`refreshTokenFake\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`refreshTokenFake\``);
    }

}
