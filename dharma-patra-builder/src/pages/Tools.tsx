
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Translator from "@/components/tools/Translator";
import DateConverter from "@/components/date-converter/DateConverter";
import { CalendarClock, Languages } from "lucide-react";

const Tools = () => {
  const [searchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState("translator");
  
  useEffect(() => {
    if (tabParam === 'date-converter' || tabParam === 'translator') {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-asklegal-heading">Legal Tools</h1>
          <p className="text-asklegal-text/70 mt-2">
            Helpful utilities for legal professionals in Nepal
          </p>
        </div>

        <Tabs 
          defaultValue="translator" 
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
            <TabsTrigger value="translator" className="flex items-center gap-2">
              <Languages className="h-4 w-4" />
              <span>Translator</span>
            </TabsTrigger>
            <TabsTrigger value="date-converter" className="flex items-center gap-2">
              <CalendarClock className="h-4 w-4" />
              <span>Date Converter</span>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="translator">
            <Translator />
          </TabsContent>
          <TabsContent value="date-converter">
            <div className="card-glassmorphism shadow-md p-4 rounded-lg">
              <DateConverter />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Tools;
