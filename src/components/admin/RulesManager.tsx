'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { ActivityCategory } from '@/types';
import { Settings, Save, RotateCcw, Check, X } from 'lucide-react';

export const RulesManager: React.FC = () => {
  const { categories, settings, updateSettings, updateCategory, resetToDefaults } = useApp();

  const [regularPoints, setRegularPoints] = useState(settings.regular_target_points);
  const [lePoints, setLePoints] = useState(settings.lateral_entry_target_points);
  const [editingCategory, setEditingCategory] = useState<ActivityCategory | null>(null);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      regular_target_points: Number(regularPoints),
      lateral_entry_target_points: Number(lePoints),
    });
    setSaveMessage('Target MAR requirements updated successfully.');
    setTimeout(() => setSaveMessage(null), 4000);
  };

  const handleSaveCategoryEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCategory) {
      updateCategory(editingCategory);
      setEditingCategory(null);
      setSaveMessage(`Category #${editingCategory.sno} updated successfully.`);
      setTimeout(() => setSaveMessage(null), 4000);
    }
  };

  return (
    <div className="space-y-6">
      
      {saveMessage && (
        <div className="p-3.5 rounded-xl bg-[#eef5ec] border border-[#385529]/30 text-[#273e1c] text-xs font-bold flex items-center space-x-2 animate-in fade-in">
          <Check className="w-4 h-4 text-[#385529]" />
          <span>{saveMessage}</span>
        </div>
      )}

      {/* Target Points Settings Card */}
      <div className="bg-white rounded-2xl p-6 border-t-4 border-[#385529] border-x border-b border-[#e8e3d8] shadow-xs space-y-4">
        <div className="flex items-center space-x-2">
          <Settings className="w-5 h-5 text-[#385529]" />
          <h3 className="text-base font-serif font-bold text-[#385529] uppercase tracking-wide">
            Graduation Target Points Configuration
          </h3>
        </div>
        <p className="text-xs text-gray-500">
          Modify the mandatory activity points required for degree award. Changes take effect across all student dashboards immediately.
        </p>

        <form onSubmit={handleSaveSettings} className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div>
            <label className="block text-xs font-bold text-[#1c2718] mb-1">
              4-Year Regular B.Tech Target (Points)
            </label>
            <input
              type="number"
              min={10}
              max={200}
              value={regularPoints}
              onChange={(e) => setRegularPoints(Number(e.target.value))}
              className="w-full px-3 py-2 text-sm font-bold text-[#385529] rounded-lg border border-[#e8e3d8] focus:ring-2 focus:ring-[#385529]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1c2718] mb-1">
              Lateral Entry (Diploma) Target (Points)
            </label>
            <input
              type="number"
              min={10}
              max={200}
              value={lePoints}
              onChange={(e) => setLePoints(Number(e.target.value))}
              className="w-full px-3 py-2 text-sm font-bold text-[#a16b15] rounded-lg border border-[#e8e3d8] focus:ring-2 focus:ring-[#a16b15]"
            />
          </div>

          <div className="flex items-end space-x-2">
            <button
              type="submit"
              className="w-full px-4 py-2.5 bg-[#385529] hover:bg-[#273e1c] text-white text-xs font-bold rounded-lg shadow-sm transition-all flex items-center justify-center space-x-1.5 border-b-2 border-[#a16b15]"
            >
              <Save className="w-4 h-4 text-[#dfa94b]" />
              <span>Update Targets</span>
            </button>
            <button
              type="button"
              onClick={resetToDefaults}
              title="Reset to CBIT Default Rubrics"
              className="p-2.5 border border-[#e8e3d8] hover:bg-[#faf7f2] text-gray-600 rounded-lg transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>

      {/* 24 Activity Categories List & Inline Editor */}
      <div className="bg-white rounded-2xl p-6 border border-[#e8e3d8] shadow-xs space-y-4">
        <div>
          <h3 className="text-base font-serif font-bold text-[#385529] uppercase tracking-wide">
            CBIT MAR 24 Categories & Point Allocation Rules
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Click edit on any category to modify default points, sub-type, max cap limit, or description.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#faf9f5] border-y border-[#e8e3d8] text-[#385529] font-serif font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-3 w-12 text-center">SNo</th>
                <th className="py-3 px-4">Activity Name</th>
                <th className="py-3 px-3">Sub-Type / Level</th>
                <th className="py-3 px-3 text-center">Points</th>
                <th className="py-3 px-3 text-center">Max Cap</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {categories.map((cat) => {
                const isEditingThis = editingCategory?.id === cat.id;

                if (isEditingThis && editingCategory) {
                  return (
                    <tr key={cat.id} className="bg-[#fbf5eb]">
                      <td className="py-3 px-3 text-center font-bold text-[#a16b15]">{editingCategory.sno}</td>
                      <td className="py-3 px-4">
                        <input
                          type="text"
                          value={editingCategory.name}
                          onChange={(e) =>
                            setEditingCategory({ ...editingCategory, name: e.target.value })
                          }
                          className="w-full text-xs p-1.5 border rounded bg-white"
                        />
                      </td>
                      <td className="py-3 px-3">
                        <input
                          type="text"
                          value={editingCategory.sub_type || ''}
                          onChange={(e) =>
                            setEditingCategory({ ...editingCategory, sub_type: e.target.value })
                          }
                          className="w-full text-xs p-1.5 border rounded bg-white"
                        />
                      </td>
                      <td className="py-3 px-3 text-center">
                        <input
                          type="number"
                          value={editingCategory.default_points}
                          onChange={(e) =>
                            setEditingCategory({
                              ...editingCategory,
                              default_points: Number(e.target.value),
                            })
                          }
                          className="w-14 text-xs p-1.5 border rounded bg-white text-center font-bold"
                        />
                      </td>
                      <td className="py-3 px-3 text-center">
                        <input
                          type="number"
                          value={editingCategory.max_points_allowed}
                          onChange={(e) =>
                            setEditingCategory({
                              ...editingCategory,
                              max_points_allowed: Number(e.target.value),
                            })
                          }
                          className="w-14 text-xs p-1.5 border rounded bg-white text-center font-bold"
                        />
                      </td>
                      <td className="py-3 px-3 text-right space-x-1">
                        <button
                          onClick={handleSaveCategoryEdit}
                          className="p-1 bg-[#385529] text-white rounded hover:bg-[#273e1c]"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setEditingCategory(null)}
                          className="p-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                }

                return (
                  <tr key={cat.id} className="hover:bg-[#faf9f5] transition-colors">
                    <td className="py-3 px-3 text-center font-bold text-[#385529]">#{cat.sno}</td>
                    <td className="py-3 px-4 font-semibold text-[#1c2718]">{cat.name}</td>
                    <td className="py-3 px-3 text-gray-600">
                      <span className="bg-[#faf9f5] px-2 py-0.5 rounded text-[11px] border border-[#e8e3d8]">
                        {cat.sub_type || 'General'}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center font-extrabold text-[#385529]">
                      {cat.default_points} pts
                    </td>
                    <td className="py-3 px-3 text-center font-extrabold text-[#a16b15]">
                      {cat.max_points_allowed} pts
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => setEditingCategory({ ...cat })}
                        className="px-2.5 py-1 text-[11px] font-bold text-[#a16b15] hover:text-[#385529] hover:bg-[#fbf5eb] rounded-md transition-colors"
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
