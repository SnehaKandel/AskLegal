import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { BookOpen } from 'lucide-react';

const Learn = () => {
  return (
    <MainLayout>
      <div className="container mx-auto py-16 px-4 text-center">
        <div className="max-w-3xl mx-auto bg-asklegal-dark/60 border border-asklegal-purple/30 rounded-lg p-10">
          <BookOpen size={80} className="text-asklegal-purple mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-asklegal-purple mb-4">Learning Center</h1>
          <p className="text-xl text-white/80 mb-10">
            This section is under development. New legal courses and educational materials will be added soon.
          </p>
          <Button className="bg-asklegal-purple hover:bg-asklegal-accent text-white">
            Notify Me
          </Button>
        </div>
      </div>
    </MainLayout>
  );
};

export default Learn;

