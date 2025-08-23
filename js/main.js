/**
 * CoTax 법인정보등록시스템 메인 자바스크립트
 * 로컬스토리지를 활용한 법인세 관련 데이터 관리
 */

// 전역 변수
let currentCompanyId = null;
let businessYearRowCount = 0;

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    initializeSystem();
    loadSavedData();
    setupEventListeners();
});

/**
 * 시스템 초기화
 */
function initializeSystem() {
    console.log('CoTax 법인정보등록시스템 v1.0 초기화 중...');
    
    // UUID 생성 함수 (간단한 버전)
    if (!window.crypto && !window.msCrypto) {
        console.warn('Crypto API를 사용할 수 없습니다. 대체 UUID 생성 함수를 사용합니다.');
    }
    
    // 현재 날짜를 기본값으로 설정
    setCurrentDateDefaults();
    
    console.log('시스템 초기화 완료');
}

/**
 * 현재 날짜를 기본값으로 설정
 */
function setCurrentDateDefaults() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const currentDate = `${year}${month}${day}`;
    
    // 사업연도 기본값 설정
    const businessYearInputs = document.querySelectorAll('input[name="business_year"]');
    businessYearInputs.forEach(input => {
        if (!input.value) {
            input.value = year.toString();
        }
    });
}

/**
 * 이벤트 리스너 설정
 */
function setupEventListeners() {
    // 탭 전환 시 데이터 동기화
    document.querySelectorAll('#layoutTabs .nav-link').forEach(tab => {
        tab.addEventListener('click', function() {
            syncDataBetweenTabs();
        });
    });
    
    // 폼 입력 시 실시간 저장
    document.querySelectorAll('input, select, textarea').forEach(element => {
        element.addEventListener('change', function() {
            if (this.form && this.form.id) {
                autoSaveFormData(this.form.id);
            }
        });
    });
    
    // 법인명, 법인등록번호 변경 시 전체 동기화
    document.getElementById('companyName')?.addEventListener('change', syncCompanyName);
    document.getElementById('companyRegNo')?.addEventListener('change', syncCompanyRegNo);
}

/**
 * UUID 생성
 */
function generateUUID() {
    if (window.crypto && window.crypto.randomUUID) {
        return window.crypto.randomUUID();
    } else {
        // 대체 UUID 생성
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
}

/**
 * 로컬스토리지에서 데이터 로드
 */
function loadSavedData() {
    try {
        // 법인 기본정보 로드
        const companyData = localStorage.getItem('cotax_company_master');
        if (companyData) {
            const data = JSON.parse(companyData);
            populateForm('layout1Form', data);
            populateForm('layout2Form', data);
            populateForm('layout3Form', data);
            currentCompanyId = data.id;
        }
        
        // 세무대리인정보 로드
        const taxAgentData = localStorage.getItem('cotax_tax_agent_info');
        if (taxAgentData) {
            populateForm('layout4Form', JSON.parse(taxAgentData));
        }
        
        // 계좌정보 로드
        const accountData = localStorage.getItem('cotax_account_info');
        if (accountData) {
            populateForm('layout5Form', JSON.parse(accountData));
        }
        
        // 법인구분정보 로드
        const taxClassificationData = localStorage.getItem('cotax_tax_classification');
        if (taxClassificationData) {
            populateForm('layout3Form', JSON.parse(taxClassificationData));
        }
        
        // 사업연도 테이블 로드
        loadBusinessYearTable();
        
        showAlert('저장된 데이터를 불러왔습니다.', 'success');
        
    } catch (error) {
        console.error('데이터 로드 중 오류 발생:', error);
        showAlert('데이터 로드 중 오류가 발생했습니다.', 'danger');
    }
}

/**
 * 폼에 데이터 채우기
 */
function populateForm(formId, data) {
    const form = document.getElementById(formId);
    if (!form) return;
    
    Object.keys(data).forEach(key => {
        const element = form.querySelector(`[name="${key}"]`);
        if (element) {
            if (element.type === 'checkbox') {
                element.checked = data[key];
            } else {
                element.value = data[key] || '';
            }
        }
    });
}

/**
 * 폼 데이터 자동 저장
 */
function autoSaveFormData(formId) {
    const form = document.getElementById(formId);
    if (!form) return;
    
    const formData = new FormData(form);
    const data = {};
    
    for (let [key, value] of formData.entries()) {
        data[key] = value;
    }
    
    // 체크박스 처리
    form.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        data[checkbox.name] = checkbox.checked;
    });
    
    // ID가 없으면 생성
    if (!data.id && !currentCompanyId) {
        currentCompanyId = generateUUID();
    }
    data.id = currentCompanyId;
    data.updated_at = new Date().toISOString();
    
    // 폼별로 적절한 키에 저장
    let storageKey = '';
    switch (formId) {
        case 'layout1Form':
        case 'layout2Form':
        case 'layout3Form':
            storageKey = 'cotax_company_master';
            break;
        case 'layout4Form':
            storageKey = 'cotax_tax_agent_info';
            data.company_id = currentCompanyId;
            break;
        case 'layout5Form':
            storageKey = 'cotax_account_info';
            data.company_id = currentCompanyId;
            break;
    }
    
    if (storageKey) {
        // 기존 데이터와 병합
        const existingData = localStorage.getItem(storageKey);
        if (existingData) {
            const merged = { ...JSON.parse(existingData), ...data };
            localStorage.setItem(storageKey, JSON.stringify(merged));
        } else {
            data.created_at = new Date().toISOString();
            localStorage.setItem(storageKey, JSON.stringify(data));
        }
    }
}

