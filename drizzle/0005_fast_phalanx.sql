ALTER TABLE "delivery" RENAME TO "assignments";--> statement-breakpoint
ALTER TABLE "assignments" DROP CONSTRAINT "delivery_area_id_areas_area_id_fk";
--> statement-breakpoint
ALTER TABLE "assignments" DROP CONSTRAINT "delivery_truck_id_trucks_truck_id_fk";
--> statement-breakpoint
ALTER TABLE "assignments" ADD CONSTRAINT "assignments_area_id_areas_area_id_fk" FOREIGN KEY ("area_id") REFERENCES "public"."areas"("area_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assignments" ADD CONSTRAINT "assignments_truck_id_trucks_truck_id_fk" FOREIGN KEY ("truck_id") REFERENCES "public"."trucks"("truck_id") ON DELETE no action ON UPDATE no action;