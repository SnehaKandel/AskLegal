
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FormAccordionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const FormAccordion = ({ title, children, defaultOpen = false }: FormAccordionProps) => {
  return (
    <Accordion type="single" collapsible defaultValue={defaultOpen ? "item-1" : undefined} className="border border-asklegal-form-border/30 rounded-lg overflow-hidden backdrop-blur-sm">
      <AccordionItem value="item-1" className="border-0">
        <AccordionTrigger className="accordion-title hover:no-underline px-4 py-3 bg-asklegal-form-bg/50 border-b border-asklegal-form-border/30">
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-asklegal-accent"></span>
            {title}
          </span>
        </AccordionTrigger>
        <AccordionContent className="bg-asklegal-form-bg/30">
          <div className="pt-4 pb-2 p-6 space-y-4">
            {children}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default FormAccordion;
