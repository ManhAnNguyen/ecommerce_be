import { MigrationInterface, QueryRunner } from "typeorm";

export class BankAndStatisticUser1696048958172 implements MigrationInterface {
    name = 'BankAndStatisticUser1696048958172'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`banks\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`code\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`userBank\` (\`user_id\` int NOT NULL, \`bank_id\` int NOT NULL, \`isDefault\` tinyint NOT NULL, PRIMARY KEY (\`user_id\`, \`bank_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`statisticUser\` (\`user_id\` int NOT NULL, \`total_item_order\` int NOT NULL, \`total_price\` int NOT NULL, PRIMARY KEY (\`user_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`userBank\` ADD CONSTRAINT \`FK_eec624a4216fd2f30dd0a6bcd3c\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`userBank\` ADD CONSTRAINT \`FK_b1e92f71725eabdb7411616a495\` FOREIGN KEY (\`bank_id\`) REFERENCES \`banks\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`statisticUser\` ADD CONSTRAINT \`FK_f4a209b546ec217f169ba2a1e20\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`statisticUser\` DROP FOREIGN KEY \`FK_f4a209b546ec217f169ba2a1e20\``);
        await queryRunner.query(`ALTER TABLE \`userBank\` DROP FOREIGN KEY \`FK_b1e92f71725eabdb7411616a495\``);
        await queryRunner.query(`ALTER TABLE \`userBank\` DROP FOREIGN KEY \`FK_eec624a4216fd2f30dd0a6bcd3c\``);
        await queryRunner.query(`DROP TABLE \`statisticUser\``);
        await queryRunner.query(`DROP TABLE \`userBank\``);
        await queryRunner.query(`DROP TABLE \`banks\``);
    }

}
