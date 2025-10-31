import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeftRight, RotateCcw, Loader2, Languages } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

// Enhanced mock translations as fallback
const mockTranslations: Record<string, string> = {
  // Basic greetings and common phrases
  "hello": "नमस्ते",
  "namaste": "नमस्ते", 
  "hi": "नमस्ते",
  "good morning": "शुभ प्रभात",
  "good evening": "शुभ साँझ",
  "good night": "शुभ रात्री",
  "how are you": "तपाईंलाई कस्तो छ",
  "i am fine": "म ठीक छु",
  "thank you": "धन्यवाद",
  "please": "कृपया",
  "sorry": "माफ गर्नुहोस्",
  "excuse me": "माफ गर्नुहोस्",
  "yes": "हो",
  "no": "होइन",
  "maybe": "हुनसक्छ",
  
  // Legal terms
  "court": "अदालत",
  "judge": "न्यायाधीश",
  "lawyer": "वकिल",
  "law": "कानून",
  "legal": "कानुनी",
  "justice": "न्याय",
  "petition": "निवेदन",
  "case": "मुद्दा",
  "evidence": "प्रमाण",
  "witness": "साक्षी",
  "verdict": "फैसला",
  "appeal": "पुनरावेदन",
  "bail": "धरौटी",
  "fine": "जरिवाना",
  "penalty": "दण्ड",
  "crime": "अपराध",
  "criminal": "अपराधी",
  "civil": "नागरिक",
  "constitutional": "संवैधानिक",
  "rights": "अधिकार",
  "duty": "कर्तव्य",
  "obligation": "बाध्यता",
  "contract": "सम्झौता",
  "agreement": "सहमति",
  "property": "सम्पत्ति",
  "inheritance": "वंशाधिकार",
  "marriage": "विवाह",
  "divorce": "तलाक",
  "custody": "अभिभावकत्व",
  "adoption": "दत्तक",
  "citizenship": "नागरिकता",
  "passport": "राहदानी",
  "visa": "भिसा",
  "document": "कागजात",
  "certificate": "प्रमाणपत्र",
  "license": "अनुमतिपत्र",
  "registration": "दर्ता",
  "tax": "कर",
  "income": "आम्दानी",
  "business": "व्यापार",
  "company": "कम्पनी",
  "government": "सरकार",
  "ministry": "मन्त्रालय",
  "department": "विभाग",
  "office": "कार्यालय",
  "police": "प्रहरी",
  "hospital": "अस्पताल",
  "school": "विद्यालय",
  "university": "विश्वविद्यालय",
  
  // Family and personal
  "family": "परिवार",
  "father": "बुबा",
  "mother": "आमा",
  "son": "छोरा",
  "daughter": "छोरी",
  "brother": "दाज्यू/भाइ",
  "sister": "दिदी/बहिनी",
  "husband": "श्रीमान्",
  "wife": "श्रीमती",
  "friend": "साथी",
  "neighbor": "छिमेकी",
  
  // Common words
  "house": "घर",
  "home": "घर",
  "work": "काम",
  "job": "जागिर",
  "money": "पैसा",
  "food": "खाना",
  "water": "पानी",
  "time": "समय",
  "day": "दिन",
  "night": "रात",
  "today": "आज",
  "tomorrow": "भोलि",
  "yesterday": "हिजो",
  "week": "हप्ता",
  "month": "महिना",
  "year": "वर्ष",
  "book": "किताब",
  "paper": "कागज",
  "pen": "कलम",
  "phone": "फोन",
  "computer": "कम्प्युटर",
  "internet": "इन्टरनेट",
  "email": "इमेल",
  "address": "ठेगाना",
  "name": "नाम",
  "age": "उमेर",
  "place": "ठाउँ",
  "city": "शहर",
  "village": "गाउँ",
  "country": "देश",
  "nepal": "नेपाल",
  "kathmandu": "काठमाडौं",
  
  // Reverse translations (Nepali to English)
  "नमस्ते": "Hello",
  "शुभ प्रभात": "Good morning",
  "शुभ साँझ": "Good evening", 
  "शुभ रात्री": "Good night",
  "तपाईंलाई कस्तो छ": "How are you",
  "म ठीक छु": "I am fine",
  "धन्यवाद": "Thank you",
  "कृपया": "Please",
  "माफ गर्नुहोस्": "Sorry",
  "हो": "Yes",
  "होइन": "No",
  "हुनसक्छ": "Maybe",
  "अदालत": "Court",
  "न्यायाधीश": "Judge",
  "वकिल": "Lawyer",
  "कानून": "Law",
  "कानुनी": "Legal",
  "न्याय": "Justice",
  "निवेदन": "Petition",
  "मुद्दा": "Case",
  "प्रमाण": "Evidence",
  "साक्षी": "Witness",
  "फैसला": "Verdict",
  "पुनरावेदन": "Appeal",
  "धरौटी": "Bail",
  "जरिवाना": "Fine",
  "दण्ड": "Penalty",
  "अपराध": "Crime",
  "अपराधी": "Criminal",
  "नागरिक": "Civil",
  "संवैधानिक": "Constitutional",
  "अधिकार": "Rights",
  "कर्तव्य": "Duty",
  "बाध्यता": "Obligation",
  "सम्झौता": "Contract",
  "सहमति": "Agreement",
  "सम्पत्ति": "Property",
  "वंशाधिकार": "Inheritance",
  "विवाह": "Marriage",
  "तलाक": "Divorce",
  "अभिभावकत्व": "Custody",
  "दत्तक": "Adoption",
  "नागरिकता": "Citizenship",
  "राहदानी": "Passport",
  "भिसा": "Visa",
  "कागजात": "Document",
  "प्रमाणपत्र": "Certificate",
  "अनुमतिपत्र": "License",
  "दर्ता": "Registration",
  "कर": "Tax",
  "आम्दानी": "Income",
  "व्यापार": "Business",
  "कम्पनी": "Company",
  "सरकार": "Government",
  "मन्त्रालय": "Ministry",
  "विभाग": "Department",
  "कार्यालय": "Office",
  "प्रहरी": "Police",
  "अस्पताल": "Hospital",
  "विद्यालय": "School",
  "विश्वविद्यालय": "University",
  "परिवार": "Family",
  "बुबा": "Father",
  "आमा": "Mother",
  "छोरा": "Son",
  "छोरी": "Daughter",
  "दाज्यू": "Elder brother",
  "भाइ": "Brother",
  "दिदी": "Elder sister",
  "बहिनी": "Sister",
  "श्रीमान्": "Husband",
  "श्रीमती": "Wife",
  "साथी": "Friend",
  "छिमेकी": "Neighbor",
  "घर": "House",
  "काम": "Work",
  "जागिर": "Job",
  "पैसा": "Money",
  "खाना": "Food",
  "पानी": "Water",
  "समय": "Time",
  "दिन": "Day",
  "रात": "Night",
  "आज": "Today",
  "भोलि": "Tomorrow",
  "हिजो": "Yesterday",
  "हप्ता": "Week",
  "महिना": "Month",
  "वर्ष": "Year",
  "किताब": "Book",
  "कागज": "Paper",
  "कलम": "Pen",
  "फोन": "Phone",
  "कम्प्युटर": "Computer",
  "इन्टरनेट": "Internet",
  "इमेल": "Email",
  "ठेगाना": "Address",
  "नाम": "Name",
  "उमेर": "Age",
  "ठाउँ": "Place",
  "शहर": "City",
  "गाउँ": "Village",
  "देश": "Country",
  "नेपाल": "Nepal",
  "काठमाडौं": "Kathmandu"
};

