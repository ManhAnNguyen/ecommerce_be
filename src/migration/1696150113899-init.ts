import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1696150113899 implements MigrationInterface {
    name = 'Init1696150113899'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`admin\` (\`admin_id\` varchar(36) NOT NULL, \`username\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`admin_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`banks\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`code\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`provinces\` (\`code\` varchar(255) NOT NULL, \`name\` varchar(255) NOT NULL, PRIMARY KEY (\`code\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`districts\` (\`code\` varchar(255) NOT NULL, \`name\` varchar(255) NOT NULL, \`province_code\` varchar(255) NOT NULL, PRIMARY KEY (\`code\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`communes\` (\`name\` varchar(255) NOT NULL, \`code\` varchar(255) NOT NULL, \`district_code\` varchar(255) NOT NULL, PRIMARY KEY (\`code\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`userAddress\` (\`id\` int NOT NULL AUTO_INCREMENT, \`specific\` varchar(255) NULL, \`isDefault\` tinyint NOT NULL, \`user_id\` int NULL, \`communeCode\` varchar(255) NULL, \`districtCode\` varchar(255) NULL, \`provinceCode\` varchar(255) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`statisticUser\` (\`user_id\` int NOT NULL, \`total_item_order\` int NOT NULL, \`total_price\` int NOT NULL, PRIMARY KEY (\`user_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`userBank\` (\`user_id\` int NOT NULL, \`bank_id\` int NOT NULL, \`isDefault\` tinyint NULL DEFAULT 0, PRIMARY KEY (\`user_id\`, \`bank_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`users\` (\`id\` int NOT NULL AUTO_INCREMENT, \`username\` varchar(255) NOT NULL, \`email\` varchar(255) NULL, \`password\` varchar(255) NOT NULL, \`phone\` varchar(255) NULL, \`gender\` varchar(255) NULL, \`birthday\` varchar(255) NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`locked\` tinyint NULL, \`refreshToken\` varchar(255) NULL, \`avatar\` varchar(255) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`paymentMethod\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`orders\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`status\` varchar(255) NOT NULL DEFAULT 'PENDING', \`userId\` int NOT NULL, \`paymentMethod\` int NOT NULL, \`address\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`products\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`price\` int NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`image\` varchar(255) NOT NULL, \`quantity\` int NOT NULL, \`hidden\` tinyint NULL DEFAULT 0, \`description\` varchar(255) NULL, \`categoryId\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`category\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`orderItems\` (\`productId\` int NOT NULL, \`orderId\` int NOT NULL, \`quantity\` int NOT NULL, PRIMARY KEY (\`productId\`, \`orderId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`reviewProduct\` (\`id\` int NOT NULL AUTO_INCREMENT, \`image\` varchar(255) NULL, \`comment\` varchar(255) NULL, \`star\` int NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`userId\` int NOT NULL, \`produtId\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`districts\` ADD CONSTRAINT \`FK_7f4b31875273010908d39850284\` FOREIGN KEY (\`province_code\`) REFERENCES \`provinces\`(\`code\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`communes\` ADD CONSTRAINT \`FK_f046cb37ce8d1284b136abdc680\` FOREIGN KEY (\`district_code\`) REFERENCES \`districts\`(\`code\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`userAddress\` ADD CONSTRAINT \`FK_f7b3966b9a1b8bfdaf3d1cdb127\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`userAddress\` ADD CONSTRAINT \`FK_dc2335f08fbf74851cbaad619b1\` FOREIGN KEY (\`communeCode\`) REFERENCES \`communes\`(\`code\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`userAddress\` ADD CONSTRAINT \`FK_7dead1c2ced14370584a30c17a9\` FOREIGN KEY (\`districtCode\`) REFERENCES \`districts\`(\`code\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`userAddress\` ADD CONSTRAINT \`FK_7df0dae65681a1aeae165dd0836\` FOREIGN KEY (\`provinceCode\`) REFERENCES \`provinces\`(\`code\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`statisticUser\` ADD CONSTRAINT \`FK_f4a209b546ec217f169ba2a1e20\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`userBank\` ADD CONSTRAINT \`FK_eec624a4216fd2f30dd0a6bcd3c\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`userBank\` ADD CONSTRAINT \`FK_b1e92f71725eabdb7411616a495\` FOREIGN KEY (\`bank_id\`) REFERENCES \`banks\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`orders\` ADD CONSTRAINT \`FK_151b79a83ba240b0cb31b2302d1\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`orders\` ADD CONSTRAINT \`FK_7516b15d32fa3d9dd55810bf9f3\` FOREIGN KEY (\`paymentMethod\`) REFERENCES \`paymentMethod\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`orders\` ADD CONSTRAINT \`FK_b90d92f2aa3a7db7067805d3adb\` FOREIGN KEY (\`address\`) REFERENCES \`userAddress\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`products\` ADD CONSTRAINT \`FK_ff56834e735fa78a15d0cf21926\` FOREIGN KEY (\`categoryId\`) REFERENCES \`category\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
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
        await queryRunner.query(`ALTER TABLE \`products\` DROP FOREIGN KEY \`FK_ff56834e735fa78a15d0cf21926\``);
        await queryRunner.query(`ALTER TABLE \`orders\` DROP FOREIGN KEY \`FK_b90d92f2aa3a7db7067805d3adb\``);
        await queryRunner.query(`ALTER TABLE \`orders\` DROP FOREIGN KEY \`FK_7516b15d32fa3d9dd55810bf9f3\``);
        await queryRunner.query(`ALTER TABLE \`orders\` DROP FOREIGN KEY \`FK_151b79a83ba240b0cb31b2302d1\``);
        await queryRunner.query(`ALTER TABLE \`userBank\` DROP FOREIGN KEY \`FK_b1e92f71725eabdb7411616a495\``);
        await queryRunner.query(`ALTER TABLE \`userBank\` DROP FOREIGN KEY \`FK_eec624a4216fd2f30dd0a6bcd3c\``);
        await queryRunner.query(`ALTER TABLE \`statisticUser\` DROP FOREIGN KEY \`FK_f4a209b546ec217f169ba2a1e20\``);
        await queryRunner.query(`ALTER TABLE \`userAddress\` DROP FOREIGN KEY \`FK_7df0dae65681a1aeae165dd0836\``);
        await queryRunner.query(`ALTER TABLE \`userAddress\` DROP FOREIGN KEY \`FK_7dead1c2ced14370584a30c17a9\``);
        await queryRunner.query(`ALTER TABLE \`userAddress\` DROP FOREIGN KEY \`FK_dc2335f08fbf74851cbaad619b1\``);
        await queryRunner.query(`ALTER TABLE \`userAddress\` DROP FOREIGN KEY \`FK_f7b3966b9a1b8bfdaf3d1cdb127\``);
        await queryRunner.query(`ALTER TABLE \`communes\` DROP FOREIGN KEY \`FK_f046cb37ce8d1284b136abdc680\``);
        await queryRunner.query(`ALTER TABLE \`districts\` DROP FOREIGN KEY \`FK_7f4b31875273010908d39850284\``);
        await queryRunner.query(`DROP TABLE \`reviewProduct\``);
        await queryRunner.query(`DROP TABLE \`orderItems\``);
        await queryRunner.query(`DROP TABLE \`category\``);
        await queryRunner.query(`DROP TABLE \`products\``);
        await queryRunner.query(`DROP TABLE \`orders\``);
        await queryRunner.query(`DROP TABLE \`paymentMethod\``);
        await queryRunner.query(`DROP TABLE \`users\``);
        await queryRunner.query(`DROP TABLE \`userBank\``);
        await queryRunner.query(`DROP TABLE \`statisticUser\``);
        await queryRunner.query(`DROP TABLE \`userAddress\``);
        await queryRunner.query(`DROP TABLE \`communes\``);
        await queryRunner.query(`DROP TABLE \`districts\``);
        await queryRunner.query(`DROP TABLE \`provinces\``);
        await queryRunner.query(`DROP TABLE \`banks\``);
        await queryRunner.query(`DROP TABLE \`admin\``);
    }

}
