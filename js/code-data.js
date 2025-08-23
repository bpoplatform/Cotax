/**
 * CoTax 법인정보등록시스템 코드 데이터
 * 법인세 관련 코드 및 구분값 정의
 */

// 종류별 구분코드 (법인세법 기준)
const TAX_CLASSIFICATION_CODES = {
    "11": "영리법인(상장법인, 중소기업)",
    "71": "영리법인(상장법인, 중견기업)",
    "81": "영리법인(상장법인, 상호출자제한기업)",
    "91": "영리법인(상장법인, 그외기업)",
    "21": "영리법인(코스닥상장법인, 중소기업)",
    "72": "영리법인(코스닥상장법인, 중견기업)",
    "82": "영리법인(코스닥상장법인, 상호출자제한기업)",
    "92": "영리법인(코스닥상장법인, 그외기업)",
    "30": "영리법인(기타법인, 중소기업)",
    "73": "영리법인(기타법인, 중견기업)",
    "83": "영리법인(기타법인, 상호출자제한기업)",
    "93": "영리법인(기타법인, 그외기업)",
    "60": "비영리법인(중소기업)",
    "74": "비영리법인(중견기업)",
    "84": "비영리법인(상호출자제한기업)",
    "94": "비영리법인(그외기업)",
    "50": "비영리법인(당기순이익과세)"
};

// 소장구분 코드
const PRIMARY_CLASSIFICATION_CODES = {
    "A": "일반",
    "B": "간이",
    "C": "특별",
    "D": "임시"
};

// 신고구분 코드
const REPORT_CLASSIFICATION_CODES = {
    "1": "정기신고",
    "2": "수정신고",
    "3": "경정청구",
    "4": "기한후신고"
};

// 세무대리인구분 코드
const TAX_AGENT_CLASSIFICATION_CODES = {
    "01": "세무사",
    "02": "공인회계사",
    "03": "변호사",
    "04": "세무법인",
    "05": "회계법인",
    "06": "기타"
};

// 업종코드 (주요 업종만)
const BUSINESS_TYPE_CODES = {
    "62010": "컴퓨터 프로그래밍 서비스업",
    "62020": "컴퓨터시스템 통합 서비스업",
    "46900": "기타 전문 도매업",
    "47910": "무점포 소매업",
    "64110": "한국은행",
    "64190": "기타 통화금융기관",
    "66110": "생명보험업",
    "66120": "손해보험업",
    "68111": "주거용 건물 임대업",
    "68112": "비주거용 건물 임대업"
};

// 법인유형별 구분코드 (중분류별)
const CORPORATION_TYPE_CODES = {
    // 금융기관 (101-199)
    "101": "은행",
    "102": "증권",
    "103": "생명보험",
    "104": "손해보험",
    "105": "금융지주회사",
    "106": "상호저축은행",
    "107": "신탁회사",
    "108": "종합금융회사",
    "109": "선물회사",
    "110": "신기술금융회사",
    "111": "신용카드사",
    "112": "재보험사",
    "113": "투자자문회사",
    "114": "시설대여회사(리스회사포함)",
    "115": "할부금융회사",
    "199": "기타금융회사",
    
    // 투자회사 (201-210)
    "201": "유동화전문회사",
    "202": "「자본시장과 금융투자업에 관한 법률」에 따른 투자회사 등(경영참여형 사모집합투자기구제외)",
    "203": "기업구조조정부동산투자회사",
    "204": "위탁관리부동산투자회사",
    "205": "선박투자회사",
    "206": "기타 특수목적의 명목회사",
    "207": "기업구조조정투자회사",
    "208": "「민간임대주택에 관한 특별법」또는 「공공주택특별법」에 따른 특수목적법인",
    "209": "「문화산업진흥기본법」에 따른 문화산업전문회사",
    "210": "「해외자원개발 사업법」에 따른 해외자원개발투자회사",
    
    // 비영리조합 (301-399)
    "301": "정비사업조합",
    "302": "농협",
    "303": "수협",
    "304": "신용협동조합",
    "305": "새마을금고",
    "306": "영농조합",
    "307": "영어조합",
    "308": "학교법인",
    "309": "의료법인",
    "310": "산학협력단",
    "311": "산림조합",
    "312": "인삼협동조합",
    "313": "소비자생활조합",
    "399": "기타 조합법인",
    
    // 공기업 (401-499)
    "401": "정부투자기관",
    "402": "정부출자기관",
    "403": "지방공기업(투자)",
    "404": "지방공기업(출자)",
    "499": "그 밖의 공기업",
    
    // 일반지주회사 (501-503)
    "501": "「독점규제 및 공정거래에 관한 법률」제2조1호의2에 따른 지주회사",
    "502": "「기술의 이전 및 사업화 촉진에 관한 법률」제2조제10호의 공공연구기관첨단기술지주회사",
    "503": "「산업교육진흥 및 신학연협력촉진에 관한 법률」제2조제8호의 산학연협력기술지주회사",
    
    // 기타 (100)
    "100": "기타법인"
};

