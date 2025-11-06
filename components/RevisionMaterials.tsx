import React, { useState } from 'react';
import ArrowLeftIcon from './icons/ArrowLeftIcon';
import MathIcon from './icons/MathIcon';
import PhysicsIcon from './icons/PhysicsIcon';
import ChemistryIcon from './icons/ChemistryIcon';
import BiologyIcon from './icons/BiologyIcon';
import EnglishIcon from './icons/EnglishIcon';
import SocialScienceIcon from './icons/SocialScienceIcon';
import { generateFlashcards, generateRevisionNotes } from '../services/geminiService';
import { Flashcard } from '../types';
import ModuleDetailView from './ModuleDetailView';

// Define the Module interface
interface Module {
  id: string;
  moduleNumber: number;
  title: string;
  description: string;
  resources: any[];
  lessons: any[];
  content?: string; // For storing module-specific content
}

const biologyModules: Module[] = [
  {
    id: "bio-mod-1",
    moduleNumber: 1,
    title: "Microorganisms: Friend and Foe",
    description: "Learn about the world of microorganisms, their types, uses, and harmful effects.",
    resources: [],
    lessons: [],
    content: `CHAPTER 2 MICROORGANISMS: FRIEND AND FOE
You have seen several kinds of plants and animals. However, there are other living organisms around us which we normally cannot see. These are called microorganisms or microbes. For example, you might have observed that during the rainy season moist bread gets spoilt and its surface gets covered with greyish white patches. Observe these patches through a magnifying glass. You will see tiny, black rounded structures. Do you know what these structures are and where do these come from?
2.1 Microorganisms
These observations show that water and soil are full of tiny organisms, though not all of them fall into the category of microbes. These microorganisms or microbes are so small in size that they cannot be seen with the unaided eye. Some of these, such as the fungus that grows on bread, can be seen with a magnifying glass. Others cannot be seen without the help of a microscope. That is why these are called microorganisms or microbes.
Microorganisms are classified into four major groups. These groups are bacteria, fungi, protozoa and some algae.
Viruses are also microscopic but are different from other microorganisms. They, however, reproduce only inside the cells of the host organism, which may be a bacterium, plant or animal. Common ailments like cold, influenza (flu) and most coughs are caused by viruses. Serious diseases like polio and chicken pox are also caused by viruses. Diseases like dysentery and malaria are caused by protozoa(protozoans) whereas typhoid and tuberculosis (TB) are bacterial diseases.
2.2 Where do Microorganisms Live?
Microorganisms may be single-celled like bacteria, some algae and protozoa, or multicellular, such as many algae and fungi. They live in all types of environment, ranging from ice cold climate to hot springs; and deserts to marshy lands. They are also found inside the bodies of animals including humans. Some microorganisms grow on other organisms while others exist freely.
2.3 Microorganisms and Us
Microorganisms play an important role in our lives. Some of them are beneficial in many ways whereas some others are harmful and cause diseases.
Friendly Microorganisms
Microorganisms are used for various purposes. They are used in the preparation of curd, bread and cake, and for the production of alcohol since ages. They are also used in cleaning up of the environment, breaking down organic wastes. In agriculture they are used to increase soil fertility by fixing nitrogen. The bacterium Lactobacillus promotes the formation of curd.
Commercial Use of Microorganisms
Microorganisms are used for the large scale production of alcohol, wine and acetic acid (vinegar). Yeast is used for commercial production of alcohol and wine. The process of conversion of sugar into alcohol is known as fermentation.
Medicinal Use of Microorganisms
Medicines produced from microorganisms to kill or stop the growth of disease-causing microorganisms are called antibiotics. Penicillin, Streptomycin, tetracycline and erythromycin are common antibiotics.
Vaccine
When a disease-carrying microbe enters our body, the body produces antibodies to fight the invader. A vaccine contains dead or weakened microbes, which when introduced into the body, stimulate the production of suitable antibodies. These antibodies remain in the body and protect us from the disease-causing microbes. Diseases like cholera, tuberculosis, smallpox and hepatitis can be prevented by vaccination.
Increasing Soil Fertility
Some bacteria are able to fix nitrogen from the atmosphere to enrich soil with nitrogen and increase its fertility. These microbes are commonly called biological nitrogen fixers.
Cleaning the Environment
Microorganisms decompose dead organic waste of plants and animals converting them into simple substances. These substances are again used by other plants and animals.
2.4 Harmful Microorganisms
Microorganisms that cause diseases are called pathogens. Pathogens enter our body through air, water, or food. They can also get transmitted by direct contact or carried by an animal. Microbial diseases that can spread from an infected person to a healthy person are called communicable diseases, e.g., cholera, common cold, chicken pox and tuberculosis.
Insects and animals which carry disease-causing microbes are called carriers. Housefly and female Anopheles mosquito (carries parasite of malaria) are examples.
Food Preservation
Chemicals used to check the growth of microorganisms are called preservatives. Common salt, sugar, edible oils and vinegar are common preservatives. Pasteurisation is a process in which milk is heated to about 70°C for 15 to 30 seconds and then suddenly chilled and stored to prevent the growth of microbes.
2.7 Nitrogen cycle
Certain bacteria and blue green algae present in the soil fix nitrogen from the atmosphere and convert it into compounds of nitrogen. These are then utilised by plants. When plants and animals die, bacteria and fungi present in the soil convert the nitrogenous wastes into nitrogenous compounds to be used by plants again. Certain other bacteria convert some part of them to nitrogen gas which goes back into the atmosphere.`
  },
  {
    id: "bio-mod-2",
    moduleNumber: 2,
    title: "Coal and Petroleum",
    description: "Overview of coal formation, types, petroleum, and uses",
    resources: [],
    lessons: []
  },
  {
    id: "bio-mod-3",
    moduleNumber: 3,
    title: "Crop Production and Management",
    description: "Learn about agricultural practices, crop management techniques, and sustainable farming",
    resources: [],
    lessons: []
  },
  {
    id: "bio-mod-4",
    moduleNumber: 4,
    title: "Conservation of Plants and Animals",
    description: "Understanding biodiversity, endangered species, and conservation efforts",
    resources: [],
    lessons: []
  },
  {
    id: "bio-mod-5",
    moduleNumber: 5,
    title: "Module 5",
    description: "Coming soon...",
    resources: [],
    lessons: []
  }
];

