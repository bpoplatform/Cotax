/**
 * CoTax 세무계산 인터페이스
 * 사용자 인터페이스와 세무계산 로직 연결
 */

// 세무조정 항목 목록
let taxAdjustmentItems = [];

/**
 * 세무조정 항목 추가
 */
function addTaxAdjustment(type) {
    const modalContent = type === 'nonDeductible' 
        ? generateNonDeductibleModal() 
        : generateNonTaxableModal();
    
    showTaxAdjustmentModal(modalContent, type);
}

/**
 * 손금불산입 모달 생성
 */
function generateNonDeductibleModal() {
    return `
        <div class="mb-3">
            <label class="form-label">항목 선택</label>
            <select class="form-select" id="adjustmentCode">
                <option value="">선택하세요</option>
                <option value="A01">A01 - 접대비한도초과액</option>
                <option value="A02">A02 - 기부금한도초과액</option>
                <option value="A03">A03 - 업무무관경비</option>
                <option value="A04">A04 - 법인세법위반과태료</option>
                <option value="A05">A05 - 임원상여한도초과액</option>
                <option value="A06">A06 - 감가상각비한도초과액</option>
                <option value="A07">A07 - 충당금한도초과액</option>
                <option value="A08">A08 - 지급이자한도초과액</option>
            </select>
        </div>
        <div class="mb-3">
            <label class="form-label">항목명</label>
            <input type="text" class="form-control" id="adjustmentName" readonly placeholder="항목 선택 시 자동입력">
        </div>
        <div class="mb-3">
            <label class="form-label text-danger">금액 *</label>
            <div class="input-group">
                <input type="number" class="form-control" id="adjustmentAmount" placeholder="0" min="0">
                <span class="input-group-text">원</span>
            </div>
        </div>
        <div class="mb-3">
            <label class="form-label">설명</label>
            <textarea class="form-control" id="adjustmentDescription" rows="2" placeholder="추가 설명 (선택사항)"></textarea>
        </div>
    `;
}

/**
 * 익금불산입 모달 생성
 */
function generateNonTaxableModal() {
    return `
        <div class="mb-3">
            <label class="form-label">항목 선택</label>
            <select class="form-select" id="adjustmentCode">
                <option value="">선택하세요</option>
                <option value="B01">B01 - 수입배당금익금불산입</option>
                <option value="B02">B02 - 국고보조금등익금불산입</option>
                <option value="B03">B03 - 보험차익익금불산입</option>
                <option value="B04">B04 - 기타익금불산입</option>
            </select>
        </div>
        <div class="mb-3">
            <label class="form-label">항목명</label>
            <input type="text" class="form-control" id="adjustmentName" readonly placeholder="항목 선택 시 자동입력">
        </div>
        <div class="mb-3">
            <label class="form-label text-danger">금액 *</label>
            <div class="input-group">
                <input type="number" class="form-control" id="adjustmentAmount" placeholder="0" min="0">
                <span class="input-group-text">원</span>
            </div>
        </div>
        <div class="mb-3">
            <label class="form-label">설명</label>
            <textarea class="form-control" id="adjustmentDescription" rows="2" placeholder="추가 설명 (선택사항)"></textarea>
        </div>
    `;
}

/**
 * 세무조정 모달 표시
 */
