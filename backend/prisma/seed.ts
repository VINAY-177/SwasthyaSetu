import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Delhi/NCR Hospitals...');
  await prisma.hospital.createMany({
    data: [
      {
        name: 'AIIMS, New Delhi',
        type: 'Government',
        district: 'New Delhi',
        state: 'Delhi',
        location: 'Ansari Nagar, New Delhi',
        totalBeds: 2500,
        availableBeds: 120,
        icuBeds: 250,
        availableIcu: 15,
        specialties: 'Cardiology,Neurology,Oncology,Trauma',
      },
      {
        name: 'Safdarjung Hospital',
        type: 'Government',
        district: 'South Delhi',
        state: 'Delhi',
        location: 'Ring Road, New Delhi',
        totalBeds: 1530,
        availableBeds: 45,
        icuBeds: 150,
        availableIcu: 5,
        specialties: 'Orthopaedics,Burns,Surgery,Medicine',
      },
      {
        name: 'Fortis Memorial Research Institute',
        type: 'Private',
        district: 'Gurugram',
        state: 'NCR',
        location: 'Sector 44, Gurugram',
        totalBeds: 1000,
        availableBeds: 210,
        icuBeds: 100,
        availableIcu: 25,
        specialties: 'Oncology,Neurology,Cardiology,Transplants',
      },
      {
        name: 'Max Super Speciality Hospital',
        type: 'Private',
        district: 'South Delhi',
        state: 'Delhi',
        location: 'Saket, New Delhi',
        totalBeds: 500,
        availableBeds: 50,
        icuBeds: 75,
        availableIcu: 10,
        specialties: 'Cardiac Sciences,Orthopaedics,Oncology',
      },
      {
        name: 'Lok Nayak Jai Prakash Narayan Hospital (LNJP)',
        type: 'Government',
        district: 'Central Delhi',
        state: 'Delhi',
        location: 'Jawaharlal Nehru Marg, New Delhi',
        totalBeds: 2000,
        availableBeds: 300,
        icuBeds: 200,
        availableIcu: 18,
        specialties: 'General Medicine,Surgery,Paediatrics',
      },
    ],
  });

  console.log('Seeding Government Schemes...');
  await prisma.governmentScheme.createMany({
    data: [
      {
        schemeName: 'Ayushman Bharat PM-JAY',
        description: 'National health protection scheme covering ₹5 lakhs per family per year for secondary and tertiary care hospitalization.',
        eligibility: 'BPL families, deprived households per SECC data.',
        coverageAmount: '₹5,000,000',
        officialLink: 'https://pmjay.gov.in',
        stateApplicable: 'National',
      },
      {
        schemeName: 'Delhi Arogya Kosh (DAK)',
        description: 'Financial assistance to needy eligible patients for medical treatment, surgeries, and high-end diagnostics in Delhi.',
        eligibility: 'Residents of Delhi with annual family income up to ₹3 lakhs.',
        coverageAmount: 'Up to ₹5,00,000',
        officialLink: 'https://health.delhigovt.nic.in',
        stateApplicable: 'Delhi',
      },
      {
        schemeName: 'Central Government Health Scheme (CGHS)',
        description: 'Comprehensive medical care to Central Government employees and pensioners in Delhi/NCR.',
        eligibility: 'Central Government employees, pensioners, and their dependents.',
        coverageAmount: 'Varies',
        officialLink: 'https://cghs.nic.in',
        stateApplicable: 'National',
      },
      {
        schemeName: 'Aam Aadmi Mohalla Clinics',
        description: 'Primary health care centers offering free consultations, medicines, and diagnostics in Delhi.',
        eligibility: 'All residents of Delhi.',
        coverageAmount: 'Free Primary Care',
        officialLink: 'https://mohalla.delhi.gov.in',
        stateApplicable: 'Delhi',
      },
    ],
  });

  console.log('Seeding completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
