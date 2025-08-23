/**
 * CoTax 법인세 계산로직 시스템
 * 법인세법에 따른 세액 계산 및 신고서 자동생성
 */

// 법인세율 테이블 (2024년 기준)
const CORPORATE_TAX_RATES = {
    // 일반법인 세율
    general: [
        { min: 0, max: 200000000, rate: 0.10 },           // 2억 이하 10%
        { min: 200000001, max: 20000000000, rate: 0.20 }, // 2억초과 200억 이하 20%
        { min: 20000000001, max: 300000000000, rate: 0.22 }, // 200억초과 3000억 이하 22%
        { min: 300000000001, max: Infinity, rate: 0.25 }  // 3000억 초과 25%
    ],
    
    // 중소기업 세율 (매출액 4000억 미만)
    small: [
        { min: 0, max: 200000000, rate: 0.10 },           // 2억 이하 10%
        { min: 200000001, max: 20000000000, rate: 0.20 }, // 2억초과 200억 이하 20%
        { min: 20000000001, max: Infinity, rate: 0.22 }   // 200억 초과 22%
    ],
    
    // 비영리법인 세율
    nonprofit: [
        { min: 0, max: Infinity, rate: 0.10 }             // 10% 단일세율
    ]
};

// 지방소득세율 (법인세의 10%)
const LOCAL_INCOME_TAX_RATE = 0.10;

// 세무조정 항목 정의
const TAX_ADJUSTMENT_ITEMS = {
    // 손금불산입 항목
    nonDeductible: [
        { code: 'A01', name: '접대비한도초과액', category: '접대비' },
        { code: 'A02', name: '기부금한도초과액', category: '기부금' },
        { code: 'A03', name: '업무무관경비', category: '업무무관' },
        { code: 'A04', name: '법인세법위반과태료', category: '벌과금' },
        { code: 'A05', name: '임원상여한도초과액', category: '임원급여' },
        { code: 'A06', name: '감가상각비한도초과액', category: '감가상각' },
        { code: 'A07', name: '충당금한도초과액', category: '충당금' },
        { code: 'A08', name: '지급이자한도초과액', category: '지급이자' }
    ],
    
    // 익금불산입 항목
    nonTaxable: [
        { code: 'B01', name: '수입배당금익금불산입', category: '배당소득' },
        { code: 'B02', name: '국고보조금등익금불산입', category: '보조금' },
        { code: 'B03', name: '보험차익익금불산입', category: '보험금' },
        { code: 'B04', name: '기타익금불산입', category: '기타' }
    ]
};

/**
 * 법인세 계산 클래스
 */
class CorporateTaxCalculator {
    constructor() {
        this.taxData = {
            // 기본 정보
            companyInfo: {},
            
            // 재무 정보
            financialData: {
                revenue: 0,           // 수입금액
                expenses: 0,          // 손금
                netIncome: 0,         // 당기순이익
                bookIncome: 0,        // 회계상 소득
                taxableIncome: 0,     // 과세표준
                corporateTax: 0,      // 법인세
                localIncomeTax: 0     // 지방소득세
            },
            
            // 세무조정
            taxAdjustments: [],
            
            // 계산 결과
            results: {}
        };
    }
    
    /**
     * 회사 정보 설정
     */
    setCompanyInfo(companyInfo) {
        this.taxData.companyInfo = { ...companyInfo };
        return this;
    }
    
    /**
     * 재무 데이터 설정
     */
    setFinancialData(financialData) {
        this.taxData.financialData = { ...this.taxData.financialData, ...financialData };
        return this;
    }
    
    /**
     * 세무조정 항목 추가
     */
    addTaxAdjustment(adjustment) {
        this.taxData.taxAdjustments.push(adjustment);
        return this;
    }
    
