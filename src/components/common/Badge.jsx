import React from 'react';

const variantStyles = {
  primary: 'bg-blue-50 text-blue-700 border-blue-200',
  success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  warning: 'bg-amber-50 text-amber-700 border-amber-200',
  danger: 'bg-red-50 text-red-700 border-red-200',
  neutral: 'bg-slate-100 text-slate-600 border-slate-200',
  dept_cse: 'bg-sky-50 text-sky-700 border-sky-200',
  dept_eee: 'bg-purple-50 text-purple-700 border-purple-200',
  dept_ce: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  dept_me: 'bg-amber-50 text-amber-700 border-amber-200',
  dept_bba: 'bg-indigo-50 text-indigo-700 border-indigo-200',
};

export const Badge = ({
  variant = 'neutral',
  department,
  children,
  className = '',
}) => {
  let resolvedVariant = variant;
  if (department) {
    const deptKey = `dept_${department.toLowerCase()}`;
    if (deptKey in variantStyles) {
      resolvedVariant = deptKey;
    }
  }

  // Matches admin's split: generic Badge defaults to text-xs, while
  // department chips (admin's separate DeptBadge) stay at the smaller
  // text-[11px] but bold/uppercase/tracked.
  const baseClasses = department
    ? 'inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider border'
    : 'inline-flex items-center px-2 py-0.5 rounded text-xs font-mono font-medium border tracking-tight leading-none';

  return (
    <span
      className={`${baseClasses} ${variantStyles[resolvedVariant] || variantStyles.neutral} ${className}`}
    >
      {children}
    </span>
  );
};
