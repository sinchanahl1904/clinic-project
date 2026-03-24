require("dotenv").config();
const mongoose = require("mongoose");
const User      = require("./backend/models/User");
const Doctor    = require("./backend/models/Doctor");
const Branch    = require("./backend/models/Branch");

const URI = process.env.MONGODB_URI || "mongodb://localhost:27017/clinicDB";

const branches = [
  { name: "Smart Clinic — KR Hospital",       address: "Near KR Hospital, Mysuru",          city: "Mysuru", phone: "+918214100001", location: { type:"Point", coordinates:[76.6394,12.2958] } },
  { name: "Smart Clinic — Saraswathipuram",   address: "Saraswathipuram Main Road, Mysuru", city: "Mysuru", phone: "+918214100002", location: { type:"Point", coordinates:[76.6491,12.3070] } },
  { name: "Smart Clinic — JSS Medical",       address: "JSS Medical College Area, Mysuru",  city: "Mysuru", phone: "+918214100003", location: { type:"Point", coordinates:[76.6400,12.3050] } },
  { name: "Smart Clinic — Vijayanagar",       address: "Vijayanagar 2nd Stage, Mysuru",     city: "Mysuru", phone: "+918214100004", location: { type:"Point", coordinates:[76.6247,12.3198] } },
  { name: "Smart Clinic — Chamundi Hill",     address: "Chamundi Hill Road, Mysuru",        city: "Mysuru", phone: "+918214100005", location: { type:"Point", coordinates:[76.6328,12.2955] } },
  { name: "Smart Clinic — KR Road",           address: "KR Road, Mysuru",                   city: "Mysuru", phone: "+918214100006", location: { type:"Point", coordinates:[76.6429,12.2846] } },
  { name: "Smart Clinic — Vidyaranyapuram",   address: "Vidyaranyapuram, Mysuru",           city: "Mysuru", phone: "+918214100007", location: { type:"Point", coordinates:[76.6475,12.3304] } },
  { name: "Smart Clinic — Nanjangud Road",    address: "Nanjangud Road, Mysuru",            city: "Mysuru", phone: "+918214100008", location: { type:"Point", coordinates:[76.6800,12.2828] } },
  { name: "Smart Clinic — Nazarbad",          address: "Nazarbad Main Road, Mysuru",        city: "Mysuru", phone: "+918214100009", location: { type:"Point", coordinates:[76.6656,12.3184] } },
  { name: "Smart Clinic — Hebbal",            address: "Hebbal Industrial Area, Mysuru",    city: "Mysuru", phone: "+918214100010", location: { type:"Point", coordinates:[76.6123,12.3452] } },
];