    /**
     * 과세표준 계산
     */
    calculateTaxableIncome() {
        const { bookIncome } = this.taxData.financialData;
        
        // 손금불산입 합계
        const nonDeductibleTotal = this.taxData.taxAdjustments
            .filter(adj => adj.type === 'nonDeductible')
            .reduce((sum, adj) => sum + adj.amount, 0);
        
        // 익금불산입 합계
        const nonTaxableTotal = this.taxData.taxAdjustments
            .filter(adj => adj.type === 'nonTaxable')
            .reduce((sum, adj) => sum + adj.amount, 0);
        
        // 과세표준 = 회계상소득 + 손금불산입 - 익금불산입
        const taxableIncome = bookIncome + nonDeductibleTotal - nonTaxableTotal;
        
        this.taxData.financialData.taxableIncome = Math.max(0, taxableIncome);
        
        return this;
    }
    
    /**
     * 법인세 계산 (누진세율 적용)
     */
    calculateCorporateTax() {
        const { taxableIncome } = this.taxData.financialData;
        const { tax_classification, corporation_type_code } = this.taxData.companyInfo;
        
        let taxRates;
        
        // 법인 유형별 세율 적용
        if (this.isSmallBusiness()) {
            taxRates = CORPORATE_TAX_RATES.small;
        } else if (this.isNonprofitCorporation()) {
            taxRates = CORPORATE_TAX_RATES.nonprofit;
        } else {
            taxRates = CORPORATE_TAX_RATES.general;
        }
        
        let corporateTax = 0;
        let remainingIncome = taxableIncome;
        
        for (const bracket of taxRates) {
            if (remainingIncome <= 0) break;
            
            const taxableAmount = Math.min(remainingIncome, bracket.max - bracket.min + 1);
            corporateTax += taxableAmount * bracket.rate;
            remainingIncome -= taxableAmount;
        }
        
        this.taxData.financialData.corporateTax = Math.floor(corporateTax);
        
        return this;
    }
    
    /**
     * 지방소득세 계산
     */
    calculateLocalIncomeTax() {
        const { corporateTax } = this.taxData.financialData;
        const localIncomeTax = Math.floor(corporateTax * LOCAL_INCOME_TAX_RATE);
        
        this.taxData.financialData.localIncomeTax = localIncomeTax;
        
        return this;
    }
    
    /**
     * 중소기업 여부 판정
     */
    isSmallBusiness() {
        const { tax_classification, revenue } = this.taxData.companyInfo;
        
        // 매출액 4000억 미만이고, 중소기업 구분코드인 경우
        const smallBusinessCodes = ['11', '21', '30', '60'];
        return smallBusinessCodes.includes(tax_classification) && revenue < 400000000000;
    }
    
    /**
     * 비영리법인 여부 판정
     */
    isNonprofitCorporation() {
        const { tax_classification } = this.taxData.companyInfo;
        const nonProfitCodes = ['60', '74', '84', '94', '50'];
        return nonProfitCodes.includes(tax_classification);
    }
    
    /**
     * 전체 세액 계산 실행
     */
    calculate() {
        return this
            .calculateTaxableIncome()
            .calculateCorporateTax()
            .calculateLocalIncomeTax();
    }
    
    /**
     * 계산 결과 반환
     */
    getResults() {
        const { financialData, companyInfo } = this.taxData;
        
        return {
            companyInfo,
            financialData,
            taxAdjustments: this.taxData.taxAdjustments,
            summary: {
                taxableIncome: financialData.taxableIncome,
                corporateTax: financialData.corporateTax,
                localIncomeTax: financialData.localIncomeTax,
                totalTax: financialData.corporateTax + financialData.localIncomeTax,
                effectiveRate: financialData.taxableIncome > 0 ? 
                    ((financialData.corporateTax + financialData.localIncomeTax) / financialData.taxableIncome * 100).toFixed(2) : 0
            }
        };
    }
    
