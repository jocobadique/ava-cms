let idSeq = 9000;
export const genId = () => String(++idSeq);

export const clinics: any[] = [
  { id: "c1", name: "Klinik Sejahtera", is_active: true, subscriber: "Ahmad Bin Yusuf", subscriber_id: "s1", practice: "GENERAL", contact_number: "03-12345678", license_number: "KKM-001-2023" },
  { id: "c2", name: "Klinik Maju Jaya", is_active: true, subscriber: "Siti Binti Rahmat", subscriber_id: "s2", practice: "DENTAL", contact_number: "03-23456789", license_number: "KKM-002-2023" },
  { id: "c3", name: "Poliklinik Bahagia", is_active: false, subscriber: "Rajan A/L Kumar", subscriber_id: "s3", practice: "SPECIALIST", contact_number: "03-34567890", license_number: "KKM-003-2022" },
  { id: "c4", name: "Klinik Ikhlas", is_active: true, subscriber: "Mei Lin Tan", subscriber_id: "s4", practice: "GENERAL", contact_number: "03-45678901", license_number: "KKM-004-2023" },
  { id: "c5", name: "Pusat Perubatan Amanah", is_active: true, subscriber: "Hassan Bin Othman", subscriber_id: "s5", practice: "SPECIALIST", contact_number: "03-56789012", license_number: "KKM-005-2023" },
];

export const branches: any[] = [
  { id: "b1", clinic_id: "c1", name: "Branch Petaling Jaya", address: "Jalan SS2/24, Petaling Jaya", contact_number: "03-12345679", is_active: true, created: "2023-01-10", modified: "2024-03-15" },
  { id: "b2", clinic_id: "c1", name: "Branch Shah Alam", address: "Persiaran Selangor, Shah Alam", contact_number: "03-12345680", is_active: true, created: "2023-02-20", modified: "2024-04-01" },
  { id: "b3", clinic_id: "c2", name: "Branch Subang", address: "Jalan Subang 5, Subang Jaya", contact_number: "03-23456790", is_active: true, created: "2023-03-05", modified: "2024-02-28" },
  { id: "b4", clinic_id: "c3", name: "Branch Klang", address: "Jalan Meru, Klang", contact_number: "03-34567891", is_active: false, created: "2022-11-15", modified: "2023-12-10" },
  { id: "b5", clinic_id: "c4", name: "Branch Puchong", address: "Jalan Puchong, Puchong", contact_number: "03-45678902", is_active: true, created: "2023-05-22", modified: "2024-01-18" },
];

export const mcos: any[] = [
  { id: "m1", name: "Great Eastern Life", code: "GEL", kind: "insurance", email: "cs@greateastern.com.my", contacts: [{ label: "Hotline", phone: "1300-13-1388" }], notes: "Covers inpatient and outpatient" },
  { id: "m2", name: "AIA Health", code: "AIA", kind: "insurance", email: "customer@aia.com.my", contacts: [{ label: "Hotline", phone: "1800-88-1899" }], notes: null },
  { id: "m3", name: "Prudential BSN Takaful", code: "PBT", kind: "prepaid", email: "info@prumedical.com.my", contacts: [{ label: "General", phone: "03-21161228" }], notes: "Takaful-based coverage" },
  { id: "m4", name: "Allianz Life Insurance", code: "ALZ", kind: "hmo", email: "customer@allianz.com.my", contacts: [{ label: "Support", phone: "1300-22-5542" }], notes: null },
  { id: "m5", name: "Sun Life Malaysia", code: "SLM", kind: "insurance", email: "service@sunlife.com.my", contacts: [{ label: "Hotline", phone: "1800-88-5055" }], notes: "Panel clinic coverage" },
];