const subjects = [
  { name: 'Mathematics', chapters: 15, Icon: MathIcon, iconBg: 'bg-blue-100', iconColor: 'text-blue-600' },
  { name: 'Physics', chapters: 12, Icon: PhysicsIcon, iconBg: 'bg-purple-100', iconColor: 'text-purple-600' },
  { name: 'Chemistry', chapters: 14, Icon: ChemistryIcon, iconBg: 'bg-green-100', iconColor: 'text-green-600' },
  { name: 'Biology', chapters: 16, Icon: BiologyIcon, iconBg: 'bg-teal-100', iconColor: 'text-teal-600' },
  { name: 'English', chapters: 10, Icon: EnglishIcon, iconBg: 'bg-orange-100', iconColor: 'text-orange-600' },
  { name: 'Social Science', chapters: 18, Icon: SocialScienceIcon, iconBg: 'bg-red-100', iconColor: 'text-red-600' },
];

type Subject = typeof subjects[0];

interface SubjectCardProps {
  subject: Subject;
  onClick: () => void;
}

const SubjectCard: React.FC<SubjectCardProps> = ({ subject, onClick }) => (
    <div onClick={onClick} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${subject.iconBg}`}>
            <subject.Icon className={`w-7 h-7 ${subject.iconColor}`} />
        </div>
        <div className="mt-4">
            <h3 className="text-lg font-bold text-slate-900">{subject.name}</h3>
            <p className="text-sm text-slate-500 mt-1">{subject.chapters} Chapters</p>
        </div>
    </div>
);

const RevisionMaterials: React.FC = () => {
    const [view, setView] = useState<'subjects' | 'modules' | 'moduleDetail'>('subjects');
    const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
    const [selectedModule, setSelectedModule] = useState<Module | null>(null);
    const [notes, setNotes] = useState('');
    const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubjectClick = (subject: Subject) => {
        if (subject.name !== 'Biology') {
            // Don't show alert for other subjects, just return
            return;
        }
        setSelectedSubject(subject);
        setView('modules');
    };
    
    const handleModuleClick = async (module: Module) => {
        setSelectedModule(module);
        setView('moduleDetail');
        setIsLoading(true);
        setError(null);
        setNotes('');
        setFlashcards([]);
        try {
            // Use module-specific content if available, otherwise use default content
            const content = module.content || `Content for ${module.title} will be generated here.`;
            const [notesResult, flashcardsResult] = await Promise.all([
                generateRevisionNotes(content),
                generateFlashcards(content)
            ]);
            setNotes(notesResult);
            setFlashcards(flashcardsResult);
        } catch (e: any) {
            setError(e.message || 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleBack = () => {
        if (view === 'moduleDetail') {
            setView('modules');
        } else if (view === 'modules') {
            setView('subjects');
            setSelectedSubject(null);
            setSelectedModule(null);
        }
    }

    if (view === 'moduleDetail' && selectedSubject && selectedModule) {
        return <ModuleDetailView 
                    subjectName={selectedSubject.name}
                    moduleName={selectedModule.title}
                    notes={notes}
                    flashcards={flashcards}
                    isLoading={isLoading}
                    error={error}
                    onBack={handleBack}
                />
    }
    
    if (view === 'modules' && selectedSubject) {
       // Filter modules for Biology subject
       const subjectModules = biologyModules.filter(module => 
         module.moduleNumber >= 1 && module.moduleNumber <= 5
       ).sort((a, b) => a.moduleNumber - b.moduleNumber);
       
       return (
         <div className="bg-slate-100 p-4 md:p-0 rounded-xl">
            <div className="mb-6">
                <button onClick={handleBack} className="flex items-center text-slate-700 hover:text-slate-900 font-semibold text-lg">
                    <ArrowLeftIcon className="w-5 h-5 mr-3" />
                    Back to Subjects
                </button>
            </div>
             <h2 className="text-2xl font-bold mb-6 text-slate-800">Modules for {selectedSubject.name}</h2>
             <div className="space-y-4">
                {subjectModules.map(module => (
                  module.moduleNumber === 1 ? (
                    // Only Module 1 is clickable
                    <div 
                      key={module.id} 
                      onClick={() => handleModuleClick(module)} 
                      className="bg-white p-5 rounded-lg shadow-sm border border-slate-200 hover:shadow-md transition-shadow cursor-pointer"
                    >
                      <h3 className="font-bold text-indigo-600">Module {module.moduleNumber}: {module.title}</h3>
                      <p className="text-sm text-slate-500 mt-1">{module.description}</p>
                    </div>
                  ) : (
                    // Modules 2-5 are placeholders (not clickable) with same color scheme as Module 1
                    <div 
                      key={module.id} 
                      className="bg-white p-5 rounded-lg shadow-sm border border-slate-200"
                    >
                      <h3 className="font-bold text-indigo-600">Module {module.moduleNumber}: {module.title}</h3>
                      <p className="text-sm text-slate-500 mt-1">{module.description}</p>
                    </div>
                  )
                ))}
             </div>
        </div>
       )
    }

    return (
        <div className="bg-slate-100 p-4 md:p-0 rounded-xl">
            <div className="mb-6">
                <button className="flex items-center text-slate-700 hover:text-slate-900 font-semibold text-lg cursor-default">
                    <ArrowLeftIcon className="w-5 h-5 mr-3" />
                    School Exam Mode
                </button>
                <p className="text-slate-500 ml-8 text-sm">Select a subject to begin</p>
            </div>
            
            <h2 className="text-2xl font-bold mb-6 text-slate-800">Choose Your Subject</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {subjects.map(subject => (
                    <SubjectCard 
                        key={subject.name} 
                        subject={subject}
                        onClick={() => handleSubjectClick(subject)}
                    />
                ))}
            </div>
        </div>
    );
};

export default RevisionMaterials;