import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1746804511887 implements MigrationInterface {

    name = 'InitialSchema1746804511887'
    
        public async up(queryRunner: QueryRunner): Promise<void> {
            // Create enum types first
            await queryRunner.query(`CREATE TYPE "user_role_enum" AS ENUM ('user', 'admin', 'ngo', 'volunteer', 'refugee')`);
            await queryRunner.query(`CREATE TYPE "need_category_enum" AS ENUM ('shelter', 'food', 'medical', 'legal', 'education', 'employment', 'translation', 'transportation', 'clothing', 'housing', 'other')`);
            await queryRunner.query(`CREATE TYPE "need_status_enum" AS ENUM ('open', 'matched', 'fulfilled', 'closed')`);
            await queryRunner.query(`CREATE TYPE "offer_category_enum" AS ENUM ('shelter', 'food', 'medical', 'legal', 'education', 'employment', 'translation', 'transportation', 'clothing', 'housing', 'other')`);
            await queryRunner.query(`CREATE TYPE "offer_status_enum" AS ENUM ('active', 'inactive', 'fulfilled')`);
            await queryRunner.query(`CREATE TYPE "match_status_enum" AS ENUM ('pending', 'accepted', 'rejected', 'completed', 'cancelled')`);
            await queryRunner.query(`CREATE TYPE "notification_type_enum" AS ENUM ('match', 'message', 'offer', 'need', 'announcement', 'system')`);
            
            // Create users table
            await queryRunner.query(`CREATE TABLE "users" (
                "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
                "name" character varying NOT NULL,
                "organizationName" character varying,
                "email" character varying NOT NULL UNIQUE,
                "password" character varying NOT NULL,
                "role" "user_role_enum" NOT NULL DEFAULT 'refugee',
                "language" character varying NOT NULL,
                "verified" boolean NOT NULL DEFAULT false,
                "avatar" character varying,
                "contact" character varying,
                "location" jsonb,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
            )`);
    
            // Create needs table
            await queryRunner.query(`CREATE TABLE "needs" (
                "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
                "title" character varying NOT NULL,
                "description" text NOT NULL,
                "category" "need_category_enum" NOT NULL DEFAULT 'other',
                "urgent" boolean NOT NULL DEFAULT false,
                "status" "need_status_enum" NOT NULL DEFAULT 'open',
                "location" jsonb,
                "userId" uuid NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "FK_needs_userId" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE
            )`);
    
            // Create offers table
            await queryRunner.query(`CREATE TABLE "offers" (
                "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
                "title" character varying NOT NULL,
                "description" text NOT NULL,
                "category" "offer_category_enum" NOT NULL DEFAULT 'other',
                "status" "offer_status_enum" NOT NULL DEFAULT 'active',
                "location" jsonb,
                "contact" jsonb,
                "availability" jsonb,
                "userId" uuid NOT NULL,
                "helpedCount" integer NOT NULL DEFAULT 0,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "FK_offers_userId" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE
            )`);
    
            // Create matches table
            await queryRunner.query(`CREATE TABLE "matches" (
                "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
                "needId" uuid,
                "offerId" uuid,
                "initiatedBy" uuid NOT NULL,
                "respondedBy" uuid,
                "message" character varying,
                "status" "match_status_enum" NOT NULL DEFAULT 'pending',
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "FK_matches_initiatedBy" FOREIGN KEY ("initiatedBy") REFERENCES "users"("id") ON DELETE NO ACTION,
                CONSTRAINT "FK_matches_respondedBy" FOREIGN KEY ("respondedBy") REFERENCES "users"("id") ON DELETE NO ACTION,
                CONSTRAINT "FK_matches_needId" FOREIGN KEY ("needId") REFERENCES "needs"("id") ON DELETE CASCADE,
                CONSTRAINT "FK_matches_offerId" FOREIGN KEY ("offerId") REFERENCES "offers"("id") ON DELETE CASCADE
            )`);
    
            // Create conversations table
            await queryRunner.query(`CREATE TABLE "conversations" (
                "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
                "lastMessage" character varying,
                "lastMessageAt" TIMESTAMP,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
            )`);
    
            // Create messages table
            await queryRunner.query(`CREATE TABLE "messages" (
                "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
                "content" text NOT NULL,
                "senderId" uuid NOT NULL,
                "read" boolean NOT NULL DEFAULT false,
                "conversationId" uuid NOT NULL,
                "timestamp" TIMESTAMP NOT NULL DEFAULT now(),
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "FK_messages_senderId" FOREIGN KEY ("senderId") REFERENCES "users"("id") ON DELETE NO ACTION,
                CONSTRAINT "FK_messages_conversationId" FOREIGN KEY ("conversationId") REFERENCES "conversations"("id") ON DELETE CASCADE
            )`);
    
            // Create conversation_participants table (for many-to-many)
            await queryRunner.query(`CREATE TABLE "conversation_participants" (
                "conversationId" uuid NOT NULL,
                "userId" uuid NOT NULL,
                PRIMARY KEY ("conversationId", "userId"),
                CONSTRAINT "FK_conversation_participants_conversationId" FOREIGN KEY ("conversationId") REFERENCES "conversations"("id") ON DELETE CASCADE,
                CONSTRAINT "FK_conversation_participants_userId" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE
            )`);
    
            // Create notification table
            await queryRunner.query(`CREATE TABLE "notification" (
                "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
                "title" character varying NOT NULL,
                "description" character varying NOT NULL,
                "type" "notification_type_enum" NOT NULL DEFAULT 'system',
                "recipientId" uuid NOT NULL,
                "entityId" uuid,
                "read" boolean NOT NULL DEFAULT false,
                "actionTaken" boolean NOT NULL DEFAULT false,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "FK_notification_recipientId" FOREIGN KEY ("recipientId") REFERENCES "users"("id") ON DELETE CASCADE
            )`);
    
            // Create announcement table
            await queryRunner.query(`CREATE TABLE "announcement" (
                "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
                "title" character varying NOT NULL,
                "content" text NOT NULL,
                "category" character varying NOT NULL,
                "region" character varying NOT NULL,
                "important" boolean NOT NULL DEFAULT false,
                "eventDate" TIMESTAMP,
                "postedById" uuid NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "FK_announcement_postedById" FOREIGN KEY ("postedById") REFERENCES "users"("id") ON DELETE NO ACTION
            )`);
    
            // Create announcement_subscription table
            await queryRunner.query(`CREATE TABLE "announcement_subscription" (
                "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
                "email" character varying NOT NULL,
                "categories" text,
                "regions" text,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now()
            )`);
    
            // Create location related tables
            await queryRunner.query(`CREATE TABLE "contact_info" (
                "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
                "phone" character varying,
                "email" character varying,
                "website" character varying,
                "hours" character varying
            )`);
    
            await queryRunner.query(`CREATE TABLE "location" (
                "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
                "name" character varying NOT NULL,
                "type" character varying NOT NULL DEFAULT 'resource',
                "address" character varying NOT NULL,
                "lat" real NOT NULL,
                "lng" real NOT NULL,
                "description" text NOT NULL,
                "contactInfoId" uuid,
                "isActive" boolean NOT NULL DEFAULT true,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "createdBy" uuid,
                CONSTRAINT "REL_location_contactInfoId" UNIQUE ("contactInfoId"),
                CONSTRAINT "FK_location_contactInfoId" FOREIGN KEY ("contactInfoId") REFERENCES "contact_info"("id") ON DELETE SET NULL
            )`);
    
            await queryRunner.query(`CREATE TABLE "service" (
                "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
                "name" character varying NOT NULL,
                "locationId" uuid,
                CONSTRAINT "FK_service_locationId" FOREIGN KEY ("locationId") REFERENCES "location"("id") ON DELETE CASCADE
            )`);
    
            // Create indexes for performance
            await queryRunner.query(`CREATE INDEX "IDX_users_email" ON "users" ("email")`);
            await queryRunner.query(`CREATE INDEX "IDX_needs_userId" ON "needs" ("userId")`);
            await queryRunner.query(`CREATE INDEX "IDX_needs_status" ON "needs" ("status")`);
            await queryRunner.query(`CREATE INDEX "IDX_needs_category" ON "needs" ("category")`);
            await queryRunner.query(`CREATE INDEX "IDX_offers_userId" ON "offers" ("userId")`);
            await queryRunner.query(`CREATE INDEX "IDX_offers_category" ON "offers" ("category")`);
            await queryRunner.query(`CREATE INDEX "IDX_matches_needId" ON "matches" ("needId")`);
            await queryRunner.query(`CREATE INDEX "IDX_matches_offerId" ON "matches" ("offerId")`);
            await queryRunner.query(`CREATE INDEX "IDX_matches_initiatedBy" ON "matches" ("initiatedBy")`);
            await queryRunner.query(`CREATE INDEX "IDX_notification_recipientId" ON "notification" ("recipientId")`);
            await queryRunner.query(`CREATE INDEX "IDX_messages_conversationId" ON "messages" ("conversationId")`);
        }
    
        public async down(queryRunner: QueryRunner): Promise<void> {
            // Drop indexes
            await queryRunner.query(`DROP INDEX "IDX_messages_conversationId"`);
            await queryRunner.query(`DROP INDEX "IDX_notification_recipientId"`);
            await queryRunner.query(`DROP INDEX "IDX_matches_initiatedBy"`);
            await queryRunner.query(`DROP INDEX "IDX_matches_offerId"`);
            await queryRunner.query(`DROP INDEX "IDX_matches_needId"`);
            await queryRunner.query(`DROP INDEX "IDX_offers_category"`);
            await queryRunner.query(`DROP INDEX "IDX_offers_userId"`);
            await queryRunner.query(`DROP INDEX "IDX_needs_category"`);
            await queryRunner.query(`DROP INDEX "IDX_needs_status"`);
            await queryRunner.query(`DROP INDEX "IDX_needs_userId"`);
            await queryRunner.query(`DROP INDEX "IDX_users_email"`);
            
            // Drop tables in reverse order of creation (respecting foreign keys)
            await queryRunner.query(`DROP TABLE "service"`);
            await queryRunner.query(`DROP TABLE "location"`);
            await queryRunner.query(`DROP TABLE "contact_info"`);
            await queryRunner.query(`DROP TABLE "announcement_subscription"`);
            await queryRunner.query(`DROP TABLE "announcement"`);
            await queryRunner.query(`DROP TABLE "notification"`);
            await queryRunner.query(`DROP TABLE "conversation_participants"`);
            await queryRunner.query(`DROP TABLE "messages"`);
            await queryRunner.query(`DROP TABLE "conversations"`);
            await queryRunner.query(`DROP TABLE "matches"`);
            await queryRunner.query(`DROP TABLE "offers"`);
            await queryRunner.query(`DROP TABLE "needs"`);
            await queryRunner.query(`DROP TABLE "users"`);
    
            // Drop enums
            await queryRunner.query(`DROP TYPE "notification_type_enum"`);
            await queryRunner.query(`DROP TYPE "match_status_enum"`);
            await queryRunner.query(`DROP TYPE "offer_status_enum"`);
            await queryRunner.query(`DROP TYPE "offer_category_enum"`);
            await queryRunner.query(`DROP TYPE "need_status_enum"`);
            await queryRunner.query(`DROP TYPE "need_category_enum"`);
            await queryRunner.query(`DROP TYPE "user_role_enum"`);
        }
    }
