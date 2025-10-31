import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import PetitionForm from "@/components/forms/PetitionForm";
import DocumentPreview from "@/components/forms/DocumentPreview";
import { PetitionFormData } from "@/types/forms";
import { Link } from "react-router-dom";
import { Search, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

const Forms = () => {
  const [formData, setFormData] = useState<PetitionFormData>({
    subject: "दाखिल खारेज गरिपाउँ।",
    applicantName: "",
    district: "",
    address: "",
    residentYears: "",
    opponentName: "",
    opponentPosition: "",
    opponentOffice: "",
    petitionDetails: "",
    demands: "",
    date: new Date().toISOString().split('T')[0],
    caseNumber: "",
    issueNumber: "",
    applicantMunicipality: "",
    applicantDistrictName: "",
    applicantAdditionalInfo: "",
    applicantWardNumber: "",
    applicantFatherName: "",
    opponentMunicipality: "",
    mukuda: "",
    opponentAdditionalInfo: "",
    opponentFatherName: "",
    opponentDistrictName: "",
    opponentYearsOfResidence: "",
    opponentWardNumber: "",
    otherWardNumber: "",
    otherName: "",
    otherMunicipality: "",
    otherWardName: "",
    shubham: "",
    day: "",
    month: "",
    year: "",
    dateBS: ""
  });

  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-asklegal-purple">Judicial Petitions and Forms</h1>
            <p className="text-white/70 mt-2">
              Create, customize, and download legal petition documents.
            </p>
          </div>
          
          <div className="flex items-center">
            <Link to="/kanoon-search">
              <Button className="flex items-center gap-2 bg-asklegal-purple hover:bg-asklegal-accent">
                <Search size={18} />
                <span>कानून खोज</span>
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div>
            <PetitionForm formData={formData} onFormChange={setFormData} />
          </div>

          {/* Document Preview */}
          <div className="lg:sticky lg:top-4 lg:h-[calc(100vh-8rem)]">
            <DocumentPreview formData={formData} />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Forms;
