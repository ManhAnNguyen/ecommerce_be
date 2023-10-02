import { MigrationInterface, QueryRunner } from "typeorm";

export class AddColumnDateUserAddress1696213374094 implements MigrationInterface {
    name = 'AddColumnDateUserAddress1696213374094'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`userAddress\` ADD \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`userAddress\` ADD \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`userAddress\` DROP COLUMN \`updated_at\``);
        await queryRunner.query(`ALTER TABLE \`userAddress\` DROP COLUMN \`created_at\``);
    }

}