// 법인유형별 중분류
const CORPORATION_CATEGORIES = {
    "금융기관": ["101", "102", "103", "104", "105", "106", "107", "108", "109", "110", "111", "112", "113", "114", "115", "199"],
    "투자회사": ["201", "202", "203", "204", "205", "206", "207", "208", "209", "210"],
    "비영리조합": ["301", "302", "303", "304", "305", "306", "307", "308", "309", "310", "311", "312", "313", "399"],
    "공기업": ["401", "402", "403", "404", "499"],
    "일반지주회사": ["501", "502", "503"],
    "기타": ["100"]
};

// 지역코드 (주요 지역)
const REGION_CODES = {
    "001": "서울특별시",
    "002": "부산광역시",
    "003": "대구광역시",
    "004": "인천광역시",
    "005": "광주광역시",
    "006": "대전광역시",
    "007": "울산광역시",
    "008": "세종특별자치시",
    "009": "경기도",
    "010": "강원도",
    "011": "충청북도",
    "012": "충청남도",
    "013": "전라북도",
    "014": "전라남도",
    "015": "경상북도",
    "016": "경상남도",
    "017": "제주특별자치도"
};

// 금융기관 코드
const BANK_CODES = {
    "001": "한국은행",
    "002": "산업은행",
    "003": "기업은행",
    "004": "국민은행",
    "007": "수협은행",
    "011": "농협은행",
    "020": "우리은행",
    "023": "SC제일은행",
    "027": "한국씨티은행",
    "031": "대구은행",
    "032": "부산은행",
    "034": "광주은행",
    "035": "제주은행",
    "037": "전북은행",
    "039": "경남은행",
    "045": "새마을금고",
    "048": "신협",
    "050": "상호저축은행",
    "064": "산림조합",
    "088": "신한은행",
    "089": "케이뱅크",
    "090": "카카오뱅크"
};

/**
 * 코드헬프 모달 표시
 */
