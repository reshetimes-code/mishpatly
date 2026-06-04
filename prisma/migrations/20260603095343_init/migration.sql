-- CreateEnum
CREATE TYPE "JudgmentStatus" AS ENUM ('PUBLISHED', 'DRAFT', 'HIDDEN', 'PENDING_REVIEW');

-- CreateEnum
CREATE TYPE "RemovalStatus" AS ENUM ('NEW', 'IN_PROGRESS', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'EDITOR', 'VIEWER');

-- CreateTable
CREATE TABLE "judgments" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "case_number" TEXT NOT NULL,
    "court_name" TEXT NOT NULL,
    "procedure_type" TEXT,
    "judgment_date" TIMESTAMP(3) NOT NULL,
    "judge" TEXT,
    "plaintiff" TEXT,
    "defendant" TEXT,
    "parties" TEXT,
    "summary" TEXT,
    "full_text" TEXT,
    "source_url" TEXT,
    "pdf_url" TEXT,
    "source_name" TEXT,
    "category" TEXT,
    "seo_title" TEXT,
    "seo_description" TEXT,
    "status" "JudgmentStatus" NOT NULL DEFAULT 'PUBLISHED',
    "is_indexable" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "judgments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "import_logs" (
    "id" SERIAL NOT NULL,
    "source" TEXT NOT NULL,
    "source_name" TEXT NOT NULL,
    "import_date" TIMESTAMP(3) NOT NULL,
    "total_count" INTEGER NOT NULL,
    "new_count" INTEGER NOT NULL,
    "updated_count" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "errors" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "import_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "removal_requests" (
    "id" SERIAL NOT NULL,
    "judgment_id" INTEGER,
    "full_name" TEXT NOT NULL,
    "phone" TEXT,
    "email" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "document_url" TEXT,
    "status" "RemovalStatus" NOT NULL DEFAULT 'NEW',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "removal_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'VIEWER',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "judgments_slug_key" ON "judgments"("slug");

-- CreateIndex
CREATE INDEX "judgments_slug_idx" ON "judgments"("slug");

-- CreateIndex
CREATE INDEX "judgments_case_number_idx" ON "judgments"("case_number");

-- CreateIndex
CREATE INDEX "judgments_status_idx" ON "judgments"("status");

-- CreateIndex
CREATE INDEX "judgments_judgment_date_idx" ON "judgments"("judgment_date");

-- CreateIndex
CREATE INDEX "judgments_court_name_idx" ON "judgments"("court_name");

-- CreateIndex
CREATE INDEX "judgments_source_name_idx" ON "judgments"("source_name");

-- CreateIndex
CREATE INDEX "judgments_category_idx" ON "judgments"("category");

-- CreateIndex
CREATE INDEX "import_logs_source_idx" ON "import_logs"("source");

-- CreateIndex
CREATE INDEX "import_logs_import_date_idx" ON "import_logs"("import_date");

-- CreateIndex
CREATE INDEX "removal_requests_status_idx" ON "removal_requests"("status");

-- CreateIndex
CREATE INDEX "removal_requests_judgment_id_idx" ON "removal_requests"("judgment_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "removal_requests" ADD CONSTRAINT "removal_requests_judgment_id_fkey" FOREIGN KEY ("judgment_id") REFERENCES "judgments"("id") ON DELETE SET NULL ON UPDATE CASCADE;
