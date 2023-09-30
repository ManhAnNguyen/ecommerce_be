import { MigrationInterface, QueryRunner } from "typeorm";

export class UserAddress1696046663448 implements MigrationInterface {
    name = 'UserAddress1696046663448'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`userAddress\` (\`id\` int NOT NULL AUTO_INCREMENT, \`specific\` varchar(255) NOT NULL, \`isDefault\` tinyint NOT NULL, \`user_id\` int NULL, \`communeCode\` varchar(255) NULL, \`districtCode\` varchar(255) NULL, \`provinceCode\` varchar(255) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`userAddress\` ADD CONSTRAINT \`FK_f7b3966b9a1b8bfdaf3d1cdb127\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`userAddress\` ADD CONSTRAINT \`FK_dc2335f08fbf74851cbaad619b1\` FOREIGN KEY (\`communeCode\`) REFERENCES \`communes\`(\`code\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`userAddress\` ADD CONSTRAINT \`FK_7dead1c2ced14370584a30c17a9\` FOREIGN KEY (\`districtCode\`) REFERENCES \`districts\`(\`code\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`userAddress\` ADD CONSTRAINT \`FK_7df0dae65681a1aeae165dd0836\` FOREIGN KEY (\`provinceCode\`) REFERENCES \`provinces\`(\`code\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`userAddress\` DROP FOREIGN KEY \`FK_7df0dae65681a1aeae165dd0836\``);
        await queryRunner.query(`ALTER TABLE \`userAddress\` DROP FOREIGN KEY \`FK_7dead1c2ced14370584a30c17a9\``);
        await queryRunner.query(`ALTER TABLE \`userAddress\` DROP FOREIGN KEY \`FK_dc2335f08fbf74851cbaad619b1\``);
        await queryRunner.query(`ALTER TABLE \`userAddress\` DROP FOREIGN KEY \`FK_f7b3966b9a1b8bfdaf3d1cdb127\``);
        await queryRunner.query(`DROP TABLE \`userAddress\``);
    }

}
