-- AlterTable
ALTER TABLE "order_items" ADD COLUMN     "is_half_half" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "second_product_id" TEXT,
ADD COLUMN     "second_product_name" TEXT,
ADD COLUMN     "second_product_price" DECIMAL(10,2);