function showTaxAdjustmentModal(content, type) {
    const title = type === 'nonDeductible' ? '손금불산입 항목 추가' : '익금불산입 항목 추가';
    
    const modalHtml = `
        <div class="modal fade" id="taxAdjustmentModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">${title}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        ${content}
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">취소</button>
                        <button type="button" class="btn btn-primary" onclick="saveTaxAdjustmentItem('${type}')">추가</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // 기존 모달 제거
    const existingModal = document.getElementById('taxAdjustmentModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // 새 모달 추가 및 표시
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    const modal = new bootstrap.Modal(document.getElementById('taxAdjustmentModal'));
    modal.show();
    
    // 항목 선택 시 이름 자동 입력
    document.getElementById('adjustmentCode').addEventListener('change', function() {
        const selectedOption = this.options[this.selectedIndex];
        const name = selectedOption.text.split(' - ')[1] || '';
        document.getElementById('adjustmentName').value = name;
    });
    
    // 모달이 숨겨진 후 DOM에서 제거
    document.getElementById('taxAdjustmentModal').addEventListener('hidden.bs.modal', function() {
        this.remove();
    });
}

/**
 * 세무조정 항목 저장
 */
function saveTaxAdjustmentItem(type) {
    const code = document.getElementById('adjustmentCode').value;
    const name = document.getElementById('adjustmentName').value;
    const amount = parseFloat(document.getElementById('adjustmentAmount').value) || 0;
    const description = document.getElementById('adjustmentDescription').value;
    
    if (!code || !name || amount <= 0) {
        showAlert('모든 필수 항목을 입력해주세요.', 'warning');
        return;
    }
    
    const adjustment = {
        id: Date.now().toString(),
        code,
        name,
        type,
        amount,
        description
    };
    
    taxAdjustmentItems.push(adjustment);
    updateTaxAdjustmentsList();
    
    // 모달 닫기
    const modal = bootstrap.Modal.getInstance(document.getElementById('taxAdjustmentModal'));
    if (modal) {
        modal.hide();
    }
    
    showAlert('세무조정 항목이 추가되었습니다.', 'success');
}

/**
 * 세무조정 목록 업데이트
 */
function updateTaxAdjustmentsList() {
    const listContainer = document.getElementById('taxAdjustmentsList');
    
    if (taxAdjustmentItems.length === 0) {
        listContainer.innerHTML = '<p class="text-muted mb-0">세무조정 항목이 없습니다. 위 버튼을 클릭하여 추가하세요.</p>';
        return;
    }
    
    const nonDeductibleItems = taxAdjustmentItems.filter(item => item.type === 'nonDeductible');
    const nonTaxableItems = taxAdjustmentItems.filter(item => item.type === 'nonTaxable');
    
    let html = '';
    
    if (nonDeductibleItems.length > 0) {
        html += `
            <div class="mb-3">
                <h6 class="text-danger">손금불산입</h6>
                <div class="table-responsive">
                    <table class="table table-sm table-bordered">
                        <thead class="table-light">
                            <tr>
                                <th>코드</th>
                                <th>항목명</th>
                                <th>금액</th>
                                <th>설명</th>
                                <th>작업</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${nonDeductibleItems.map(item => `
                                <tr>
                                    <td>${item.code}</td>
                                    <td>${item.name}</td>
                                    <td class="text-end">${formatAmount(item.amount)}원</td>
                                    <td>${item.description || '-'}</td>
                                    <td>
                                        <button class="btn btn-outline-danger btn-sm" onclick="removeTaxAdjustmentItem('${item.id}')">
                                            <i class="fas fa-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            `).join('')}
                            <tr class="table-danger">
                                <td colspan="2"><strong>손금불산입 합계</strong></td>
                                <td class="text-end"><strong>${formatAmount(nonDeductibleItems.reduce((sum, item) => sum + item.amount, 0))}원</strong></td>
                                <td colspan="2"></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }
    
    if (nonTaxableItems.length > 0) {
        html += `
            <div class="mb-3">
                <h6 class="text-success">익금불산입</h6>
                <div class="table-responsive">
                    <table class="table table-sm table-bordered">
                        <thead class="table-light">
                            <tr>
                                <th>코드</th>
                                <th>항목명</th>
                                <th>금액</th>
                                <th>설명</th>
                                <th>작업</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${nonTaxableItems.map(item => `
                                <tr>
                                    <td>${item.code}</td>
                                    <td>${item.name}</td>
                                    <td class="text-end">${formatAmount(item.amount)}원</td>
                                    <td>${item.description || '-'}</td>
                                    <td>
                                        <button class="btn btn-outline-danger btn-sm" onclick="removeTaxAdjustmentItem('${item.id}')">
                                            <i class="fas fa-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            `).join('')}
                            <tr class="table-success">
                                <td colspan="2"><strong>익금불산입 합계</strong></td>
                                <td class="text-end"><strong>${formatAmount(nonTaxableItems.reduce((sum, item) => sum + item.amount, 0))}원</strong></td>
                                <td colspan="2"></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }
    
    listContainer.innerHTML = html;
}

