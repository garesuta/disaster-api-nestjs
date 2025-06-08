ALTER TABLE "assignments" ALTER COLUMN "truck_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "assignments" ALTER COLUMN "resource_delivered" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "assignments" ADD COLUMN "created_at" time DEFAULT now();