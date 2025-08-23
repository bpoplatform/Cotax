/**
 * CoTax 법인정보등록시스템 샘플 데이터
 * 테스트 및 데모용 샘플 데이터
 */

// 샘플 법인 데이터
const sampleCompanyData = {
    id: "550e8400-e29b-41d4-a716-446655440000",
    company_name: "주식회사 코택스",
    company_reg_no: "110111-0012345",
    business_reg_no: "123-45-67890",
    business_year: "2024",
    business_year_from: "20240101",
    business_year_to: "20241231",
    ceo_name: "김대표",
    business_type: "제조업",
    business_item: "소프트웨어 개발",
    main_business_code: "62010",
    address: "서울특별시 강남구 테헤란로 123",
    phone_number: "02-1234-5678",
    email: "info@cotax.co.kr",
    branch_code: "001",
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: new Date().toISOString()
};

// 샘플 법인구분 데이터
const sampleTaxClassificationData = {
    id: "550e8400-e29b-41d4-a716-446655440001",
    company_id: "550e8400-e29b-41d4-a716-446655440000",
    company_reg_no: "110111-0012345",
    tax_classification: "30", // 영리법인(기타법인, 중소기업)
    tax_rate: 25.0,
    primary_classification: "A", // 일반
    secondary_classification_code: "30",
    secondary_classification_name: "영리법인(기타법인, 중소기업)",
    report_classification: "1", // 정기신고
    tax_agent_classification: "01", // 세무사
    report_date: "20240331",
    settlement_date: "20240228",
    payment_date: "20240331",
    new_business_extension: false,
    establishment_date: "20200101",
    extension_period: "",
    external_audit: true,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: new Date().toISOString()
};

// 샘플 세무대리인 데이터
const sampleTaxAgentData = {
    id: "550e8400-e29b-41d4-a716-446655440002",
    company_id: "550e8400-e29b-41d4-a716-446655440000",
    primary_phone: "02-9876-5432",
    management_number: "TAX-2024-001",
    agent_name: "박세무사",
    agent_business_no: "987-65-43210",
    agent_phone: "02-9876-5433",
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: new Date().toISOString()
};

// 샘플 계좌정보 데이터
const sampleAccountData = {
    id: "550e8400-e29b-41d4-a716-446655440003",
    company_id: "550e8400-e29b-41d4-a716-446655440000",
    account_number: "123-456-789012",
    bank_code: "004", // 국민은행
    bank_name: "국민은행",
    bank_branch: "강남점",
    deposit_type: "1", // 보통예금
    deposit_period: "1년",
    deposit_rate: "2.5",
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: new Date().toISOString()
};

// 샘플 사업연도 테이블 데이터
const sampleBusinessYearTable = [
    {
        business_year_1: "2024",
        start_date_1: "20240101",
        end_date_1: "20241231",
        report_submitted_1: true,
        remarks_1: "정기신고 완료"
    },
    {
        business_year_2: "2023",
        start_date_2: "20230101",
        end_date_2: "20231231",
        report_submitted_2: true,
        remarks_2: "정기신고 완료"
    },
    {
        business_year_3: "2022",
        start_date_3: "20220101",
        end_date_3: "20221231",
        report_submitted_3: true,
        remarks_3: "정기신고 완료"
    }
];

/**
 * 샘플 데이터 로드
 */
function loadSampleData() {
    if (confirm('샘플 데이터를 로드하시겠습니까? 기존 데이터는 덮어씌워집니다.')) {
        try {
            // 샘플 데이터를 로컬스토리지에 저장
            localStorage.setItem('cotax_company_master', JSON.stringify(sampleCompanyData));
            localStorage.setItem('cotax_tax_classification', JSON.stringify(sampleTaxClassificationData));
            localStorage.setItem('cotax_tax_agent_info', JSON.stringify(sampleTaxAgentData));
            localStorage.setItem('cotax_account_info', JSON.stringify(sampleAccountData));
            localStorage.setItem('cotax_business_year_table', JSON.stringify(sampleBusinessYearTable));
            
            // 페이지 새로고침하여 데이터 반영
            window.location.reload();
            
        } catch (error) {
            console.error('샘플 데이터 로드 중 오류:', error);
            showAlert('샘플 데이터 로드 중 오류가 발생했습니다.', 'danger');
        }
    }
}