function showCodeHelp(type, targetElementId) {
    let title = '';
    let codes = {};
    
    switch (type) {
        case 'tax_classification':
            title = '종류별 구분코드 선택';
            codes = TAX_CLASSIFICATION_CODES;
            break;
        case 'primary_classification':
            title = '소장구분 선택';
            codes = PRIMARY_CLASSIFICATION_CODES;
            break;
        case 'report_classification':
            title = '신고구분 선택';
            codes = REPORT_CLASSIFICATION_CODES;
            break;
        case 'tax_agent_classification':
            title = '세무대리인구분 선택';
            codes = TAX_AGENT_CLASSIFICATION_CODES;
            break;
        case 'business_type':
            title = '업종코드 선택';
            codes = BUSINESS_TYPE_CODES;
            break;
        case 'corporation_type':
            title = '법인유형별 구분코드 선택';
            codes = CORPORATION_TYPE_CODES;
            break;
        case 'region':
            title = '지역코드 선택';
            codes = REGION_CODES;
            break;
        case 'bank':
            title = '금융기관 선택';
            codes = BANK_CODES;
            break;
        default:
            title = 'CodeHelp';
            codes = {};
    }
    
    // 코드 목록 HTML 생성
    const codeListHtml = Object.entries(codes).map(([code, name]) => `
        <div class="list-group-item list-group-item-action" style="cursor: pointer;" onclick="selectCode('${code}', '${name}', '${targetElementId}')">
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <strong>${code}</strong> - ${name}
                </div>
                <small class="text-muted">선택</small>
            </div>
        </div>
    `).join('');
    
    const modalHtml = `
        <div class="modal fade" id="codeHelpModal" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">${title}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mb-3">
                            <input type="text" class="form-control" placeholder="코드 또는 명칭으로 검색..." onkeyup="filterCodes(this.value)">
                        </div>
                        <div class="list-group" id="codeList" style="max-height: 400px; overflow-y: auto;">
                            ${codeListHtml}
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">취소</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // 기존 모달 제거
    const existingModal = document.getElementById('codeHelpModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // 새 모달 추가 및 표시
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    const modal = new bootstrap.Modal(document.getElementById('codeHelpModal'));
    modal.show();
    
    // 모달이 숨겨진 후 DOM에서 제거
    document.getElementById('codeHelpModal').addEventListener('hidden.bs.modal', function() {
        this.remove();
    });
}

/**
 * 코드 선택
 */
function selectCode(code, name, targetElementId) {
    const targetElement = document.getElementById(targetElementId);
    if (targetElement) {
        if (targetElement.tagName === 'SELECT') {
            // 셀렉트 박스인 경우
            let option = targetElement.querySelector(`option[value="${code}"]`);
            if (!option) {
                // 옵션이 없으면 추가
                option = document.createElement('option');
                option.value = code;
                option.textContent = `${code} - ${name}`;
                targetElement.appendChild(option);
            }
            targetElement.value = code;
        } else {
            // 입력 필드인 경우
            targetElement.value = code;
        }
        
        // 관련 명칭 필드도 업데이트
        const nameFieldId = targetElementId.replace('_code', '_name');
        const nameField = document.getElementById(nameFieldId);
        if (nameField) {
            nameField.value = name;
        }
        
        // 변경 이벤트 발생
        targetElement.dispatchEvent(new Event('change'));
    }
    
    // 모달 닫기
    const modal = bootstrap.Modal.getInstance(document.getElementById('codeHelpModal'));
    if (modal) {
        modal.hide();
    }
}

/**
 * 코드 필터링
 */
function filterCodes(searchTerm) {
    const codeList = document.getElementById('codeList');
    const items = codeList.querySelectorAll('.list-group-item');
    
    items.forEach(item => {
        const text = item.textContent.toLowerCase();
        const search = searchTerm.toLowerCase();
        
        if (text.includes(search)) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

/**
 * 드롭다운 옵션 자동 채우기
 */
function populateDropdownOptions() {
    // 종류별 구분코드 드롭다운 채우기
    const taxClassificationSelects = document.querySelectorAll('select[name*="tax_classification"]');
    taxClassificationSelects.forEach(select => {
        // 기존 옵션 제거 (첫 번째 옵션 제외)
        while (select.children.length > 1) {
            select.removeChild(select.lastChild);
        }
        
        // 새 옵션 추가
        Object.entries(TAX_CLASSIFICATION_CODES).forEach(([code, name]) => {
            const option = document.createElement('option');
            option.value = code;
            option.textContent = `${code} - ${name}`;
            select.appendChild(option);
        });
    });
    
    // 소장구분 드롭다운 채우기
    const primaryClassificationSelects = document.querySelectorAll('select[name*="primary_classification"]');
    primaryClassificationSelects.forEach(select => {
        while (select.children.length > 1) {
            select.removeChild(select.lastChild);
        }
        
        Object.entries(PRIMARY_CLASSIFICATION_CODES).forEach(([code, name]) => {
            const option = document.createElement('option');
            option.value = code;
            option.textContent = `${code} - ${name}`;
            select.appendChild(option);
        });
    });
    
    // 신고구분 드롭다운 채우기
    const reportClassificationSelects = document.querySelectorAll('select[name*="report_classification"]');
    reportClassificationSelects.forEach(select => {
        while (select.children.length > 1) {
            select.removeChild(select.lastChild);
        }
        
        Object.entries(REPORT_CLASSIFICATION_CODES).forEach(([code, name]) => {
            const option = document.createElement('option');
            option.value = code;
            option.textContent = `${code} - ${name}`;
            select.appendChild(option);
        });
    });
    
    // 세무대리인구분 드롭다운 채우기
    const taxAgentClassificationSelects = document.querySelectorAll('select[name*="tax_agent_classification"]');
    taxAgentClassificationSelects.forEach(select => {
        while (select.children.length > 1) {
            select.removeChild(select.lastChild);
        }
        
        Object.entries(TAX_AGENT_CLASSIFICATION_CODES).forEach(([code, name]) => {
            const option = document.createElement('option');
            option.value = code;
            option.textContent = `${code} - ${name}`;
            select.appendChild(option);
        });
    });
}

/**
 * 코드명 자동 조회
 */
function getCodeName(codeType, code) {
    switch (codeType) {
        case 'tax_classification':
            return TAX_CLASSIFICATION_CODES[code] || '';
        case 'primary_classification':
            return PRIMARY_CLASSIFICATION_CODES[code] || '';
        case 'report_classification':
            return REPORT_CLASSIFICATION_CODES[code] || '';
        case 'tax_agent_classification':
            return TAX_AGENT_CLASSIFICATION_CODES[code] || '';
        case 'business_type':
            return BUSINESS_TYPE_CODES[code] || '';
        case 'corporation_type':
            return CORPORATION_TYPE_CODES[code] || '';
        case 'region':
            return REGION_CODES[code] || '';
        case 'bank':
            return BANK_CODES[code] || '';
        default:
            return '';
    }
}

/**
 * 코드 입력 시 자동 명칭 조회
 */
function setupCodeAutoComplete() {
    // 종류별 구분코드 자동완성
    const taxClassificationInputs = document.querySelectorAll('input[name*="tax_classification_code"]');
    taxClassificationInputs.forEach(input => {
        input.addEventListener('blur', function() {
            const code = this.value;
            const name = getCodeName('tax_classification', code);
            const nameField = document.getElementById(this.id.replace('_code', '_name'));
            if (nameField && name) {
                nameField.value = name;
            }
        });
    });
}

/**
 * 코드 변경 시 관련 필드 업데이트
 */
function setupCodeChangeHandlers() {
    // 종류별 구분코드 변경 시
    const taxClassificationSelect = document.getElementById('taxClassificationSelect');
    if (taxClassificationSelect) {
        taxClassificationSelect.addEventListener('change', function() {
            const code = this.value;
            const name = TAX_CLASSIFICATION_CODES[code];
            
            // 중류구분 필드도 업데이트
            const secondaryCode = document.getElementById('secondaryClassificationCode');
            const secondaryName = document.getElementById('secondaryClassificationName');
            if (secondaryCode && secondaryName && code) {
                secondaryCode.value = code;
                secondaryName.value = name;
            }
        });
    }
    
    // 중류구분코드 입력 시 자동 명칭 조회
    const secondaryClassificationCode = document.getElementById('secondaryClassificationCode');
    if (secondaryClassificationCode) {
        secondaryClassificationCode.addEventListener('blur', function() {
            const code = this.value;
            const name = TAX_CLASSIFICATION_CODES[code];
            const nameField = document.getElementById('secondaryClassificationName');
            if (nameField && name) {
                nameField.value = name;
            }
        });
    }
    
    // 금융기관 선택 시 기관명 자동 입력
    const bankCodeSelect = document.getElementById('bankCodeSelect');
    if (bankCodeSelect) {
        bankCodeSelect.addEventListener('change', function() {
            const code = this.value;
            const name = BANK_CODES[code];
            const nameField = document.getElementById('bankName');
            if (nameField && name) {
                nameField.value = name;
            }
        });
    }
    
    // 법인유형별 구분코드 선택 시 명칭 자동 입력
    const corporationTypeSelect = document.getElementById('corporationTypeSelect');
    if (corporationTypeSelect) {
        corporationTypeSelect.addEventListener('change', function() {
            const code = this.value;
            const name = CORPORATION_TYPE_CODES[code];
            const nameField = document.getElementById('corporationTypeName');
            if (nameField && name) {
                nameField.value = name;
            }
        });
    }
}

/**
 * 전체 코드 조회 모달
 */
function showAllCodes() {
    const allCodesHtml = `
        <div class="modal fade" id="allCodesModal" tabindex="-1">
            <div class="modal-dialog modal-xl">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">📋 전체 코드 조회</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <!-- 종류별 구분코드 -->
                            <div class="col-md-6 mb-4">
                                <h6 class="text-primary">🏢 종류별 구분코드</h6>
                                <div class="table-responsive" style="max-height: 300px;">
                                    <table class="table table-sm table-striped">
                                        <thead class="table-dark">
                                            <tr><th>코드</th><th>명칭</th></tr>
                                        </thead>
                                        <tbody>
                                            ${Object.entries(TAX_CLASSIFICATION_CODES).map(([code, name]) => 
                                                `<tr><td><code>${code}</code></td><td>${name}</td></tr>`
                                            ).join('')}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            
                            <!-- 금융기관 코드 -->
                            <div class="col-md-6 mb-4">
                                <h6 class="text-success">🏦 금융기관 코드</h6>
                                <div class="table-responsive" style="max-height: 300px;">
                                    <table class="table table-sm table-striped">
                                        <thead class="table-dark">
                                            <tr><th>코드</th><th>기관명</th></tr>
                                        </thead>
                                        <tbody>
                                            ${Object.entries(BANK_CODES).map(([code, name]) => 
                                                `<tr><td><code>${code}</code></td><td>${name}</td></tr>`
                                            ).join('')}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        
                        <div class="row">
                            <!-- 신고구분 코드 -->
                            <div class="col-md-4 mb-4">
                                <h6 class="text-warning">📝 신고구분 코드</h6>
                                <div class="table-responsive">
                                    <table class="table table-sm table-striped">
                                        <thead class="table-dark">
                                            <tr><th>코드</th><th>구분</th></tr>
                                        </thead>
                                        <tbody>
                                            ${Object.entries(REPORT_CLASSIFICATION_CODES).map(([code, name]) => 
                                                `<tr><td><code>${code}</code></td><td>${name}</td></tr>`
                                            ).join('')}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            
                            <!-- 소장구분 코드 -->
                            <div class="col-md-4 mb-4">
                                <h6 class="text-info">🏛️ 소장구분 코드</h6>
                                <div class="table-responsive">
                                    <table class="table table-sm table-striped">
                                        <thead class="table-dark">
                                            <tr><th>코드</th><th>구분</th></tr>
                                        </thead>
                                        <tbody>
                                            ${Object.entries(PRIMARY_CLASSIFICATION_CODES).map(([code, name]) => 
                                                `<tr><td><code>${code}</code></td><td>${name}</td></tr>`
                                            ).join('')}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            
                            <!-- 세무대리인구분 코드 -->
                            <div class="col-md-4 mb-4">
                                <h6 class="text-secondary">👨‍💼 세무대리인구분 코드</h6>
                                <div class="table-responsive">
                                    <table class="table table-sm table-striped">
                                        <thead class="table-dark">
                                            <tr><th>코드</th><th>구분</th></tr>
                                        </thead>
                                        <tbody>
                                            ${Object.entries(TAX_AGENT_CLASSIFICATION_CODES).map(([code, name]) => 
                                                `<tr><td><code>${code}</code></td><td>${name}</td></tr>`
                                            ).join('')}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        
                        <div class="alert alert-info">
                            <h6><i class="fas fa-info-circle"></i> 코드 사용법</h6>
                            <ul class="mb-0">
                                <li>각 입력 필드 옆의 <i class="fas fa-search"></i> 버튼을 클릭하여 코드를 검색할 수 있습니다.</li>
                                <li>드롭다운에서 직접 선택하거나 코드를 직접 입력할 수 있습니다.</li>
                                <li>코드 입력 후 포커스를 벗어나면 자동으로 명칭이 조회됩니다.</li>
                                <li>법인세법에 따른 정확한 구분코드를 사용해주세요.</li>
                            </ul>
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
    const existingModal = document.getElementById('allCodesModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // 새 모달 추가 및 표시
    document.body.insertAdjacentHTML('beforeend', allCodesHtml);
    const modal = new bootstrap.Modal(document.getElementById('allCodesModal'));
    modal.show();
    
    // 모달이 숨겨진 후 DOM에서 제거
    document.getElementById('allCodesModal').addEventListener('hidden.bs.modal', function() {
        this.remove();
    });
}

// 전역 함수로 노출
window.showCodeHelp = showCodeHelp;
window.selectCode = selectCode;
window.filterCodes = filterCodes;
window.populateDropdownOptions = populateDropdownOptions;
window.getCodeName = getCodeName;
window.setupCodeAutoComplete = setupCodeAutoComplete;
window.setupCodeChangeHandlers = setupCodeChangeHandlers;
window.showAllCodes = showAllCodes;

// 페이지 로드 시 드롭다운 옵션 채우기
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        populateDropdownOptions();
        setupCodeAutoComplete();
        setupCodeChangeHandlers();
    }, 100);
});