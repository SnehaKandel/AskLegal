
import MainLayout from "@/components/layout/MainLayout";
import DateConverter from "@/components/date-converter/DateConverter";

const DateConverterPage = () => {
  return (
    <MainLayout>
      <div className="container mx-auto py-6">
        <DateConverter />
      </div>
    </MainLayout>
  );
};

export default DateConverterPage;
