import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateMig11777364443392 implements MigrationInterface {
    name = 'UpdateMig11777364443392'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "reviews" ("id" SERIAL NOT NULL, "product_id" integer NOT NULL, "account_id" integer NOT NULL, "order_id" integer NOT NULL, "rating" integer NOT NULL, "content" text, "seller_rating" integer, "shipping_rating" integer, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_d2d3488d01dedb58916a4b6ce06" UNIQUE ("account_id", "product_id", "order_id"), CONSTRAINT "PK_231ae565c273ee700b283f15c1d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."orders_status_enum" AS ENUM('pending', 'confirmed', 'shipping', 'delivered', 'reviewed', 'cancelled')`);
        await queryRunner.query(`CREATE TYPE "public"."orders_payment_method_enum" AS ENUM('cash_on_delivery', 'vnpay_wallet', 'momo_wallet', 'zalopay_wallet')`);
        await queryRunner.query(`CREATE TABLE "orders" ("id" SERIAL NOT NULL, "status" "public"."orders_status_enum" NOT NULL, "order_date" date NOT NULL, "total_product_amount" numeric(12,3) NOT NULL, "shipping_fee" numeric(12,3) NOT NULL, "discount_amount" numeric(12,3) NOT NULL, "total_amount" numeric(12,3) NOT NULL, "is_paid" boolean NOT NULL, "payment_method" "public"."orders_payment_method_enum" NOT NULL, "bank_transfer_time" TIMESTAMP, "bank_transfer_transaction_code" character varying(255), "note" character varying(255), "account_id" integer NOT NULL, "shipping_info_id" integer NOT NULL, "discount_code_id" integer, CONSTRAINT "PK_710e2d4957aa5878dfe94e4ac2f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "order_items" ("id" SERIAL NOT NULL, "product_name_snapshot" character varying(255) NOT NULL, "variant_name_snapshot" character varying(255) NOT NULL, "price_before_discount" numeric(12,3) NOT NULL, "price_after_discount" numeric(12,3) NOT NULL, "quantity" integer NOT NULL, "total_amount" numeric(12,3) NOT NULL, "order_id" integer NOT NULL, "variant_id" integer NOT NULL, CONSTRAINT "PK_005269d8574e6fac0493715c308" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."order_status_histories_old_status_enum" AS ENUM('pending', 'confirmed', 'shipping', 'delivered', 'reviewed', 'cancelled')`);
        await queryRunner.query(`CREATE TYPE "public"."order_status_histories_new_status_enum" AS ENUM('pending', 'confirmed', 'shipping', 'delivered', 'reviewed', 'cancelled')`);
        await queryRunner.query(`CREATE TABLE "order_status_histories" ("id" SERIAL NOT NULL, "note" character varying(255), "changed_at" TIMESTAMP NOT NULL, "old_status" "public"."order_status_histories_old_status_enum" NOT NULL, "new_status" "public"."order_status_histories_new_status_enum" NOT NULL, "order_id" integer NOT NULL, CONSTRAINT "PK_28cee84c06f647cf7c806645b68" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."discount_codes_type_enum" AS ENUM('fixed', 'percentage')`);
        await queryRunner.query(`CREATE TABLE "discount_codes" ("id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, "discount_code" character varying(255) NOT NULL, "type" "public"."discount_codes_type_enum" NOT NULL, "discount_value" numeric(12,3) NOT NULL, "minimum_order_value" numeric(12,3) NOT NULL DEFAULT '0', "maximum_discount" numeric(12,3) NOT NULL, "maximum_usage" integer NOT NULL, "start_time" TIMESTAMP NOT NULL, "end_time" TIMESTAMP NOT NULL, "is_active" boolean NOT NULL DEFAULT true, "allow_save_before" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_2887b5c7837a43c545bb28f6090" UNIQUE ("discount_code"), CONSTRAINT "PK_c0170a28d937472e9ce50fdce17" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."promotion_programs_status_enum" AS ENUM('draft', 'active', 'inactive')`);
        await queryRunner.query(`CREATE TABLE "promotion_programs" ("id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, "startTime" TIMESTAMP NOT NULL, "endTime" TIMESTAMP NOT NULL, "status" "public"."promotion_programs_status_enum" NOT NULL DEFAULT 'draft', CONSTRAINT "PK_8f914e8ac167c4d719be94d367b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."promotion_details_type_enum" AS ENUM('fixed', 'percentage')`);
        await queryRunner.query(`CREATE TABLE "promotion_details" ("id" SERIAL NOT NULL, "type" "public"."promotion_details_type_enum" NOT NULL, "promotionValue" numeric(12,3) NOT NULL, "productLimit" integer NOT NULL, "usageLimitPerCustomer" integer NOT NULL, "promotionProgramId" integer NOT NULL, "variantId" integer NOT NULL, CONSTRAINT "PK_5ce7ba31ce79bd520569ceeb60e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "order_items" ADD CONSTRAINT "FK_145532db85752b29c57d2b7b1f1" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_status_histories" ADD CONSTRAINT "FK_529791717165559256e8ed191fe" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "promotion_details" ADD CONSTRAINT "FK_c0e49c0da75715e49fd59c5cf59" FOREIGN KEY ("promotionProgramId") REFERENCES "promotion_programs"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "promotion_details" DROP CONSTRAINT "FK_c0e49c0da75715e49fd59c5cf59"`);
        await queryRunner.query(`ALTER TABLE "order_status_histories" DROP CONSTRAINT "FK_529791717165559256e8ed191fe"`);
        await queryRunner.query(`ALTER TABLE "order_items" DROP CONSTRAINT "FK_145532db85752b29c57d2b7b1f1"`);
        await queryRunner.query(`DROP TABLE "promotion_details"`);
        await queryRunner.query(`DROP TYPE "public"."promotion_details_type_enum"`);
        await queryRunner.query(`DROP TABLE "promotion_programs"`);
        await queryRunner.query(`DROP TYPE "public"."promotion_programs_status_enum"`);
        await queryRunner.query(`DROP TABLE "discount_codes"`);
        await queryRunner.query(`DROP TYPE "public"."discount_codes_type_enum"`);
        await queryRunner.query(`DROP TABLE "order_status_histories"`);
        await queryRunner.query(`DROP TYPE "public"."order_status_histories_new_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."order_status_histories_old_status_enum"`);
        await queryRunner.query(`DROP TABLE "order_items"`);
        await queryRunner.query(`DROP TABLE "orders"`);
        await queryRunner.query(`DROP TYPE "public"."orders_payment_method_enum"`);
        await queryRunner.query(`DROP TYPE "public"."orders_status_enum"`);
        await queryRunner.query(`DROP TABLE "reviews"`);
    }

}
