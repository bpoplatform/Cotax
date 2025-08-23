/**
 * CoTax 그리드 관리자 - AG-Grid Community Edition 기반
 * Apple Liquid Glass 스타일 적용
 */

class GridManager {
    constructor() {
        this.grids = {};
        this.themes = 'ag-theme-alpine-liquid-glass';
        this.initGridConfigurations();
    }

    // 그리드 설정 초기화
    initGridConfigurations() {
        this.gridConfigs = {
            businessYear: {
                columnDefs: [
                    { 
                        headerName: '', 
                        field: 'selected', 
                        width: 60, 
                        checkboxSelection: true,
                        headerCheckboxSelection: true,
                        editable: false,
                        sortable: false,
                        filter: false,
                        pinned: 'left'
                    },
                    { 
                        headerName: '연도', 
                        field: 'year', 
                        width: 100, 
                        editable: true, 
                        cellEditor: 'agNumberCellEditor',
                        cellEditorParams: {
                            min: 2020,
                            max: 2030
                        },
                        filter: 'agNumberColumnFilter',
                        sortable: true
                    },
                    { 
                        headerName: '시작일', 
                        field: 'startDate', 
                        width: 120, 
                        editable: true,
                        cellRenderer: this.dateRenderer,
                        cellEditor: 'agTextCellEditor',
                        cellEditorParams: {
                            placeholder: 'YYYY-MM-DD'
                        },
                        filter: 'agTextColumnFilter'
                    },
                    { 
                        headerName: '종료일', 
                        field: 'endDate', 
                        width: 120, 
                        editable: true,
                        cellRenderer: this.dateRenderer,
                        cellEditor: 'agTextCellEditor',
                        cellEditorParams: {
                            placeholder: 'YYYY-MM-DD'
                        },
                        filter: 'agTextColumnFilter'
                    },
                    { 
                        headerName: '사업장보고서제출여부', 
                        field: 'reportSubmitted', 
                        width: 180, 
                        editable: true,
                        cellRenderer: this.checkboxRenderer,
                        cellEditor: 'agCheckboxCellEditor',
                        filter: 'agSetColumnFilter',
                        filterParams: {
                            values: [true, false],
                            valueFormatter: (params) => params.value ? '제출' : '미제출'
                        }
                    },
                    { 
                        headerName: '비고', 
                        field: 'remarks', 
                        width: 200, 
                        editable: true, 
                        cellEditor: 'agLargeTextCellEditor',
                        cellEditorParams: {
                            maxLength: 500,
                            rows: 3,
                            cols: 30
                        },
                        filter: 'agTextColumnFilter'
                    },
                    { 
                        headerName: '작업', 
                        field: 'actions', 
                        width: 120, 
                        cellRenderer: this.actionButtonsRenderer,
                        editable: false,
                        sortable: false,
                        filter: false,
                        pinned: 'right'
                    }
                ],
                defaultColDef: {
                    sortable: true,
                    filter: true,
                    resizable: true,
                    cellStyle: { textAlign: 'center' },
                    headerClass: 'ag-header-cell-center',
                    flex: 1,
                    minWidth: 80
                },
                rowSelection: 'multiple',
                animateRows: true,
                suppressRowClickSelection: true,
                pagination: true,
                paginationPageSize: 10,
                paginationPageSizeSelector: [5, 10, 20, 50],
                rowData: []
            },
            businessInfo: {
                columnDefs: [
                    { 
                        headerName: '', 
                        field: 'selected', 
                        width: 60, 
                        checkboxSelection: true,
                        headerCheckboxSelection: true,
                        editable: false,
                        sortable: false,
                        filter: false,
                        pinned: 'left'
                    },
                    { 
                        headerName: '구분', 
                        field: 'category', 
                        width: 120, 
                        editable: true,
                        cellEditor: 'agSelectCellEditor',
                        cellEditorParams: {
                            values: ['법인서류', '신고서식', '첨부서류', '기타']
                        },
                        filter: 'agSetColumnFilter'
                    },
                    { 
                        headerName: '서식', 
                        field: 'format', 
                        width: 100, 
                        editable: true,
                        cellEditor: 'agSelectCellEditor',
                        cellEditorParams: {
                            values: ['전산', '법인세신고', '수기', '온라인']
                        },
                        filter: 'agSetColumnFilter'
                    },
                    { 
                        headerName: '서식번호', 
                        field: 'formatNumber', 
                        width: 140, 
                        editable: true,
                        filter: 'agTextColumnFilter'
                    },
                    { 
                        headerName: '서식명', 
                        field: 'formatName', 
                        width: 200, 
                        editable: true,
                        filter: 'agTextColumnFilter',
                        tooltipField: 'formatName'
                    },
                    { 
                        headerName: '과표계산서 구분', 
                        field: 'taxCalculationType', 
                        width: 150, 
                        editable: true,
                        cellEditor: 'agSelectCellEditor',
                        cellEditorParams: {
                            values: ['선택', '일반', '간편', '추계', '기타']
                        },
                        filter: 'agSetColumnFilter'
                    },
                    { 
                        headerName: '상태', 
                        field: 'status', 
                        width: 100, 
                        editable: true,
                        cellEditor: 'agSelectCellEditor',
                        cellEditorParams: {
                            values: ['', '진행중', '완료', '보류', '오류']
                        },
                        filter: 'agSetColumnFilter',
                        cellStyle: (params) => {
                            switch(params.value) {
                                case '완료': return { backgroundColor: 'rgba(52, 199, 89, 0.1)', color: '#34C759' };
                                case '진행중': return { backgroundColor: 'rgba(255, 149, 0, 0.1)', color: '#FF9500' };
                                case '오류': return { backgroundColor: 'rgba(255, 59, 48, 0.1)', color: '#FF3B30' };
                                case '보류': return { backgroundColor: 'rgba(142, 142, 147, 0.1)', color: '#8E8E93' };
                                default: return { color: '#1C1C1E' };
                            }
                        }
                    },
                    { 
                        headerName: '제출여부', 
                        field: 'submitted', 
                        width: 100, 
                        editable: true,
                        cellRenderer: this.checkboxRenderer,
                        cellEditor: 'agCheckboxCellEditor',
                        filter: 'agSetColumnFilter',
                        filterParams: {
                            values: [true, false],
                            valueFormatter: (params) => params.value ? '제출' : '미제출'
                        }
                    },
                    { 
                        headerName: '순서', 
                        field: 'order', 
                        width: 80, 
                        editable: true,
                        cellEditor: 'agNumberCellEditor',
                        cellEditorParams: {
                            min: 1,
                            max: 100
                        },
                        filter: 'agNumberColumnFilter',
                        sort: 'asc'
                    },
                    { 
                        headerName: '작업', 
                        field: 'actions', 
                        width: 120, 
                        cellRenderer: this.actionButtonsRenderer,
                        editable: false,
                        sortable: false,
                        filter: false,
                        pinned: 'right'
                    }
                ],
                defaultColDef: {
                    sortable: true,
                    filter: true,
                    resizable: true,
                    cellStyle: { textAlign: 'center' },
                    headerClass: 'ag-header-cell-center',
                    flex: 1,
                    minWidth: 80
                },
                rowSelection: 'multiple',
                animateRows: true,
                suppressRowClickSelection: true,
                pagination: true,
                paginationPageSize: 15,
                paginationPageSizeSelector: [10, 15, 25, 50],
                rowData: [
                    {
                        category: '법인서류',
                        format: '전산',
                        formatNumber: '법인서류목록',
                        formatName: '제출',
                        taxCalculationType: '선택',
                        status: '진행중',
                        submitted: false,
                        order: 1
                    },
                    {
                        category: '법인서류',
                        format: '전산',
                        formatNumber: '정관변경증서',
                        formatName: '제출',
                        taxCalculationType: '선택',
                        status: '완료',
                        submitted: true,
                        order: 2
                    },
                    {
                        category: '법인서류',
                        format: '전산',
                        formatNumber: '정관변경증서',
                        formatName: '제출',
                        taxCalculationType: '선택',
                        status: '',
                        submitted: false,
                        order: 3
                    },
                    {
                        category: '신고서식',
                        format: '법인세신고',
                        formatNumber: '자6호.2',
                        formatName: '신고신고서(근로소득원천징수)',
                        taxCalculationType: '일반',
                        status: '보류',
                        submitted: false,
                        order: 4
                    }
                ]
            }
        };
    }