/**
 * 탭 간 데이터 동기화
 */
function syncDataBetweenTabs() {
    const companyName = document.getElementById('companyName')?.value;
    const companyRegNo = document.getElementById('companyRegNo')?.value;
    const businessYear = document.querySelector('input[name="business_year"]')?.value;
    
    if (companyName) {
        document.querySelectorAll('input[name="company_name"]').forEach(input => {
            input.value = companyName;
        });
    }
    
    if (companyRegNo) {
        document.querySelectorAll('input[name="company_reg_no"]').forEach(input => {
            input.value = companyRegNo;
        });
    }
    
    if (businessYear) {
        document.querySelectorAll('input[name="business_year"]').forEach(input => {
            input.value = businessYear;
        });
    }
}

/**
 * 법인명 동기화
 */
function syncCompanyName() {
    const companyName = this.value;
    document.querySelectorAll('input[name="company_name"]').forEach(input => {
        input.value = companyName;
    });
    autoSaveFormData('layout1Form');
}

/**
 * 법인등록번호 동기화
 */
function syncCompanyRegNo() {
    const companyRegNo = this.value;
    document.querySelectorAll('input[name="company_reg_no"]').forEach(input => {
        input.value = companyRegNo;
    });
    autoSaveFormData('layout1Form');
}

/**
 * 사업연도 테이블 행 추가
 */
function addBusinessYearRow() {
    console.log('Legacy addBusinessYearRow called - checking for grid...');
    
    // AG-Grid가 있으면 그것을 우선 사용
    if (window.gridManager && window.gridManager.grids && window.gridManager.grids['businessYear']) {
        console.log('Using AG-Grid to add business year row');
        const newRow = {
            year: new Date().getFullYear() + Math.floor(Math.random() * 3),
            startDate: new Date().getFullYear() + '-01-01',
            endDate: new Date().getFullYear() + '-12-31',
            reportSubmitted: false,
            remarks: '새로운 사업연도'
        };
        
        try {
            window.gridManager.addRow('businessYear', newRow);
            console.log('Business year row added successfully via AG-Grid');
            return;
        } catch (error) {
            console.error('Error adding row via AG-Grid:', error);
        }
    }
    
    // AG-Grid가 없으면 기존 HTML 테이블 로직 사용 (fallback)
    console.log('Fallback to HTML table');
    const tableBody = document.getElementById('businessYearTable');
    if (!tableBody) {
        console.log('No HTML table found either');
        return;
    }
    
    businessYearRowCount++;
    const row = document.createElement('tr');
    
    const currentYear = new Date().getFullYear();
    const startDate = `${currentYear}0101`;
    const endDate = `${currentYear}1231`;
    
    row.innerHTML = `
        <td><input type="text" class="form-control form-control-sm" value="${currentYear}" name="business_year_${businessYearRowCount}"></td>
        <td><input type="text" class="form-control form-control-sm" value="${startDate}" name="start_date_${businessYearRowCount}" placeholder="YYYYMMDD"></td>
        <td><input type="text" class="form-control form-control-sm" value="${endDate}" name="end_date_${businessYearRowCount}" placeholder="YYYYMMDD"></td>
        <td><input type="checkbox" class="form-check-input" name="report_submitted_${businessYearRowCount}"></td>
        <td><input type="text" class="form-control form-control-sm" name="remarks_${businessYearRowCount}"></td>
        <td><button type="button" class="btn btn-sm btn-outline-success" onclick="editRow(this)">E</button></td>
        <td><button type="button" class="btn btn-sm btn-outline-info" onclick="newRow(this)">N</button></td>
        <td><button type="button" class="btn btn-sm btn-outline-danger" onclick="deleteRow(this)">D</button></td>
        <td></td><td></td><td></td><td></td><td></td>
    `;
    
    tableBody.appendChild(row);
    
    // 새 행의 이벤트 리스너 추가
    row.querySelectorAll('input').forEach(input => {
        input.addEventListener('change', saveBusinessYearTable);
    });
    
    saveBusinessYearTable();
}

