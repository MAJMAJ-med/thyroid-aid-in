/* AID-IN v3 — WashU Medicine brand application.
   Same interaction design as v2, with WashU red/cream/green palette,
   Georgia display serif + Calibri/Arial body, and tighter v1-style type scale. */
const { useState, useEffect, useMemo, useRef } = React;

// ---------- helpers ----------
function Citations({ nums }) {
  if (!nums || !nums.length) return null;
  return (
    <span className="cite-group">
      {nums.map((n, i) => (
        <a key={n} className="cite" href={`#ref-${n}`}
           aria-label={`Reference ${n}`}
           onClick={(e) => { e.preventDefault(); window.dispatchEvent(new CustomEvent('aid-goto-ref', { detail: n })); }}>
          {n}
        </a>
      ))}
    </span>
  );
}

function IconArray({ lower, upper, label, affectedLabel='Affected', unaffectedLabel='Not affected', ariaLabel, size='md' }) {
  const total = 100;
  const solid = lower || 0;
  const rangeExtra = upper !== undefined ? Math.max(0, upper - solid) : 0;
  const isRange = lower !== undefined && upper !== undefined && lower !== upper;
  const dots = Array.from({length: total}, (_, i) =>
    i < solid ? 'affected' : i < solid + rangeExtra ? 'range' : '');
  const numLabel = isRange ? `${lower}–${upper}` : `${solid}`;
  const frequencyText = isRange ? `${lower} to ${upper} out of 100` : `${solid} out of 100`;
  return (
    <figure className={`icon-array-figure size-${size}`} role="figure"
            aria-label={ariaLabel || `Icon array showing ${frequencyText}`}>
      <div className="icon-array" aria-hidden="true">
        {dots.map((cls, i) => <span key={i} className={`dot ${cls}`} />)}
      </div>
      <figcaption className="icon-array-caption">
        <div className="headline">{numLabel} <span className="headline-tail">out of 100</span></div>
        {isRange && <div className="range">A range — your own chance may be anywhere between.</div>}
        {label && <div className="iaf-label">{label}</div>}
        <div className="legend">
          <span className="swatch"><span className="dot affected" /> {affectedLabel}{isRange ? ` (at least ${lower})` : ` (${solid})`}</span>
          {rangeExtra > 0 && <span className="swatch"><span className="dot range" /> Possible up to {upper}</span>}
          <span className="swatch"><span className="dot" /> {unaffectedLabel}</span>
        </div>
        <span className="sr-only">{frequencyText} people {affectedLabel.toLowerCase()}.</span>
      </figcaption>
    </figure>
  );
}

function MiniArray({ lower, upper }) {
  const total = 100;
  const solid = lower || 0;
  const rangeExtra = upper !== undefined ? Math.max(0, upper - solid) : 0;
  const dots = Array.from({length: total}, (_, i) =>
    i < solid ? 'aff' : i < solid + rangeExtra ? 'range' : '');
  return <div className="mini-array" aria-hidden="true">{dots.map((c, i) => <span key={i} className={`d ${c}`} />)}</div>;
}

function BarGraph({ rows }) {
  return (
    <div className="bars" role="table" aria-label="Bar graph comparison across options">
      {rows.map(r => {
        const isRange = r.lower !== r.upper;
        const everyone = r.lower === 100 && r.upper === 100;
        const none = r.lower === 0 && r.upper === 0;
        const widthLower = (r.lower / 100) * 100;
        const widthRange = isRange ? ((r.upper - r.lower) / 100) * 100 : 0;
        return (
          <div className="bar-row" key={r.label} role="row">
            <div role="cell" className="bar-label">{r.label}</div>
            <div className="bar-track" role="cell"
                 aria-label={`${r.lower}${isRange ? ` to ${r.upper}` : ''} out of 100`}>
              <div className="bar-fill" style={{ width: `${widthLower}%` }} />
              {isRange && <div className="bar-fill range" style={{ left: `${widthLower}%`, width: `${widthRange}%` }} />}
            </div>
            <div className="bar-val" role="cell">
              {everyone ? 'Everyone' : none ? 'No one' : (isRange ? `${r.lower}–${r.upper}` : r.lower)}
              {!everyone && !none && <span className="bar-val-unit"> / 100</span>}
            </div>
          </div>
        );
      })}
      <div className="bars-footnote">Solid bar = lower estimate. Striped extension = upper estimate of the range.</div>
    </div>
  );
}

function UncertaintyCallout({ children }) {
  return <div className="uncertainty" role="note"><strong>Note on uncertainty:</strong> {children}</div>;
}

// ---------- module 1 ----------
function ModuleWelcome({ content }) {
  const w = content.welcome;
  return (
    <div>
      <div className="module-kicker">Module 1 of 8 · Welcome</div>
      <h2>{w.heading}</h2>
      <p className="lede">{w.lede}</p>
      <p>{w.body}</p>
      <ul>{w.bullets.map((b,i) => <li key={i}>{b}</li>)}</ul>
      <p>{w.closing}</p>
      <div className="card">
        <h4 style={{marginTop:0}}>Before you start</h4>
        <ul style={{marginBottom:0}}>
          <li><strong>Time:</strong> {w.orientation.time}</li>
          <li><strong>What this tool does:</strong> {w.orientation.purpose}</li>
          <li><strong>What it does not do:</strong> {w.orientation.limits}</li>
        </ul>
      </div>
      <div className="storage-note">
        <strong>A note on saving:</strong> {w.orientation.storage} Your information is never sent anywhere — it stays on your device.
      </div>
    </div>
  );
}