/**
 * 랜덤 법인 데이터 생성
 */
function generateRandomCompanyData() {
    const companies = [
        "주식회사 코택스",
        "㈜테크솔루션",
        "주식회사 비즈니스파트너",
        "㈜스마트시스템즈",
        "주식회사 글로벌테크"
    ];
    
    const ceoNames = ["김대표", "이사장", "박회장", "최대표", "정사장"];
    const businessTypes = ["제조업", "서비스업", "도매업", "소매업", "건설업"];
    const businessItems = [
        "소프트웨어 개발", 
        "컨설팅 서비스", 
        "전자제품 제조", 
        "온라인 쇼핑몰 운영",
        "건축 설계"
    ];
    
    const randomCompany = companies[Math.floor(Math.random() * companies.length)];
    const randomCeo = ceoNames[Math.floor(Math.random() * ceoNames.length)];
    const randomBusinessType = businessTypes[Math.floor(Math.random() * businessTypes.length)];
    const randomBusinessItem = businessItems[Math.floor(Math.random() * businessItems.length)];
    
    // 랜덤 등록번호 생성
    const randomRegNo = `${Math.floor(Math.random() * 900000) + 100000}-${Math.floor(Math.random() * 9000000) + 1000000}`;
    const randomBusinessNo = `${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 90) + 10}-${Math.floor(Math.random() * 90000) + 10000}`;
    
    return {
        id: generateUUID(),
        company_name: randomCompany,
        company_reg_no: randomRegNo,
        business_reg_no: randomBusinessNo,
        business_year: new Date().getFullYear().toString(),
        business_year_from: `${new Date().getFullYear()}0101`,
        business_year_to: `${new Date().getFullYear()}1231`,
        ceo_name: randomCeo,
        business_type: randomBusinessType,
        business_item: randomBusinessItem,
        main_business_code: (Math.floor(Math.random() * 90000) + 10000).toString(),
        address: `서울특별시 ${['강남구', '서초구', '종로구', '중구', '영등포구'][Math.floor(Math.random() * 5)]} ${['테헤란로', '강남대로', '서초대로', '세종대로', '여의대로'][Math.floor(Math.random() * 5)]} ${Math.floor(Math.random() * 500) + 1}`,
        phone_number: `02-${Math.floor(Math.random() * 9000) + 1000}-${Math.floor(Math.random() * 9000) + 1000}`,
        email: `info@${randomCompany.replace(/[^a-zA-Z]/g, '').toLowerCase()}.co.kr`,
        branch_code: String(Math.floor(Math.random() * 999) + 1).padStart(3, '0'),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    };
}

/**
 * 랜덤 데이터로 테스트
 */
function loadRandomTestData() {
    if (confirm('랜덤 테스트 데이터를 생성하시겠습니까?')) {
        try {
            const randomData = generateRandomCompanyData();
            
            // 기본 정보
            localStorage.setItem('cotax_company_master', JSON.stringify(randomData));
            
            // 법인구분 정보 (기본값으로 설정)
            const taxClassificationData = {
                ...sampleTaxClassificationData,
                id: generateUUID(),
                company_id: randomData.id,
                company_reg_no: randomData.company_reg_no,
                updated_at: new Date().toISOString()
            };
            localStorage.setItem('cotax_tax_classification', JSON.stringify(taxClassificationData));
            
            // 세무대리인 정보 (기본값으로 설정)
            const taxAgentData = {
                ...sampleTaxAgentData,
                id: generateUUID(),
                company_id: randomData.id,
                updated_at: new Date().toISOString()
            };
            localStorage.setItem('cotax_tax_agent_info', JSON.stringify(taxAgentData));
            
            // 계좌 정보 (기본값으로 설정)
            const accountData = {
                ...sampleAccountData,
                id: generateUUID(),
                company_id: randomData.id,
                account_number: `${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 900000) + 100000}-${Math.floor(Math.random() * 900000) + 100000}`,
                updated_at: new Date().toISOString()
            };
            localStorage.setItem('cotax_account_info', JSON.stringify(accountData));
            
            // 사업연도 테이블 (현재 연도만)
            const currentYear = new Date().getFullYear();
            const businessYearData = [{
                business_year_1: currentYear.toString(),
                start_date_1: `${currentYear}0101`,
                end_date_1: `${currentYear}1231`,
                report_submitted_1: Math.random() > 0.5,
                remarks_1: "자동 생성 데이터"
            }];
            localStorage.setItem('cotax_business_year_table', JSON.stringify(businessYearData));
            
            // 페이지 새로고침하여 데이터 반영
            window.location.reload();
            
        } catch (error) {
            console.error('랜덤 데이터 생성 중 오류:', error);
            showAlert('랜덤 데이터 생성 중 오류가 발생했습니다.', 'danger');
        }
    }
}