const doctorData = [
  { name:"Dr. Ramesh Kumar",     spec:"Cardiology",       exp:15, edu:"MBBS, MD Cardiology, DM" },
  { name:"Dr. Priya Sharma",     spec:"Dermatology",      exp:10, edu:"MBBS, MD Dermatology" },
  { name:"Dr. Amit Patel",       spec:"Neurology",        exp:12, edu:"MBBS, MD Neurology, DM" },
  { name:"Dr. Sunita Reddy",     spec:"Pediatrics",       exp:8,  edu:"MBBS, MD Pediatrics" },
  { name:"Dr. Karthik Nair",     spec:"Orthopedics",      exp:14, edu:"MBBS, MS Orthopedics" },
  { name:"Dr. Anjali Gupta",     spec:"General Medicine", exp:7,  edu:"MBBS, MD General Medicine" },
  { name:"Dr. Vikram Singh",     spec:"Gynecology",       exp:11, edu:"MBBS, MS Gynecology" },
  { name:"Dr. Meera Iyer",       spec:"Psychiatry",       exp:9,  edu:"MBBS, MD Psychiatry" },
  { name:"Dr. Rahul Verma",      spec:"ENT",              exp:6,  edu:"MBBS, MS ENT" },
  { name:"Dr. Deepa Joshi",      spec:"Ophthalmology",    exp:8,  edu:"MBBS, MS Ophthalmology" },
  { name:"Dr. Arun Kumar",       spec:"Dentistry",        exp:10, edu:"BDS, MDS" },
  { name:"Dr. Lakshmi Nair",     spec:"Urology",          exp:13, edu:"MBBS, MS Urology, MCh" },
  { name:"Dr. Sanjay Rao",       spec:"Cardiology",       exp:18, edu:"MBBS, MD, DM Cardiology" },
  { name:"Dr. Kavita Menon",     spec:"Endocrinology",    exp:9,  edu:"MBBS, MD, DM Endocrinology" },
  { name:"Dr. Mohan Babu",       spec:"Pulmonology",      exp:11, edu:"MBBS, MD Pulmonology" },
  { name:"Dr. Anand Krishnan",   spec:"Nephrology",       exp:14, edu:"MBBS, MD, DM Nephrology" },
  { name:"Dr. Shalini Devi",     spec:"Oncology",         exp:12, edu:"MBBS, MD Oncology" },
  { name:"Dr. Prakash Rao",      spec:"General Surgery",  exp:16, edu:"MBBS, MS General Surgery" },
  { name:"Dr. Meenakshi Iyer",   spec:"Rheumatology",     exp:10, edu:"MBBS, MD Rheumatology" },
  { name:"Dr. Venkatesh Nair",   spec:"Gastroenterology", exp:13, edu:"MBBS, MD, DM Gastroenterology" },
];

const doctorImages = [
  "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=600",
  "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600",
  "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=600",
  "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=600",
  "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=600",
];

mongoose.connect(URI).then(async () => {
  console.log("Connected. Seeding...");

  await Promise.all([
    Branch.deleteMany({}),
    Doctor.deleteMany({}),
    User.deleteMany({})
  ]);
  console.log("Cleared old data.");

  const savedBranches = await Branch.insertMany(branches);
  console.log(`✅ ${savedBranches.length} branches created.`);

  // Admin
  await User.create({
    name: "Admin User", email: "admin@clinic.com",
    password: "admin123", role: "admin", isVerified: true, phone: "+919999999999"
  });
  console.log("✅ Admin created: admin@clinic.com / admin123");

  // Doctors
  for (let i = 0; i < doctorData.length; i++) {
    const d = doctorData[i];
    const user = await User.create({
      name: d.name,
      email: `dr${i + 1}@clinic.com`,
      password: "doctor123",
      role: "doctor", isVerified: true,
      phone: `+9198765${String(43200 + i).padStart(5,"0")}`
    });
    await Doctor.create({
      user: user._id,
      specialization: d.spec,
      contact: user.phone,
      branch: savedBranches[i % savedBranches.length]._id,
      experience: d.exp,
      education: d.edu,
      bio: `${d.name} is a highly experienced specialist in ${d.spec} with ${d.exp} years of practice in Mysuru.`,
      image: doctorImages[i % doctorImages.length],
      languages: ["English", "Kannada", "Hindi"],
      schedule: [
        { day:"Mon", start:"09:00", end:"17:00" },
        { day:"Tue", start:"09:00", end:"17:00" },
        { day:"Wed", start:"09:00", end:"17:00" },
        { day:"Thu", start:"09:00", end:"17:00" },
        { day:"Fri", start:"09:00", end:"17:00" }
      ]
    });
    process.stdout.write(`  Doctor ${i + 1}/20 created\r`);
  }

  console.log("\n✅ 20 doctors created.");
  console.log("\n🎉 Seeding complete!");
  console.log("─────────────────────────────");
  console.log("Admin login:  admin@clinic.com / admin123");
  console.log("Doctor login: dr1@clinic.com / doctor123");
  console.log("─────────────────────────────");
  mongoose.connection.close();
  process.exit(0);
}).catch(err => { console.error("Seed failed:", err); process.exit(1); });