/**
 * 테이블 행 편집
 */
function editRow(button) {
    const row = button.closest('tr');
    const inputs = row.querySelectorAll('input');
    
    inputs.forEach(input => {
        input.disabled = !input.disabled;
        input.classList.toggle('bg-warning', !input.disabled);
    });
    
    button.textContent = button.textContent === 'E' ? 'S' : 'E';
    button.classList.toggle('btn-outline-success');
    button.classList.toggle('btn-success');
}

/**
 * 새 행 추가
 */
function newRow(button) {
    addBusinessYearRow();
}

/**
 * 행 삭제
 */
function deleteRow(button) {
    if (confirm('이 행을 삭제하시겠습니까?')) {
        const row = button.closest('tr');
        row.remove();
        saveBusinessYearTable();
    }
}

/**
 * 사업연도 테이블 저장
 */
function saveBusinessYearTable() {
    const tableBody = document.getElementById('businessYearTable');
    if (!tableBody) return;
    
    const rows = [];
    tableBody.querySelectorAll('tr').forEach(row => {
        const rowData = {};
        row.querySelectorAll('input').forEach(input => {
            if (input.type === 'checkbox') {
                rowData[input.name] = input.checked;
            } else {
                rowData[input.name] = input.value;
            }
        });
        if (Object.keys(rowData).length > 0) {
            rows.push(rowData);
        }
    });
    
    localStorage.setItem('cotax_business_year_table', JSON.stringify(rows));
}

/**
 * 사업연도 테이블 로드
 */
function loadBusinessYearTable() {
    const savedRows = localStorage.getItem('cotax_business_year_table');
    if (!savedRows) return;
    
    const rows = JSON.parse(savedRows);
    const tableBody = document.getElementById('businessYearTable');
    
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    businessYearRowCount = 0;
    
    rows.forEach(rowData => {
        businessYearRowCount++;
        const row = document.createElement('tr');
        
        const businessYearKey = `business_year_${businessYearRowCount}`;
        const startDateKey = `start_date_${businessYearRowCount}`;
        const endDateKey = `end_date_${businessYearRowCount}`;
        const reportSubmittedKey = `report_submitted_${businessYearRowCount}`;
        const remarksKey = `remarks_${businessYearRowCount}`;
        
        row.innerHTML = `
            <td><input type="text" class="form-control form-control-sm" value="${rowData[businessYearKey] || ''}" name="${businessYearKey}"></td>
            <td><input type="text" class="form-control form-control-sm" value="${rowData[startDateKey] || ''}" name="${startDateKey}" placeholder="YYYYMMDD"></td>
            <td><input type="text" class="form-control form-control-sm" value="${rowData[endDateKey] || ''}" name="${endDateKey}" placeholder="YYYYMMDD"></td>
            <td><input type="checkbox" class="form-check-input" name="${reportSubmittedKey}" ${rowData[reportSubmittedKey] ? 'checked' : ''}></td>
            <td><input type="text" class="form-control form-control-sm" value="${rowData[remarksKey] || ''}" name="${remarksKey}"></td>
            <td><button type="button" class="btn btn-sm btn-outline-success" onclick="editRow(this)">E</button></td>
            <td><button type="button" class="btn btn-sm btn-outline-info" onclick="newRow(this)">N</button></td>
            <td><button type="button" class="btn btn-sm btn-outline-danger" onclick="deleteRow(this)">D</button></td>
            <td></td><td></td><td></td><td></td><td></td>
        `;
        
        tableBody.appendChild(row);
        
        // 이벤트 리스너 추가
        row.querySelectorAll('input').forEach(input => {
            input.addEventListener('change', saveBusinessYearTable);
        });
    });
}