    // 날짜 렌더러
    dateRenderer(params) {
        if (params.value) {
            return `<span class="date-cell">${params.value}</span>`;
        }
        return '<span class="placeholder-text">YMD</span>';
    }

    // 체크박스 렌더러
    checkboxRenderer(params) {
        const checked = params.value ? 'checked' : '';
        return `<input type="checkbox" ${checked} onclick="return false;" class="grid-checkbox" />`;
    }

    // 액션 버튼 렌더러
    actionButtonsRenderer(params) {
        return `
            <div class="btn-group btn-group-sm" role="group">
                <button type="button" class="btn btn-outline-primary btn-sm" onclick="gridManager.editRow('${params.node.id}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button type="button" class="btn btn-outline-danger btn-sm" onclick="gridManager.deleteRow('${params.node.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
    }

    // 그리드 초기화
    initGrid(containerId, configKey) {
        const gridContainer = document.getElementById(containerId);
        if (!gridContainer) {
            console.error(`Grid container not found: ${containerId}`);
            return null;
        }

        // 컨테이너에 테마 클래스 추가
        gridContainer.className = `${this.themes} liquid-glass-grid`;
        gridContainer.style.height = '400px';
        gridContainer.style.width = '100%';
        gridContainer.style.minHeight = '300px';
        gridContainer.style.display = 'block';
        
        console.log(`Grid container ${containerId} initialized:`, {
            width: gridContainer.offsetWidth,
            height: gridContainer.offsetHeight,
            visible: gridContainer.offsetParent !== null
        });

        const gridOptions = {
            ...this.gridConfigs[configKey],
            onGridReady: (params) => {
                console.log(`Grid ready: ${configKey}`);
                
                // 컨테이너가 보이는지 확인하고 크기 조정
                setTimeout(() => {
                    if (gridContainer.offsetWidth > 0) {
                        params.api.sizeColumnsToFit();
                        console.log(`Grid sized for ${configKey}: ${gridContainer.offsetWidth}px`);
                    } else {
                        console.warn(`Grid container ${configKey} not visible, retrying...`);
                        setTimeout(() => {
                            if (gridContainer.offsetWidth > 0) {
                                params.api.sizeColumnsToFit();
                            }
                        }, 1000);
                    }
                }, 100);

                // 사업연도 그리드에만 초기 데이터 추가 (사업정보는 기본 데이터가 있음)
                if (configKey === 'businessYear') {
                    // 저장된 데이터가 없으면 기본 데이터 직접 설정
                    const savedData = localStorage.getItem(`grid_${configKey}`);
                    if (!savedData) {
                        console.log(`Setting default data for ${configKey}`);
                        const defaultData = [{
                            year: new Date().getFullYear(),
                            startDate: new Date().getFullYear() + '-01-01',
                            endDate: new Date().getFullYear() + '-12-31',
                            reportSubmitted: false,
                            remarks: '기본 사업연도'
                        }];
                        
                        // 그리드에 바로 데이터 설정
                        setTimeout(() => {
                            params.api.setGridOption('rowData', defaultData);
                            console.log('Default businessYear data set');
                        }, 100);
                    }
                }
            },
            onCellValueChanged: (params) => {
                console.log('Cell value changed:', params.data);
                this.saveGridData(configKey);
            },
            onRowSelected: (params) => {
                console.log('Row selected:', params.data);
            },
            onFirstDataRendered: (params) => {
                console.log(`First data rendered for ${configKey}`);
                params.api.sizeColumnsToFit();
            }
        };

        const grid = agGrid.createGrid(gridContainer, gridOptions);
        this.grids[configKey] = grid;

        return grid;
    }

    // 행 추가
    addRow(configKey, newData = {}) {
        const grid = this.grids[configKey];
        if (!grid || !grid.gridOptions || !grid.gridOptions.api) {
            console.error(`Grid not ready for adding row: ${configKey}`);
            return;
        }

        const defaultData = this.getDefaultRowData(configKey);
        const rowData = { ...defaultData, ...newData };
        
        try {
            grid.gridOptions.api.applyTransaction({ add: [rowData] });
            this.saveGridData(configKey);
            console.log(`Row added to ${configKey}:`, rowData);
        } catch (error) {
            console.error(`Error adding row to ${configKey}:`, error);
        }
    }

    // 행 편집
    editRow(nodeId) {
        console.log('Edit row:', nodeId);
        // 여기서 편집 모달을 열거나 인라인 편집을 시작할 수 있습니다
    }

    // 행 삭제
    deleteRow(nodeId) {
        const confirmed = confirm('선택한 행을 삭제하시겠습니까?');
        if (!confirmed) return;

        Object.keys(this.grids).forEach(configKey => {
            const grid = this.grids[configKey];
            const node = grid.gridOptions.api.getRowNode(nodeId);
            if (node) {
                grid.gridOptions.api.applyTransaction({ remove: [node.data] });
                this.saveGridData(configKey);
            }
        });
    }

    // 선택된 행 삭제
    deleteSelectedRows(configKey) {
        const grid = this.grids[configKey];
        if (!grid) return;

        const selectedRows = grid.gridOptions.api.getSelectedRows();
        if (selectedRows.length === 0) {
            alert('삭제할 행을 선택해주세요.');
            return;
        }

        const confirmed = confirm(`선택한 ${selectedRows.length}개 행을 삭제하시겠습니까?`);
        if (confirmed) {
            grid.gridOptions.api.applyTransaction({ remove: selectedRows });
            this.saveGridData(configKey);
        }
    }

    // 기본 행 데이터 생성
    getDefaultRowData(configKey) {
        switch (configKey) {
            case 'businessYear':
                return {
                    year: new Date().getFullYear(),
                    startDate: '',
                    endDate: '',
                    reportSubmitted: false,
                    remarks: ''
                };
            case 'businessInfo':
                return {
                    category: '신규',
                    format: '',
                    formatNumber: '',
                    formatName: '',
                    taxCalculationType: '선택',
                    status: '',
                    submitted: false,
                    order: 0
                };
            default:
                return {};
        }
    }

    // 그리드 데이터 저장
    saveGridData(configKey) {
        const grid = this.grids[configKey];
        if (!grid) return;

        const rowData = [];
        grid.gridOptions.api.forEachNode(node => rowData.push(node.data));
        
        localStorage.setItem(`grid_${configKey}`, JSON.stringify(rowData));
        console.log(`Grid data saved: ${configKey}`, rowData);
    }

    // 그리드 데이터 로드
    loadGridData(configKey) {
        const savedData = localStorage.getItem(`grid_${configKey}`);
        if (savedData) {
            const rowData = JSON.parse(savedData);
            const grid = this.grids[configKey];
            if (grid) {
                grid.gridOptions.api.setGridOption('rowData', rowData);
                console.log(`Grid data loaded: ${configKey}`, rowData);
            }
        }
    }

    // 그리드 데이터 내보내기
    exportGridData(configKey, format = 'csv') {
        const grid = this.grids[configKey];
        if (!grid) return;

        switch (format) {
            case 'csv':
                grid.gridOptions.api.exportDataAsCsv({
                    fileName: `${configKey}_${new Date().toISOString().split('T')[0]}.csv`
                });
                break;
            case 'excel':
                // Excel 내보내기 (Community 버전에서는 제한적)
                console.log('Excel export requires AG-Grid Enterprise');
                break;
        }
    }

    // 그리드 필터 초기화
    clearAllFilters(configKey) {
        const grid = this.grids[configKey];
        if (grid) {
            grid.gridOptions.api.setFilterModel(null);
        }
    }

    // 그리드 새로고침
    refreshGrid(configKey) {
        const grid = this.grids[configKey];
        if (grid) {
            grid.gridOptions.api.refreshCells();
            grid.gridOptions.api.sizeColumnsToFit();
        }
    }

    // 일괄 편집 모드
    toggleBulkEdit(configKey) {
        const grid = this.grids[configKey];
        if (!grid) return;

        const selectedRows = grid.gridOptions.api.getSelectedRows();
        if (selectedRows.length === 0) {
            alert('편집할 행을 선택해주세요.');
            return;
        }

        const field = prompt('편집할 필드명을 입력하세요 (예: status, category):');
        if (!field) return;

        const newValue = prompt(`새로운 ${field} 값을 입력하세요:`);
        if (newValue === null) return;

        selectedRows.forEach(row => {
            row[field] = newValue;
        });

        grid.gridOptions.api.applyTransaction({ update: selectedRows });
        this.saveGridData(configKey);
        
        console.log(`일괄 편집 완료: ${selectedRows.length}개 행의 ${field} 필드가 "${newValue}"로 변경됨`);
    }

    // 행 복사
    duplicateSelectedRows(configKey) {
        const grid = this.grids[configKey];
        if (!grid) return;

        const selectedRows = grid.gridOptions.api.getSelectedRows();
        if (selectedRows.length === 0) {
            alert('복사할 행을 선택해주세요.');
            return;
        }

        const duplicatedRows = selectedRows.map(row => {
            const newRow = { ...row };
            delete newRow.id; // ID 제거하여 새 행으로 인식
            newRow.order = (newRow.order || 0) + 1; // 순서 증가
            return newRow;
        });

        grid.gridOptions.api.applyTransaction({ add: duplicatedRows });
        this.saveGridData(configKey);
        
        console.log(`${duplicatedRows.length}개 행이 복사되었습니다.`);
    }

    // 데이터 검증
    validateGridData(configKey) {
        const grid = this.grids[configKey];
        if (!grid) return;

        const errors = [];
        const allData = [];
        grid.gridOptions.api.forEachNode(node => allData.push(node.data));

        // 검증 규칙 적용
        allData.forEach((row, index) => {
            const rowErrors = [];

            switch (configKey) {
                case 'businessYear':
                    if (!row.year || row.year < 2020 || row.year > 2030) {
                        rowErrors.push(`행 ${index + 1}: 연도가 유효하지 않습니다.`);
                    }
                    if (row.startDate && row.endDate && new Date(row.startDate) >= new Date(row.endDate)) {
                        rowErrors.push(`행 ${index + 1}: 시작일이 종료일보다 늦습니다.`);
                    }
                    break;

                case 'businessInfo':
                    if (!row.category) {
                        rowErrors.push(`행 ${index + 1}: 구분이 필수입니다.`);
                    }
                    if (!row.formatName) {
                        rowErrors.push(`행 ${index + 1}: 서식명이 필수입니다.`);
                    }
                    if (row.order && (row.order < 1 || row.order > 100)) {
                        rowErrors.push(`행 ${index + 1}: 순서는 1-100 사이여야 합니다.`);
                    }
                    break;
            }

            if (rowErrors.length > 0) {
                errors.push(...rowErrors);
            }
        });

        if (errors.length > 0) {
            alert(`데이터 검증 오류:\n\n${errors.join('\n')}`);
            return false;
        } else {
            alert('데이터 검증 완료: 모든 데이터가 유효합니다.');
            return true;
        }
    }

    // 고급 필터링
    applyAdvancedFilter(configKey, filterConfig) {
        const grid = this.grids[configKey];
        if (!grid) return;

        grid.gridOptions.api.setFilterModel(filterConfig);
        console.log('고급 필터 적용:', filterConfig);
    }

    // 데이터 통계
    getGridStatistics(configKey) {
        const grid = this.grids[configKey];
        if (!grid) return null;

        const allData = [];
        grid.gridOptions.api.forEachNode(node => allData.push(node.data));

        const stats = {
            totalRows: allData.length,
            selectedRows: grid.gridOptions.api.getSelectedRows().length
        };

        // 구체적인 통계 계산
        switch (configKey) {
            case 'businessYear':
                stats.submittedReports = allData.filter(row => row.reportSubmitted).length;
                stats.years = [...new Set(allData.map(row => row.year))].sort();
                break;

            case 'businessInfo':
                stats.completedItems = allData.filter(row => row.status === '완료').length;
                stats.submittedItems = allData.filter(row => row.submitted).length;
                stats.categories = [...new Set(allData.map(row => row.category))];
                break;
        }

        return stats;
    }

    // 컨텍스트 메뉴 구성
    getContextMenuItems(params) {
        const result = [
            {
                name: '행 편집',
                action: () => this.editRow(params.node.id),
                icon: '<i class="fas fa-edit"></i>'
            },
            {
                name: '행 복사',
                action: () => this.duplicateRow(params.node.data),
                icon: '<i class="fas fa-copy"></i>'
            },
            {
                name: '행 삭제',
                action: () => this.deleteRow(params.node.id),
                icon: '<i class="fas fa-trash"></i>'
            },
            'separator',
            {
                name: '위로 이동',
                action: () => this.moveRowUp(params.node),
                icon: '<i class="fas fa-arrow-up"></i>'
            },
            {
                name: '아래로 이동',
                action: () => this.moveRowDown(params.node),
                icon: '<i class="fas fa-arrow-down"></i>'
            },
            'separator',
            {
                name: '데이터 내보내기',
                action: () => this.exportGridData(params.configKey, 'csv'),
                icon: '<i class="fas fa-download"></i>'
            }
        ];

        return result;
    }

    // 행 이동 함수들
    moveRowUp(node) {
        if (!node.data.order || node.data.order <= 1) return;
        
        node.data.order--;
        node.api.applyTransaction({ update: [node.data] });
        this.saveGridData(node.configKey);
    }

    moveRowDown(node) {
        node.data.order = (node.data.order || 0) + 1;
        node.api.applyTransaction({ update: [node.data] });
        this.saveGridData(node.configKey);
    }

    // 단일 행 복사
    duplicateRow(rowData) {
        const newRow = { ...rowData };
        delete newRow.id;
        newRow.order = (newRow.order || 0) + 1;
        
        // 적절한 그리드 찾기
        Object.keys(this.grids).forEach(configKey => {
            const grid = this.grids[configKey];
            if (grid) {
                grid.gridOptions.api.applyTransaction({ add: [newRow] });
                this.saveGridData(configKey);
            }
        });
    }

    // 모든 그리드 초기화
    initAllGrids() {
        console.log('Initializing all grids...');
        
        // 사업연도 그리드 초기화
        if (document.getElementById('businessYearGrid')) {
            console.log('Initializing businessYear grid...');
            this.initGrid('businessYearGrid', 'businessYear');
            this.loadGridData('businessYear');
        }

        // 사업정보 그리드 초기화  
        if (document.getElementById('businessInfoGrid')) {
            console.log('Initializing businessInfo grid...');
            this.initGrid('businessInfoGrid', 'businessInfo');
            this.loadGridData('businessInfo');
        }
    }

    // 샘플 데이터 로드 (필요시 호출)
    loadSampleData() {
        console.log('Loading additional sample data for grids...');
        
        // 사업연도 샘플 데이터 추가
        const businessYearSample = [
            {
                year: 2023,
                startDate: '2023-01-01', 
                endDate: '2023-12-31',
                reportSubmitted: true,
                remarks: '2023년 완료된 사업연도'
            },
            {
                year: 2025,
                startDate: '2025-01-01',
                endDate: '2025-12-31', 
                reportSubmitted: false,
                remarks: '2025년 예정 사업연도'
            }
        ];

        // 그리드가 준비된 후 데이터 추가
        setTimeout(() => {
            const businessYearGrid = this.grids['businessYear'];
            if (businessYearGrid && businessYearGrid.gridOptions && businessYearGrid.gridOptions.api) {
                try {
                    businessYearSample.forEach(row => {
                        businessYearGrid.gridOptions.api.applyTransaction({ add: [row] });
                    });
                    console.log('Additional BusinessYear sample data loaded:', businessYearSample.length, 'rows');
                } catch (error) {
                    console.error('Error loading additional businessYear data:', error);
                }
            }
        }, 1000);
    }
}

// 전역 그리드 매니저 인스턴스
window.gridManager = new GridManager();

// 전역 함수들을 다시 한번 확실히 설정
window.addEventListener('load', function() {
    // 그리드 매니저가 준비된 후 전역 함수 재설정
    console.log('Window loaded, setting up global grid functions...');
    
    window.addBusinessYearRow = function() {
        console.log('Global addBusinessYearRow called');
        
        if (!window.gridManager || !window.gridManager.grids || !window.gridManager.grids['businessYear']) {
            console.error('BusinessYear grid not ready');
            alert('그리드가 아직 준비되지 않았습니다. 잠시 후 다시 시도해주세요.');
            return;
        }
        
        const newRow = {
            year: new Date().getFullYear() + 1,
            startDate: (new Date().getFullYear() + 1) + '-01-01',
            endDate: (new Date().getFullYear() + 1) + '-12-31',
            reportSubmitted: false,
            remarks: '새로운 사업연도'
        };
        
        try {
            window.gridManager.addRow('businessYear', newRow);
            console.log('Business year row added successfully');
        } catch (error) {
            console.error('Error adding business year row:', error);
            alert('행 추가 중 오류가 발생했습니다: ' + error.message);
        }
    };
    
    window.addBusinessInfoRow = function() {
        console.log('Global addBusinessInfoRow called');
        
        if (!window.gridManager || !window.gridManager.grids || !window.gridManager.grids['businessInfo']) {
            console.error('BusinessInfo grid not ready');
            alert('그리드가 아직 준비되지 않았습니다. 잠시 후 다시 시도해주세요.');
            return;
        }
        
        const newRow = {
            category: '신규',
            format: '전산',
            formatNumber: '',
            formatName: '새로운 서식',
            taxCalculationType: '선택',
            status: '',
            submitted: false,
            order: 1
        };
        
        try {
            window.gridManager.addRow('businessInfo', newRow);
            console.log('Business info row added successfully');
        } catch (error) {
            console.error('Error adding business info row:', error);
            alert('행 추가 중 오류가 발생했습니다: ' + error.message);
        }
    };
});

// DOM 로드 완료 후 그리드 초기화
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing grids...');
    
    // AG-Grid 라이브러리 로딩 확인
    const checkAGGrid = () => {
        if (typeof agGrid !== 'undefined') {
            console.log('AG-Grid library loaded, initializing grids...');
            
            // 탭이 활성화된 후 그리드 초기화
            setTimeout(() => {
                gridManager.initAllGrids();
                console.log('AG-Grid 초기화 완료');
            }, 1000);
        } else {
            console.log('AG-Grid library not ready, retrying...');
            setTimeout(checkAGGrid, 200);
        }
    };
    
    checkAGGrid();
});

// 그리드 관련 유틸리티 함수들
window.addBusinessYearRow = function() {
    console.log('Adding business year row...');
    
    if (!gridManager || !gridManager.grids || !gridManager.grids['businessYear']) {
        console.error('BusinessYear grid not ready');
        alert('그리드가 아직 준비되지 않았습니다. 잠시 후 다시 시도해주세요.');
        return;
    }
    
    const newRow = {
        year: new Date().getFullYear() + 1,
        startDate: (new Date().getFullYear() + 1) + '-01-01',
        endDate: (new Date().getFullYear() + 1) + '-12-31',
        reportSubmitted: false,
        remarks: '새로운 사업연도'
    };
    
    try {
        gridManager.addRow('businessYear', newRow);
        console.log('Business year row added successfully');
    } catch (error) {
        console.error('Error adding business year row:', error);
        alert('행 추가 중 오류가 발생했습니다: ' + error.message);
    }
};

window.deleteSelectedBusinessYearRows = function() {
    gridManager.deleteSelectedRows('businessYear');
};

window.addBusinessInfoRow = function() {
    console.log('Adding business info row...');
    
    if (!gridManager || !gridManager.grids || !gridManager.grids['businessInfo']) {
        console.error('BusinessInfo grid not ready');
        alert('그리드가 아직 준비되지 않았습니다. 잠시 후 다시 시도해주세요.');
        return;
    }
    
    const newRow = {
        category: '신규',
        format: '전산',
        formatNumber: '',
        formatName: '새로운 서식',
        taxCalculationType: '선택',
        status: '',
        submitted: false,
        order: 1
    };
    
    try {
        gridManager.addRow('businessInfo', newRow);
        console.log('Business info row added successfully');
    } catch (error) {
        console.error('Error adding business info row:', error);
        alert('행 추가 중 오류가 발생했습니다: ' + error.message);
    }
};

window.deleteSelectedBusinessInfoRows = function() {
    gridManager.deleteSelectedRows('businessInfo');
};

window.exportBusinessYearData = function(format = 'csv') {
    gridManager.exportGridData('businessYear', format);
};

window.exportBusinessInfoData = function(format = 'csv') {
    gridManager.exportGridData('businessInfo', format);
};

window.showGridStatistics = function(configKey) {
    const stats = gridManager.getGridStatistics(configKey);
    if (!stats) return;

    let message = `=== ${configKey === 'businessYear' ? '사업연도' : '사업정보'} 통계 ===\n\n`;
    message += `총 행 수: ${stats.totalRows}개\n`;
    message += `선택된 행: ${stats.selectedRows}개\n\n`;

    if (configKey === 'businessYear') {
        message += `보고서 제출: ${stats.submittedReports}개\n`;
        message += `연도 범위: ${stats.years.join(', ')}\n`;
    } else if (configKey === 'businessInfo') {
        message += `완료된 항목: ${stats.completedItems}개\n`;
        message += `제출된 항목: ${stats.submittedItems}개\n`;
        message += `구분 유형: ${stats.categories.join(', ')}\n`;
    }

    alert(message);
};

// 탭 전환 시 그리드 크기 재조정 및 데이터 로드 보장
document.addEventListener('DOMContentLoaded', function() {
    // Bootstrap 탭 이벤트 리스너 추가  
    setTimeout(() => {
        const tabLinks = document.querySelectorAll('[data-bs-toggle="tab"]');
        console.log('Found tab links:', tabLinks.length);
        
        tabLinks.forEach(tabLink => {
            tabLink.addEventListener('shown.bs.tab', function(event) {
                const tabId = event.target.getAttribute('href');
                console.log('Tab switched to:', tabId);
                
                // 짧은 지연 후 그리드 처리
                setTimeout(() => {
                    // 사업정보 탭이 활성화되었을 때 특별 처리
                    if (tabId === '#layout2') {
                        const businessInfoGrid = gridManager.grids['businessInfo'];
                        if (businessInfoGrid && businessInfoGrid.gridOptions && businessInfoGrid.gridOptions.api) {
                            try {
                                // 데이터가 없으면 기본 데이터 설정
                                let rowCount = 0;
                                businessInfoGrid.gridOptions.api.forEachNode(() => rowCount++);
                                
                                if (rowCount === 0) {
                                    businessInfoGrid.gridOptions.api.setGridOption('rowData', gridManager.gridConfigs.businessInfo.rowData);
                                    console.log('BusinessInfo data loaded on tab switch');
                                }
                                
                                businessInfoGrid.gridOptions.api.sizeColumnsToFit();
                                console.log('BusinessInfo grid resized on tab switch');
                            } catch (error) {
                                console.warn('Failed to process businessInfo grid:', error);
                            }
                        }
                    }
                    
                    // 모든 그리드 크기 재조정
                    Object.keys(gridManager.grids).forEach(configKey => {
                        const grid = gridManager.grids[configKey];
                        if (grid && grid.gridOptions && grid.gridOptions.api) {
                            try {
                                const container = document.getElementById(configKey === 'businessYear' ? 'businessYearGrid' : 'businessInfoGrid');
                                if (container && container.offsetWidth > 0) {
                                    grid.gridOptions.api.sizeColumnsToFit();
                                    console.log(`Resized grid: ${configKey} (${container.offsetWidth}px)`);
                                }
                            } catch (error) {
                                console.warn(`Failed to resize grid ${configKey}:`, error);
                            }
                        }
                    });
                }, 300);
            });
        });
    }, 1500);
});