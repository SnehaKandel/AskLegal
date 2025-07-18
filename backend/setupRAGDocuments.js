const axios = require('axios');
const fs = require('fs');
const path = require('path');

const BACKEND_URL = 'http://localhost:5000';

async function setupRAGDocuments() {
  try {
    console.log('🚀 Setting up RAG Documents System\n');

    // 1. Test admin login
    console.log('1. Logging in as admin...');
    let token;
    try {
      const loginResponse = await axios.post(`${BACKEND_URL}/api/auth/login`, {
        email: 'admin@asklegal.com',
        password: 'Admin123!'
      });
      token = loginResponse.data.token;
      console.log('✅ Admin login successful');
    } catch (error) {
      console.log('❌ Admin login failed:', error.response?.data?.message || error.message);
      return;
    }

    // 2. Check Ollama models
    console.log('\n2. Checking Ollama models...');
    try {
      const ollamaResponse = await axios.get('http://localhost:11434/api/tags');
      const models = ollamaResponse.data.models || [];
      console.log(`✅ Ollama is running with ${models.length} models`);
      
      const modelNames = models.map(m => m.name);
      console.log(`   Available models: ${modelNames.join(', ')}`);
      
      // Check for required models
      const requiredModels = ['llama2', 'nomic-embed-text'];
      const missingModels = requiredModels.filter(model => !modelNames.includes(model));
      
      if (missingModels.length > 0) {
        console.log(`\n⚠️ Missing required models: ${missingModels.join(', ')}`);
        console.log('Please install them with:');
        missingModels.forEach(model => {
          console.log(`   ollama pull ${model}`);
        });
      } else {
        console.log('✅ All required models are available');
      }
    } catch (error) {
      console.log('❌ Ollama is not running. Please start Ollama first: ollama serve');
      return;
    }

    // 3. Check current documents
    console.log('\n3. Checking current documents...');
    try {
      const docsResponse = await axios.get(`${BACKEND_URL}/api/documents`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const documents = docsResponse.data.documents;
      console.log(`📄 Found ${documents.length} documents`);
      
      if (documents.length > 0) {
        documents.forEach((doc, index) => {
          console.log(`   ${index + 1}. ${doc.title} (${doc.status})`);
        });
      }
    } catch (error) {
      console.log('❌ Failed to fetch documents:', error.response?.data?.message || error.message);
    }

    // 4. Create sample documents directory
    console.log('\n4. Setting up sample documents...');
    const sampleDir = path.join(__dirname, 'sample-documents');
    if (!fs.existsSync(sampleDir)) {
      fs.mkdirSync(sampleDir);
      console.log('✅ Created sample documents directory');
    }

    // 5. Create sample legal documents
    const sampleDocuments = [
      {
        filename: 'nepal-constitution.txt',
        title: 'Nepal Constitution Overview',
        category: 'Constitutional Law',
        content: `NEPAL CONSTITUTION OVERVIEW

The Constitution of Nepal (Nepali: नेपालको संविधान २०७२) is the present governing Constitution of Nepal. Nepal is governed according to the Constitution which came into effect on 20 September 2015, replacing the Interim Constitution of 2007.

Key Features:
- Federal Democratic Republic
- Multi-party system
- Separation of powers
- Fundamental rights and duties
- Directive principles and policies

The Constitution establishes Nepal as a federal democratic republic with three levels of government: federal, provincial, and local. It guarantees fundamental rights to all citizens and establishes a system of checks and balances between the executive, legislative, and judicial branches.

Fundamental Rights:
1. Right to equality
2. Right to freedom
3. Right against exploitation
4. Right to religion
5. Right to education and culture
6. Right to constitutional remedies

The Constitution also includes provisions for affirmative action to ensure the participation of marginalized communities in all state organs.`
      },
      {
        filename: 'business-laws.txt',
        title: 'Nepal Business Laws',
        category: 'Business Law',
        content: `NEPAL BUSINESS LAWS

Business Registration and Operation in Nepal

1. Company Registration:
- Companies Act, 2006 governs company formation
- Private Limited Companies require minimum 1 director and 1 shareholder
- Public Limited Companies require minimum 7 shareholders
- Registration through Office of Company Registrar

2. Business Registration:
- Business Registration Act, 2018
- Required for all business operations
- Registration through local government offices
- Renewal required annually

3. Tax Laws:
- Income Tax Act, 2002
- Value Added Tax Act, 1996
- Customs Act, 2007
- All businesses must register for tax purposes

4. Labor Laws:
- Labor Act, 2017
- Minimum wage requirements
- Working hours and conditions
- Social security contributions

5. Foreign Investment:
- Foreign Investment and Technology Transfer Act, 2019
- Automatic route for most sectors
- Foreign Exchange Regulation Act compliance
- Investment Board Nepal approval for large projects

6. Intellectual Property:
- Patent, Design and Trademark Act, 2022
- Copyright Act, 2002
- Protection for trademarks, patents, and copyrights

7. Banking and Finance:
- Nepal Rastra Bank Act, 2002
- Banking and Financial Institutions Act, 2017
- Regulation of banking and financial services

8. Competition Law:
- Competition Promotion and Market Protection Act, 2007
- Prevents anti-competitive practices
- Merger control provisions

9. Consumer Protection:
- Consumer Protection Act, 2018
- Rights of consumers
- Product liability and safety standards

10. Environmental Compliance:
- Environment Protection Act, 2019
- Environmental Impact Assessment requirements
- Waste management regulations`
      },
      {
        filename: 'property-laws.txt',
        title: 'Nepal Property Laws',
        category: 'Property Law',
        content: `NEPAL PROPERTY LAWS

Property Rights and Land Ownership in Nepal

1. Land Ownership:
- Land Act, 2021 governs land ownership
- Private ownership recognized
- Government land management
- Land ceiling limits apply

2. Property Registration:
- Land Registration Act, 2017
- Compulsory registration of property transactions
- Digital land records system
- Title verification required

3. Land Tenure:
- Raiker (owner) - Full ownership rights
- Guthi (trust) - Religious/cultural trust land
- Government land - State ownership
- Community forest - Community ownership

4. Property Transactions:
- Sale deed registration mandatory
- Stamp duty and registration fees
- Capital gains tax on property sales
- Inheritance tax considerations

5. Land Use:
- Zoning regulations
- Building codes compliance
- Environmental restrictions
- Agricultural land protection

6. Dispute Resolution:
- Land Revenue Tribunal
- District Court jurisdiction
- Alternative dispute resolution
- Survey and measurement disputes

7. Inheritance:
- Muluki Civil Code, 2017
- Equal inheritance rights
- Will and testament provisions
- Family property division

8. Tenancy Laws:
- Tenancy Act, 2001
- Tenant rights and obligations
- Rent control provisions
- Eviction procedures

9. Mortgage and Lien:
- Mortgage registration
- Bank financing requirements
- Foreclosure procedures
- Priority of claims

10. Property Tax:
- Local government taxation
- Property valuation methods
- Tax assessment procedures
- Appeal mechanisms

11. Foreign Ownership:
- Restrictions on foreign land ownership
- Leasehold rights for foreigners
- Investment property regulations
- Citizenship requirements

12. Eminent Domain:
- Government acquisition powers
- Compensation requirements
- Public purpose definition
- Judicial review rights`
      },
      {
        filename: 'family-laws.txt',
        title: 'Nepal Family Laws',
        category: 'Family Law',
        content: `NEPAL FAMILY LAWS

Marriage, Divorce, and Family Matters

1. Marriage Laws:
- Muluki Civil Code, 2017 governs marriage
- Minimum age: 20 years for both parties
- Consent of both parties required
- Registration mandatory within 35 days

2. Marriage Registration:
- Local government registration
- Required documents:
  * Citizenship certificates
  * Age proof
  * Consent letters
  * Witness statements
- Registration fees apply

3. Divorce Laws:
- Mutual consent divorce
- Fault-based divorce grounds:
  * Adultery
  * Cruelty
  * Desertion
  * Mental illness
  * Conversion to another religion
- One year separation requirement
- Court proceedings required

4. Child Custody:
- Best interest of child standard
- Joint custody possible
- Child support obligations
- Visitation rights
- Age and preference consideration

5. Property Division:
- Equal division of marital property
- Separate property protection
- Business asset division
- Debt allocation
- Maintenance provisions

6. Adoption:
- Adoption Act, 2028
- Domestic and international adoption
- Age requirements for adoptive parents
- Child welfare considerations
- Court approval required

7. Inheritance:
- Equal inheritance rights
- Intestate succession rules
- Will and testament validity
- Family property division
- Spouse inheritance rights

8. Domestic Violence:
- Domestic Violence (Offence and Punishment) Act, 2009
- Protection orders available
- Criminal penalties
- Support services
- Reporting requirements

9. Child Rights:
- Children's Act, 2018
- Education rights
- Health care access
- Protection from exploitation
- Juvenile justice provisions

10. Maintenance:
- Spousal maintenance
- Child support calculations
- Enforcement mechanisms
- Modification procedures
- Arrears collection

11. Family Dispute Resolution:
- Mediation services
- Family courts
- Alternative dispute resolution
- Counseling services
- Legal aid availability

12. Polygamy:
- Prohibited by law
- Criminal penalties
- Void marriage consequences
- Property rights implications`
      },
      {
        filename: 'criminal-laws.txt',
        title: 'Nepal Criminal Laws',
        category: 'Criminal Law',
        content: `NEPAL CRIMINAL LAWS

Criminal Justice System and Penal Code

1. Penal Code:
- Muluki Criminal Code, 2017
- Comprehensive criminal law
- Offenses and punishments
- Procedural requirements

2. Major Offenses:
- Homicide and murder
- Theft and robbery
- Fraud and forgery
- Assault and battery
- Sexual offenses
- Drug trafficking
- Corruption

3. Criminal Procedure:
- Criminal Procedure Code, 2017
- Investigation procedures
- Arrest and detention
- Bail provisions
- Trial procedures
- Appeal rights

4. Police Powers:
- Investigation authority
- Arrest without warrant
- Search and seizure
- Interrogation rights
- Evidence collection
- Witness protection

5. Rights of Accused:
- Presumption of innocence
- Right to legal counsel
- Right to remain silent
- Right to fair trial
- Right to appeal
- Protection from torture

6. Juvenile Justice:
- Children's Act, 2018
- Special procedures for minors
- Rehabilitation focus
- Age of criminal responsibility
- Juvenile courts
- Alternative measures

7. Victim Rights:
- Victim compensation
- Witness protection
- Legal assistance
- Information rights
- Participation in proceedings
- Support services

8. Sentencing:
- Sentencing guidelines
- Mitigating factors
- Aggravating circumstances
- Alternative sentences
- Probation and parole
- Fine and imprisonment

9. Evidence Law:
- Evidence Act, 2031
- Admissibility rules
- Witness testimony
- Documentary evidence
- Expert testimony
- Digital evidence

10. Corruption Laws:
- Prevention of Corruption Act, 2002
- Anti-corruption commission
- Asset declaration
- Conflict of interest
- Bribery offenses
- Whistleblower protection

11. Cyber Crimes:
- Electronic Transactions Act, 2008
- Computer fraud
- Online harassment
- Data protection
- Digital evidence
- Jurisdiction issues

12. International Cooperation:
- Extradition treaties
- Mutual legal assistance
- International arrest warrants
- Evidence sharing
- Prisoner transfers
- Interpol cooperation

13. Alternative Dispute Resolution:
- Mediation in criminal cases
- Restorative justice
- Community service
- Victim-offender reconciliation
- Diversion programs
- Plea bargaining

14. Human Rights:
- Constitutional guarantees
- International obligations
- Right to life and liberty
- Freedom from torture
- Right to fair trial
- Non-discrimination`
      }
    ];

    // Create sample documents
    sampleDocuments.forEach(doc => {
      const filePath = path.join(sampleDir, doc.filename);
      if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, doc.content);
        console.log(`✅ Created: ${doc.filename}`);
      } else {
        console.log(`📄 Exists: ${doc.filename}`);
      }
    });

    console.log('\n📋 Sample documents created in backend/sample-documents/');
    console.log('You can upload these as PDFs or create actual PDF versions.');

    // 6. Instructions for testing
    console.log('\n🎯 NEXT STEPS TO TEST RAG SYSTEM:');
    console.log('\n1. Convert sample documents to PDF:');
    console.log('   - Use online converters or Word to PDF');
    console.log('   - Ensure documents are 100-200 pages for realistic testing');
    console.log('   - Upload through admin interface at http://localhost:3000/admin');
    
    console.log('\n2. Test document upload:');
    console.log('   - Login as admin: admin@asklegal.com / Admin123!');
    console.log('   - Go to Documents page');
    console.log('   - Upload PDF documents');
    console.log('   - Monitor processing status');
    
    console.log('\n3. Test chatbot with uploaded documents:');
    console.log('   - Login as regular user');
    console.log('   - Go to homepage chatbot');
    console.log('   - Ask questions about uploaded documents');
    console.log('   - Verify RAG responses are accurate');
    
    console.log('\n4. Monitor system:');
    console.log('   - Check document processing status');
    console.log('   - Monitor Ollama logs for embedding generation');
    console.log('   - Verify vector chunks are created in database');
    
    console.log('\n5. Troubleshooting:');
    console.log('   - If uploads fail: Check file size (max 10MB)');
    console.log('   - If processing fails: Check Ollama is running');
    console.log('   - If chatbot fails: Check document processing status');
    console.log('   - If responses poor: Ensure documents are relevant and well-formatted');

    console.log('\n✅ RAG Document Setup Complete!');

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
  }
}

// Run the setup
setupRAGDocuments(); 