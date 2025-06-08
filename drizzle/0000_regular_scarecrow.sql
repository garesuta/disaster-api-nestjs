CREATE TABLE "areas" (
	"area_id" text PRIMARY KEY NOT NULL,
	"urgency_level" integer NOT NULL,
	"time_constraints" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "delivery" (
	"id" serial PRIMARY KEY NOT NULL,
	"area_id" text NOT NULL,
	"truck_id" text NOT NULL,
	"resource_delivered" jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "resources" (
	"id" serial PRIMARY KEY NOT NULL,
	"area_id" text NOT NULL,
	"description" text NOT NULL,
	"quantity" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "travel_time_to_area" (
	"id" serial PRIMARY KEY NOT NULL,
	"truck_id" text NOT NULL,
	"area_id" text NOT NULL,
	"hours" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "trucks_resource" (
	"id" serial PRIMARY KEY NOT NULL,
	"truck_id" text NOT NULL,
	"resource_type" text NOT NULL,
	"quantity" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "trucks" (
	"truck_id" text PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE "urgencyLevel" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "areas" ADD CONSTRAINT "areas_urgency_level_urgencyLevel_id_fk" FOREIGN KEY ("urgency_level") REFERENCES "public"."urgencyLevel"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "delivery" ADD CONSTRAINT "delivery_area_id_areas_area_id_fk" FOREIGN KEY ("area_id") REFERENCES "public"."areas"("area_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "delivery" ADD CONSTRAINT "delivery_truck_id_trucks_truck_id_fk" FOREIGN KEY ("truck_id") REFERENCES "public"."trucks"("truck_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "resources" ADD CONSTRAINT "resources_area_id_areas_area_id_fk" FOREIGN KEY ("area_id") REFERENCES "public"."areas"("area_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "travel_time_to_area" ADD CONSTRAINT "travel_time_to_area_truck_id_trucks_truck_id_fk" FOREIGN KEY ("truck_id") REFERENCES "public"."trucks"("truck_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "travel_time_to_area" ADD CONSTRAINT "travel_time_to_area_area_id_areas_area_id_fk" FOREIGN KEY ("area_id") REFERENCES "public"."areas"("area_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trucks_resource" ADD CONSTRAINT "trucks_resource_truck_id_trucks_truck_id_fk" FOREIGN KEY ("truck_id") REFERENCES "public"."trucks"("truck_id") ON DELETE cascade ON UPDATE no action;