'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { ActivityCategory } from '@/types';
import { Settings, Save, RotateCcw, Check, X, ShieldAlert, Award, Shield } from 'lucide-react';

export const RulesManager: React.FC = () => {
  const { categories, settings, updateSettings, updateCategory, resetToDefaults } = useApp();

  const [regularPoints, setRegularPoints] = useState<string>(String(settings.regular_target_points || 60));
  const [regularMaxPoints, setRegularMaxPoints] = useState<string>(String(settings.regular_max_points || 100));
  const [lePoints, setLePoints] = useState<string>(String(settings.lateral_entry_target_points || 45));
  const [leMaxPoints, setLeMaxPoints] = useState<string>(String(settings.lateral_entry_max_points || 75));

  const [editingCategory, setEditingCategory] = useState<ActivityCategory | null>(null);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  // Helper to handle numeric inputs without leading zero glitches
  const handleNumericInput = (
    val: string,
    setter: React.Dispatch<React.SetStateAction<string>>
  ) => {
    if (val === '') {
      setter('');
      return;
    }
    // Remove leading zeros when user types next digit
    const cleaned = val.replace(/^0+(?=\d)/, '');
    setter(cleaned);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const regNum = Number(regularPoints) || 60;
    const regMaxNum = Number(regularMaxPoints) || 100;
    const leNum = Number(lePoints) || 45;
    const leMaxNum = Number(leMaxPoints) || 75;

    updateSettings({
      regular_target_points: regNum,
      regular_max_points: regMaxNum,
      lateral_entry_target_points: leNum,
      lateral_entry_max_points: leMaxNum,
    });

    setRegularPoints(String(regNum));
    setRegularMaxPoints(String(regMaxNum));
    setLePoints(String(leNum));
    setLeMaxPoints(String(leMaxNum));

    setSaveMessage('Graduation activity targets and maximum caps updated successfully.');
    setTimeout(() => setSaveMessage(null), 4000);
  };

  const handleSaveCategoryEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCategory) {
      const sanitizedCat: ActivityCategory = {
        ...editingCategory,
        default_points: Number(editingCategory.default_points) || 0,
        max_points_allowed: Number(editingCategory.max_points_allowed) || 0,
      };
      updateCategory(sanitizedCat);
      setEditingCategory(null);
      setSaveMessage(`Category #${sanitizedCat.sno} (${sanitizedCat.name}) updated successfully.`);
      setTimeout(() => setSaveMessage(null), 4000);
    }
  };

  return (
    <div className="space-y-6">
      
      {saveMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center space-x-2 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>{saveMessage}</span>
        </div>
      )}

      {/* Target Points & Maximum Caps Settings Card */}
      <div className="bg-white dark:bg-[#1a1b20] rounded-2xl p-6 border-t-4 border-[#385529] dark:border-emerald-600 border-x border-b border-[#e8e3d8] dark:border-[#2c2d36] shadow-xs space-y-4">
        <div className="flex items-center space-x-2">
          <Settings className="w-5 h-5 text-[#385529] dark:text-gray-300" />
          <h3 className="text-base font-serif font-bold text-[#385529] dark:text-gray-200 uppercase tracking-wide">
            CBIT MAR Degree Award Requirements & Maximum Limits
          </h3>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Configure the mandatory threshold points required for graduation, and the absolute maximum activity points cap that a student can earn in total.
        </p>

        <form onSubmit={handleSaveSettings} className="space-y-4 pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Regular Student Target */}
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                4-Year Regular Target (Points)
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={regularPoints}
                onChange={(e) => handleNumericInput(e.target.value, setRegularPoints)}
                className="w-full px-3 py-2 text-sm font-bold text-[#385529] dark:text-gray-100 rounded-xl border border-[#e8e3d8] dark:border-[#2e3039] bg-gray-50 dark:bg-[#121214] focus:ring-2 focus:ring-[#385529] dark:focus:ring-gray-400 focus:outline-none"
              />
              <span className="text-[10px] text-gray-400 mt-0.5 block">Default: 60 Points</span>
            </div>

            {/* Regular Student Max Cap */}
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                4-Year Regular Max Cap (Points)
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={regularMaxPoints}
                onChange={(e) => handleNumericInput(e.target.value, setRegularMaxPoints)}
                className="w-full px-3 py-2 text-sm font-bold text-[#385529] dark:text-gray-100 rounded-xl border border-[#e8e3d8] dark:border-[#2e3039] bg-gray-50 dark:bg-[#121214] focus:ring-2 focus:ring-[#385529] dark:focus:ring-gray-400 focus:outline-none"
              />
              <span className="text-[10px] text-gray-400 mt-0.5 block">Absolute maximum: 100 Points</span>
            </div>

            {/* Lateral Entry Target */}
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                Lateral Entry Target (Points)
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={lePoints}
                onChange={(e) => handleNumericInput(e.target.value, setLePoints)}
                className="w-full px-3 py-2 text-sm font-bold text-[#a16b15] dark:text-amber-400 rounded-xl border border-[#e8e3d8] dark:border-[#2e3039] bg-gray-50 dark:bg-[#121214] focus:ring-2 focus:ring-[#a16b15] dark:focus:ring-gray-400 focus:outline-none"
              />
              <span className="text-[10px] text-gray-400 mt-0.5 block">Default: 45 Points</span>
            </div>

            {/* Lateral Entry Max Cap */}
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                Lateral Entry Max Cap (Points)
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={leMaxPoints}
                onChange={(e) => handleNumericInput(e.target.value, setLeMaxPoints)}
                className="w-full px-3 py-2 text-sm font-bold text-[#a16b15] dark:text-amber-400 rounded-xl border border-[#e8e3d8] dark:border-[#2e3039] bg-gray-50 dark:bg-[#121214] focus:ring-2 focus:ring-[#a16b15] dark:focus:ring-gray-400 focus:outline-none"
              />
              <span className="text-[10px] text-gray-400 mt-0.5 block">Absolute maximum: 75 Points</span>
            </div>

          </div>

          <div className="flex items-center justify-end space-x-2 pt-2 border-t border-gray-100 dark:border-[#2a2b33]">
            <button
              type="button"
              onClick={resetToDefaults}
              title="Reset to CBIT Default Rubrics"
              className="px-4 py-2 border border-[#e8e3d8] dark:border-[#2e3039] hover:bg-gray-50 dark:hover:bg-[#22232a] text-gray-600 dark:text-gray-300 text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Defaults (60/100, 45/75)</span>
            </button>

            <button
              type="submit"
              className="px-6 py-2 bg-[#385529] hover:bg-[#273e1c] dark:bg-[#2a2b33] dark:hover:bg-[#343640] text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center space-x-1.5 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Requirements & Caps</span>
            </button>
          </div>
        </form>
      </div>

      {/* 24 Activity Categories List & Inline Editor */}
      <div className="bg-white dark:bg-[#1a1b20] rounded-2xl p-6 border border-[#e8e3d8] dark:border-[#2c2d36] shadow-xs space-y-4">
        <div>
          <h3 className="text-base font-serif font-bold text-[#385529] dark:text-gray-200 uppercase tracking-wide">
            CBIT MAR 24 Categories & Point Allocation Rules
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Click edit on any category to modify default points, sub-type, max cap limit, or description.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#faf9f5] dark:bg-[#22232a] border-y border-[#e8e3d8] dark:border-[#2c2d36] text-[#385529] dark:text-gray-300 font-serif font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-3 w-12 text-center">SNo</th>
                <th className="py-3 px-4">Activity Name</th>
                <th className="py-3 px-3">Sub-Type / Level</th>
                <th className="py-3 px-3 text-center">Points</th>
                <th className="py-3 px-3 text-center">Max Cap</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-[#2c2d36]">
              {categories.map((cat) => {
                const isEditingThis = editingCategory?.id === cat.id;

                if (isEditingThis && editingCategory) {
                  return (
                    <tr key={cat.id} className="bg-amber-50/60 dark:bg-[#22232a]">
                      <td className="py-3 px-3 text-center font-bold text-[#a16b15] dark:text-amber-400">{editingCategory.sno}</td>
                      <td className="py-3 px-4">
                        <input
                          type="text"
                          value={editingCategory.name}
                          onChange={(e) =>
                            setEditingCategory({ ...editingCategory, name: e.target.value })
                          }
                          className="w-full text-xs p-1.5 border rounded-lg bg-white dark:bg-[#121214] text-gray-900 dark:text-white border-gray-300 dark:border-[#2e3039]"
                        />
                      </td>
                      <td className="py-3 px-3">
                        <input
                          type="text"
                          value={editingCategory.sub_type || ''}
                          onChange={(e) =>
                            setEditingCategory({ ...editingCategory, sub_type: e.target.value })
                          }
                          className="w-full text-xs p-1.5 border rounded-lg bg-white dark:bg-[#121214] text-gray-900 dark:text-white border-gray-300 dark:border-[#2e3039]"
                        />
                      </td>
                      <td className="py-3 px-3 text-center">
                        <input
                          type="text"
                          inputMode="numeric"
                          value={String(editingCategory.default_points ?? '')}
                          onChange={(e) => {
                            const val = e.target.value.replace(/^0+(?=\d)/, '');
                            setEditingCategory({
                              ...editingCategory,
                              default_points: val === '' ? ('' as any) : Number(val),
                            });
                          }}
                          className="w-16 text-xs p-1.5 border rounded-lg bg-white dark:bg-[#121214] text-gray-900 dark:text-white border-gray-300 dark:border-[#2e3039] text-center font-bold"
                        />
                      </td>
                      <td className="py-3 px-3 text-center">
                        <input
                          type="text"
                          inputMode="numeric"
                          value={String(editingCategory.max_points_allowed ?? '')}
                          onChange={(e) => {
                            const val = e.target.value.replace(/^0+(?=\d)/, '');
                            setEditingCategory({
                              ...editingCategory,
                              max_points_allowed: val === '' ? ('' as any) : Number(val),
                            });
                          }}
                          className="w-16 text-xs p-1.5 border rounded-lg bg-white dark:bg-[#121214] text-gray-900 dark:text-white border-gray-300 dark:border-[#2e3039] text-center font-bold"
                        />
                      </td>
                      <td className="py-3 px-3 text-right space-x-1">
                        <button
                          onClick={handleSaveCategoryEdit}
                          className="p-1.5 bg-[#385529] dark:bg-emerald-600 text-white rounded-lg hover:opacity-90 cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setEditingCategory(null)}
                          className="p-1.5 bg-gray-200 dark:bg-[#2c2d36] text-gray-700 dark:text-gray-300 rounded-lg hover:opacity-90 cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                }

                return (
                  <tr key={cat.id} className="hover:bg-[#faf9f5] dark:hover:bg-[#22232a] transition-colors">
                    <td className="py-3 px-3 text-center font-bold text-[#385529] dark:text-gray-300">#{cat.sno}</td>
                    <td className="py-3 px-4 font-semibold text-gray-900 dark:text-gray-100">{cat.name}</td>
                    <td className="py-3 px-3 text-gray-600 dark:text-gray-300">
                      <span className="bg-[#faf9f5] dark:bg-[#121214] px-2 py-0.5 rounded-md text-[11px] border border-[#e8e3d8] dark:border-[#2e3039]">
                        {cat.sub_type || 'General'}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center font-extrabold text-[#385529] dark:text-gray-200">
                      {cat.default_points} pts
                    </td>
                    <td className="py-3 px-3 text-center font-extrabold text-[#a16b15] dark:text-amber-400">
                      {cat.max_points_allowed} pts
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => setEditingCategory({ ...cat })}
                        className="px-2.5 py-1 text-[11px] font-bold text-[#a16b15] dark:text-amber-400 hover:text-[#385529] dark:hover:text-white hover:bg-[#fbf5eb] dark:hover:bg-[#22232a] rounded-lg transition-colors cursor-pointer"
                      >
                        Edit Rule
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