export const mcoEntries: any[] = [
  { id: "me1", clinic_id: "c1", mco: "m1", mco_name: "Great Eastern Life", code: "GEL", name: "Great Eastern Life", kind: "insurance", email: "cs@greateastern.com.my", contacts: [{ label: "Hotline", phone: "1300-13-1388" }], notes: "Covers inpatient and outpatient", status: "approved", is_active: true },
  { id: "me2", clinic_id: "c1", mco: "m2", mco_name: "AIA Health", code: "AIA", name: "AIA Health", kind: "insurance", email: "customer@aia.com.my", contacts: [{ label: "Hotline", phone: "1800-88-1899" }], notes: null, status: "new", is_active: true },
  { id: "me3", clinic_id: "c2", mco: "m3", mco_name: "Prudential BSN Takaful", code: "PBT", name: "Prudential BSN Takaful", kind: "prepaid", email: "info@prumedical.com.my", contacts: [{ label: "General", phone: "03-21161228" }], notes: "Takaful-based coverage", status: "approved", is_active: true },
  { id: "me4", clinic_id: "c3", mco: "m1", mco_name: "Great Eastern Life", code: "GEL", name: "Great Eastern Life", kind: "insurance", email: "cs@greateastern.com.my", contacts: [{ label: "Hotline", phone: "1300-13-1388" }], notes: null, status: "declined", is_active: false },
];

export const drugs: any[] = [
  { id: "d1", generic_name: "Paracetamol", brand_name: "Panadol", dosage: "500mg" },
  { id: "d2", generic_name: "Amoxicillin", brand_name: "Amoxil", dosage: "250mg" },
  { id: "d3", generic_name: "Metformin", brand_name: "Glucophage", dosage: "500mg" },
  { id: "d4", generic_name: "Atorvastatin", brand_name: "Lipitor", dosage: "20mg" },
  { id: "d5", generic_name: "Amlodipine", brand_name: "Norvasc", dosage: "5mg" },
  { id: "d6", generic_name: "Omeprazole", brand_name: "Losec", dosage: "20mg" },
  { id: "d7", generic_name: "Salbutamol", brand_name: "Ventolin", dosage: "2mg" },
  { id: "d8", generic_name: "Losartan", brand_name: "Cozaar", dosage: "50mg" },
  { id: "d9", generic_name: "Cetirizine", brand_name: "Zyrtec", dosage: "10mg" },
  { id: "d10", generic_name: "Ibuprofen", brand_name: "Brufen", dosage: "400mg" },
];

export const billExemptions: any[] = [
  { id: "be1", recipient_name: "Ahmad Bin Yusuf", email: "ahmad@sejahtera.com", subscription_type: "basic", duration: 365, status: "active", subscription_date: "2024-01-15", activate_date: "2024-01-15", deactivate_date: null, inactive_reason: null, subscriber: "s1" },
  { id: "be2", recipient_name: "Siti Binti Rahmat", email: "siti@majujaya.com", subscription_type: "pro", duration: 180, status: "active", subscription_date: "2024-03-10", activate_date: "2024-03-10", deactivate_date: null, inactive_reason: null, subscriber: "s2" },
  { id: "be3", recipient_name: "Rajan Kumar", email: "rajan@bahagia.com", subscription_type: "biz", duration: 90, status: "inactive", subscription_date: "2023-12-01", activate_date: "2023-12-01", deactivate_date: "2024-03-01", inactive_reason: "Subscription ended", subscriber: "s3" },
  { id: "be4", recipient_name: "Mei Lin Tan", email: "meilin@ikhlas.com", subscription_type: "prime", duration: 365, status: "active", subscription_date: "2024-02-20", activate_date: "2024-02-20", deactivate_date: null, inactive_reason: null, subscriber: "s4" },
];

export const cmsAdmins: any[] = [
  { id: "ca1", display_name: "Demo Admin", email: "admin@ava.com", contact_number: "012-3456789", cms_role: "cms_admin", is_active: true },
  { id: "ca2", display_name: "Super Admin", email: "superadmin@ava.com", contact_number: "012-9876543", cms_role: "cms_super_admin", is_active: true },
  { id: "ca3", display_name: "Ops Manager", email: "ops@ava.com", contact_number: "012-1112222", cms_role: "cms_admin", is_active: false },
];

