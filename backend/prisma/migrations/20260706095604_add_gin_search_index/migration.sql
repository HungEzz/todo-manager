-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- CreateIndex
CREATE INDEX "Task_title_idx" ON "Task" USING GIN ("title" gin_trgm_ops);
