-- CreateEnum
CREATE TYPE "public"."UserStatus" AS ENUM ('ACTIVE', 'DISABLED');

-- CreateEnum
CREATE TYPE "public"."DepartmentStatus" AS ENUM ('ACTIVE', 'DISABLED');

-- CreateEnum
CREATE TYPE "public"."PermissionType" AS ENUM ('MENU', 'BUTTON');

-- CreateEnum
CREATE TYPE "public"."PostStatus" AS ENUM ('OPEN', 'PAUSED', 'CLOSED');

-- CreateEnum
CREATE TYPE "public"."CandidateStatus" AS ENUM ('NEW', 'DEPARTMENT_ASSESSING', 'DEPARTMENT_PASSED', 'DEPARTMENT_FAILED', 'INTERVIEWING', 'OFFERED', 'REJECTED');

-- CreateEnum
CREATE TYPE "public"."AssessmentResult" AS ENUM ('PASSED', 'FAILED', 'PENDING');

-- CreateEnum
CREATE TYPE "public"."InterviewStatus" AS ENUM ('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "public"."InterviewTaskStatus" AS ENUM ('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "public"."NotificationType" AS ENUM ('SYSTEM', 'EMAIL', 'SMS');

-- CreateEnum
CREATE TYPE "public"."LogResult" AS ENUM ('SUCCESS', 'FAILED', 'PARTIAL');

-- CreateEnum
CREATE TYPE "public"."AttachmentCategory" AS ENUM ('RESUME', 'PORTFOLIO', 'CERTIFICATE', 'JOB_DESCRIPTION', 'INTERVIEW_FEEDBACK', 'CONTRACT', 'OTHER');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "email" TEXT,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "employeeNo" TEXT,
    "phone" TEXT,
    "status" "public"."UserStatus" NOT NULL DEFAULT 'ACTIVE',
    "departmentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Department" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "parentId" TEXT,
    "leaderId" TEXT,
    "orgId" TEXT,
    "status" "public"."DepartmentStatus" NOT NULL DEFAULT 'ACTIVE',
    "level" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Department_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Organization" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Role" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT,
    "description" TEXT,
    "isSystem" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."UserRole" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserRole_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Permission" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT,
    "type" "public"."PermissionType" NOT NULL,
    "parentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Permission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Post" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "departmentId" TEXT NOT NULL,
    "jd" TEXT,
    "hiringCount" INTEGER,
    "priority" INTEGER,
    "location" TEXT,
    "status" "public"."PostStatus" NOT NULL DEFAULT 'OPEN',
    "createdById" TEXT NOT NULL,
    "closedAt" TIMESTAMP(3),
    "restoredAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Candidate" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "resumeUrl" TEXT,
    "remarks" TEXT,
    "status" "public"."CandidateStatus" NOT NULL DEFAULT 'NEW',
    "source" TEXT,
    "expectedSalary" TEXT,
    "currentCompany" TEXT,
    "workExperience" INTEGER,
    "departmentId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Candidate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CandidateStatusHistory" (
    "id" TEXT NOT NULL,
    "candidateId" TEXT NOT NULL,
    "fromStatus" "public"."CandidateStatus",
    "toStatus" "public"."CandidateStatus" NOT NULL,
    "reason" TEXT,
    "operatorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CandidateStatusHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."DepartmentAssessment" (
    "id" TEXT NOT NULL,
    "candidateId" TEXT NOT NULL,
    "assessorId" TEXT NOT NULL,
    "result" "public"."AssessmentResult" NOT NULL,
    "remarks" TEXT,
    "assessedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DepartmentAssessment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Interview" (
    "id" TEXT NOT NULL,
    "candidateId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "round" INTEGER NOT NULL,
    "status" "public"."InterviewStatus" NOT NULL DEFAULT 'SCHEDULED',
    "scheduledAt" TIMESTAMP(3) NOT NULL,
    "actualStartAt" TIMESTAMP(3),
    "actualEndAt" TIMESTAMP(3),
    "location" TEXT,
    "meetingLink" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Interview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."InterviewTask" (
    "id" TEXT NOT NULL,
    "interviewId" TEXT NOT NULL,
    "interviewerId" TEXT NOT NULL,
    "sequence" INTEGER NOT NULL,
    "status" "public"."InterviewTaskStatus" NOT NULL DEFAULT 'SCHEDULED',
    "scheduledAt" TIMESTAMP(3),
    "actualStartAt" TIMESTAMP(3),
    "actualEndAt" TIMESTAMP(3),
    "feedback" TEXT,
    "feedbackScore" INTEGER,
    "feedbackAt" TIMESTAMP(3),
    "decision" TEXT,
    "notified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "InterviewTask_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Notification" (
    "id" TEXT NOT NULL,
    "type" "public"."NotificationType" NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "receiverId" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "relatedPostId" TEXT,
    "relatedCandidateId" TEXT,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."OperationLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "module" TEXT NOT NULL,
    "objectId" TEXT,
    "objectType" TEXT,
    "objectName" TEXT,
    "details" JSONB,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "result" "public"."LogResult" NOT NULL DEFAULT 'SUCCESS',
    "errorMsg" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OperationLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Attachment" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "fileType" TEXT NOT NULL,
    "fileSize" INTEGER,
    "category" "public"."AttachmentCategory" NOT NULL DEFAULT 'OTHER',
    "description" TEXT,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "uploaderId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Attachment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."_PermissionToRole" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_PermissionToRole_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "public"."User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_employeeNo_key" ON "public"."User"("employeeNo");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "public"."User"("phone");

-- CreateIndex
CREATE INDEX "User_status_idx" ON "public"."User"("status");

-- CreateIndex
CREATE INDEX "User_departmentId_idx" ON "public"."User"("departmentId");

-- CreateIndex
CREATE INDEX "User_createdAt_idx" ON "public"."User"("createdAt");

-- CreateIndex
CREATE INDEX "User_isDeleted_idx" ON "public"."User"("isDeleted");

-- CreateIndex
CREATE INDEX "User_deletedAt_idx" ON "public"."User"("deletedAt");

-- CreateIndex
CREATE INDEX "User_departmentId_status_idx" ON "public"."User"("departmentId", "status");

-- CreateIndex
CREATE INDEX "User_isDeleted_status_idx" ON "public"."User"("isDeleted", "status");

-- CreateIndex
CREATE INDEX "Department_status_idx" ON "public"."Department"("status");

-- CreateIndex
CREATE INDEX "Department_orgId_idx" ON "public"."Department"("orgId");

-- CreateIndex
CREATE INDEX "Department_parentId_idx" ON "public"."Department"("parentId");

-- CreateIndex
CREATE INDEX "Department_leaderId_idx" ON "public"."Department"("leaderId");

-- CreateIndex
CREATE INDEX "Department_level_idx" ON "public"."Department"("level");

-- CreateIndex
CREATE INDEX "Department_isDeleted_idx" ON "public"."Department"("isDeleted");

-- CreateIndex
CREATE INDEX "Department_deletedAt_idx" ON "public"."Department"("deletedAt");

-- CreateIndex
CREATE INDEX "Department_orgId_status_idx" ON "public"."Department"("orgId", "status");

-- CreateIndex
CREATE INDEX "Department_isDeleted_status_idx" ON "public"."Department"("isDeleted", "status");

-- CreateIndex
CREATE UNIQUE INDEX "Organization_code_key" ON "public"."Organization"("code");

-- CreateIndex
CREATE INDEX "Organization_createdAt_idx" ON "public"."Organization"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Role_code_key" ON "public"."Role"("code");

-- CreateIndex
CREATE INDEX "Role_isSystem_idx" ON "public"."Role"("isSystem");

-- CreateIndex
CREATE INDEX "Role_createdAt_idx" ON "public"."Role"("createdAt");

-- CreateIndex
CREATE INDEX "UserRole_userId_idx" ON "public"."UserRole"("userId");

-- CreateIndex
CREATE INDEX "UserRole_roleId_idx" ON "public"."UserRole"("roleId");

-- CreateIndex
CREATE INDEX "UserRole_assignedAt_idx" ON "public"."UserRole"("assignedAt");

-- CreateIndex
CREATE UNIQUE INDEX "UserRole_userId_roleId_key" ON "public"."UserRole"("userId", "roleId");

-- CreateIndex
CREATE UNIQUE INDEX "Permission_code_key" ON "public"."Permission"("code");

-- CreateIndex
CREATE INDEX "Permission_type_idx" ON "public"."Permission"("type");

-- CreateIndex
CREATE INDEX "Permission_parentId_idx" ON "public"."Permission"("parentId");

-- CreateIndex
CREATE INDEX "Permission_type_parentId_idx" ON "public"."Permission"("type", "parentId");

-- CreateIndex
CREATE INDEX "Post_status_idx" ON "public"."Post"("status");

-- CreateIndex
CREATE INDEX "Post_departmentId_idx" ON "public"."Post"("departmentId");

-- CreateIndex
CREATE INDEX "Post_createdById_idx" ON "public"."Post"("createdById");

-- CreateIndex
CREATE INDEX "Post_createdAt_idx" ON "public"."Post"("createdAt");

-- CreateIndex
CREATE INDEX "Post_priority_idx" ON "public"."Post"("priority");

-- CreateIndex
CREATE INDEX "Post_location_idx" ON "public"."Post"("location");

-- CreateIndex
CREATE INDEX "Post_isDeleted_idx" ON "public"."Post"("isDeleted");

-- CreateIndex
CREATE INDEX "Post_deletedAt_idx" ON "public"."Post"("deletedAt");

-- CreateIndex
CREATE INDEX "Post_status_departmentId_idx" ON "public"."Post"("status", "departmentId");

-- CreateIndex
CREATE INDEX "Post_status_createdAt_idx" ON "public"."Post"("status", "createdAt");

-- CreateIndex
CREATE INDEX "Post_isDeleted_status_idx" ON "public"."Post"("isDeleted", "status");

-- CreateIndex
CREATE INDEX "Post_departmentId_isDeleted_idx" ON "public"."Post"("departmentId", "isDeleted");

-- CreateIndex
CREATE INDEX "Candidate_status_idx" ON "public"."Candidate"("status");

-- CreateIndex
CREATE INDEX "Candidate_departmentId_idx" ON "public"."Candidate"("departmentId");

-- CreateIndex
CREATE INDEX "Candidate_postId_idx" ON "public"."Candidate"("postId");

-- CreateIndex
CREATE INDEX "Candidate_createdById_idx" ON "public"."Candidate"("createdById");

-- CreateIndex
CREATE INDEX "Candidate_createdAt_idx" ON "public"."Candidate"("createdAt");

-- CreateIndex
CREATE INDEX "Candidate_email_idx" ON "public"."Candidate"("email");

-- CreateIndex
CREATE INDEX "Candidate_phone_idx" ON "public"."Candidate"("phone");

-- CreateIndex
CREATE INDEX "Candidate_source_idx" ON "public"."Candidate"("source");

-- CreateIndex
CREATE INDEX "Candidate_workExperience_idx" ON "public"."Candidate"("workExperience");

-- CreateIndex
CREATE INDEX "Candidate_isDeleted_idx" ON "public"."Candidate"("isDeleted");

-- CreateIndex
CREATE INDEX "Candidate_deletedAt_idx" ON "public"."Candidate"("deletedAt");

-- CreateIndex
CREATE INDEX "Candidate_status_departmentId_idx" ON "public"."Candidate"("status", "departmentId");

-- CreateIndex
CREATE INDEX "Candidate_status_postId_idx" ON "public"."Candidate"("status", "postId");

-- CreateIndex
CREATE INDEX "Candidate_status_createdAt_idx" ON "public"."Candidate"("status", "createdAt");

-- CreateIndex
CREATE INDEX "Candidate_isDeleted_status_idx" ON "public"."Candidate"("isDeleted", "status");

-- CreateIndex
CREATE INDEX "Candidate_departmentId_isDeleted_idx" ON "public"."Candidate"("departmentId", "isDeleted");

-- CreateIndex
CREATE INDEX "Candidate_postId_status_idx" ON "public"."Candidate"("postId", "status");

-- CreateIndex
CREATE INDEX "CandidateStatusHistory_candidateId_idx" ON "public"."CandidateStatusHistory"("candidateId");

-- CreateIndex
CREATE INDEX "CandidateStatusHistory_operatorId_idx" ON "public"."CandidateStatusHistory"("operatorId");

-- CreateIndex
CREATE INDEX "CandidateStatusHistory_toStatus_idx" ON "public"."CandidateStatusHistory"("toStatus");

-- CreateIndex
CREATE INDEX "CandidateStatusHistory_createdAt_idx" ON "public"."CandidateStatusHistory"("createdAt");

-- CreateIndex
CREATE INDEX "CandidateStatusHistory_candidateId_createdAt_idx" ON "public"."CandidateStatusHistory"("candidateId", "createdAt");

-- CreateIndex
CREATE INDEX "CandidateStatusHistory_candidateId_toStatus_idx" ON "public"."CandidateStatusHistory"("candidateId", "toStatus");

-- CreateIndex
CREATE INDEX "DepartmentAssessment_candidateId_idx" ON "public"."DepartmentAssessment"("candidateId");

-- CreateIndex
CREATE INDEX "DepartmentAssessment_assessorId_idx" ON "public"."DepartmentAssessment"("assessorId");

-- CreateIndex
CREATE INDEX "DepartmentAssessment_result_idx" ON "public"."DepartmentAssessment"("result");

-- CreateIndex
CREATE INDEX "DepartmentAssessment_assessedAt_idx" ON "public"."DepartmentAssessment"("assessedAt");

-- CreateIndex
CREATE INDEX "DepartmentAssessment_candidateId_result_idx" ON "public"."DepartmentAssessment"("candidateId", "result");

-- CreateIndex
CREATE INDEX "Interview_candidateId_idx" ON "public"."Interview"("candidateId");

-- CreateIndex
CREATE INDEX "Interview_postId_idx" ON "public"."Interview"("postId");

-- CreateIndex
CREATE INDEX "Interview_status_idx" ON "public"."Interview"("status");

-- CreateIndex
CREATE INDEX "Interview_scheduledAt_idx" ON "public"."Interview"("scheduledAt");

-- CreateIndex
CREATE INDEX "Interview_round_idx" ON "public"."Interview"("round");

-- CreateIndex
CREATE INDEX "Interview_isDeleted_idx" ON "public"."Interview"("isDeleted");

-- CreateIndex
CREATE INDEX "Interview_deletedAt_idx" ON "public"."Interview"("deletedAt");

-- CreateIndex
CREATE INDEX "Interview_candidateId_status_idx" ON "public"."Interview"("candidateId", "status");

-- CreateIndex
CREATE INDEX "Interview_candidateId_round_idx" ON "public"."Interview"("candidateId", "round");

-- CreateIndex
CREATE INDEX "Interview_isDeleted_status_idx" ON "public"."Interview"("isDeleted", "status");

-- CreateIndex
CREATE INDEX "Interview_scheduledAt_status_idx" ON "public"."Interview"("scheduledAt", "status");

-- CreateIndex
CREATE INDEX "InterviewTask_interviewId_idx" ON "public"."InterviewTask"("interviewId");

-- CreateIndex
CREATE INDEX "InterviewTask_interviewerId_idx" ON "public"."InterviewTask"("interviewerId");

-- CreateIndex
CREATE INDEX "InterviewTask_status_idx" ON "public"."InterviewTask"("status");

-- CreateIndex
CREATE INDEX "InterviewTask_scheduledAt_idx" ON "public"."InterviewTask"("scheduledAt");

-- CreateIndex
CREATE INDEX "InterviewTask_sequence_idx" ON "public"."InterviewTask"("sequence");

-- CreateIndex
CREATE INDEX "InterviewTask_isDeleted_idx" ON "public"."InterviewTask"("isDeleted");

-- CreateIndex
CREATE INDEX "InterviewTask_deletedAt_idx" ON "public"."InterviewTask"("deletedAt");

-- CreateIndex
CREATE INDEX "InterviewTask_interviewId_sequence_idx" ON "public"."InterviewTask"("interviewId", "sequence");

-- CreateIndex
CREATE INDEX "InterviewTask_interviewerId_status_idx" ON "public"."InterviewTask"("interviewerId", "status");

-- CreateIndex
CREATE INDEX "InterviewTask_isDeleted_status_idx" ON "public"."InterviewTask"("isDeleted", "status");

-- CreateIndex
CREATE INDEX "InterviewTask_feedbackAt_idx" ON "public"."InterviewTask"("feedbackAt");

-- CreateIndex
CREATE INDEX "Notification_receiverId_idx" ON "public"."Notification"("receiverId");

-- CreateIndex
CREATE INDEX "Notification_isRead_idx" ON "public"."Notification"("isRead");

-- CreateIndex
CREATE INDEX "Notification_type_idx" ON "public"."Notification"("type");

-- CreateIndex
CREATE INDEX "Notification_sentAt_idx" ON "public"."Notification"("sentAt");

-- CreateIndex
CREATE INDEX "Notification_receiverId_isRead_idx" ON "public"."Notification"("receiverId", "isRead");

-- CreateIndex
CREATE INDEX "Notification_relatedPostId_idx" ON "public"."Notification"("relatedPostId");

-- CreateIndex
CREATE INDEX "Notification_relatedCandidateId_idx" ON "public"."Notification"("relatedCandidateId");

-- CreateIndex
CREATE INDEX "OperationLog_userId_idx" ON "public"."OperationLog"("userId");

-- CreateIndex
CREATE INDEX "OperationLog_module_idx" ON "public"."OperationLog"("module");

-- CreateIndex
CREATE INDEX "OperationLog_objectType_idx" ON "public"."OperationLog"("objectType");

-- CreateIndex
CREATE INDEX "OperationLog_objectId_idx" ON "public"."OperationLog"("objectId");

-- CreateIndex
CREATE INDEX "OperationLog_action_idx" ON "public"."OperationLog"("action");

-- CreateIndex
CREATE INDEX "OperationLog_result_idx" ON "public"."OperationLog"("result");

-- CreateIndex
CREATE INDEX "OperationLog_createdAt_idx" ON "public"."OperationLog"("createdAt");

-- CreateIndex
CREATE INDEX "OperationLog_userId_createdAt_idx" ON "public"."OperationLog"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "OperationLog_module_createdAt_idx" ON "public"."OperationLog"("module", "createdAt");

-- CreateIndex
CREATE INDEX "OperationLog_module_action_idx" ON "public"."OperationLog"("module", "action");

-- CreateIndex
CREATE INDEX "OperationLog_objectType_objectId_idx" ON "public"."OperationLog"("objectType", "objectId");

-- CreateIndex
CREATE INDEX "Attachment_uploaderId_idx" ON "public"."Attachment"("uploaderId");

-- CreateIndex
CREATE INDEX "Attachment_fileType_idx" ON "public"."Attachment"("fileType");

-- CreateIndex
CREATE INDEX "Attachment_category_idx" ON "public"."Attachment"("category");

-- CreateIndex
CREATE INDEX "Attachment_entityType_entityId_idx" ON "public"."Attachment"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "Attachment_isDeleted_idx" ON "public"."Attachment"("isDeleted");

-- CreateIndex
CREATE INDEX "Attachment_createdAt_idx" ON "public"."Attachment"("createdAt");

-- CreateIndex
CREATE INDEX "Attachment_uploaderId_isDeleted_idx" ON "public"."Attachment"("uploaderId", "isDeleted");

-- CreateIndex
CREATE INDEX "Attachment_entityType_isDeleted_idx" ON "public"."Attachment"("entityType", "isDeleted");

-- CreateIndex
CREATE INDEX "_PermissionToRole_B_index" ON "public"."_PermissionToRole"("B");

-- AddForeignKey
ALTER TABLE "public"."User" ADD CONSTRAINT "User_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "public"."Department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Department" ADD CONSTRAINT "Department_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "public"."Department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Department" ADD CONSTRAINT "Department_leaderId_fkey" FOREIGN KEY ("leaderId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Department" ADD CONSTRAINT "Department_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "public"."Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserRole" ADD CONSTRAINT "UserRole_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserRole" ADD CONSTRAINT "UserRole_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "public"."Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Permission" ADD CONSTRAINT "Permission_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "public"."Permission"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Post" ADD CONSTRAINT "Post_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "public"."Department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Post" ADD CONSTRAINT "Post_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Candidate" ADD CONSTRAINT "Candidate_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "public"."Department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Candidate" ADD CONSTRAINT "Candidate_postId_fkey" FOREIGN KEY ("postId") REFERENCES "public"."Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Candidate" ADD CONSTRAINT "Candidate_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CandidateStatusHistory" ADD CONSTRAINT "CandidateStatusHistory_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "public"."Candidate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CandidateStatusHistory" ADD CONSTRAINT "CandidateStatusHistory_operatorId_fkey" FOREIGN KEY ("operatorId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DepartmentAssessment" ADD CONSTRAINT "DepartmentAssessment_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "public"."Candidate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DepartmentAssessment" ADD CONSTRAINT "DepartmentAssessment_assessorId_fkey" FOREIGN KEY ("assessorId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Interview" ADD CONSTRAINT "Interview_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "public"."Candidate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Interview" ADD CONSTRAINT "Interview_postId_fkey" FOREIGN KEY ("postId") REFERENCES "public"."Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."InterviewTask" ADD CONSTRAINT "InterviewTask_interviewId_fkey" FOREIGN KEY ("interviewId") REFERENCES "public"."Interview"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."InterviewTask" ADD CONSTRAINT "InterviewTask_interviewerId_fkey" FOREIGN KEY ("interviewerId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Notification" ADD CONSTRAINT "Notification_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Notification" ADD CONSTRAINT "Notification_relatedPostId_fkey" FOREIGN KEY ("relatedPostId") REFERENCES "public"."Post"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Notification" ADD CONSTRAINT "Notification_relatedCandidateId_fkey" FOREIGN KEY ("relatedCandidateId") REFERENCES "public"."Candidate"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."OperationLog" ADD CONSTRAINT "OperationLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Attachment" ADD CONSTRAINT "Attachment_uploaderId_fkey" FOREIGN KEY ("uploaderId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_PermissionToRole" ADD CONSTRAINT "_PermissionToRole_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Permission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_PermissionToRole" ADD CONSTRAINT "_PermissionToRole_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;
