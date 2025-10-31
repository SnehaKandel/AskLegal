
import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { LegalDocument } from "@/types/forms";
import DocumentList from "@/components/kanoon/DocumentList";
import DocumentPreview from "@/components/kanoon/DocumentPreview";
import { MOCK_DOCUMENTS } from "@/data/mockDocuments";

const KanoonSearch = () => {
  const [selectedDocument, setSelectedDocument] = useState<LegalDocument | null>(null);

  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-asklegal-heading">नेपाल कानून खोज</h1>
          <p className="text-asklegal-text/80 mt-2">
            Browse and read Nepali laws, acts, and legislative provisions.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar - Document Categories */}
          <div className="lg:col-span-1">
            <DocumentList 
              documents={MOCK_DOCUMENTS} 
              setSelectedDocument={setSelectedDocument} 
            />
          </div>

          {/* Right Document Preview */}
          <div className="lg:col-span-2">
            <DocumentPreview 
              document={selectedDocument} 
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default KanoonSearch;
