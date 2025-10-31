
import { LegalDocument } from "@/types/forms";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText } from "lucide-react";

interface DocumentListProps {
  documents: LegalDocument[];
  setSelectedDocument: (doc: LegalDocument | null) => void;
}

const DocumentList = ({ documents, setSelectedDocument }: DocumentListProps) => {
  const categorizeDocuments = (category: string) => {
    return documents.filter(doc => doc.category === category);
  };

  const DocumentItem = ({ doc }: { doc: LegalDocument }) => (
    <div 
      className="flex items-center gap-3 p-3 hover:bg-asklegal-purple/10 rounded cursor-pointer border border-transparent hover:border-asklegal-purple/20"
      onClick={() => setSelectedDocument(doc)}
    >
      <FileText className="h-4 w-4 text-asklegal-purple flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <h4 className="text-asklegal-text font-nepali text-sm font-medium truncate">{doc.title}</h4>
        <p className="text-xs text-asklegal-text/60 mt-1">{doc.titleEn}</p>
        <div className="flex gap-2 mt-1">
          <span className="text-xs text-asklegal-text/50">{doc.year}</span>
          <span className="text-xs text-asklegal-text/50">• {doc.ministry}</span>
        </div>
      </div>
    </div>
  );

  const categories = [
    { value: 'abuse-of-authority', label: 'Abuse of Authority (अख्तियार दुरुपयोग)' },
    { value: 'corruption', label: 'Corruption (भ्रष्टाचार)' },
    { value: 'crime', label: 'Crime (अपराध)' },
    { value: 'judicial-procedure', label: 'Judicial Procedure (देवानिकार्यबिधि)' },
    { value: 'civil', label: 'Civil Law (देवानी)' },
    { value: 'criminal', label: 'Criminal Law (फौजदारी)' },
    { value: 'medical-education', label: 'Medical Education Act (चिकित्सा शिक्षा ऐन)' },
    { value: 'human-rights', label: 'Human Rights (मानव अधिकार)' },
    { value: 'drug-regulation', label: 'Drug Regulation (लागू औषध)' },
    { value: 'electronic-transaction', label: 'Electronic Transaction (इलेक्ट्रोनिक ट्रान्जेक्सन)' },
    { value: 'disaster-risk', label: 'Disaster Risk Management (विपद जोखिम)' },
    { value: 'disability-rights', label: 'Disability Rights (अपाङ्गता अधिकार)' },
    { value: 'personal-privacy', label: 'Personal Privacy (व्यक्तिगत गोपनीयता)' },
    { value: 'education', label: 'Education (शिक्षा)' },
    { value: 'labor', label: 'Labor (श्रम)' },
    { value: 'communicable-diseases', label: 'Communicable Diseases (सङ्क्रामक रोग)' },
    { value: 'transportation', label: 'Transportation (सवारी तथा यातायात)' },
    { value: 'cooperatives', label: 'Cooperatives (सहकारी)' },
    { value: 'public-procurement', label: 'Public Procurement Act (सार्वजनिक खरिद ऐन)' },
    { value: 'good-governance', label: 'Good Governance (सुशासन)' },
    { value: 'right-to-information', label: 'Right to Information (सूचना को हक)' }
  ];
  
  return (
    <div className="card-glassmorphism p-0 overflow-hidden">
      <div className="p-4 bg-asklegal-purple/10 border-b border-asklegal-purple/30">
        <h2 className="text-lg font-medium text-asklegal-heading">
          Acts and legislative provisions
        </h2>
      </div>
      <div className="p-4">
        <Tabs defaultValue="abuse-of-authority" className="w-full">
          <div className="space-y-2 mb-4">
            {categories.map((category) => (
              <TabsList key={category.value} className="w-full bg-asklegal-card-bg text-asklegal-text h-auto">
                <TabsTrigger 
                  value={category.value} 
                  className="w-full data-[state=active]:text-asklegal-heading data-[state=active]:bg-asklegal-purple/10 text-sm p-3 text-left justify-start"
                >
                  {category.label}
                </TabsTrigger>
              </TabsList>
            ))}
          </div>
          
          <div className="space-y-1 max-h-96 overflow-y-auto">
            {categories.map((category) => (
              <TabsContent key={category.value} value={category.value} className="space-y-1 mt-0">
                {categorizeDocuments(category.value).map((doc) => (
                  <DocumentItem key={doc.id} doc={doc} />
                ))}
              </TabsContent>
            ))}
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default DocumentList;