const Translator = () => {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [direction, setDirection] = useState<"en-to-ne" | "ne-to-en">("en-to-ne");
  const { toast } = useToast();

  // Check if text contains Devanagari script
  const containsDevanagari = (text: string): boolean => {
    const devanagariRegex = /[\u0900-\u097F]/;
    return devanagariRegex.test(text);
  };

  // Detect language and set direction automatically
  const detectLanguageAndSetDirection = (text: string) => {
    if (containsDevanagari(text)) {
      setDirection("ne-to-en");
    } else {
      setDirection("en-to-ne");
    }
  };

  // Google Translate API call
  const translateWithGoogleAPI = async (text: string, sourceLang: string, targetLang: string) => {
    // Note: This requires a Google Translate API key
    // For production, you'd need to set this up with proper API credentials
    const API_KEY = "YOUR_GOOGLE_TRANSLATE_API_KEY"; // This should be in environment variables
    
    try {
      const response = await fetch(
        `https://translation.googleapis.com/language/translate/v2?key=${API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            q: text,
            source: sourceLang,
            target: targetLang,
            format: "text"
          })
        }
      );

      if (response.ok) {
        const data = await response.json();
        return data.data.translations[0].translatedText;
      }
      throw new Error("Google Translate API failed");
    } catch (error) {
      console.error("Google Translate API error:", error);
      throw error;
    }
  };

  // MyMemory Translation API (free alternative)
  const translateWithMyMemory = async (text: string, sourceLang: string, targetLang: string) => {
    try {
      const langPair = `${sourceLang}|${targetLang}`;
      const response = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${langPair}`
      );

      if (response.ok) {
        const data = await response.json();
        if (data.responseStatus === 200) {
          return data.responseData.translatedText;
        }
      }
      throw new Error("MyMemory API failed");
    } catch (error) {
      console.error("MyMemory API error:", error);
      throw error;
    }
  };

  // Enhanced translation function
  const translateText = async (text: string) => {
    if (!text.trim()) {
      setOutputText("");
      return;
    }

    setIsLoading(true);
    
    // Detect language first, then use the detected direction for API calls
    const isDevanagari = containsDevanagari(text);
    const currentDirection = isDevanagari ? "ne-to-en" : "en-to-ne";
    
    // Update the direction state
    setDirection(currentDirection);

    const sourceLang = currentDirection === "en-to-ne" ? "en" : "ne";
    const targetLang = currentDirection === "en-to-ne" ? "ne" : "en";

    console.log(`Translating from ${sourceLang} to ${targetLang}:`, text);

    try {
      let translatedText = "";

      // Try multiple translation services in order of preference
      try {
        // First try Google Translate (requires API key)
        translatedText = await translateWithGoogleAPI(text, sourceLang, targetLang);
      } catch (error) {
        console.log("Google Translate failed, trying MyMemory...");
        try {
          // Fallback to MyMemory API (free but limited for Nepali)
          translatedText = await translateWithMyMemory(text, sourceLang, targetLang);
        } catch (error) {
          console.log("MyMemory failed, using local dictionary...");
          // Fallback to local dictionary
          translatedText = fallbackTranslation(text, currentDirection);
        }
      }

      setOutputText(translatedText);
    } catch (error) {
      console.error("All translation methods failed:", error);
      const fallbackResult = fallbackTranslation(text, currentDirection);
      setOutputText(fallbackResult);
    } finally {
      setIsLoading(false);
    }
  };

  // Enhanced fallback translation using local dictionary
  const fallbackTranslation = (text: string, translationDirection: "en-to-ne" | "ne-to-en"): string => {
    const processedText = text.trim().toLowerCase();
    
    // Check for exact match first
    if (mockTranslations[processedText]) {
      return mockTranslations[processedText];
    }

    // Try word-by-word translation for phrases
    const words = processedText.split(/\s+/);
    if (words.length > 1) {
      const translatedWords = words.map(word => {
        // Remove punctuation for lookup
        const cleanWord = word.replace(/[.,!?;:"'()]/g, '');
        return mockTranslations[cleanWord] || word;
      });
      
      // If at least one word was translated, return the result
      const hasTranslation = translatedWords.some((translatedWord, index) => 
        translatedWord !== words[index].replace(/[.,!?;:"'()]/g, '')
      );
      
      if (hasTranslation) {
        return translatedWords.join(" ");
      }
    }

    // If no translation found
    if (translationDirection === "en-to-ne") {
      return "अनुवाद उपलब्ध छैन (Translation not available)";
    } else {
      return "Translation not available";
    }
  };

  const handleSwapLanguages = () => {
    setDirection(prev => prev === "en-to-ne" ? "ne-to-en" : "en-to-ne");
    setInputText(outputText);
    setOutputText(inputText);
  };

  const handleClearText = () => {
    setInputText("");
    setOutputText("");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setInputText(newText);
    
    // Auto-detect language and update direction
    if (newText.trim()) {
      detectLanguageAndSetDirection(newText);
    }
  };

  return (
    <Card className="w-full bg-asklegal-dark border-asklegal-purple/30">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-asklegal-heading flex items-center gap-2">
            <Languages className="h-5 w-5" />
            Nepali-English Translator
          </CardTitle>
          <div className="text-sm text-asklegal-text/70 flex items-center">
            <span>
              {direction === "en-to-ne" 
                ? "English → Nepali" 
                : "Nepali → English"}
            </span>
          </div>
        </div>
        <p className="text-sm text-asklegal-text/60">
          Professional legal translation tool with extensive legal terminology support
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4">
          {/* Input Section */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-asklegal-heading">
                {direction === "en-to-ne" ? "English / Romanized Nepali" : "नेपाली (Nepali)"}
              </label>
            </div>
            <Textarea
              value={inputText}
              onChange={handleInputChange}
              placeholder={direction === "en-to-ne" ? "Type English or Romanized Nepali here..." : "यहाँ नेपाली टाइप गर्नुहोस्..."}
              className="min-h-[100px] bg-asklegal-darker border-asklegal-purple/20 placeholder:text-white/30"
            />
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handleSwapLanguages}
              className="rounded-full bg-asklegal-purple/10 border-asklegal-purple/30 hover:bg-asklegal-purple/20"
            >
              <ArrowLeftRight className="h-4 w-4" />
              <span className="sr-only">Swap languages</span>
            </Button>
            
            <Button
              variant="outline"
              size="icon"
              onClick={handleClearText}
              className="rounded-full bg-asklegal-purple/10 border-asklegal-purple/30 hover:bg-asklegal-purple/20"
            >
              <RotateCcw className="h-4 w-4" />
              <span className="sr-only">Clear text</span>
            </Button>

            <Button
              onClick={() => translateText(inputText)}
              className="bg-asklegal-purple hover:bg-asklegal-accent"
              disabled={isLoading || !inputText.trim()}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Translating...
                </>
              ) : (
                "Translate"
              )}
            </Button>
          </div>

          {/* Output Section */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-asklegal-heading">
                {direction === "en-to-ne" ? "नेपाली (Nepali)" : "English"}
              </label>
            </div>
            <div className="min-h-[100px] p-3 bg-asklegal-darker border border-asklegal-purple/20 rounded-md">
              {isLoading ? (
                <div className="flex justify-center items-center h-full">
                  <Loader2 className="h-4 w-4 animate-spin text-asklegal-purple" />
                </div>
              ) : (
                <div className={`${direction === "ne-to-en" ? "font-sans" : "font-nepali"} whitespace-pre-wrap`}>
                  {outputText || "Translation will appear here..."}
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Translator;
