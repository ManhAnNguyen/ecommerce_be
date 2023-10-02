import { MigrationInterface, QueryRunner } from "typeorm";

export class NullableQty1696229553031 implements MigrationInterface {
    name = 'NullableQty1696229553031'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`products\` CHANGE \`quantity\` \`quantity\` int NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`products\` CHANGE \`quantity\` \`quantity\` int NOT NULL`);
    }

}
