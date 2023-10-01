import { MigrationInterface, QueryRunner } from "typeorm";

export class AddEntity1696147644811 implements MigrationInterface {
    name = 'AddEntity1696147644811'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`products\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`price\` int NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`image\` varchar(255) NOT NULL, \`quantity\` int NOT NULL, \`hidden\` tinyint NULL DEFAULT 0, \`description\` varchar(255) NULL, \`categoryId\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`category\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`paymentMethod\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`orders\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`status\` varchar(255) NOT NULL DEFAULT 'PENDING', \`userId\` int NOT NULL, \`paymentMethod\` int NOT NULL, \`address\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`orderItems\` (\`productId\` int NOT NULL, \`orderId\` int NOT NULL, \`quantity\` int NOT NULL, PRIMARY KEY (\`productId\`, \`orderId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`reviewProduct\` (\`id\` int NOT NULL AUTO_INCREMENT, \`image\` varchar(255) NULL, \`comment\` varchar(255) NULL, \`star\` int NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`userId\` int NOT NULL, \`produtId\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`refreshTokenFake\``);
        await queryRunner.query(`ALTER TABLE \`userAddress\` CHANGE \`specific\` \`specific\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`userBank\` CHANGE \`isDefault\` \`isDefault\` tinyint NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE \`products\` ADD CONSTRAINT \`FK_ff56834e735fa78a15d0cf21926\` FOREIGN KEY (\`categoryId\`) REFERENCES \`category\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`orders\` ADD CONSTRAINT \`FK_151b79a83ba240b0cb31b2302d1\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`orders\` ADD CONSTRAINT \`FK_7516b15d32fa3d9dd55810bf9f3\` FOREIGN KEY (\`paymentMethod\`) REFERENCES \`paymentMethod\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`orders\` ADD CONSTRAINT \`FK_b90d92f2aa3a7db7067805d3adb\` FOREIGN KEY (\`address\`) REFERENCES \`userAddress\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`orderItems\` ADD CONSTRAINT \`FK_391c9e5d5af8d7d7ce4b96db80e\` FOREIGN KEY (\`orderId\`) REFERENCES \`orders\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`orderItems\` ADD CONSTRAINT \`FK_51d8fc35a95624166faeca65e86\` FOREIGN KEY (\`productId\`) REFERENCES \`products\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`reviewProduct\` ADD CONSTRAINT \`FK_75fcc3c7526450dd52a38b4b396\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`reviewProduct\` ADD CONSTRAINT \`FK_066629bc7bb8850f10084679c42\` FOREIGN KEY (\`produtId\`) REFERENCES \`products\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`reviewProduct\` DROP FOREIGN KEY \`FK_066629bc7bb8850f10084679c42\``);
        await queryRunner.query(`ALTER TABLE \`reviewProduct\` DROP FOREIGN KEY \`FK_75fcc3c7526450dd52a38b4b396\``);
        await queryRunner.query(`ALTER TABLE \`orderItems\` DROP FOREIGN KEY \`FK_51d8fc35a95624166faeca65e86\``);
        await queryRunner.query(`ALTER TABLE \`orderItems\` DROP FOREIGN KEY \`FK_391c9e5d5af8d7d7ce4b96db80e\``);
        await queryRunner.query(`ALTER TABLE \`orders\` DROP FOREIGN KEY \`FK_b90d92f2aa3a7db7067805d3adb\``);
        await queryRunner.query(`ALTER TABLE \`orders\` DROP FOREIGN KEY \`FK_7516b15d32fa3d9dd55810bf9f3\``);
        await queryRunner.query(`ALTER TABLE \`orders\` DROP FOREIGN KEY \`FK_151b79a83ba240b0cb31b2302d1\``);
        await queryRunner.query(`ALTER TABLE \`products\` DROP FOREIGN KEY \`FK_ff56834e735fa78a15d0cf21926\``);
        await queryRunner.query(`ALTER TABLE \`userBank\` CHANGE \`isDefault\` \`isDefault\` tinyint NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`userAddress\` CHANGE \`specific\` \`specific\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`refreshTokenFake\` varchar(255) NULL`);
        await queryRunner.query(`DROP TABLE \`reviewProduct\``);
        await queryRunner.query(`DROP TABLE \`orderItems\``);
        await queryRunner.query(`DROP TABLE \`orders\``);
        await queryRunner.query(`DROP TABLE \`paymentMethod\``);
        await queryRunner.query(`DROP TABLE \`category\``);
        await queryRunner.query(`DROP TABLE \`products\``);
    }

}