    /**
     * 신고서 데이터 생성
     */
    generateTaxReturnData() {
        const results = this.getResults();
        
        const taxReturn = {
            // 기본 정보
            declaration: {
                company_name: results.companyInfo.company_name,
                company_reg_no: results.companyInfo.company_reg_no,
                business_year: results.companyInfo.business_year,
                tax_classification: results.companyInfo.tax_classification,
                corporation_type_code: results.companyInfo.corporation_type_code,
                report_date: new Date().toISOString().substr(0, 10).replace(/-/g, ''),
                calculation_date: new Date().toISOString().substr(0, 10).replace(/-/g, '')
            },
            
            // 소득금액 계산
            income: {
                book_income: results.financialData.bookIncome,
                non_deductible_total: this.taxData.taxAdjustments
                    .filter(adj => adj.type === 'nonDeductible')
                    .reduce((sum, adj) => sum + adj.amount, 0),
                non_taxable_total: this.taxData.taxAdjustments
                    .filter(adj => adj.type === 'nonTaxable')
                    .reduce((sum, adj) => sum + adj.amount, 0),
                taxable_income: results.financialData.taxableIncome
            },
            
            // 세액 계산
            tax: {
                corporate_tax: results.financialData.corporateTax,
                local_income_tax: results.financialData.localIncomeTax,
                total_tax: results.summary.totalTax,
                effective_rate: results.summary.effectiveRate
            },
            
            // 세무조정 내역
            adjustments: this.taxData.taxAdjustments.map(adj => ({
                code: adj.code,
                name: adj.name,
                type: adj.type,
                amount: adj.amount,
                description: adj.description || ''
            })),
            
            // 생성 정보
            generated_at: new Date().toISOString(),
            generated_by: 'CoTax System v1.0'
        };
        
        return taxReturn;
    }
}

/**
 * 세무조정 도우미 함수들
 */
const TaxAdjustmentHelper = {
    /**
     * 접대비 한도 계산
     */
    calculateEntertainmentLimit(revenue) {
        if (revenue <= 10000000000) { // 100억 이하
            return Math.min(12000000, revenue * 0.03); // 1200만원 또는 매출액의 3% 중 적은 금액
        } else if (revenue <= 50000000000) { // 500억 이하
            return 12000000 + (revenue - 10000000000) * 0.005; // 1200만원 + 초과분의 0.5%
        } else {
            return 32000000; // 3200만원 한도
        }
    },
    
    /**
     * 기부금 한도 계산
     */
    calculateDonationLimit(taxableIncome) {
        return taxableIncome * 0.1; // 과세표준의 10%
    },
    
    /**
     * 임원상여 한도 계산
     */
    calculateExecutiveBonusLimit(totalSalary) {
        return totalSalary * 0.7; // 총급여의 70%
    }
};

// 전역 변수로 계산기 인스턴스
let taxCalculator = null;

/**
 * 세무계산 초기화
 */
function initializeTaxCalculator() {
    taxCalculator = new CorporateTaxCalculator();
    return taxCalculator;
}

/**
 * 회사 정보로부터 세무계산 설정
 */
function setupTaxCalculatorFromStorage() {
    const companyData = JSON.parse(localStorage.getItem('cotax_company_master') || '{}');
    const taxClassificationData = JSON.parse(localStorage.getItem('cotax_tax_classification') || '{}');
    
    if (!taxCalculator) {
        initializeTaxCalculator();
    }
    
    const companyInfo = {
        ...companyData,
        ...taxClassificationData
    };
    
    taxCalculator.setCompanyInfo(companyInfo);
    return taxCalculator;
}

// 전역 함수로 노출
window.CorporateTaxCalculator = CorporateTaxCalculator;
window.TaxAdjustmentHelper = TaxAdjustmentHelper;
window.initializeTaxCalculator = initializeTaxCalculator;
window.setupTaxCalculatorFromStorage = setupTaxCalculatorFromStorage;
window.taxCalculator = taxCalculator;