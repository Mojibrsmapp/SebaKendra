// UDYOG (উদ্যোগ) - উপজেলাভিত্তিক তরুণ উদ্যোক্তা অনুসন্ধান, চিহ্নিতকরণ ও অর্থায়ন কর্মসূচি
// বাংলাদেশ ব্যাংক · এসএমইএসপিডি সার্কুলার নং-০৫ · ১৩ সেপ্টেম্বর ২০২৬
// নীতিমালার সংক্ষিপ্ত সার, ৭ পৃষ্ঠার আবেদন ফরম পূরণ, যোগ্যতা যাচাই ও প্রিন্ট/পিডিএফ সহায়ক।

const Udyog = {
  currentStep: 1,
  data: {
    // Bank Office use
    trackingNo: '',
    bankName: '',
    branchName: '',
    receiveDate: '২০২৬',
    district: '',
    upazila: '',
    managerName: '',

    // 1. Personal Info
    applicantNameBn: '',
    applicantNameEn: '',
    fatherName: '',
    motherName: '',
    spouseName: '',
    dob: '',
    age: '',
    nid: '',
    birthReg: '',
    gender: 'পুরুষ',
    maritalStatus: 'অবিবাহিত',
    mobile: '',
    email: '',
    education: '',

    // 2. Address & Training
    presentAddress: '',
    permanentAddress: '',
    isResident: 'হ্যাঁ',
    hasTraining: 'না',
    trainingOrg: '',
    trainingCourse: '',
    trainingDuration: '',

    // 3. Business Plan
    bizName: '',
    bizSector: 'কৃষি ও খাদ্য প্রক্রিয়াজাতকরণ',
    bizType: 'নতুন ব্যবসা',
    bizAddress: '',
    totalCapitalNeeded: '',

    // 4. Existing Biz & Employment
    existingBizExp: '',
    currentMonthlySales: '',
    currentMonthlyProfit: '',
    existingEmpTotal: '০',
    existingEmpFemale: '০',
    futureEmpTotal: '',
    futureEmpFemale: '',

    // 5. Financial Plan (50:50 Loan & Grant)
    ownInvestment: '',
    loanNeeded: '',
    grantNeeded: '',
    bankAccountNo: '',

    // 6. Eligibility declaration
    hasPastLoan: 'না',
    isDefaulter: 'না',
    isGovtJob: 'না',
  },

  // Auto-calculate age as of 30 November 2026
  calcAge(dobStr) {
    if (!dobStr) return '';
    const dob = new Date(dobStr);
    if (isNaN(dob)) return '';
    const target = new Date('2026-11-30');
    let years = target.getFullYear() - dob.getFullYear();
    let months = target.getMonth() - dob.getMonth();
    if (months < 0 || (months === 0 && target.getDate() < dob.getDate())) {
      years--;
      months += 12;
    }
    return `${Tools.enToBnNum(years)} বছর ${Tools.enToBnNum(months)} মাস`;
  },

  // Calculate 50:50 loan and grant
  calcFinancing(totalNeeded, ownInvest = 0) {
    const net = Math.max(0, Number(totalNeeded || 0) - Number(ownInvest || 0));
    const capped = Math.min(net, 2000000); // Max 20 Lakh
    const half = Math.floor(capped / 2);
    return {
      total: capped,
      loan: half,
      grant: capped - half,
      exceedsCap: net > 2000000,
    };
  },

  // Calculate percentage of completion
  calcProgress() {
    const keys = ['applicantNameBn', 'fatherName', 'motherName', 'dob', 'nid', 'mobile', 'presentAddress', 'permanentAddress', 'bizName', 'totalCapitalNeeded'];
    let filled = 0;
    keys.forEach(k => { if (this.data[k] && String(this.data[k]).trim()) filled++; });
    return Math.round((filled / keys.length) * 100);
  },

  loadProfile() {
    try {
      const saved = localStorage.getItem('sebakendra_udyog_data');
      if (saved) Object.assign(this.data, JSON.parse(saved));
    } catch (e) {}
  },

  saveProfile() {
    localStorage.setItem('sebakendra_udyog_data', JSON.stringify(this.data));
  },
};
