import React, { useState } from 'react';
import { Icons } from '../components/Icons';
import SourceListsBar from '../components/SourceListsBar';

export default function NewScreening({
  sourceLists,
  refreshingLists,
  onRefreshLists,
  onCaseCreated
}) {
  const todayStr = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    subjectName: 'Jerin Davis',
    subjectType: 'Individual', // Individual or Entity
    clientRef: 'CL-2026-089',
    issDate: todayStr,
    hasExpiry: true,
    expDate: '2027-10-20',
    signedDate: todayStr,
    checkDate: todayStr
  });

  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [caseResult, setCaseResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Live formatted filenames
  const cleanName = (formData.subjectName || 'Subject_Name').trim().replace(/[^\w\s-]/g, '').replace(/\s+/g, '_');
  const expVal = formData.hasExpiry && formData.expDate ? formData.expDate : 'NotSet';
  const previewFilenames = {
    adverseMedia: `COMAdverseMedia_${cleanName}_Iss_${formData.issDate || 'NotSet'}_Exp_${expVal}_Signed_${formData.signedDate || 'NotSet'}.pdf`,
    ofac: `COMOFAC_${cleanName}_Iss_${formData.issDate || 'NotSet'}_Exp_${expVal}_Signed_${formData.signedDate || 'NotSet'}.pdf`,
    un: `COMUN_${cleanName}_Iss_${formData.issDate || 'NotSet'}_Exp_${expVal}_Signed_${formData.signedDate || 'NotSet'}.pdf`,
    uae: `COMUAE_${cleanName}_Iss_${formData.issDate || 'NotSet'}_Exp_${expVal}_Signed_${formData.signedDate || 'NotSet'}.pdf`
  };

  const handleStartScreening = async (e) => {
    e.preventDefault();
    if (!formData.subjectName.trim()) {
      setErrorMsg('Please enter an individual or entity name.');
      return;
    }

    setErrorMsg('');
    setLoading(true);
    setStep(1);

    const timer = setInterval(() => {
      setStep(prev => (prev < 4 ? prev + 1 : prev));
    }, 1200);

    try {
      const payload = {
        subjectName: formData.subjectName.trim(),
        subjectType: formData.subjectType,
        clientRef: formData.clientRef,
        issDate: formData.issDate,
        expDate: formData.hasExpiry ? formData.expDate : 'NotSet',
        signedDate: formData.signedDate,
        checkDate: formData.checkDate
      };

      const res = await fetch('/api/screenings/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Screening failed');

      setCaseResult(result.caseData);
      if (onCaseCreated) onCaseCreated(result.caseData);
    } catch (err) {
      setErrorMsg(err.message || 'Screening execution failed.');
    } finally {
      clearInterval(timer);
      setLoading(false);
      setStep(0);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Official Lists Top Bar */}
      <SourceListsBar
        sourceLists={sourceLists}
        refreshing={refreshingLists}
        onRefresh={onRefreshLists}
      />

      {/* Error Banner */}
      {errorMsg && (
        <div style={{
          padding: '14px 18px',
          backgroundColor: '#fff1f2',
          border: '1px solid #fecdd3',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          color: '#9f1239',
          fontSize: '13.5px',
          fontWeight: 600
        }}>
          <Icons.AlertTriangle />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Main Screening Registration Form */}
      <section className="white-panel" style={{ padding: '28px' }}>
        <div style={{ marginBottom: '22px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>
            1. Register Client or Shareholder for Screening
          </h2>
          <p style={{ fontSize: '13px', color: '#64748b' }}>
            Enter subject details and compliance dates. When you click &quot;Start Screening&quot;, the system checks list versions, runs all 4 source searches, and saves 4 evidence PDFs with strict compliance filenames.
          </p>
        </div>

        <form onSubmit={handleStartScreening}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '20px' }}>
            
            {/* Subject Name */}
            <div style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Subject Name (Individual or Entity) *</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  className="form-input"
                  value={formData.subjectName}
                  onChange={(e) => setFormData({ ...formData, subjectName: e.target.value })}
                  placeholder="e.g. Jerin Davis or Acme General Trading LLC"
                  required
                  style={{ paddingLeft: '38px', fontSize: '15px', fontWeight: 600, color: '#0f172a' }}
                />
                <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }}>
                  <Icons.Search />
                </div>
              </div>
            </div>

            {/* Subject Type */}
            <div>
              <label className="form-label">Subject Type *</label>
              <select
                className="form-select"
                value={formData.subjectType}
                onChange={(e) => setFormData({ ...formData, subjectType: e.target.value })}
              >
                <option value="Individual">Individual (Person / Shareholder)</option>
                <option value="Entity">Entity (Corporate / Company)</option>
              </select>
            </div>

            {/* Client Reference */}
            <div>
              <label className="form-label">Client / Case Reference</label>
              <input
                type="text"
                className="form-input"
                value={formData.clientRef}
                onChange={(e) => setFormData({ ...formData, clientRef: e.target.value })}
                placeholder="e.g. CL-2026-089"
              />
            </div>

            {/* Issue Date */}
            <div>
              <label className="form-label">Issue Date (Iss) *</label>
              <input
                type="date"
                className="form-input"
                value={formData.issDate}
                onChange={(e) => setFormData({ ...formData, issDate: e.target.value })}
                required
              />
            </div>

            {/* Expiry Date */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label className="form-label" style={{ margin: 0 }}>Expiry Date (Exp)</label>
                <label style={{ fontSize: '11px', color: '#475569', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={formData.hasExpiry}
                    onChange={(e) => setFormData({ ...formData, hasExpiry: e.target.checked })}
                  />
                  <span>Has Expiry</span>
                </label>
              </div>
              <input
                type="date"
                className="form-input"
                value={formData.expDate}
                onChange={(e) => setFormData({ ...formData, expDate: e.target.value })}
                disabled={!formData.hasExpiry}
                style={{ opacity: formData.hasExpiry ? 1 : 0.4 }}
              />
            </div>

            {/* Signed Date */}
            <div>
              <label className="form-label">Signed Date *</label>
              <input
                type="date"
                className="form-input"
                value={formData.signedDate}
                onChange={(e) => setFormData({ ...formData, signedDate: e.target.value })}
                required
              />
            </div>

            {/* Check Date */}
            <div>
              <label className="form-label">Source Check Date *</label>
              <input
                type="date"
                className="form-input"
                value={formData.checkDate}
                onChange={(e) => setFormData({ ...formData, checkDate: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Standardized Filenames Preview */}
          <div style={{
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            padding: '16px 20px',
            marginBottom: '22px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#1d4ed8' }}>
                Standardized Evidence Filenames Preview
              </span>
              <span style={{ fontSize: '11px', color: '#64748b' }}>Generated on screening completion</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '8px', fontFamily: 'var(--font-mono)', fontSize: '11.5px', color: '#0f172a' }}>
              <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', padding: '7px 10px', borderRadius: '6px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                <span style={{ color: '#0284c7', fontWeight: 600 }}>1. AdverseMedia: </span>{previewFilenames.adverseMedia}
              </div>
              <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', padding: '7px 10px', borderRadius: '6px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                <span style={{ color: '#059669', fontWeight: 600 }}>2. OFAC: </span>{previewFilenames.ofac}
              </div>
              <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', padding: '7px 10px', borderRadius: '6px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                <span style={{ color: '#d97706', fontWeight: 600 }}>3. UN: </span>{previewFilenames.un}
              </div>
              <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', padding: '7px 10px', borderRadius: '6px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                <span style={{ color: '#dc2626', fontWeight: 600 }}>4. UAE: </span>{previewFilenames.uae}
              </div>
            </div>
          </div>

          {/* Stepper & Action Button */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              {loading ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div className="animate-spin" style={{ color: '#1d4ed8' }}><Icons.Refresh /></div>
                  <div style={{ fontSize: '13.5px', color: '#1e293b', fontWeight: 600 }}>
                    {step === 1 && 'Checking official list versions & verifying freshness...'}
                    {step === 2 && 'Executing Google adverse media & risk queries...'}
                    {step === 3 && 'Automating OFAC Sanctions Search form submission...'}
                    {step === 4 && 'Scanning UN & UAE lists and generating 4 PDFs...'}
                  </div>
                </div>
              ) : (
                <span style={{ fontSize: '12.5px', color: '#64748b' }}>
                  Ready to screen subject: <strong style={{ color: '#0f172a' }}>{formData.subjectName}</strong>
                </span>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{ padding: '12px 28px', fontSize: '14.5px' }}
            >
              {loading ? (
                <>
                  <Icons.Refresh spin={true} />
                  <span>Screening in progress...</span>
                </>
              ) : (
                <>
                  <Icons.Shield />
                  <span>Start Screening (Generate 4 PDFs)</span>
                </>
              )}
            </button>
          </div>
        </form>
      </section>

      {/* Generated Evidence Results */}
      {caseResult && (
        <section className="white-panel" style={{ padding: '26px', border: '2px solid #bfdbfe' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid #e2e8f0' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>
                  Evidence Dossier: {caseResult.subjectName}
                </h3>
                {caseResult.overallStatus === 'PASSED_CLEARED' ? (
                  <span className="badge-clear"><Icons.CheckCircle /> CLEARED</span>
                ) : (
                  <span className="badge-match"><Icons.AlertTriangle /> FLAGGED / REVIEW</span>
                )}
              </div>
              <p style={{ fontSize: '12px', color: '#64748b' }}>
                Case ID: <span style={{ fontFamily: 'var(--font-mono)', color: '#0f172a' }}>{caseResult.id}</span> | 
                Generated on: {new Date(caseResult.createdAt).toLocaleString()} | 
                Type: {caseResult.subjectType}
              </p>
            </div>

            <a
              href={`/api/screenings/${caseResult.id}/download-zip`}
              className="btn-secondary"
              style={{ backgroundColor: '#eff6ff', borderColor: '#bfdbfe', color: '#1d4ed8' }}
            >
              <Icons.ZipArchive />
              <span>Download All Evidence (ZIP Dossier)</span>
            </a>
          </div>

          {/* 4 Cards for 4 Generated PDFs */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            {caseResult.files.map((file) => (
              <div
                key={file.key}
                style={{
                  backgroundColor: file.matchStatus === 'POTENTIAL_MATCH' ? '#fff1f2' : '#ffffff',
                  border: file.matchStatus === 'POTENTIAL_MATCH' ? '1.5px solid #fca5a5' : '1px solid #e2e8f0',
                  borderRadius: '10px',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 1px 2px 0 rgba(0,0,0,0.04)',
                  gap: '12px'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Icons.FilePdf />
                      <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#0f172a' }}>{file.sourceName}</span>
                    </div>
                    {file.matchStatus === 'POTENTIAL_MATCH' ? (
                      <span className="badge-match"><Icons.AlertTriangle /> FLAGGED</span>
                    ) : (
                      <span className="badge-clear"><Icons.CheckCircle /> CLEARED</span>
                    )}
                  </div>

                  <div style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    color: '#1d4ed8',
                    backgroundColor: '#eff6ff',
                    border: '1px solid #dbeafe',
                    padding: '6px 8px',
                    borderRadius: '6px',
                    wordBreak: 'break-all',
                    marginBottom: '8px'
                  }}>
                    {file.filename}
                  </div>

                  <p style={{ fontSize: '12px', color: '#475569', lineHeight: '1.4' }}>
                    {file.matchDetails}
                  </p>
                </div>

                <div style={{ paddingTop: '8px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'flex-end' }}>
                  <a
                    href={`/api/screenings/${caseResult.id}/download/${encodeURIComponent(file.filename)}`}
                    className="btn-secondary"
                    style={{ fontSize: '12px', padding: '6px 12px' }}
                  >
                    <Icons.Download />
                    <span>Download PDF</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
