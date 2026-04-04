import { useState } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import { Button, Input, Card, Header, Container } from './components/ui/index.ts'
import LoginPage from './pages/LoginPage.tsx'
import SignUpPage from './pages/SignUpPage.tsx'

function App() {
  // useState<string>으로 타입을 명시해 의도를 명확히 한다
  const [inputValue, setInputValue] = useState<string>('')
  const [inputError, setInputError] = useState<string>('')

  function handleValidate() {
    setInputError(inputValue.length > 0 && inputValue.length < 3 ? '3자 이상 입력해주세요.' : '')
  }

  const MainPage = (
    <div className="min-h-screen bg-app-bg">
      <Header
        brand="PhotoShare"
        nav={
          <>
            <a href="#" className="hover:text-app-text-h transition-colors">Gallery</a>
            <a href="#" className="hover:text-app-text-h transition-colors">Upload</a>
            <a href="#" className="hover:text-app-text-h transition-colors">About</a>
          </>
        }
        actions={
          <>
            <Link to="/login">
              <Button variant="secondary" size="sm">Log in</Button>
            </Link>
            <Button variant="primary" size="sm">Sign up</Button>
          </>
        }
      />

      <Container maxWidth="7xl">

        {/* ── Buttons ─────────────────────────────────────── */}
        <section className="mb-14">
          <h2 className="text-app-text-h text-2xl font-semibold mb-2">Buttons</h2>
          <p className="text-app-text text-sm mb-6">Variant / Size / Disabled 상태 조합</p>

          <div className="flex flex-wrap gap-4 items-center mb-4">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="primary" disabled>Disabled</Button>
          </div>
          <div className="flex flex-wrap gap-4 items-center">
            <Button variant="primary" size="sm">Small</Button>
            <Button variant="primary" size="md">Medium</Button>
            <Button variant="primary" size="lg">Large</Button>
          </div>
        </section>

        {/* ── Inputs ──────────────────────────────────────── */}
        <section className="mb-14">
          <h2 className="text-app-text-h text-2xl font-semibold mb-2">Inputs</h2>
          <p className="text-app-text text-sm mb-6">기본 / 에러 / Disabled 상태</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
            <Input
              label="이메일"
              type="email"
              placeholder="you@example.com"
              hint="이메일 주소를 입력하세요."
            />
            <Input
              label="비밀번호"
              type="password"
              placeholder="비밀번호 입력"
              required
            />
            <Input
              label="유효성 검사 (blur 시 검증)"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onBlur={handleValidate}
              error={inputError}
              hint="3자 미만으로 입력 후 탭을 눌러보세요."
            />
            <Input
              label="비활성화 입력창"
              value="수정 불가능"
              disabled
              readOnly
            />
          </div>
        </section>

        {/* ── Cards ───────────────────────────────────────── */}
        <section className="mb-14">
          <h2 className="text-app-text-h text-2xl font-semibold mb-2">Cards</h2>
          <p className="text-app-text text-sm mb-6">기본 / Footer 슬롯 / Hover 효과</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card title="기본 카드" subtitle="서브타이틀 라인">
              <p className="text-app-text text-sm">카드 본문 내용이 이곳에 들어갑니다. 텍스트, 이미지, 기타 컴포넌트를 자유롭게 넣을 수 있습니다.</p>
            </Card>
            <Card
              title="Footer 슬롯"
              footer={
                <>
                  <Button size="sm">확인</Button>
                  <Button variant="ghost" size="sm">취소</Button>
                </>
              }
            >
              <p className="text-app-text text-sm">footer prop에 액션 버튼을 넣으면 하단 구분선과 함께 렌더됩니다.</p>
            </Card>
            <Card hover title="Hover 카드" subtitle="마우스를 올려보세요">
              <p className="text-app-text text-sm">hover prop을 추가하면 shadow + 위로 살짝 올라오는 효과가 적용됩니다.</p>
            </Card>
          </div>
        </section>

        {/* ── Photo Grid ──────────────────────────────────── */}
        <section className="mb-14">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-app-text-h text-2xl font-semibold mb-1">Photo Grid</h2>
              <p className="text-app-text text-sm">반응형 사진 그리드 (1 / 2 / 3 컬럼)</p>
            </div>
            <Button variant="primary" size="sm">+ 업로드</Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} hover padding="none" as="article">
                <div className="aspect-video bg-surface-700 flex items-center justify-center">
                  <svg className="w-10 h-10 text-app-border" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M13.5 12a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                  </svg>
                </div>
                <div className="p-4">
                  <p className="text-app-text-h font-medium text-sm">사진 제목 {i + 1}</p>
                  <p className="text-app-text text-xs mt-0.5">2026년 4월 업로드</p>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* ── Color Palette ────────────────────────────────── */}
        <section className="mb-14">
          <h2 className="text-app-text-h text-2xl font-semibold mb-2">Color Palette</h2>
          <p className="text-app-text text-sm mb-6">Accent (보라 계열) + Surface / App 시맨틱 토큰</p>

          <div className="flex flex-wrap gap-2 mb-4">
            {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950].map(shade => (
              <div key={shade} className="flex flex-col items-center gap-1">
                <div
                  className="w-10 h-10 rounded border border-app-border"
                  style={{ backgroundColor: `var(--tw-accent-${shade}, #a855f7)` }}
                  title={`accent-${shade}`}
                />
                <span className="text-app-text text-xs">{shade}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-3">
            {[
              { label: 'app-bg', bg: 'bg-app-bg', border: true },
              { label: 'app-border', bg: 'bg-app-border', border: false },
              { label: 'app-text', bg: 'bg-app-text', border: false },
              { label: 'app-text-h', bg: 'bg-app-text-h', border: false },
              { label: 'app-code-bg', bg: 'bg-app-code-bg', border: false },
              { label: 'surface-700', bg: 'bg-surface-700', border: false },
              { label: 'surface-800', bg: 'bg-surface-800', border: false },
              { label: 'surface-900', bg: 'bg-surface-900', border: false },
              { label: 'accent-400', bg: 'bg-accent-400', border: false },
              { label: 'accent-500', bg: 'bg-accent-500', border: false },
              { label: 'accent-600', bg: 'bg-accent-600', border: false },
            ].map(({ label, bg, border }) => (
              <div key={label} className="flex flex-col items-center gap-1">
                <div className={`w-12 h-12 rounded ${bg} ${border ? 'border border-app-border' : ''}`} title={label} />
                <span className="text-app-text text-xs text-center leading-tight">{label}</span>
              </div>
            ))}
          </div>
        </section>

      </Container>
    </div>
  )

  return (
    <Routes>
      <Route path="/" element={MainPage} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
    </Routes>
  )
}

export default App
