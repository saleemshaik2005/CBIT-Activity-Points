'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { ActivityCategory } from '@/types';
import { Settings, Save, RotateCcw, Check, X, ShieldAlert } from 'lucide-react';

export const RulesManager: React.FC = () => {
  const { categories, settings, updateSettings, updateCategory, resetToDefaults } = useApp();

  const [regularPoints, setRegularPoints] = useState<string | number>(settings.regular_target_points);
  const [lePoints, setLePoints] = useState<string | number>(settings.lateral_entry_target_points);
  const [editingCategory, setEditingCategory] = useState<ActivityCategory | null>(null);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const regNum = Number(regularPoints) || 60;
    const leNum = Number(lePoints) || 50;
    updateSettings({
      regular_target_points: regNum,
      lateral_entry_target_points: leNum,
    });
    setRegularPoints(regNum);
    setLePoints(leNum);
    setSaveMessage('Target graduation activity requirements updated successfully.');
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

      {/* Target Points Settings Card */}
      <div className="bg-white dark:bg-[#1a1b20] rounded-2xl p-6 border-t-4 border-[#385529] dark:border-emerald-600 border-x border-b border-[#e8e3d8] dark:border-[#2c2d36] shadow-xs space-y-4">
        <div className="flex items-center space-x-2">
          <Settings className="w-5 h-5 text-[#385529] dark:text-gray-300" />
          <h3 className="text-base font-serif font-bold text-[#385529] dark:text-gray-200 uppercase tracking-wide">
            Graduation Target Points Configuration
          </h3>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Modify the mandatory activity points required for degree award. Changes take effect across all student dashboards immediately.
        </p>

        <form onSubmit={handleSaveSettings} className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
              4-Year Regular B.Tech Target (Points)
            </label>
            <input
              type="number"
              min={1}
              max={500}
              value={regularPoints}
              onChange={(e) => {
                const val = e.target.value;
                setRegularPoints(val === '' ? '' : Number(val));
              }}
              className="w-full px-3 py-2 text-sm font-bold text-[#385529] dark:text-gray-100 rounded-xl border border-[#e8e3d8] dark:border-[#2e3039] bg-gray-50 dark:bg-[#121214] focus:ring-2 focus:ring-[#385529] dark:focus:ring-gray-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
              Lateral Entry (Diploma) Target (Points)
            </label>
            <input
              type="number"
              min={1}
              max={500}
              value={lePoints}
              onChange={(e) => {
                const val = e.target.value;
                setLePoints(val === '' ? '' : Number(val));
              }}
              className="w-full px-3 py-2 text-sm font-bold text-[#a16b15] dark:text-amber-400 rounded-xl border border-[#e8e3d8] dark:border-[#2e3039] bg-gray-50 dark:bg-[#121214] focus:ring-2 focus:ring-[#a16b15] dark:focus:ring-gray-400 focus:outline-none"
            />
          </div>

          <div className="flex items-end space-x-2">
            <button
              type="submit"
              className="w-full px-4 py-2.5 bg-[#385529] hover:bg-[#273e1c] dark:bg-[#2a2b33] dark:hover:bg-[#343640] text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Update Targets</span>
            </button>
            <button
              type="button"
              onClick={resetToDefaults}
              title="Reset to CBIT Default Rubrics"
              className="p-2.5 border border-[#e8e3d8] dark:border-[#2e3039] hover:bg-gray-50 dark:hover:bg-[#22232a] text-gray-600 dark:text-gray-300 rounded-xl transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
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
                          type="number"
                          value={editingCategory.default_points}
                          onChange={(e) => {
                            const val = e.target.value;
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
                          type="number"
                          value={editingCategory.max_points_allowed}
                          onChange={(e) => {
                            const val = e.target.value;
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
