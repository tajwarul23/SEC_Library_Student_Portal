import React, { useState } from 'react';
import { FileUp, Link as LinkIcon, Calendar, Plus, X } from 'lucide-react';
import { Button } from '../../../components/common/Button';
import { useSubmitResearchPaper } from '../Hooks/useResearchPapers';
import toast from 'react-hot-toast';

const CATEGORY_OPTIONS = ['CSE', 'EEE', 'CE', 'ME', 'PHYSICS', 'CHEMISTRY', 'MATH', 'BIOLOGY', 'GENERAL'];
const emptyAuthor = () => ({ name: '', affiliation: '', orcid: '' });

export const SubmitResearchPaperForm = ({ onSuccess }) => {
  const submitMutation = useSubmitResearchPaper();
  const [title, setTitle] = useState('');
  const [authors, setAuthors] = useState([emptyAuthor()]);
  const [category, setCategory] = useState('CSE');
  const [paperLink, setPaperLink] = useState('');
  const [abstractText, setAbstractText] = useState('');
  const [keywords, setKeywords] = useState('');
  const [publicationDate, setPublicationDate] = useState('');
  const [journalName, setJournalName] = useState('');
  const [conferenceName, setConferenceName] = useState('');
  const [doi, setDoi] = useState('');

  const updateAuthor = (index, field, value) => {
    setAuthors((prev) => prev.map((a, i) => (i === index ? { ...a, [field]: value } : a)));
  };
  const addAuthor = () => setAuthors((prev) => [...prev, emptyAuthor()]);
  const removeAuthor = (index) => setAuthors((prev) => prev.filter((_, i) => i !== index));

  const validAuthors = authors
    .map((a) => ({ name: a.name.trim(), affiliation: a.affiliation.trim(), orcid: a.orcid.trim() }))
    .filter((a) => a.name);

  const resetForm = () => {
    setTitle('');
    setAuthors([emptyAuthor()]);
    setCategory('CSE');
    setPaperLink('');
    setAbstractText('');
    setKeywords('');
    setPublicationDate('');
    setJournalName('');
    setConferenceName('');
    setDoi('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !paperLink.trim() || validAuthors.length === 0) return;

    try {
      await submitMutation.mutateAsync({
        title: title.trim(),
        authors: validAuthors.map((a) => ({
          name: a.name,
          affiliation: a.affiliation || undefined,
          orcid: a.orcid || undefined,
        })),
        category,
        paperLink: paperLink.trim(),
        abstract: abstractText.trim() || undefined,
        keywords: keywords.split(',').map((k) => k.trim()).filter(Boolean),
        publicationDate: publicationDate || undefined,
        journalName: journalName.trim() || undefined,
        conferenceName: conferenceName.trim() || undefined,
        doi: doi.trim() || undefined,
      });
      toast.success('Paper submitted — pending admin approval.');
      resetForm();
      if (onSuccess) onSuccess();
    } catch (err) {
      toast.error(err.extractedMessage || 'Failed to submit research paper.');
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-5 sm:p-6 shadow-2xs space-y-5">
      <div className="pb-3 border-b border-slate-100">
        <h2 className="text-base font-bold text-slate-900 font-serif">Submit a Research Paper</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Your submission is reviewed by the library admin before it appears in the public repository.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {/* Title */}
        <div>
          <label className="block font-semibold text-slate-700 mb-1">
            Paper Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. AI-Based Power Grid Failure Prediction in Sylhet Industrial Zone"
            className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
            required
          />
        </div>

        {/* Authors */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block font-semibold text-slate-700">
              Author(s) <span className="text-red-500">*</span>
            </label>
            <button
              type="button"
              onClick={addAuthor}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-800 hover:text-blue-900 cursor-pointer"
            >
              <Plus className="w-3 h-3" />
              <span>Add Author</span>
            </button>
          </div>
          <div className="space-y-2">
            {authors.map((author, index) => (
              <div key={index} className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_1fr_auto] gap-2 items-center">
                <input
                  type="text"
                  value={author.name}
                  onChange={(e) => updateAuthor(index, 'name', e.target.value)}
                  placeholder="Author name"
                  className="px-3 py-2 bg-slate-50 border border-slate-300 rounded text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
                  required={index === 0}
                />
                <input
                  type="text"
                  value={author.affiliation}
                  onChange={(e) => updateAuthor(index, 'affiliation', e.target.value)}
                  placeholder="Affiliation (optional)"
                  className="px-3 py-2 bg-slate-50 border border-slate-300 rounded text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
                <input
                  type="text"
                  value={author.orcid}
                  onChange={(e) => updateAuthor(index, 'orcid', e.target.value)}
                  placeholder="ORCID (optional)"
                  className="px-3 py-2 font-mono bg-slate-50 border border-slate-300 rounded text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
                <button
                  type="button"
                  onClick={() => removeAuthor(index)}
                  disabled={authors.length === 1}
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer justify-self-start sm:justify-self-center"
                  title="Remove author"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Category, Paper Link, Publication Date */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
            >
              {CATEGORY_OPTIONS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Document PDF Link (URL) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <LinkIcon className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="url"
                value={paperLink}
                onChange={(e) => setPaperLink(e.target.value)}
                placeholder="https://sec.ac.bd/research/paper.pdf"
                className="w-full pl-9 pr-3 py-2 font-mono text-xs bg-slate-50 border border-slate-300 rounded text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
                required
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Publication Date</label>
            <div className="relative">
              <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
              <input
                type="date"
                value={publicationDate}
                onChange={(e) => setPublicationDate(e.target.value)}
                className="w-full pl-9 pr-3 py-2 font-mono bg-slate-50 border border-slate-300 rounded text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
            </div>
          </div>
        </div>

        {/* Journal, Conference, DOI */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Journal Name</label>
            <input
              type="text"
              value={journalName}
              onChange={(e) => setJournalName(e.target.value)}
              placeholder="e.g. IEEE Access"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
            />
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Conference Name</label>
            <input
              type="text"
              value={conferenceName}
              onChange={(e) => setConferenceName(e.target.value)}
              placeholder="e.g. ICCIT 2026"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
            />
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-1">DOI</label>
            <input
              type="text"
              value={doi}
              onChange={(e) => setDoi(e.target.value)}
              placeholder="e.g. 10.1109/ACCESS.2026.1234567"
              className="w-full px-3 py-2 font-mono bg-slate-50 border border-slate-300 rounded text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
            />
          </div>
        </div>

        {/* Keywords */}
        <div>
          <label className="block font-semibold text-slate-700 mb-1">Keywords (comma-separated)</label>
          <input
            type="text"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            placeholder="e.g. Hydrology, GIS, Surma Basin"
            className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
          />
        </div>

        {/* Abstract */}
        <div>
          <label className="block font-semibold text-slate-700 mb-1">Abstract</label>
          <textarea
            rows={3}
            value={abstractText}
            onChange={(e) => setAbstractText(e.target.value)}
            placeholder="Brief overview of methodology, experiments, and findings..."
            className="w-full p-3 bg-slate-50 border border-slate-300 rounded text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
          />
        </div>

        <Button
          type="submit"
          variant="primary"
          size="md"
          className="w-full"
          isLoading={submitMutation.isPending}
          leftIcon={<FileUp className="w-4 h-4" />}
        >
          Submit for Admin Review
        </Button>
      </form>
    </div>
  );
};