export const subscribers: any[] = [
  { id: "s1", display_name: "Ahmad Bin Yusuf", email: "ahmad@sejahtera.com", contact_number: "012-1111111", subscription: "basic", clinic_role: "subscriber", is_active: true, clinic_name: "Klinik Sejahtera", clinic_id: "c1" },
  { id: "s2", display_name: "Siti Binti Rahmat", email: "siti@majujaya.com", contact_number: "012-2222222", subscription: "pro", clinic_role: "subscriber", is_active: true, clinic_name: "Klinik Maju Jaya", clinic_id: "c2" },
  { id: "s3", display_name: "Rajan A/L Kumar", email: "rajan@bahagia.com", contact_number: "012-3333333", subscription: "biz", clinic_role: "subscriber", is_active: false, clinic_name: "Poliklinik Bahagia", clinic_id: "c3" },
  { id: "s4", display_name: "Mei Lin Tan", email: "meilin@ikhlas.com", contact_number: "012-4444444", subscription: "prime", clinic_role: "subscriber", is_active: true, clinic_name: "Klinik Ikhlas", clinic_id: "c4" },
  { id: "s5", display_name: "Hassan Bin Othman", email: "hassan@amanah.com", contact_number: "012-5555555", subscription: "pro", clinic_role: "subscriber", is_active: true, clinic_name: "Pusat Perubatan Amanah", clinic_id: "c5" },
];

export const practitioners: any[] = [
  { id: "p1", practice: "GENERAL", branch_name: "Branch Petaling Jaya", branch_id: "b1", clinic_id: "c1", branches: [{ id: "b1", name: "Branch Petaling Jaya", clinic_id: "c1", clinic_name: "Klinik Sejahtera" }, { id: "b2", name: "Branch Shah Alam", clinic_id: "c1", clinic_name: "Klinik Sejahtera" }], account: { display_name: "Dr. Ali Bin Hassan", first_name: "Ali", middle_name: "", last_name: "Bin Hassan", email: "dr.ali@clinic.com", contact_number: "012-6666666", subscription: "basic" } },
  { id: "p2", practice: "DENTAL", branch_name: "Branch Subang", branch_id: "b3", clinic_id: "c2", branches: [{ id: "b3", name: "Branch Subang", clinic_id: "c2", clinic_name: "Klinik Maju Jaya" }], account: { display_name: "Dr. Chen Wei Ming", first_name: "Chen", middle_name: "", last_name: "Wei Ming", email: "dr.chen@clinic.com", contact_number: "012-7777777", subscription: "pro" } },
  { id: "p3", practice: "PAEDIATRICS", branch_name: "Branch Petaling Jaya", branch_id: "b1", clinic_id: "c1", branches: [{ id: "b1", name: "Branch Petaling Jaya", clinic_id: "c1", clinic_name: "Klinik Sejahtera" }], account: { display_name: "Dr. Priya A/P Suresh", first_name: "Priya", middle_name: "", last_name: "A/P Suresh", email: "dr.priya@clinic.com", contact_number: "012-8888888", subscription: "basic" } },
  { id: "p4", practice: "CARDIOLOGY", branch_name: "Branch Puchong", branch_id: "b5", clinic_id: "c4", branches: [{ id: "b5", name: "Branch Puchong", clinic_id: "c4", clinic_name: "Klinik Ikhlas" }], account: { display_name: "Dr. James Lim", first_name: "James", middle_name: "", last_name: "Lim", email: "dr.james@clinic.com", contact_number: "012-9999000", subscription: "prime" } },
  { id: "p5", practice: "OBSTETRICS", branch_name: "Branch Klang", branch_id: "b4", clinic_id: "c3", branches: [{ id: "b4", name: "Branch Klang", clinic_id: "c3", clinic_name: "Poliklinik Bahagia" }], account: { display_name: "Dr. Nurul Ain Binti Zain", first_name: "Nurul Ain", middle_name: "", last_name: "Binti Zain", email: "dr.nurul@clinic.com", contact_number: "012-0001111", subscription: "biz" } },
];

