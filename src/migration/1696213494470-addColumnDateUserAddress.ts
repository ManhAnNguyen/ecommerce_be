import { MigrationInterface, QueryRunner } from "typeorm";

export class AddColumnDateUserAddress1696213494470 implements MigrationInterface {
    name = 'AddColumnDateUserAddress1696213494470'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`userAddress\` CHANGE \`isDefault\` \`isDefault\` tinyint NULL DEFAULT 0`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`userAddress\` CHANGE \`isDefault\` \`isDefault\` tinyint NOT NULL`);
    }

}
