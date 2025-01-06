export const isFormSectionComplete = (formData, activeTab) => {
    const requiredFields = {
      universityBody: ['entity', 'proposed_name', 'proposed_date', 'proposed_by', 'proposer_name', 'emp_code', 'proposer_email', 'mobile', 'entity_nature', 'department'],
      advisoryBoardStudent: ['student_sec_1_name', 'student_sec_1_email', 'student_sec_1_uid', 'student_sec_1_mobile', 'student_sec_2_name', 'student_sec_2_email', 'student_sec_2_uid', 'student_sec_2_mobile', 'student_advsec_1_name', 'student_advsec_1_email', 'student_advsec_1_uid', 'student_advsec_1_mobile', 'student_advsec_2_name', 'student_advsec_2_email', 'student_advsec_2_uid', 'student_advsec_2_mobile'],
      advisoryBoardFaculty: ['faculty_adv_1_name', 'faculty_adv_1_email', 'faculty_adv_1_empcode', 'faculty_adv_1_mobile', 'faculty_adv_2_name', 'faculty_adv_2_email', 'faculty_adv_2_empcode', 'faculty_adv_2_mobile', 'faculty_coadv_1_name', 'faculty_coadv_1_email', 'faculty_coadv_1_empcode', 'faculty_coadv_1_mobile', 'faculty_coadv_2_name', 'faculty_coadv_2_email', 'faculty_coadv_2_empcode', 'faculty_coadv_2_mobile'],
      acknowledgement: ['agreed']
    };
  
    return requiredFields[activeTab].every(field => formData[field] && formData[field].toString().trim() !== '');
  };
  
  