// Shared clinic-user pool (patients, branch-admins, staff, clinic-admins, clinic-users, subscribers detail)
export const clinicUsers: any[] = [
  { id: "s1", display_name: "Ahmad Bin Yusuf", email: "ahmad@sejahtera.com", contact_number: "012-1111111", user_type: "subscriber", clinic_role: "subscriber", subscription: "basic", is_active: true, clinic_id: "c1", clinic_name: "Klinik Sejahtera", branch_id: null },
  { id: "s2", display_name: "Siti Binti Rahmat", email: "siti@majujaya.com", contact_number: "012-2222222", user_type: "subscriber", clinic_role: "subscriber", subscription: "pro", is_active: true, clinic_id: "c2", clinic_name: "Klinik Maju Jaya", branch_id: null },
  { id: "s3", display_name: "Rajan A/L Kumar", email: "rajan@bahagia.com", contact_number: "012-3333333", user_type: "subscriber", clinic_role: "subscriber", subscription: "biz", is_active: false, clinic_id: "c3", clinic_name: "Poliklinik Bahagia", branch_id: null },
  { id: "s4", display_name: "Mei Lin Tan", email: "meilin@ikhlas.com", contact_number: "012-4444444", user_type: "subscriber", clinic_role: "subscriber", subscription: "prime", is_active: true, clinic_id: "c4", clinic_name: "Klinik Ikhlas", branch_id: null },
  { id: "s5", display_name: "Hassan Bin Othman", email: "hassan@amanah.com", contact_number: "012-5555555", user_type: "subscriber", clinic_role: "subscriber", subscription: "pro", is_active: true, clinic_id: "c5", clinic_name: "Pusat Perubatan Amanah", branch_id: null },
  { id: "u1", display_name: "Nur Hidayah", email: "admin.c1@klinik.com", contact_number: "012-1010101", user_type: "clinic_admin", clinic_role: "clinic_admin", subscription: "basic", is_active: true, clinic_id: "c1", clinic_name: "Klinik Sejahtera", branch_id: null },
  { id: "u2", display_name: "Farid Bin Aziz", email: "ba.c1@klinik.com", contact_number: "012-2020202", user_type: "branch_admin", clinic_role: "branch_admin", subscription: "basic", is_active: true, clinic_id: "c1", clinic_name: "Klinik Sejahtera", branch_id: "b1" },
  { id: "u3", display_name: "Lina Binti Ismail", email: "staff.c1@klinik.com", contact_number: "012-3030303", user_type: "staff", clinic_role: "staff", subscription: "basic", is_active: true, clinic_id: "c1", clinic_name: "Klinik Sejahtera", branch_id: "b1" },
  { id: "u4", display_name: "Zack Bin Razali", email: "admin.c2@klinik.com", contact_number: "012-4040404", user_type: "clinic_admin", clinic_role: "clinic_admin", subscription: "pro", is_active: true, clinic_id: "c2", clinic_name: "Klinik Maju Jaya", branch_id: null },
  { id: "patient1", display_name: "Aminah Binti Said", email: "patient1@email.com", contact_number: "012-5050505", user_type: "patient", clinic_role: "patient", subscription: "basic", is_active: true, clinic_id: "c1", clinic_name: "Klinik Sejahtera", branch_id: "b1", branch_name: "Branch Petaling Jaya" },
  { id: "patient2", display_name: "Chong Wei Liang", email: "patient2@email.com", contact_number: "012-6060606", user_type: "patient", clinic_role: "patient", subscription: "basic", is_active: true, clinic_id: "c1", clinic_name: "Klinik Sejahtera", branch_id: "b1", branch_name: "Branch Petaling Jaya" },
  { id: "patient3", display_name: "Selvam A/L Muthu", email: "patient3@email.com", contact_number: "012-7070707", user_type: "patient", clinic_role: "patient", subscription: "basic", is_active: false, clinic_id: "c1", clinic_name: "Klinik Sejahtera", branch_id: "b2", branch_name: "Branch Shah Alam" },
  { id: "patient4", display_name: "Rohani Binti Daud", email: "patient4@email.com", contact_number: "012-8080808", user_type: "patient", clinic_role: "patient", subscription: "pro", is_active: true, clinic_id: "c2", clinic_name: "Klinik Maju Jaya", branch_id: "b3", branch_name: "Branch Subang" },
];