/**
 * 세무조정 항목 제거
 */
function removeTaxAdjustmentItem(itemId) {
    if (confirm('이 항목을 삭제하시겠습니까?')) {
        taxAdjustmentItems = taxAdjustmentItems.filter(item => item.id !== itemId);
        updateTaxAdjustmentsList();
        showAlert('세무조정 항목이 삭제되었습니다.', 'info');
    }
}

/**
 * 자동 세무조정 계산
 */
function calculateAutomaticAdjustments() {
    const revenue = parseFloat(document.getElementById('revenue').value) || 0;
    const totalSalary = parseFloat(document.getElementById('totalSalary').value) || 0;
    
    if (revenue === 0) {
        showAlert('매출액을 먼저 입력해주세요.', 'warning');
        return;
    }
    
    // 접대비 한도 계산
    const entertainmentLimit = TaxAdjustmentHelper.calculateEntertainmentLimit(revenue);
    
    // 자동 계산 결과 모달 표시
    const modalHtml = `
        <div class="modal fade" id="autoCalculationModal" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">자동 세무조정 계산 결과</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="alert alert-info">
                            <h6><i class="fas fa-info-circle"></i> 계산 기준</h6>
                            <ul class="mb-0">
                                <li>매출액: ${formatAmount(revenue)}원</li>
                                <li>총급여액: ${formatAmount(totalSalary)}원</li>
                            </ul>
                        </div>
                        
                        <h6>한도 계산 결과</h6>
                        <div class="table-responsive">
                            <table class="table table-striped">
                                <thead>
                                    <tr>
                                        <th>항목</th>
                                        <th>한도액</th>
                                        <th>계산식</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>접대비 한도</td>
                                        <td class="text-end">${formatAmount(entertainmentLimit)}원</td>
                                        <td>${getEntertainmentLimitFormula(revenue)}</td>
                                    </tr>
                                    <tr>
                                        <td>기부금 한도 (과세표준 기준)</td>
                                        <td class="text-end">과세표준의 10%</td>
                                        <td>최종 계산 후 결정</td>
                                    </tr>
                                    ${totalSalary > 0 ? `
                                    <tr>
                                        <td>임원상여 한도</td>
                                        <td class="text-end">${formatAmount(totalSalary * 0.7)}원</td>
                                        <td>총급여의 70%</td>
                                    </tr>
                                    ` : ''}
                                </tbody>
                            </table>
                        </div>
                        
                        <div class="alert alert-warning">
                            <strong>참고사항:</strong> 위 한도액은 참고용으로, 실제 지출액과 비교하여 초과분만 손금불산입으로 처리해야 합니다.
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
    const existingModal = document.getElementById('autoCalculationModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // 새 모달 추가 및 표시
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    const modal = new bootstrap.Modal(document.getElementById('autoCalculationModal'));
    modal.show();
    
    // 모달이 숨겨진 후 DOM에서 제거
    document.getElementById('autoCalculationModal').addEventListener('hidden.bs.modal', function() {
        this.remove();
    });
}

/**
 * 접대비 한도 계산식 텍스트 생성
 */
function getEntertainmentLimitFormula(revenue) {
    if (revenue <= 10000000000) {
        return `min(1,200만원, 매출액 × 3%)`;
    } else if (revenue <= 50000000000) {
        return `1,200만원 + (매출액-100억) × 0.5%`;
    } else {
        return `3,200만원 (최대한도)`;
    }
}

/**
 * 전체 세무계산 실행
 */
function executeFullTaxCalculation() {
    try {
        // 입력값 검증
        const revenue = parseFloat(document.getElementById('revenue').value) || 0;
        const bookIncome = parseFloat(document.getElementById('bookIncome').value) || 0;
        const expenses = parseFloat(document.getElementById('expenses').value) || 0;
        
        if (revenue === 0 || bookIncome === 0) {
            showAlert('매출액과 회계상 당기순이익을 입력해주세요.', 'warning');
            return;
        }
        
        // 세무계산기 초기화
        if (!window.taxCalculator) {
            window.taxCalculator = setupTaxCalculatorFromStorage();
        }
        
        // 재무 데이터 설정
        window.taxCalculator.setFinancialData({
            revenue,
            bookIncome,
            expenses
        });
        
        // 세무조정 항목 추가
        window.taxCalculator.taxData.taxAdjustments = [...taxAdjustmentItems];
        
        // 계산 실행
        window.taxCalculator.calculate();
        const results = window.taxCalculator.getResults();
        
        // 결과 표시
        displayTaxCalculationResults(results);
        
        // 로컬 스토리지에 계산 결과 저장
        localStorage.setItem('cotax_tax_calculation_results', JSON.stringify(results));
        
        showAlert('세무계산이 완료되었습니다!', 'success');
        
    } catch (error) {
        console.error('세무계산 오류:', error);
        showAlert('세무계산 중 오류가 발생했습니다: ' + error.message, 'danger');
    }
}

/**
 * 세무계산 결과 표시
 */
function displayTaxCalculationResults(results) {
    document.getElementById('resultBookIncome').textContent = formatAmount(results.financialData.bookIncome) + '원';
    document.getElementById('resultNonDeductible').textContent = '+' + formatAmount(
        results.taxAdjustments.filter(adj => adj.type === 'nonDeductible').reduce((sum, adj) => sum + adj.amount, 0)
    ) + '원';
    document.getElementById('resultNonTaxable').textContent = '-' + formatAmount(
        results.taxAdjustments.filter(adj => adj.type === 'nonTaxable').reduce((sum, adj) => sum + adj.amount, 0)
    ) + '원';
    document.getElementById('resultTaxableIncome').textContent = formatAmount(results.financialData.taxableIncome) + '원';
    document.getElementById('resultCorporateTax').textContent = formatAmount(results.financialData.corporateTax) + '원';
    document.getElementById('resultLocalIncomeTax').textContent = formatAmount(results.financialData.localIncomeTax) + '원';
    document.getElementById('resultTotalTax').textContent = formatAmount(results.summary.totalTax) + '원';
    document.getElementById('resultEffectiveRate').textContent = results.summary.effectiveRate + '%';
    
    // 결과 영역 표시
    document.getElementById('taxCalculationResults').classList.remove('d-none');
}

/**
 * 세무계산 도움말
 */
function showTaxCalculationHelp() {
    const helpHtml = `
        <div class="modal fade" id="taxCalculationHelpModal" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">세무계산 도움말</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <h6>1. 재무 데이터 입력</h6>
                        <ul>
                            <li><strong>매출액:</strong> 당 사업연도의 총 매출액 (원)</li>
                            <li><strong>회계상 당기순이익:</strong> 재무제표상 당기순이익 (원)</li>
                            <li><strong>손금:</strong> 회계상 비용 중 세법상 손금인정액 (원)</li>
                            <li><strong>총급여액:</strong> 임원 및 직원 급여 총액 (원)</li>
                        </ul>
                        
                        <h6>2. 세무조정</h6>
                        <ul>
                            <li><strong>손금불산입:</strong> 회계상 비용이지만 세법상 손금으로 인정되지 않는 항목</li>
                            <li><strong>익금불산입:</strong> 회계상 수익이지만 세법상 익금으로 보지 않는 항목</li>
                            <li><strong>자동계산:</strong> 매출액과 급여액을 기준으로 각종 한도를 자동 계산</li>
                        </ul>
                        
                        <h6>3. 계산 공식</h6>
                        <div class="alert alert-info">
                            <strong>과세표준 = 회계상소득 + 손금불산입 - 익금불산입</strong><br>
                            <strong>법인세 = 과세표준 × 누진세율</strong><br>
                            <strong>지방소득세 = 법인세 × 10%</strong>
                        </div>
                        
                        <h6>4. 세율 구조 (2024년 기준)</h6>
                        <div class="table-responsive">
                            <table class="table table-sm table-striped">
                                <thead>
                                    <tr>
                                        <th>과세표준</th>
                                        <th>일반법인</th>
                                        <th>중소기업</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>2억 이하</td>
                                        <td>10%</td>
                                        <td>10%</td>
                                    </tr>
                                    <tr>
                                        <td>2억 초과 ~ 200억 이하</td>
                                        <td>20%</td>
                                        <td>20%</td>
                                    </tr>
                                    <tr>
                                        <td>200억 초과 ~ 3000억 이하</td>
                                        <td>22%</td>
                                        <td>22%</td>
                                    </tr>
                                    <tr>
                                        <td>3000억 초과</td>
                                        <td>25%</td>
                                        <td>해당없음</td>
                                    </tr>
                                </tbody>
                            </table>
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
    const existingModal = document.getElementById('taxCalculationHelpModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // 새 모달 추가 및 표시
    document.body.insertAdjacentHTML('beforeend', helpHtml);
    const modal = new bootstrap.Modal(document.getElementById('taxCalculationHelpModal'));
    modal.show();
    
    // 모달이 숨겨진 후 DOM에서 제거
    document.getElementById('taxCalculationHelpModal').addEventListener('hidden.bs.modal', function() {
        this.remove();
    });
}

/**
 * 계산 결과 저장
 */
function saveTaxCalculationResults() {
    if (!window.taxCalculator) {
        showAlert('저장할 계산 결과가 없습니다.', 'warning');
        return;
    }
    
    try {
        const results = window.taxCalculator.getResults();
        const taxReturnData = window.taxCalculator.generateTaxReturnData();
        
        // 로컬 스토리지에 저장
        localStorage.setItem('cotax_tax_calculation_results', JSON.stringify(results));
        localStorage.setItem('cotax_tax_return_data', JSON.stringify(taxReturnData));
        
        showAlert('계산 결과가 저장되었습니다.', 'success');
        
    } catch (error) {
        console.error('계산 결과 저장 오류:', error);
        showAlert('계산 결과 저장 중 오류가 발생했습니다.', 'danger');
    }
}

/**
 * 금액 포맷팅 함수
 */
function formatAmount(amount) {
    return new Intl.NumberFormat('ko-KR').format(amount || 0);
}

/**
 * 플로팅 컨트롤 관리
 */
function toggleFloatingControls() {
    const menu = document.getElementById('floatingMenu');
    const icon = document.getElementById('floatingMainIcon');
    
    menu.classList.toggle('active');
    
    if (menu.classList.contains('active')) {
        icon.classList.remove('fa-cog');
        icon.classList.add('fa-times');
    } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-cog');
    }
}

// 문서 클릭 시 플로팅 메뉴 닫기
document.addEventListener('click', function(e) {
    const floatingControls = document.querySelector('.floating-controls');
    const menu = document.getElementById('floatingMenu');
    const icon = document.getElementById('floatingMainIcon');
    
    if (floatingControls && !floatingControls.contains(e.target)) {
        if (menu && menu.classList.contains('active')) {
            menu.classList.remove('active');
            if (icon) {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-cog');
            }
        }
    }
});

// 전역 함수로 노출
window.addTaxAdjustment = addTaxAdjustment;
window.saveTaxAdjustmentItem = saveTaxAdjustmentItem;
window.removeTaxAdjustmentItem = removeTaxAdjustmentItem;
window.calculateAutomaticAdjustments = calculateAutomaticAdjustments;
window.executeFullTaxCalculation = executeFullTaxCalculation;
window.showTaxCalculationHelp = showTaxCalculationHelp;
window.saveTaxCalculationResults = saveTaxCalculationResults;
window.toggleFloatingControls = toggleFloatingControls;