/**
 * 전체 데이터 저장
 */
function saveAllData() {
    try {
        showLoading(true);
        
        // 모든 폼 데이터 저장
        ['layout1Form', 'layout2Form', 'layout3Form', 'layout4Form', 'layout5Form'].forEach(formId => {
            autoSaveFormData(formId);
        });
        
        // 사업연도 테이블 저장
        saveBusinessYearTable();
        
        // 탭 간 데이터 동기화
        syncDataBetweenTabs();
        
        setTimeout(() => {
            showLoading(false);
            showAlert('모든 데이터가 성공적으로 저장되었습니다.', 'success');
        }, 1000);
        
    } catch (error) {
        showLoading(false);
        console.error('데이터 저장 중 오류 발생:', error);
        showAlert('데이터 저장 중 오류가 발생했습니다.', 'danger');
    }
}

/**
 * 전체 폼 초기화
 */
function resetAllForms() {
    if (confirm('모든 데이터를 초기화하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
        // 로컬스토리지 클리어
        ['cotax_company_master', 'cotax_tax_agent_info', 'cotax_account_info', 'cotax_tax_classification', 'cotax_business_year_table'].forEach(key => {
            localStorage.removeItem(key);
        });
        
        // 폼 초기화
        document.querySelectorAll('form').forEach(form => {
            form.reset();
        });
        
        // 사업연도 테이블 초기화
        const tableBody = document.getElementById('businessYearTable');
        if (tableBody) {
            tableBody.innerHTML = '';
        }
        businessYearRowCount = 0;
        currentCompanyId = null;
        
        showAlert('모든 데이터가 초기화되었습니다.', 'info');
    }
}

/**
 * CodeHelp 모달 열기
 */
function openCodeHelp(type) {
    let title = '';
    let content = '';
    
    switch (type) {
        case 'company':
            title = '법인명 검색';
            content = '등록된 법인명을 검색할 수 있습니다.';
            break;
        case 'business_year':
            title = '사업연도 선택';
            content = '사업연도를 선택할 수 있습니다.';
            break;
        default:
            title = 'CodeHelp';
            content = 'CodeHelp 기능입니다.';
    }
    
    showCustomModal(title, content);
}

/**
 * 사용자 정의 모달 표시
 */
function showCustomModal(title, content) {
    const modalHtml = `
        <div class="modal fade" id="customModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">${title}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <p>${content}</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">닫기</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // 기존 모달 제거
    const existingModal = document.getElementById('customModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // 새 모달 추가
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    
    // 모달 표시
    const modal = new bootstrap.Modal(document.getElementById('customModal'));
    modal.show();
    
    // 모달이 숨겨진 후 DOM에서 제거
    document.getElementById('customModal').addEventListener('hidden.bs.modal', function() {
        this.remove();
    });
}

/**
 * ERP 연결 모달
 */
function showERPDialog() {
    const modal = new bootstrap.Modal(document.getElementById('erpModal'));
    modal.show();
}

/**
 * 도움말 모달
 */
function showHelpDialog() {
    const modal = new bootstrap.Modal(document.getElementById('helpModal'));
    modal.show();
}

/**
 * 각종 버튼 기능들
 */
function showBusinessRegistration() {
    showCustomModal('법수서류 가져오기', '법수서류를 가져오는 기능입니다.');
}

function showBusinessInfo() {
    showCustomModal('전기 데이터 가져오기', '전기 데이터를 가져오는 기능입니다.');
}

function showTaxClassification() {
    showCustomModal('전기 데이터 가져오기', '법인기/계명/세무내역 리스트/계산정보를 가져옵니다.');
}

function showTaxAgentInfo() {
    showCustomModal('서식/법인세내역 가져오기', '서식/법인세내역을 가져오는 기능입니다.');
}

function confirmData() {
    const confirmCheck = document.getElementById('confirmCheck');
    if (confirmCheck) {
        confirmCheck.checked = true;
        showAlert('데이터가 확정되었습니다.', 'success');
        saveAllData();
    }
}

function confirmCancel() {
    const confirmCheck = document.getElementById('confirmCheck');
    if (confirmCheck) {
        confirmCheck.checked = false;
        showAlert('확정이 취소되었습니다.', 'warning');
        saveAllData();
    }
}

/**
 * 로딩 표시/숨김
 */
function showLoading(show) {
    let loading = document.querySelector('.loading');
    if (!loading) {
        loading = document.createElement('div');
        loading.className = 'loading';
        loading.innerHTML = '<div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div>';
        document.body.appendChild(loading);
    }
    
    loading.style.display = show ? 'block' : 'none';
}

/**
 * 알림 메시지 표시
 */
function showAlert(message, type = 'info') {
    // 기존 알림 제거
    const existingAlert = document.querySelector('.alert-custom');
    if (existingAlert) {
        existingAlert.remove();
    }
    
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-custom fade-in`;
    alertDiv.style.position = 'fixed';
    alertDiv.style.top = '20px';
    alertDiv.style.right = '20px';
    alertDiv.style.zIndex = '9999';
    alertDiv.style.minWidth = '300px';
    alertDiv.innerHTML = `
        <div class="d-flex justify-content-between align-items-center">
            <span>${message}</span>
            <button type="button" class="btn-close btn-sm" onclick="this.parentElement.parentElement.remove()"></button>
        </div>
    `;
    
    document.body.appendChild(alertDiv);
    
    // 5초 후 자동 제거
    setTimeout(() => {
        if (alertDiv.parentElement) {
            alertDiv.remove();
        }
    }, 5000);
}

/**
 * 데이터 내보내기 (JSON)
 */
function exportData() {
    try {
        const data = {
            company_master: JSON.parse(localStorage.getItem('cotax_company_master') || '{}'),
            tax_agent_info: JSON.parse(localStorage.getItem('cotax_tax_agent_info') || '{}'),
            account_info: JSON.parse(localStorage.getItem('cotax_account_info') || '{}'),
            tax_classification: JSON.parse(localStorage.getItem('cotax_tax_classification') || '{}'),
            business_year_table: JSON.parse(localStorage.getItem('cotax_business_year_table') || '[]'),
            exported_at: new Date().toISOString()
        };
        
        const dataStr = JSON.stringify(data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `cotax_data_${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        showAlert('데이터가 성공적으로 내보내졌습니다.', 'success');
        
    } catch (error) {
        console.error('데이터 내보내기 중 오류 발생:', error);
        showAlert('데이터 내보내기 중 오류가 발생했습니다.', 'danger');
    }
}

/**
 * 데이터 가져오기 (JSON)
 */
function importData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = function(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const data = JSON.parse(e.target.result);
                
                // 데이터 유효성 검사
                if (data.company_master) {
                    localStorage.setItem('cotax_company_master', JSON.stringify(data.company_master));
                }
                if (data.tax_agent_info) {
                    localStorage.setItem('cotax_tax_agent_info', JSON.stringify(data.tax_agent_info));
                }
                if (data.account_info) {
                    localStorage.setItem('cotax_account_info', JSON.stringify(data.account_info));
                }
                if (data.tax_classification) {
                    localStorage.setItem('cotax_tax_classification', JSON.stringify(data.tax_classification));
                }
                if (data.business_year_table) {
                    localStorage.setItem('cotax_business_year_table', JSON.stringify(data.business_year_table));
                }
                
                // 데이터 다시 로드
                loadSavedData();
                
                showAlert('데이터가 성공적으로 가져와졌습니다.', 'success');
                
            } catch (error) {
                console.error('데이터 가져오기 중 오류 발생:', error);
                showAlert('올바르지 않은 파일 형식입니다.', 'danger');
            }
        };
        
        reader.readAsText(file);
    };
    
    input.click();
}