export const patientMcos: any[] = [
  { id: "pm1", patient_id: "patient1", mco: { id: "m1", name: "Great Eastern Life", code: "GEL" }, mco_name: "Great Eastern Life", mco_number: "GEL-001234", policy_number: "GEL-001234", plan: "basic", valid_until: "2025-12-31", is_active: true },
  { id: "pm2", patient_id: "patient1", mco: { id: "m2", name: "AIA Health", code: "AIA" }, mco_name: "AIA Health", mco_number: "AIA-005678", policy_number: "AIA-005678", plan: "pro", valid_until: "2024-06-30", is_active: false },
  { id: "pm3", patient_id: "patient2", mco: { id: "m3", name: "Prudential BSN Takaful", code: "PBT" }, mco_name: "Prudential BSN Takaful", mco_number: "PBT-009012", policy_number: "PBT-009012", plan: "biz", valid_until: "2026-03-31", is_active: true },
];

export const billings: any[] = [
  { id: "bil1", clinic_id: "c1", name: "Basic Plan Invoice #001", amount: 299.00, amount_due: 299.00, amount_due_currency: "MYR", subscription_type: "basic", status: "paid", payment_status: "paid", due_date: "2024-02-15", paid_date: "2024-02-10", created: "2024-01-15", modified: "2024-02-10" },
  { id: "bil2", clinic_id: "c1", name: "Pro Plan Invoice #002", amount: 599.00, amount_due: 599.00, amount_due_currency: "MYR", subscription_type: "pro", status: "unpaid", payment_status: "unpaid", due_date: "2024-03-15", paid_date: null, created: "2024-02-15", modified: "2024-02-15" },
  { id: "bil3", clinic_id: "c2", name: "Biz Plan Invoice #001", amount: 999.00, amount_due: 999.00, amount_due_currency: "MYR", subscription_type: "biz", status: "paid", payment_status: "paid", due_date: "2024-02-20", paid_date: "2024-02-18", created: "2024-01-20", modified: "2024-02-18" },
];

export const biGeneral = {
  basic: { subscriptions: 12, total_users: 156 },
  pro: { subscriptions: 8, total_users: 240 },
  biz: { subscriptions: 5, total_users: 350 },
  prime: { subscriptions: 3, total_users: 210 },
  extra: { total_clinic_users: 956, total_subscriptions: 28, total_clinics: 28 },
};

export const biActiveAccounts = {
  basic: [
    ["total_clinics", 12],
    ["total_clinic_admins", 24],
    ["total_prac9", 18],
    ["total_patients", 320],
    ["total_users", 156],
    ["clinics", [
      { name: "Klinik Sejahtera", total_clinic_admins: 2, total_patients: 45, total_prac9: 3, total_users: 50 },
      { name: "Klinik Ikhlas", total_clinic_admins: 1, total_patients: 30, total_prac9: 2, total_users: 33 },
    ]],
  ],
  pro: [
    ["total_clinics", 8],
    ["total_clinic_admins", 16],
    ["total_prac9", 22],
    ["total_patients", 580],
    ["total_users", 240],
    ["clinics", [
      { name: "Klinik Maju Jaya", total_clinic_admins: 2, total_patients: 90, total_prac9: 4, total_users: 96 },
      { name: "Pusat Perubatan Amanah", total_clinic_admins: 2, total_patients: 80, total_prac9: 3, total_users: 85 },
    ]],
  ],
  biz: [
    ["total_clinics", 5],
    ["total_clinic_admins", 15],
    ["total_prac9", 30],
    ["total_patients", 750],
    ["total_users", 350],
    ["clinics", [
      { name: "Poliklinik Bahagia", total_clinic_admins: 3, total_patients: 150, total_prac9: 6, total_users: 159 },
    ]],
  ],
  prime: [
    ["total_clinics", 3],
    ["total_clinic_admins", 12],
    ["total_prac9", 25],
    ["total_patients", 600],
    ["total_users", 210],
    ["clinics", [
      { name: "Pusat Kesihatan Prima", total_clinic_admins: 4, total_patients: 200, total_prac9: 8, total_users: 212 },
    ]],
  ],
  total: [
    ["total_clinics", 28],
    ["total_clinic_admins", 67],
    ["total_prac9", 95],
    ["total_patients", 2250],
    ["total_users", 956],
    ["clinics", []],
  ],
};