// ---------- module 2: how to read numbers ----------
function ModuleHowToRead({ content }) {
  const h = content.howToRead;
  return (
    <div>
      <div className="module-kicker">Module 2 of 8 · How to read the numbers</div>
      <h2>{h.heading}</h2>
      {h.body.map((p,i) => <p key={i} className={i===0 ? 'lede' : ''}>{p}</p>)}
      <h3>An example with a range</h3>
      <p className="subtle">{h.demo.label}</p>
      <IconArray
        lower={h.demo.lower} upper={h.demo.upper}
        label={h.demo.caption}
        affectedLabel={h.demo.affectedLabel}
        unaffectedLabel={h.demo.unaffectedLabel}
        ariaLabel="Example icon array. 30 to 50 out of 100 umbrellas are blue; the rest are gray."
      />
      <div className="callout">
        <strong>Two patterns to notice:</strong>
        <ul style={{margin:'6px 0 0'}}>
          <li>A <span className="inline-dot affected"/> darker dot is a person who experiences the outcome. A <span className="inline-dot"/> lighter dot is a person who does not.</li>
          <li>When a risk is a <em>range</em> (like 30 to 50 out of 100), we draw the lowest estimate as solid darker dots and the extra dots up to the highest estimate as <span className="inline-dot range"/> striped dots. Your own chance sits somewhere inside that range.</li>
        </ul>
      </div>
    </div>
  );
}

// ---------- module 3: cancer risk — same-scale side by side ----------
function ModuleCancerRisk({ content }) {
  const c = content.cancerRisk;
  const [showMolecular, setShowMolecular] = useState(false);
  return (
    <div>
      <div className="module-kicker">Module 3 of 8 · Your chance of cancer</div>
      <h2>{c.heading}</h2>
      <p className="lede">{c.intro}</p>

      <h3 id="baseline">Starting point: an indeterminate nodule</h3>
      <p>Out of 100 people with an indeterminate thyroid nodule like yours, about <strong>12 to 34 out of 100</strong> will have cancer. The other <strong>66 to 88 out of 100</strong> will not have cancer.<Citations nums={c.baseline.citations} /></p>
      <IconArray lower={c.baseline.lower} upper={c.baseline.upper}
        label="People with cancer (darker dots + striped range)"
        affectedLabel="Have cancer" unaffectedLabel="Do not have cancer"/>

      <div className="card">
        <h3 style={{marginTop:0}} id="molecular">If you had molecular (genetic) testing</h3>
        <p>{c.molecular.intro}</p>
        <button className="btn" onClick={() => setShowMolecular(v => !v)} aria-expanded={showMolecular} aria-controls="molecular-panel">
          {showMolecular ? 'Hide molecular test details' : 'Show molecular test details'}
        </button>
        <div id="molecular-panel" role="region" aria-label="Molecular test details"
             aria-live="polite" hidden={!showMolecular}>
          {showMolecular && (
            <div style={{marginTop: 18}}>
              <p className="subtle">The three pictures below are drawn at the same scale, so you can see the difference side by side.</p>
              <div className="three-up">
                <div>
                  <h4>Before testing</h4>
                  <IconArray lower={c.baseline.lower} upper={c.baseline.upper}
                    label="Baseline: indeterminate nodule"
                    affectedLabel="Have cancer" unaffectedLabel="Do not have cancer" size="sm"/>
                </div>
                <div>
                  <h4>If test is <span className="neg">negative</span></h4>
                  <IconArray lower={c.molecular.negative.lower} upper={c.molecular.negative.upper}
                    label="After a negative molecular test"
                    affectedLabel="Have cancer" unaffectedLabel="Do not have cancer" size="sm"/>
                  <p className="cell-small">{c.molecular.negative.statement}<Citations nums={c.molecular.negative.citations} /></p>
                </div>
                <div>
                  <h4>If test is <span className="pos">positive</span></h4>
                  <IconArray lower={c.molecular.positive.lower} upper={c.molecular.positive.upper}
                    label="After a positive molecular test"
                    affectedLabel="Have cancer" unaffectedLabel="Do not have cancer" size="sm"/>
                  <p className="cell-small">{c.molecular.positive.statement}<Citations nums={c.molecular.positive.citations} /></p>
                </div>
              </div>
              <div className="callout">
                <strong>Side-by-side:</strong> before molecular testing, 12–34 of every 100 people have cancer. A negative test lowers that to 1–4 out of 100; a positive test raises it to 47–65 out of 100. A molecular test narrows the range — it does not give certainty.
              </div>
            </div>
          )}
        </div>
      </div>

      <p style={{marginTop: 22}}>{c.closing}</p>
    </div>
  );
}

// ---------- module 4: options overview with anatomy + framing ----------
function ThyroidAnatomy({ highlight }) {
  // Simple schematic — not anatomically precise, labelled as such.
  return (
    <svg className="anatomy" viewBox="0 0 220 180" role="img" aria-label="Schematic of the thyroid gland showing left and right lobes connected by an isthmus below the larynx. Not to scale.">
      <defs>
        <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#d5b8a6"/><stop offset="1" stopColor="#b89580"/>
        </linearGradient>
      </defs>
      {/* neck */}
      <rect x="70" y="10" width="80" height="40" fill="#f0e4d7" stroke="#d8c8b5" rx="6"/>
      <text x="110" y="33" textAnchor="middle" fontSize="10" fill="#7a6a57">larynx</text>
      {/* left lobe */}
      <path d="M 75 55 Q 55 80 70 130 Q 90 150 108 130 L 108 60 Z"
        fill={highlight==='left' || highlight==='both' ? '#b45a3c' : 'url(#g1)'}
        stroke="#8c6b58" strokeWidth="1.2"/>
      {/* right lobe */}
      <path d="M 145 55 Q 165 80 150 130 Q 130 150 112 130 L 112 60 Z"
        fill={highlight==='right' || highlight==='both' ? '#b45a3c' : 'url(#g1)'}
        stroke="#8c6b58" strokeWidth="1.2"/>
      {/* isthmus */}
      <rect x="100" y="78" width="20" height="14" fill={highlight==='both' ? '#b45a3c' : 'url(#g1)'} stroke="#8c6b58"/>
      {/* nodule */}
      {highlight !== 'none' && highlight !== 'both-removed' && (
        <circle cx="90" cy="95" r="6" fill="#7a2a14" stroke="#4a1a0a"/>
      )}
      <text x="110" y="172" textAnchor="middle" fontSize="10" fill="#7a6a57">
        Thyroid (schematic, not to scale)
      </text>
    </svg>
  );
}

