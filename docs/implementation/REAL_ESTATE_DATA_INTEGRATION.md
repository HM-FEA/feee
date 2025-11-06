# 📊 부동산 시뮬레이터 - 실제 데이터 연동 가이드

**Parent Guide:** REAL_ESTATE_PILOT_GUIDE.md
**Phase:** 3 - Data Integration

---

## 🎯 데이터 소스 전략

### 1. 한국 부동산 기업 데이터

#### 데이터 소스
| 항목 | 소스 | API | 비용 |
|------|------|-----|------|
| **재무제표** | 금융감독원 DART | [OpenDART API](https://opendart.fss.or.kr) | 무료 |
| **실시간 주가** | 한국거래소 KRX | yfinance (간접) | 무료 |
| **부동산 가격** | 국토교통부 | [공공데이터포털](https://www.data.go.kr) | 무료 |
| **은행 대출 정보** | 금융통계정보시스템 | [ECOS API](https://ecos.bok.or.kr) | 무료 |

---

## 📥 Phase 3.1: 재무 데이터 수집 (Team Data)

### DART API 연동 - 부동산 기업 재무제표 수집

```python
# services/data-pipeline/crawlers/dart_crawler.py

import requests
import pandas as pd
from datetime import datetime

class DARTCrawler:
    """금융감독원 DART API 크롤러"""

    def __init__(self, api_key: str):
        self.api_key = api_key
        self.base_url = "https://opendart.fss.or.kr/api"

    def get_real_estate_companies(self) -> pd.DataFrame:
        """
        부동산 섹터 기업 목록 조회

        섹터 분류:
        - REIT (부동산투자신탁)
        - 건설업
        - 부동산 개발
        """
        # 1. 전체 상장기업 목록 조회
        url = f"{self.base_url}/corpCode.xml"
        params = {'crtfc_key': self.api_key}

        response = requests.get(url, params=params)
        # XML 파싱 후 부동산 관련 기업 필터링

        # 주요 REIT 기업 코드 (예시)
        reit_companies = [
            {'corp_code': '00164742', 'corp_name': '신한알파리츠', 'stock_code': '293940'},
            {'corp_code': '00413793', 'corp_name': '이리츠코크렙', 'stock_code': '377190'},
            {'corp_code': '01056347', 'corp_name': 'NH프라임리츠', 'stock_code': '338100'},
            # ... 더 많은 REIT 추가
        ]

        # 주요 건설사
        construction_companies = [
            {'corp_code': '00126380', 'corp_name': '삼성물산', 'stock_code': '028260'},
            {'corp_code': '00164779', 'corp_name': '현대건설', 'stock_code': '000720'},
            {'corp_code': '00114061', 'corp_name': '대림산업', 'stock_code': '000210'},
        ]

        return pd.DataFrame(reit_companies + construction_companies)

    def get_financial_statements(self, corp_code: str, year: int) -> dict:
        """
        특정 기업의 재무제표 조회

        Args:
            corp_code: 기업 고유번호
            year: 사업연도

        Returns:
            재무제표 데이터 (대차대조표, 손익계산서)
        """
        # 1. 대차대조표 (재무상태표)
        balance_sheet = self._get_balance_sheet(corp_code, year)

        # 2. 손익계산서
        income_statement = self._get_income_statement(corp_code, year)

        return {
            'balance_sheet': balance_sheet,
            'income_statement': income_statement,
        }

    def _get_balance_sheet(self, corp_code: str, year: int) -> dict:
        """대차대조표 조회"""
        url = f"{self.base_url}/fnlttSinglAcntAll.json"
        params = {
            'crtfc_key': self.api_key,
            'corp_code': corp_code,
            'bsns_year': year,
            'reprt_code': '11011',  # 사업보고서
            'fs_div': 'CFS',        # 연결재무제표
        }

        response = requests.get(url, params=params)
        data = response.json()

        if data['status'] != '000':
            raise Exception(f"DART API Error: {data['message']}")

        # 필요한 항목 추출
        items = data['list']
        balance_sheet = {}

        for item in items:
            account_name = item['account_nm']
            amount = float(item['thstrm_amount'].replace(',', '')) if item['thstrm_amount'] else 0

            # 주요 항목 매핑
            if '자산총계' in account_name:
                balance_sheet['total_assets'] = amount
            elif '부채총계' in account_name:
                balance_sheet['total_liabilities'] = amount
            elif '자본총계' in account_name:
                balance_sheet['equity'] = amount
            elif '차입금' in account_name or '사채' in account_name:
                balance_sheet['debt'] = balance_sheet.get('debt', 0) + amount

        return balance_sheet

    def _get_income_statement(self, corp_code: str, year: int) -> dict:
        """손익계산서 조회"""
        url = f"{self.base_url}/fnlttSinglAcntAll.json"
        params = {
            'crtfc_key': self.api_key,
            'corp_code': corp_code,
            'bsns_year': year,
            'reprt_code': '11011',
            'fs_div': 'CFS',
        }

        response = requests.get(url, params=params)
        data = response.json()

        items = data['list']
        income_statement = {}

        for item in items:
            account_name = item['account_nm']
            amount = float(item['thstrm_amount'].replace(',', '')) if item['thstrm_amount'] else 0

            if '매출액' in account_name and '영업' not in account_name:
                income_statement['revenue'] = amount
            elif '영업비용' in account_name or '판매비와관리비' in account_name:
                income_statement['operating_expense'] = income_statement.get('operating_expense', 0) + amount
            elif '이자비용' in account_name:
                income_statement['interest_expense'] = amount
            elif '당기순이익' in account_name:
                income_statement['net_income'] = amount

        return income_statement


# 사용 예시
if __name__ == '__main__':
    api_key = "YOUR_DART_API_KEY"  # https://opendart.fss.or.kr 에서 발급
    crawler = DARTCrawler(api_key)

    # 1. 부동산 기업 목록 조회
    companies = crawler.get_real_estate_companies()
    print(f"부동산 기업 수: {len(companies)}")

    # 2. 각 기업의 재무제표 조회
    for idx, company in companies.iterrows():
        print(f"\n=== {company['corp_name']} ===")
        try:
            financials = crawler.get_financial_statements(company['corp_code'], 2023)
            print("대차대조표:", financials['balance_sheet'])
            print("손익계산서:", financials['income_statement'])
        except Exception as e:
            print(f"Error: {e}")
```

---

## 📤 Phase 3.2: 데이터 저장 (PostgreSQL)

### 데이터베이스 스키마

```sql
-- services/data-pipeline/migrations/create_real_estate_tables.sql

-- 1. 부동산 기업 테이블
CREATE TABLE real_estate_companies (
    company_id VARCHAR(20) PRIMARY KEY,
    company_name VARCHAR(200) NOT NULL,
    stock_code VARCHAR(10),
    sector VARCHAR(50),  -- 'REIT', 'Construction', 'Developer'
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 2. 재무제표 테이블 (연간)
CREATE TABLE company_financials (
    id SERIAL PRIMARY KEY,
    company_id VARCHAR(20) REFERENCES real_estate_companies(company_id),
    fiscal_year INT NOT NULL,
    quarter INT DEFAULT 4,  -- 1,2,3,4 (연간은 4)

    -- 대차대조표
    total_assets BIGINT,
    total_liabilities BIGINT,
    equity BIGINT,
    debt BIGINT,

    -- 손익계산서
    revenue BIGINT,
    operating_expense BIGINT,
    interest_expense BIGINT,
    net_income BIGINT,

    -- 비율 지표
    debt_ratio DECIMAL(10, 2),  -- 부채비율 (%)
    current_ratio DECIMAL(10, 2),  -- 유동비율 (%)

    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(company_id, fiscal_year, quarter)
);

CREATE INDEX idx_financials_company ON company_financials(company_id);
CREATE INDEX idx_financials_year ON company_financials(fiscal_year DESC);

-- 3. 은행 대출 정보 테이블
CREATE TABLE company_loans (
    id SERIAL PRIMARY KEY,
    company_id VARCHAR(20) REFERENCES real_estate_companies(company_id),
    bank_id VARCHAR(20),
    bank_name VARCHAR(100),
    loan_amount BIGINT,
    interest_rate DECIMAL(5, 2),  -- %
    loan_type VARCHAR(20),  -- 'Fixed', 'Variable'
    maturity_date DATE,
    collateral_value BIGINT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_loans_company ON company_loans(company_id);

-- 4. 부동산 포트폴리오 테이블
CREATE TABLE company_properties (
    id SERIAL PRIMARY KEY,
    company_id VARCHAR(20) REFERENCES real_estate_companies(company_id),
    property_id VARCHAR(50) UNIQUE,
    property_name VARCHAR(200),
    property_type VARCHAR(50),  -- 'Office', 'Retail', 'Residential', 'Industrial'
    location VARCHAR(200),
    address VARCHAR(300),
    value BIGINT,  -- 부동산 가치 (원)
    rental_income BIGINT,  -- 연간 임대수익 (원)
    occupancy_rate DECIMAL(5, 2),  -- 임차율 (%)
    acquisition_date DATE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_properties_company ON company_properties(company_id);

-- 5. 시뮬레이션 결과 저장 (히스토리)
CREATE TABLE simulation_results (
    id SERIAL PRIMARY KEY,
    user_id UUID,
    simulation_type VARCHAR(50) DEFAULT 'interest_rate',
    base_rate DECIMAL(5, 2),
    new_rate DECIMAL(5, 2),
    rate_change DECIMAL(5, 2),
    company_ids TEXT[],  -- 시뮬레이션에 포함된 기업 ID 배열
    result_data JSONB,  -- 전체 시뮬레이션 결과 JSON
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_simulation_user ON simulation_results(user_id);
CREATE INDEX idx_simulation_created ON simulation_results(created_at DESC);
```

---

## 🔄 Phase 3.3: Airflow DAG - 자동 데이터 수집

```python
# services/data-pipeline/dags/real_estate_data_sync.py

from airflow import DAG
from airflow.operators.python import PythonOperator
from datetime import datetime, timedelta
from crawlers.dart_crawler import DARTCrawler
import psycopg2
import os

def sync_real_estate_financials(**context):
    """부동산 기업 재무 데이터 동기화"""

    # 1. DART Crawler 초기화
    api_key = os.getenv('DART_API_KEY')
    crawler = DARTCrawler(api_key)

    # 2. 기업 목록 조회
    companies = crawler.get_real_estate_companies()

    # 3. PostgreSQL 연결
    conn = psycopg2.connect(os.getenv('DATABASE_URL'))
    cursor = conn.cursor()

    current_year = datetime.now().year - 1  # 전년도 데이터

    # 4. 각 기업의 재무 데이터 수집 및 저장
    for idx, company in companies.iterrows():
        try:
            # 재무제표 조회
            financials = crawler.get_financial_statements(company['corp_code'], current_year)

            balance = financials['balance_sheet']
            income = financials['income_statement']

            # 부채비율 계산
            debt_ratio = (balance['total_liabilities'] / balance['equity']) * 100 if balance['equity'] > 0 else 0

            # DB 저장 (UPSERT)
            cursor.execute("""
                INSERT INTO company_financials (
                    company_id, fiscal_year, quarter,
                    total_assets, total_liabilities, equity, debt,
                    revenue, operating_expense, interest_expense, net_income,
                    debt_ratio
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                ON CONFLICT (company_id, fiscal_year, quarter)
                DO UPDATE SET
                    total_assets = EXCLUDED.total_assets,
                    total_liabilities = EXCLUDED.total_liabilities,
                    equity = EXCLUDED.equity,
                    debt = EXCLUDED.debt,
                    revenue = EXCLUDED.revenue,
                    operating_expense = EXCLUDED.operating_expense,
                    interest_expense = EXCLUDED.interest_expense,
                    net_income = EXCLUDED.net_income,
                    debt_ratio = EXCLUDED.debt_ratio,
                    updated_at = NOW()
            """, (
                company['corp_code'],
                current_year,
                4,  # 연간
                balance.get('total_assets', 0),
                balance.get('total_liabilities', 0),
                balance.get('equity', 0),
                balance.get('debt', 0),
                income.get('revenue', 0),
                income.get('operating_expense', 0),
                income.get('interest_expense', 0),
                income.get('net_income', 0),
                debt_ratio,
            ))

            conn.commit()
            print(f"✅ {company['corp_name']} - 재무 데이터 저장 완료")

        except Exception as e:
            print(f"❌ {company['corp_name']} - Error: {e}")
            conn.rollback()

    cursor.close()
    conn.close()

    return f"Total companies processed: {len(companies)}"


# DAG 정의
default_args = {
    'owner': 'data-team',
    'depends_on_past': False,
    'email_on_failure': True,
    'email': ['data-team@nexus-alpha.com'],
    'retries': 2,
    'retry_delay': timedelta(minutes=5),
}

with DAG(
    'real_estate_data_sync',
    default_args=default_args,
    description='부동산 기업 재무 데이터 동기화 (DART API)',
    schedule_interval='0 2 * * 0',  # 매주 일요일 새벽 2시
    start_date=datetime(2025, 1, 1),
    catchup=False,
    tags=['real-estate', 'financials', 'dart'],
) as dag:

    sync_task = PythonOperator(
        task_id='sync_financials',
        python_callable=sync_real_estate_financials,
    )
```

---

## 🔌 Phase 3.4: Backend API 수정 - DB 연동

```python
# services/quant-engine/app/repositories/company_repository.py

from sqlalchemy import create_engine, text
from typing import List, Dict
import os

class CompanyRepository:
    """기업 재무 데이터 Repository"""

    def __init__(self):
        self.engine = create_engine(os.getenv('DATABASE_URL'))

    def get_real_estate_companies(self, sector: str = None) -> List[Dict]:
        """
        부동산 기업 목록 조회

        Args:
            sector: 'REIT', 'Construction', 'Developer' (Optional)

        Returns:
            기업 목록
        """
        query = """
            SELECT
                c.company_id,
                c.company_name,
                c.stock_code,
                c.sector,
                f.total_assets,
                f.total_liabilities,
                f.equity,
                f.debt,
                f.revenue,
                f.operating_expense,
                f.interest_expense,
                f.net_income,
                f.debt_ratio
            FROM real_estate_companies c
            LEFT JOIN (
                SELECT DISTINCT ON (company_id)
                    company_id,
                    total_assets,
                    total_liabilities,
                    equity,
                    debt,
                    revenue,
                    operating_expense,
                    interest_expense,
                    net_income,
                    debt_ratio
                FROM company_financials
                ORDER BY company_id, fiscal_year DESC, quarter DESC
            ) f ON c.company_id = f.company_id
        """

        if sector:
            query += f" WHERE c.sector = '{sector}'"

        with self.engine.connect() as conn:
            result = conn.execute(text(query))
            companies = []
            for row in result:
                companies.append({
                    'company_id': row[0],
                    'company_name': row[1],
                    'stock_code': row[2],
                    'sector': row[3],
                    'total_assets': row[4] or 0,
                    'total_liabilities': row[5] or 0,
                    'equity': row[6] or 0,
                    'debt': row[7] or 0,
                    'revenue': row[8] or 0,
                    'operating_expense': row[9] or 0,
                    'interest_expense': row[10] or 0,
                    'net_income': row[11] or 0,
                    'debt_ratio': float(row[12]) if row[12] else 0,
                })
            return companies

    def get_company_loans(self, company_id: str) -> List[Dict]:
        """기업의 대출 정보 조회"""
        query = """
            SELECT
                bank_id,
                bank_name,
                loan_amount,
                interest_rate,
                loan_type,
                collateral_value
            FROM company_loans
            WHERE company_id = :company_id
        """

        with self.engine.connect() as conn:
            result = conn.execute(text(query), {'company_id': company_id})
            loans = []
            for row in result:
                loans.append({
                    'bank_id': row[0],
                    'bank_name': row[1],
                    'loan_amount': row[2] or 0,
                    'interest_rate': float(row[3]) if row[3] else 0,
                    'loan_type': row[4] or 'Variable',
                    'collateral_value': row[5] or 0,
                })
            return loans
```

**API 엔드포인트 수정**
```python
# services/quant-engine/app/api/v1/routes/real_estate_simulation.py (수정)

from app.repositories.company_repository import CompanyRepository

@router.get("/real-estate/companies")
async def get_real_estate_companies(sector: str = None):
    """
    부동산 기업 목록 조회 (실제 DB 데이터)

    Query Params:
        sector: 'REIT', 'Construction', 'Developer' (Optional)
    """
    try:
        repo = CompanyRepository()
        companies = repo.get_real_estate_companies(sector)

        # 대출 정보도 함께 조회
        for company in companies:
            company['bank_loans'] = repo.get_company_loans(company['company_id'])

        return {
            'total': len(companies),
            'companies': companies,
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/real-estate/interest-rate-from-db")
async def simulate_with_db_data(
    new_rate: float,
    sector: str = None,
    company_ids: List[str] = None
):
    """
    DB의 실제 기업 데이터로 시뮬레이션

    Args:
        new_rate: 새로운 금리
        sector: 섹터 필터 (Optional)
        company_ids: 특정 기업들만 선택 (Optional)
    """
    try:
        repo = CompanyRepository()

        # 1. 기업 데이터 조회
        if company_ids:
            companies = [repo.get_company_by_id(cid) for cid in company_ids]
        else:
            companies = repo.get_real_estate_companies(sector)

        # 2. 시뮬레이션 실행
        simulator = RealEstateSimulator(companies)
        result = simulator.simulate(new_rate)

        return result

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
```

---

## 🧪 테스트

```bash
# 1. DB에 기업 데이터 조회
curl "http://localhost:8000/api/v1/simulations/real-estate/companies?sector=REIT"

# 2. 실제 데이터로 시뮬레이션
curl -X POST "http://localhost:8000/api/v1/simulations/real-estate/interest-rate-from-db?new_rate=4.5&sector=REIT"
```

---

## 📊 다음 단계

1. **프론트엔드 수정**: DB 데이터를 기반으로 UI 업데이트
2. **실시간 주가 연동**: yfinance 통합
3. **알림 시스템**: 위험 기업 자동 알림
4. **히스토리 비교**: 과거 시뮬레이션 결과와 비교

---

**Last Updated:** 2025-10-31
