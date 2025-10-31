
import { PetitionFormData } from "@/types/forms";
import { FileText } from "lucide-react";

interface DocumentPreviewProps {
  formData: PetitionFormData;
}

const DocumentPreview = ({ formData }: DocumentPreviewProps) => {
  // Helper function to display field values with fallback
  const displayField = (value: string, fallback: string = "___________") => {
    return value.trim() ? value : fallback;
  };

  // Format date in a readable format when available
  const formatDate = (dateString: string) => {
    if (!dateString) return "___________";
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString; // If invalid date, return as is
      
      // Return in YYYY-MM-DD format
      return date.toISOString().split('T')[0];
    } catch (error) {
      return dateString; // If error parsing, return as is
    }
  };

  return (
    <div className="bg-asklegal-dark rounded-lg border border-asklegal-purple/30 overflow-hidden flex flex-col h-full">
      <div className="p-4 bg-asklegal-purple/10 border-b border-asklegal-purple/30 flex justify-between items-center">
        <h3 className="text-lg font-medium text-asklegal-purple">Document Preview</h3>
      </div>
      
      <div className="p-6 flex-1 overflow-auto">
        <div className="bg-white text-gray-900 p-8 shadow-lg min-h-[842px] w-full max-w-[595px] mx-auto animate-paper-print">
          <div className="text-center mb-6">
            <h1 className="text-xl font-nepali font-bold">श्री सर्वोच्च अदालत, काठमाडौँमा पेश गरेको</h1>
            <h2 className="text-lg font-nepali font-bold">निवेदन पत्र</h2>
          </div>
          
          <div className="mb-6">
            <p className="font-nepali text-center">
              विषय : {displayField(formData.subject)}
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="font-nepali mb-1">मुद्दा र. नं. {displayField(formData.caseNumber)}</p>
              <p className="font-nepali mb-1">
                को छोरा, जिल्ला {displayField(formData.applicantDistrictName)} {displayField(formData.applicantMunicipality)} वडा नं. {displayField(formData.applicantWardNumber)}
              </p>
              <p className="font-nepali mb-1">
                बस्ने वर्ष {displayField(formData.residentYears)} को {displayField(formData.applicantName)}
              </p>
              <p className="font-nepali mb-1">
                {displayField(formData.applicantAdditionalInfo)}
              </p>
              <p className="font-nepali">निवेदक</p>
            </div>
            
            <div>
              <p className="font-nepali mb-4">विरुद्ध</p>
              <p className="font-nepali mb-1">
                को छोरा, जिल्ला {displayField(formData.opponentDistrictName)} {displayField(formData.opponentMunicipality)} वडा नं. {displayField(formData.opponentWardNumber)}
              </p>
              <p className="font-nepali mb-1">
                बस्ने वर्ष {displayField(formData.opponentYearsOfResidence)} को {displayField(formData.opponentName)}
              </p>
              <p className="font-nepali mb-1">
                {displayField(formData.opponentAdditionalInfo)}
              </p>
              <p className="font-nepali">विपक्षी</p>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="font-nepali font-bold mb-2">मुद्दा– {displayField(formData.mudda)}</h3>
            <p className="font-nepali ml-4">
              निवेदनबापत लाग्ने दस्तुर रु.१०।– साथै राखी निम्नानुसार निवेदन गर्दछु/गर्दछौँ :
            </p>
          </div>
          
          <div className="mb-6">
            <ol className="list-decimal pl-6 space-y-4">
              <li className="font-nepali">
                {formData.petitionDetails || "उक्त मुद्दामा मैले/हामीले जिल्ला न.पा./गा.पा. वडा नं बस्ने लाई वारिस राख्न अख्तियारनामा लेखिदिएको र निज वारिसलाई यस अदालतबाट मिति गतेको तारिख तोकिएकोमा म/हामी आफै तारिखमा रहने हुँदा मुलुकी देवानी कार्यविधि संहिता, २०७४ को दफा १५२ बमोजिम आफ्नो मुद्दाको तारिख आफै सकार गरिपाउँ।"}
              </li>
              <li className="font-nepali">
                {formData.demands || "लेखिएको व्यहोरा ठिक साँचो हो फरक ठहरे कानूनबमोजिम सहुँला बुझाउँला।"}
              </li>
            </ol>
          </div>
          
          <div className="text-right mt-12">
            <p className="font-nepali">निवेदक</p>
            <p className="font-nepali">नाम: {displayField(formData.applicantName)}</p>
            <p className="font-nepali">मिति: {formData.dateBS ? displayField(formData.dateBS) : formatDate(formData.date)}</p>
          </div>
          
          <div className="mt-16 pt-4 border-t border-gray-300 text-xs text-gray-500">
            <p className="font-nepali">नोट : (१) यो निवेदनको छाँचा सेवाग्राहीको सहजताको लागि अदालतबाट नि:शुल्क रुपमा उपलब्ध हुने र व्यहोरा भर्ने तरसकिनेरुलाई अदालतबाट भरिदिने व्यवस्था छ।</p>
            <p className="font-nepali">(२) असमर्थ पक्षलाई नि:शुल्क कानूनी सेवा उपलब्ध छ।</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentPreview;