function ModuleOptionsOverview({ content, onGo }) {
  const opts = content.options;
  return (
    <div>
      <div className="module-kicker">Module 4 of 8 · The four options</div>
      <h2>What are my options?</h2>
      <p className="lede">{content.optionsIntro}</p>

      <div className="framing-grid">
        <div className="framing-card">
          <ThyroidAnatomy highlight="both"/>
          <div>
            <h4>Where the nodule is</h4>
            <p>A thyroid nodule is a lump inside one of the two lobes of the thyroid gland. The options below differ in whether — and how much of — the thyroid is removed or treated.</p>
          </div>
        </div>
        <div className="framing-card framing-timing">
          <div className="timing-icon" aria-hidden="true">⏱</div>
          <div>
            <h4>This is not a same-day decision</h4>
            <p>For most people, there is time to think, ask questions, and come back with a family member. Your care team will tell you if anything about your situation changes that.</p>
          </div>
        </div>
      </div>

      <p className="subtle">The options are listed from least invasive to most invasive. This order is for readability — it is not a ranking of “best” to “worst.”</p>
      <div className="option-grid">
        {opts.map((o, i) => (
          <button key={o.id} className="option-card" onClick={() => onGo(o.id)}>
            <div className="op-top">
              <ThyroidAnatomy highlight={o.anatomyHighlight || 'none'} />
              <div className="op-ord">Option {i+1}</div>
            </div>
            <div>
              <div className="op-name">{o.name}</div>
              {o.alias && o.alias !== 'RFA' && <div className="op-alias">{o.alias}</div>}
            </div>
            <div className="op-desc">{o.shortDescription}</div>
            <div className="op-link">See this option in detail →</div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ---------- module 5: matrix with filtered-first + bar switcher + discuss flags ----------
const BAR_MEASURES = [
  { id: 'hormone', label: 'Chance of needing lifelong thyroid hormone',
    rows: [
      { label: 'Active surveillance', lower: 0, upper: 0 },
      { label: 'Thermal ablation', lower: 1, upper: 4 },
      { label: 'Diagnostic lobectomy', lower: 26, upper: 47 },
      { label: 'Total thyroidectomy', lower: 100, upper: 100 }
    ],
    footnote: 'Sources: ablation 1–4/100; lobectomy 26–47/100; total thyroidectomy requires lifelong replacement.' },
  { id: 'regrowth', label: 'Chance the nodule grows back or needs more treatment',
    rows: [
      { label: 'Active surveillance', lower: 10, upper: 20 },
      { label: 'Thermal ablation', lower: 10, upper: 15 },
      { label: 'Diagnostic lobectomy', lower: 1, upper: 5 },
      { label: 'Total thyroidectomy', lower: 0, upper: 5 }
    ],
    footnote: 'Surveillance: may need later surgery over many years. Ablation: retreatment within 3–5 years. Surgery: cancer recurrence over 10 years.' },
  { id: 'missed', label: 'Chance a cancer could be missed or delayed (approximate)',
    rows: [
      { label: 'Active surveillance', lower: 4, upper: 4, note: 'if molecular test negative' },
      { label: 'Thermal ablation', lower: 4, upper: 4, note: 'similar to surveillance if test negative' },
      { label: 'Diagnostic lobectomy', lower: 0, upper: 0, note: 'tissue is examined' },
      { label: 'Total thyroidectomy', lower: 0, upper: 0, note: 'tissue is examined' }
    ],
    footnote: 'For surveillance and ablation, the risk of missing a cancer depends heavily on biopsy and molecular-test results. Surgery gives a definite diagnosis.' }
];

function ModuleComparison({ content, discussFlags, setDiscussFlag }) {
  const { rows, cells } = content.comparison;
  const opts = content.options;
  const [mode, setMode] = useState('one'); // 'one' | 'all'
  const [activeRow, setActiveRow] = useState(rows[0].id);
  const [expandedOpt, setExpandedOpt] = useState(null);
  const [barMeasure, setBarMeasure] = useState(BAR_MEASURES[0].id);
  const measure = BAR_MEASURES.find(m => m.id === barMeasure);

  const visibleRows = mode === 'all' ? rows : rows.filter(r => r.id === activeRow);
  const rowIdx = rows.findIndex(r => r.id === activeRow);

  if (expandedOpt) return <OptionDetail content={content} optId={expandedOpt}
    onClose={() => setExpandedOpt(null)}
    flagged={!!discussFlags[expandedOpt]}
    onToggleFlag={() => setDiscussFlag(expandedOpt, !discussFlags[expandedOpt])} />;

  return (
    <div>
      <div className="module-kicker">Module 5 of 8 · Side-by-side comparison</div>
      <h2>Compare the four options</h2>
      <p className="lede">The columns show the four options. The rows show questions patients often ask. You can focus on one question at a time, or show the full table.</p>

      <div className="matrix-controls">
        <div className="seg" role="tablist" aria-label="View mode">
          <button role="tab" aria-selected={mode==='one'} className={mode==='one' ? 'on' : ''} onClick={() => setMode('one')}>One question at a time</button>
          <button role="tab" aria-selected={mode==='all'} className={mode==='all' ? 'on' : ''} onClick={() => setMode('all')}>Show all {rows.length}</button>
        </div>
        {mode === 'one' && (
          <>
            <label className="focus-select">
              <span>Question:</span>
              <select value={activeRow} onChange={e => setActiveRow(e.target.value)}>
                {rows.map(r => <option key={r.id} value={r.id}>{r.label}</option>)}
              </select>
            </label>
            <div className="row-nav">
              <button className="btn" onClick={() => setActiveRow(rows[Math.max(0,rowIdx-1)].id)} disabled={rowIdx===0}>← Prev question</button>
              <span className="row-nav-count">{rowIdx+1} of {rows.length}</span>
              <button className="btn" onClick={() => setActiveRow(rows[Math.min(rows.length-1,rowIdx+1)].id)} disabled={rowIdx===rows.length-1}>Next question →</button>
            </div>
          </>
        )}
      </div>

      <div className="matrix-wrapper">
        <table className="matrix">
          <thead>
            <tr>
              <th className="row-label" scope="col">Question</th>
              {opts.map(o => (
                <th key={o.id} scope="col">
                  <button className="col-header" onClick={() => setExpandedOpt(o.id)}>
                    <span className="op-name">{o.name}</span>
                    {o.alias && o.alias !== 'RFA' && <span className="op-alias">{o.alias}</span>}
                    {discussFlags[o.id] && <span className="flag-pill" title="Flagged to discuss">★ discuss</span>}
                    <span className="col-header-cta">Open detail →</span>
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visibleRows.map(r => (
              <tr key={r.id}>
                <th className="row-label" scope="row">{r.label}</th>
                {opts.map(o => {
                  const cell = cells[o.id][r.id];
                  const paragraphs = (cell.text || '').split(/\n\s*\n|(?<=\.) (?=[A-Z][a-z]{0,20} ?[a-z])/).slice(0,3);
                  return (
                    <td key={o.id}>
                      <div className="cell-inline">
                        <div className="cell-text">
                          {cell.text}
                          {cell.citations && <Citations nums={cell.citations} />}
                          {cell.frequency?.citations && <Citations nums={cell.frequency.citations} />}
                        </div>
                        {cell.frequency && cell.frequency.kind !== 'none' && cell.frequency.lower !== undefined && (cell.frequency.upper > 0 || cell.frequency.lower > 0) && (
                          <div className="inline-freq">
                            <MiniArray lower={cell.frequency.lower} upper={cell.frequency.upper} />
                            <span className="freq-hl">
                              {cell.frequency.lower === cell.frequency.upper ? cell.frequency.lower : `${cell.frequency.lower}–${cell.frequency.upper}`}
                              <span className="freq-tail"> / 100</span>
                            </span>
                          </div>
                        )}
                        {cell.uncertainty && <UncertaintyCallout>{cell.uncertainty}</UncertaintyCallout>}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3 style={{marginTop:44}}>Compare a number across all four options</h3>
      <div className="measure-switcher" role="tablist" aria-label="Measure">
        {BAR_MEASURES.map(m => (
          <button key={m.id} role="tab" aria-selected={barMeasure===m.id}
            className={barMeasure===m.id ? 'on' : ''} onClick={() => setBarMeasure(m.id)}>
            {m.label}
          </button>
        ))}
      </div>
      <BarGraph rows={measure.rows} />
      <p className="subtle small">{measure.footnote}</p>

      <div className="callout" style={{marginTop:32}}>
        <strong>Lean toward one of these?</strong> Click a column header to open that option in detail — and use <em>“Flag for discussion”</em> to add it to your printed summary for your clinic visit.
      </div>
    </div>
  );
}

function OptionDetail({ content, optId, onClose, flagged, onToggleFlag }) {
  const opt = content.options.find(o => o.id === optId);
  const rows = content.comparison.rows;
  const cells = content.comparison.cells[optId];
  return (
    <div>
      <div className="module-kicker">Module 5 · Option detail</div>
      <div className="option-detail-header">
        <button className="btn" onClick={onClose}>← Back to comparison</button>
        <button className={`btn flag-btn ${flagged ? 'flagged' : ''}`} onClick={onToggleFlag}
                aria-pressed={flagged}>
          {flagged ? '★ Flagged to discuss' : '☆ Flag for discussion'}
        </button>
      </div>
      <h2>{opt.name}</h2>
      <p className="lede">{opt.shortDescription}</p>
      <div className="option-detail">
        {rows.map(r => {
          const cell = cells[r.id];
          return (
            <div className="row" key={r.id}>
              <div className="row-label-up">{r.label}</div>
              <div className="row-text">{cell.text}{cell.citations && <Citations nums={cell.citations} />}{cell.frequency?.citations && <Citations nums={cell.frequency.citations} />}</div>
              {cell.frequency && cell.frequency.kind !== 'none' && cell.frequency.lower !== undefined && (cell.frequency.upper > 0 || cell.frequency.lower > 0) && (
                <IconArray lower={cell.frequency.lower} upper={cell.frequency.upper}
                  label={r.label}
                  affectedLabel="People in this group" unaffectedLabel="Other people" size="sm"/>
              )}
              {cell.uncertainty && <UncertaintyCallout>{cell.uncertainty}</UncertaintyCallout>}
            </div>
          );
        })}
      </div>
      <div className="next-row screen-only">
        <button className="btn" onClick={onClose}>← Back to comparison</button>
        <button className={`btn ${flagged ? 'primary' : ''}`} onClick={onToggleFlag}>
          {flagged ? '★ Flagged for discussion' : '☆ Flag this to discuss with my clinician'}
        </button>
      </div>
    </div>
  );
}

// ---------- module 6: values with progress + skip + revisit prompt ----------
function ModuleValues({ content, valuesState, setValuesState }) {
  const v = content.values;
  const [showSummary, setShowSummary] = useState(false);
  const answered = v.statements.filter((_, i) => valuesState[i] !== undefined && valuesState[i] !== 'skip').length;
  const skipped = v.statements.filter((_, i) => valuesState[i] === 'skip').length;
  return (
    <div>
      <div className="module-kicker">Module 6 of 8 · What matters most to me</div>
      <h2>{v.heading}</h2>
      <p className="lede">{v.intro}</p>

      <div className="values-progress" role="status" aria-live="polite">
        <div className="vp-track"><div className="vp-fill" style={{width: `${(answered/v.statements.length)*100}%`}}/></div>
        <div className="vp-text">{answered} of {v.statements.length} answered{skipped > 0 && ` · ${skipped} skipped`}</div>
      </div>

      {v.statements.map((s, i) => (
        <div className="likert-card" key={i}>
          <div className="likert-top">
            <div className="likert-num">{i+1}</div>
            <div className="likert-statement">{s}</div>
          </div>
          <div className="likert-scale" role="radiogroup" aria-label={s}>
            {v.scale.map((lab, j) => {
              const selected = valuesState[i] === j;
              return (
                <label key={j} className={selected ? 'selected' : ''}>
                  <input type="radio" name={`v-${i}`} checked={selected}
                    onChange={() => setValuesState({ ...valuesState, [i]: j })}/>
                  <span className="bubble" aria-hidden="true"/>
                  <span>{lab}</span>
                </label>
              );
            })}
          </div>
          <button className={`btn ghost skip-btn ${valuesState[i]==='skip' ? 'on' : ''}`}
                  onClick={() => setValuesState({ ...valuesState, [i]: valuesState[i]==='skip' ? undefined : 'skip' })}>
            {valuesState[i]==='skip' ? '↩ Unskip' : 'Skip this one'}
          </button>
        </div>
      ))}

      <p style={{marginTop:22}}>{v.closing}</p>
      <button className="btn" onClick={() => setShowSummary(s => !s)}>
        {showSummary ? 'Hide summary' : 'See my responses in one place'}
      </button>
      {showSummary && (
        <div className="card" style={{marginTop:16}}>
          <h4 style={{marginTop:0}}>Your responses (unweighted)</h4>
          <p className="subtle small">This is a mirror of what you chose — the tool does not score you or recommend an option.</p>
          <ul>{v.statements.map((s, i) => (
            <li key={i}><strong>{s}</strong> — <em>{
              valuesState[i] === 'skip' ? 'Skipped'
              : valuesState[i] !== undefined ? v.scale[valuesState[i]]
              : 'Not yet answered'}</em></li>
          ))}</ul>
        </div>
      )}
    </div>
  );
}

// ---------- module 7: questions with counter + priority ----------
function ModuleQuestions({ content, checkedQs, setCheckedQs, priorityQs, setPriorityQs, customQs, setCustomQs }) {
  const q = content.questions;
  const [draft, setDraft] = useState('');
  const totalChecked = Object.values(checkedQs).filter(Boolean).length + customQs.length;
  const priorityCount = Object.values(priorityQs).filter(Boolean).length;
  const togglePriority = (key) => {
    const currently = !!priorityQs[key];
    if (!currently && priorityCount >= 3) return; // cap at 3
    setPriorityQs({ ...priorityQs, [key]: !currently });
  };
  return (
    <div>
      <div className="module-kicker">Module 7 of 8 · Questions for my clinician</div>
      <h2>{q.heading}</h2>
      <p className="lede">{q.intro}</p>

      <div className="q-counter" role="status" aria-live="polite">
        <div><strong>{totalChecked}</strong> question{totalChecked===1?'':'s'} selected</div>
        <div className="q-counter-sub"><strong>{priorityCount}/3</strong> marked as top priority</div>
      </div>
      <p className="subtle small">Tip: a typical visit has time for 3–5 questions. Mark up to 3 as ★ top priority — they’ll print at the top of your summary.</p>

      {q.sections.map(sec => (
        <div className="q-section" key={sec.id}>
          <h3>{sec.title}</h3>
          {sec.items.map((item, i) => {
            const key = `${sec.id}-${i}`;
            const checked = !!checkedQs[key];
            const priority = !!priorityQs[key];
            return (
              <div key={key} className={`q-item ${checked ? 'checked' : ''}`}>
                <label className="q-item-check">
                  <input type="checkbox" checked={checked}
                         onChange={() => setCheckedQs({ ...checkedQs, [key]: !checked })}/>
                  <span className="q-text">{item}</span>
                </label>
                {checked && (
                  <button className={`priority-star ${priority ? 'on' : ''}`}
                    onClick={() => togglePriority(key)}
                    disabled={!priority && priorityCount >= 3}
                    aria-pressed={priority}
                    title={priority ? 'Top priority' : priorityCount >= 3 ? '3 priorities already chosen' : 'Mark as top priority'}>
                    {priority ? '★' : '☆'}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      ))}

      <h3>Your own questions</h3>
      <div className="custom-q">
        <input type="text" placeholder="Type a question you want to ask…" value={draft}
          maxLength={240}
          onChange={e => setDraft(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && draft.trim()) { setCustomQs([...customQs, draft.trim()]); setDraft(''); }}}/>
        <button className="btn primary" onClick={() => { if (draft.trim()) { setCustomQs([...customQs, draft.trim()]); setDraft(''); }}}>Add</button>
      </div>
      {customQs.length > 0 && (
        <ul className="custom-q-list">
          {customQs.map((qq, i) => (
            <li key={i}>
              <span style={{flex:1}}>{qq}</span>
              <button className="remove" aria-label={`Remove question ${i+1}`} onClick={() => setCustomQs(customQs.filter((_, j) => j !== i))}>×</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ---------- module 8: resources + print ----------
function ModuleResources({ content, onPrint, discussFlags }) {
  const r = content.resources;
  const [name, setName] = useState('');
  useEffect(() => {
    const stored = sessionStorage.getItem('aid-name');
    if (stored) setName(stored);
  }, []);
  useEffect(() => { sessionStorage.setItem('aid-name', name); }, [name]);
  const flaggedNames = Object.entries(discussFlags).filter(([,v])=>v).map(([id])=>{
    const o = content.options.find(x=>x.id===id); return o ? o.name : null;
  }).filter(Boolean);
  return (
    <div>
      <div className="module-kicker">Module 8 of 8 · Learn more & take away</div>
      <h2>{r.heading}</h2>
      <p>{r.intro}</p>
      <ul>
        {r.links.map(l => (
          <li key={l.url} style={{marginBottom:12}}>
            <a href={l.url} target="_blank" rel="noopener noreferrer"><strong>{l.label}</strong></a>
            <div className="subtle">{l.description}</div>
          </li>
        ))}
      </ul>
      <h3>{r.finalNotesHeading}</h3>
      <ul>{r.finalNotes.map((n, i) => <li key={i}>{n}</li>)}</ul>

      <div className="card" style={{marginTop:24}}>
        <h3 style={{marginTop:0}}>Take a summary to your appointment</h3>
        <p>This combines your values responses, your top-priority and checked questions, any options you flagged to discuss, and your own questions — on a single printable page.</p>
        {flaggedNames.length > 0 && (
          <p className="subtle small">Options flagged to discuss: <strong>{flaggedNames.join(', ')}</strong>.</p>
        )}
        <label className="name-field">
          Your first name (optional, for the printed page):
          <input type="text" value={name} onChange={e => setName(e.target.value)}/>
        </label>
        <button className="btn primary" onClick={onPrint}>Print or save my summary (PDF)</button>
      </div>

      <h3 style={{marginTop:40}}>References</h3>
      <ol className="ref-list" id="refs">
        {content.references.map((ref, i) => <li key={i} id={`ref-${i+1}`}>{ref}</li>)}
      </ol>
    </div>
  );
}

// ---------- printable summary ----------
function PrintableSummary({ content, valuesState, checkedQs, priorityQs, customQs, discussFlags }) {
  const name = typeof window !== 'undefined' ? sessionStorage.getItem('aid-name') || '' : '';
  const today = new Date().toLocaleDateString(undefined, { year:'numeric', month:'long', day:'numeric' });
  const prioritized = [];
  const checkedList = [];
  content.questions.sections.forEach(sec => {
    sec.items.forEach((t, i) => {
      const key = `${sec.id}-${i}`;
      if (checkedQs[key]) {
        (priorityQs[key] ? prioritized : checkedList).push({ section: sec.title, text: t });
      }
    });
  });
  const flagged = Object.entries(discussFlags).filter(([,v])=>v).map(([id])=>{
    return content.options.find(o=>o.id===id);
  }).filter(Boolean);
  return (
    <div className="print-only" aria-hidden="true">
      <p className="ps-brand">WashU Medicine</p>
      <h1 className="ps-h1">Thyroid Nodule Decision Tool — My Summary</h1>
      <p className="ps-meta">{name && <><strong>Name:</strong> {name} · </>}<strong>Date:</strong> {today}</p>

      {flagged.length > 0 && (<>
        <h2 className="ps-h2">Options I want to discuss</h2>
        <ul className="ps-list">{flagged.map(o => <li key={o.id}><strong>{o.name}</strong> — {o.shortDescription}</li>)}</ul>
      </>)}

      {prioritized.length > 0 && (<>
        <h2 className="ps-h2">★ My top-priority questions</h2>
        <ul className="ps-list">{prioritized.map((x,i)=><li key={i}>{x.text} <em className="ps-sec">({x.section})</em></li>)}</ul>
      </>)}

      {checkedList.length > 0 && (<>
        <h2 className="ps-h2">Other questions I selected</h2>
        <ul className="ps-list">{checkedList.map((x,i)=><li key={i}>{x.text} <em className="ps-sec">({x.section})</em></li>)}</ul>
      </>)}

      {customQs.length > 0 && (<>
        <h2 className="ps-h2">My own questions</h2>
        <ul className="ps-list">{customQs.map((q,i)=><li key={i}>{q}</li>)}</ul>
      </>)}

      <h2 className="ps-h2">What matters most to me</h2>
      <table className="ps-table">
        <tbody>
          {content.values.statements.map((s, i) => (
            <tr key={i}>
              <td>{s}</td>
              <td className="ps-answer">
                {valuesState[i] === 'skip' ? 'Skipped'
                 : valuesState[i] !== undefined ? content.values.scale[valuesState[i]]
                 : '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <hr className="ps-hr"/>
      <p className="ps-footer">
        <span className="ps-brand">WashU Medicine</span><br/>
        AID-IN alpha prototype — not for clinical use outside of the study. This summary is a reflection of the patient’s own responses. It is not a treatment recommendation.<br/>
        ©2026 Washington University School of Medicine
      </p>
    </div>
  );
}

// ---------- tweaks ----------
function TweaksPanel({ tweaks, setTweak, onClose }) {
  return (
    <div className="tweaks screen-only" role="region" aria-label="Tweaks">
      <div className="tweaks-top">
        <h5>Tweaks</h5>
        <button className="btn ghost small" onClick={onClose}>hide</button>
      </div>
      <div className="row"><span>Accent color</span><input type="color" value={tweaks.accent} onChange={e => setTweak('accent', e.target.value)}/></div>
      <div className="row"><span>Outcome color</span><input type="color" value={tweaks.affected} onChange={e => setTweak('affected', e.target.value)}/></div>
      <div className="row"><span>Base font size</span>
        <select value={tweaks.fontSize} onChange={e => setTweak('fontSize', +e.target.value)}>
          <option value={16}>16 px</option><option value={17}>17 px</option>
          <option value={18}>18 px</option><option value={20}>20 px (larger)</option>
        </select>
      </div>
      <div className="row"><span>Column order (module 5)</span>
        <select value={tweaks.columnOrder} onChange={e => setTweak('columnOrder', e.target.value)}>
          <option value="invasive-asc">Least → most invasive</option>
          <option value="invasive-desc">Most → least invasive</option>
        </select>
      </div>
    </div>
  );
}

// ---------- app shell ----------
const MODULES = [
  { id:'welcome', label:'Welcome' },
  { id:'howto', label:'How to read the numbers' },
  { id:'risk', label:'My chance of cancer' },
  { id:'options', label:'The four options' },
  { id:'compare', label:'Side-by-side comparison' },
  { id:'values', label:'What matters most to me' },
  { id:'questions', label:'Questions for my clinician' },
  { id:'resources', label:'Learn more & summary' }
];

function App({ content }) {
  const [current, setCurrent] = useState(() => sessionStorage.getItem('aid-current') || 'welcome');
  const [valuesState, setValuesState] = useState(() => JSON.parse(sessionStorage.getItem('aid-values') || '{}'));
  const [checkedQs, setCheckedQs] = useState(() => JSON.parse(sessionStorage.getItem('aid-checked') || '{}'));
  const [priorityQs, setPriorityQs] = useState(() => JSON.parse(sessionStorage.getItem('aid-priority') || '{}'));
  const [customQs, setCustomQs] = useState(() => JSON.parse(sessionStorage.getItem('aid-custom') || '[]'));
  const [discussFlags, setDiscussFlags] = useState(() => JSON.parse(sessionStorage.getItem('aid-discuss') || '{}'));
  const [visited, setVisited] = useState(() => JSON.parse(sessionStorage.getItem('aid-visited') || '{"welcome":true}'));
  const [tweaksVisible, setTweaksVisible] = useState(false);
  const [valuesPrompt, setValuesPrompt] = useState(false);

  const tweaksDefault = /*EDITMODE-BEGIN*/{
    "accent": "#BA0C2F",
    "affected": "#BA0C2F",
    "fontSize": 17,
    "columnOrder": "invasive-asc"
  }/*EDITMODE-END*/;
  const [tweaks, setTweaks] = useState(tweaksDefault);
  const setTweak = (k, v) => {
    setTweaks(t => ({ ...t, [k]: v }));
    window.parent.postMessage({ type:'__edit_mode_set_keys', edits: { [k]: v } }, '*');
  };
  const setDiscussFlag = (id, v) => {
    setDiscussFlags(d => { const n = { ...d, [id]: v }; sessionStorage.setItem('aid-discuss', JSON.stringify(n)); return n; });
  };

  useEffect(() => {
    document.documentElement.style.setProperty('--accent', tweaks.accent);
    document.documentElement.style.setProperty('--accent-ink', tweaks.accent);
    document.documentElement.style.setProperty('--affected', tweaks.affected);
    document.body.style.fontSize = tweaks.fontSize + 'px';
  }, [tweaks]);

  useEffect(() => {
    const onMsg = (e) => {
      const d = e.data || {};
      if (d.type === '__activate_edit_mode') setTweaksVisible(true);
      if (d.type === '__deactivate_edit_mode') setTweaksVisible(false);
    };
    window.addEventListener('message', onMsg);
    window.parent.postMessage({ type:'__edit_mode_available' }, '*');
    return () => window.removeEventListener('message', onMsg);
  }, []);

  useEffect(() => { sessionStorage.setItem('aid-current', current); }, [current]);
  useEffect(() => { sessionStorage.setItem('aid-values', JSON.stringify(valuesState)); }, [valuesState]);
  useEffect(() => { sessionStorage.setItem('aid-checked', JSON.stringify(checkedQs)); }, [checkedQs]);
  useEffect(() => { sessionStorage.setItem('aid-priority', JSON.stringify(priorityQs)); }, [priorityQs]);
  useEffect(() => { sessionStorage.setItem('aid-custom', JSON.stringify(customQs)); }, [customQs]);
  useEffect(() => {
    const nv = { ...visited, [current]: true };
    if (JSON.stringify(nv) !== JSON.stringify(visited)) {
      setVisited(nv);
      sessionStorage.setItem('aid-visited', JSON.stringify(nv));
    }
    // scroll main to top on module change
    const main = document.querySelector('main.main');
    if (main) main.scrollTo?.({ top: 0 });
    window.scrollTo?.({ top: 0 });
  }, [current]);

  useEffect(() => {
    const handler = (e) => {
      setCurrent('resources');
      setTimeout(() => {
        const el = document.getElementById(`ref-${e.detail}`);
        if (el) {
          el.scrollIntoView({ block:'center' });
          el.classList.add('ref-flash');
          setTimeout(() => el.classList.remove('ref-flash'), 1800);
        }
      }, 80);
    };
    window.addEventListener('aid-goto-ref', handler);
    return () => window.removeEventListener('aid-goto-ref', handler);
  }, []);

  const idx = MODULES.findIndex(m => m.id === current);
  const progress = (Object.keys(visited).length / MODULES.length) * 100;

  const contentForRender = useMemo(() => {
    if (tweaks.columnOrder === 'invasive-desc')
      return { ...content, options: [...content.options].reverse() };
    return content;
  }, [content, tweaks.columnOrder]);

  const goNext = () => {
    // after module 5 (compare), soft-prompt revisit values
    if (current === 'compare' && Object.keys(valuesState).length > 0 && !valuesPrompt) {
      setValuesPrompt(true);
      return;
    }
    setCurrent(MODULES[Math.min(idx+1, MODULES.length-1)].id);
  };
  const goPrev = () => setCurrent(MODULES[Math.max(idx-1, 0)].id);
  const doPrint = () => window.print();

  let body = null;
  if (current === 'welcome') body = <ModuleWelcome content={content} />;
  else if (current === 'howto') body = <ModuleHowToRead content={content} />;
  else if (current === 'risk') body = <ModuleCancerRisk content={content} />;
  else if (current === 'options') body = <ModuleOptionsOverview content={content} onGo={() => setCurrent('compare')} />;
  else if (current === 'compare') body = <ModuleComparison content={contentForRender} discussFlags={discussFlags} setDiscussFlag={setDiscussFlag} />;
  else if (current === 'values') body = <ModuleValues content={content} valuesState={valuesState} setValuesState={setValuesState} />;
  else if (current === 'questions') body = <ModuleQuestions content={content} checkedQs={checkedQs} setCheckedQs={setCheckedQs} priorityQs={priorityQs} setPriorityQs={setPriorityQs} customQs={customQs} setCustomQs={setCustomQs} />;
  else if (current === 'resources') body = <ModuleResources content={content} onPrint={doPrint} discussFlags={discussFlags} />;

  return (
    <div className="app">
      <aside className="sidebar screen-only" aria-label="Sections">
        <div className="brand-bar" aria-hidden="true"/>
        <div className="brand">WashU Medicine</div>
        <span className="tag">AID-IN alpha · v3</span>
        <h1>{content.title}</h1>
        <p className="subtitle">{content.subtitle}</p>
        <div className="progress" aria-label={`Progress: ${Math.round(progress)}%`}><div style={{width:`${progress}%`}}/></div>
        <div className="progress-label">{Object.keys(visited).length} of {MODULES.length} sections visited</div>
        <nav>
          <ul className="nav">
            {MODULES.map((m, i) => (
              <li key={m.id}>
                <button className={`${current===m.id?'active':''} ${visited[m.id]?'complete':''}`}
                        onClick={() => setCurrent(m.id)}>
                  <span className="nav-num">{String(i+1).padStart(2,'0')}</span>
                  <span style={{flex:1}}>{m.label}</span>
                  <span className="nav-check" aria-hidden="true">✓</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
        <div className="sidebar-foot">
          <strong>Research prototype.</strong> Answers stay on this device. Not for clinical use outside of the AID-IN study.
          <div style={{marginTop:10}}>
            <span className="foot-brand">WashU Medicine</span> · ©2026 Washington University School of Medicine
          </div>
        </div>
      </aside>

      <main className="main" data-screen-label={`0${idx+1} ${MODULES[idx].label}`}>
        {body}

        {valuesPrompt && (
          <div className="values-prompt" role="alertdialog" aria-modal="true" aria-label="Revisit your values">
            <div className="values-prompt-card">
              <h3>Want to revisit what matters most to you?</h3>
              <p>Many people update their answers after seeing the comparison. It’s optional.</p>
              <div className="vp-actions">
                <button className="btn" onClick={() => { setValuesPrompt(false); setCurrent('values'); }}>Yes, go back to values</button>
                <button className="btn primary" onClick={() => { setValuesPrompt(false); setCurrent('questions'); }}>No thanks, continue</button>
              </div>
            </div>
          </div>
        )}

        <div className="next-row screen-only">
          <button className="btn" onClick={goPrev} disabled={idx===0}>← Back</button>
          <div className="next-step">Section {idx+1} of {MODULES.length}</div>
          <button className="btn primary" onClick={goNext} disabled={idx===MODULES.length-1}>
            {idx < MODULES.length-1 ? <>Next: {MODULES[idx+1].label} →</> : 'End'}
          </button>
        </div>
      </main>

      <PrintableSummary content={content} valuesState={valuesState} checkedQs={checkedQs} priorityQs={priorityQs} customQs={customQs} discussFlags={discussFlags} />
      {tweaksVisible && <TweaksPanel tweaks={tweaks} setTweak={setTweak} onClose={() => setTweaksVisible(false)}/>}
    </div>
  );
}

window.App = App;

function bootAidApp() {
  const el = document.getElementById("root");
  if (!el) return;
  const root = ReactDOM.createRoot(el);
  root.render(<App content={window.__AID_CONTENT__} />);
}
if (window.__AID_READY__) bootAidApp();
else window.addEventListener("aid-content-ready", bootAidApp);
