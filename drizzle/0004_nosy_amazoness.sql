ALTER TABLE "resources" RENAME TO "area_resources";--> statement-breakpoint
ALTER TABLE "area_resources" RENAME COLUMN "description" TO "resourceType";--> statement-breakpoint
ALTER TABLE "area_resources" DROP CONSTRAINT "resources_area_id_areas_area_id_fk";
--> statement-breakpoint
ALTER TABLE "area_resources" ADD CONSTRAINT "area_resources_area_id_areas_area_id_fk" FOREIGN KEY ("area_id") REFERENCES "public"."areas"("area_id") ON DELETE no action ON UPDATE no action;