/**
 * 데이터 검증
 */
function validateAllData() {
    const results = [];
    
    try {
        // 법인 기본정보 검증
        const companyData = JSON.parse(localStorage.getItem('cotax_company_master') || '{}');
        if (!companyData.company_name) {
            results.push('❌ 법인명이 입력되지 않았습니다.');
        } else {
            results.push('✅ 법인명: ' + companyData.company_name);
        }
        
        if (!companyData.company_reg_no) {
            results.push('❌ 법인등록번호가 입력되지 않았습니다.');
        } else {
            results.push('✅ 법인등록번호: ' + companyData.company_reg_no);
        }
        
        // 사업연도 검증
        const businessYearData = JSON.parse(localStorage.getItem('cotax_business_year_table') || '[]');
        if (businessYearData.length === 0) {
            results.push('❌ 사업연도 정보가 없습니다.');
        } else {
            results.push(`✅ 사업연도 ${businessYearData.length}개 등록됨`);
        }
        
        // 세무대리인 정보 검증
        const taxAgentData = JSON.parse(localStorage.getItem('cotax_tax_agent_info') || '{}');
        if (Object.keys(taxAgentData).length > 0) {
            results.push('✅ 세무대리인 정보 등록됨');
        } else {
            results.push('⚠️ 세무대리인 정보가 없습니다.');
        }
        
        // 계좌 정보 검증
        const accountData = JSON.parse(localStorage.getItem('cotax_account_info') || '{}');
        if (Object.keys(accountData).length > 0) {
            results.push('✅ 계좌 정보 등록됨');
        } else {
            results.push('⚠️ 계좌 정보가 없습니다.');
        }
        
        // 법인구분 정보 검증
        const taxClassificationData = JSON.parse(localStorage.getItem('cotax_tax_classification') || '{}');
        if (Object.keys(taxClassificationData).length > 0) {
            results.push('✅ 법인구분 정보 등록됨');
        } else {
            results.push('⚠️ 법인구분 정보가 없습니다.');
        }
        
    } catch (error) {
        results.push('❌ 데이터 검증 중 오류 발생: ' + error.message);
    }
    
    // 결과 표시
    const resultHtml = `
        <div class="modal fade" id="validationModal" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">데이터 검증 결과</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="list-group">
                            ${results.map(result => `<div class="list-group-item">${result}</div>`).join('')}
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">닫기</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // 기존 모달 제거
    const existingModal = document.getElementById('validationModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // 새 모달 추가 및 표시
    document.body.insertAdjacentHTML('beforeend', resultHtml);
    const modal = new bootstrap.Modal(document.getElementById('validationModal'));
    modal.show();
    
    // 모달이 숨겨진 후 DOM에서 제거
    document.getElementById('validationModal').addEventListener('hidden.bs.modal', function() {
        this.remove();
    });
}

// 전역 함수로 노출
window.loadSampleData = loadSampleData;
window.loadRandomTestData = loadRandomTestData;
window.validateAllData = validateAllData;