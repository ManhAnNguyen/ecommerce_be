import { MigrationInterface, QueryRunner } from "typeorm";

export class Communes1696040795292 implements MigrationInterface {
    name = 'Communes1696040795292'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`communes\` ADD \`district_code\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`communes\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`communes\` ADD PRIMARY KEY (\`code\`)`);
        await queryRunner.query(`ALTER TABLE \`communes\` ADD CONSTRAINT \`FK_f046cb37ce8d1284b136abdc680\` FOREIGN KEY (\`district_code\`) REFERENCES \`districts\`(\`code\`) ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`communes\` DROP FOREIGN KEY \`FK_f046cb37ce8d1284b136abdc680\``);
        await queryRunner.query(`ALTER TABLE \`communes\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`communes\` ADD PRIMARY KEY (\`name\`, \`code\`)`);
        await queryRunner.query(`ALTER TABLE \`communes\` DROP COLUMN \`district_code\``);
    }

}
