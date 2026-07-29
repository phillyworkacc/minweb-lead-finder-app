type LeadCollection = {
   id: number;
   leadCollectionsId: string;
   name: string;
   date: string;
}

type Lead = {
   id: number;
   leadCollectionsId: string;
   leadId: string;
   name: string;
   email: string;
   address: string;
   phoneNumber: string;
   website: string;
   called: string;
   starred: boolean;
}

type WebsiteAuditReport = {
   id: number;
   auditId: string;
   leadCollectionsId: string;
   leadId: string;
   auditJson: string;
   date: string;
}

type Folder = {
   id: string;
   folderId: string;
   name: string;
}

type WebsiteAuditReportExtra = WebsiteAuditReport & {
   name?: string;
}

type WebsiteAudit = {
   title: string;
   website: any;
   auditPoints: {
      issue: string;
      detail: string;
   }[];
}