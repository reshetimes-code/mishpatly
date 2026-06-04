export type JudgmentStatus = 'PUBLISHED' | 'DRAFT' | 'HIDDEN' | 'PENDING_REVIEW';
export type RemovalStatus = 'NEW' | 'IN_PROGRESS' | 'APPROVED' | 'REJECTED';
export type UserRole = 'ADMIN' | 'EDITOR' | 'VIEWER';

export interface Judgment {
  id: number;
  title: string;
  slug: string;
  caseNumber: string;
  courtName: string;
  procedureType: string | null;
  judgmentDate: string;
  judge: string | null;
  plaintiff: string | null;
  defendant: string | null;
  parties: string | null;
  summary: string | null;
  fullText: string | null;
  sourceUrl: string | null;
  pdfUrl: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  status: JudgmentStatus;
  isIndexable: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RemovalRequest {
  id: number;
  judgmentId: number | null;
  fullName: string;
  phone: string | null;
  email: string;
  reason: string;
  documentUrl: string | null;
  status: RemovalStatus;
  createdAt: string;
  updatedAt: string;
  judgment?: Judgment;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface SearchResult {
  judgments: Judgment[];
  total: number;
  page: number;
  totalPages: number;
}

export interface AdminStats {
  totalJudgments: number;
  publishedCount: number;
  hiddenCount: number;
  pendingRemovals: number;
  recentJudgments: Judgment[];
  recentRemovals: RemovalRequest[];
}
